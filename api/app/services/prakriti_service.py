"""
services/prakriti_service.py
============================
Core RAG orchestration for Prakriti / Vikriti assessment.

Full pipeline:
  1. Extract symptom keywords from transcript  (LLM call 1 — fast/cheap)
  2. Generate semantic search query            (from keywords)
  3. Retrieve classical text chunks            (Pinecone via rag_service)
  4. Build grounded assessment prompt          (transcript + chunks + prior)
  5. Call LLM for final assessment             (LLM call 2 — main reasoning)
  6. Parse, validate, return PrakritiResponse

Owner: Khagendra Neupane (Prakriti Engine)
"""

import json
import logging
import re
from typing import Optional

import httpx

from app.config import settings
from app.models.dosha import (
    PrakritiBlock,
    PrakritiRequest,
    PrakritiResponse,
    RetrievedChunk,
    VikritiBlock,
)
from app.prompts.prakriti import (
    KEYWORD_EXTRACTION_SYSTEM,
    KEYWORD_EXTRACTION_USER,
    ASSESSMENT_SYSTEM,
    build_assessment_prompt,
)
from app.services.rag_service import rag_service

logger = logging.getLogger(__name__)

MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"


class PrakritiService:
    """
    Orchestrates the full Prakriti/Vikriti RAG pipeline.
    Stateless — safe to call concurrently.
    """

    # ── Public entry point ────────────────────────────────────────────────────

    async def assess(self, request: PrakritiRequest) -> PrakritiResponse:
        """
        Main assessment method. Called by the router.

        Args:
            request: PrakritiRequest with transcript, patient_id, session_id, etc.

        Returns:
            PrakritiResponse with prakriti, vikriti, confidence, reasoning, citations.

        Raises:
            ValueError: if LLM response cannot be parsed after retries.
            RuntimeError: if all pipeline steps fail.
        """
        logger.info(f"PrakritiService.assess | session={request.session_id} | lang={request.language}")

        # ── Step 1: Extract keywords ──────────────────────────────────────────
        keywords = await self._extract_keywords(request.transcript)
        logger.info(f"  Keywords extracted: {keywords}")

        # ── Step 2: Build semantic query ──────────────────────────────────────
        rag_query = self._build_rag_query(keywords)

        # ── Step 3: Retrieve classical text chunks ────────────────────────────
        raw_chunks = rag_service.retrieve(query=rag_query)
        logger.info(f"  Retrieved {len(raw_chunks)} chunks from Pinecone")

        # ── Step 4: Build grounded prompt ────────────────────────────────────
        prior_dict = None
        if request.prior_prakriti:
            prior_dict = {
                "vata":  request.prior_prakriti.vata,
                "pitta": request.prior_prakriti.pitta,
                "kapha": request.prior_prakriti.kapha,
            }

        assessment_prompt = build_assessment_prompt(
            transcript=request.transcript,
            keywords=keywords,
            retrieved_chunks=raw_chunks,
            prior_prakriti=prior_dict,
            language=request.language,
        )

        # ── Step 5: LLM assessment call ───────────────────────────────────────
        raw_response = await self._call_llm(
            system=ASSESSMENT_SYSTEM,
            user=assessment_prompt,
        )

        # ── Step 6: Parse and validate ────────────────────────────────────────
        parsed = self._parse_assessment(raw_response)

        # ── Step 7: Build and return response ─────────────────────────────────
        citations = [
            RetrievedChunk(
                text=c["text"],
                source=c["source"],
                relevance=c["relevance"],
            )
            for c in raw_chunks
        ]

        return PrakritiResponse(
            prakriti=PrakritiBlock(**parsed["prakriti"]),
            vikriti=VikritiBlock(**parsed["vikriti"]),
            confidence=parsed["confidence"],
            reasoning=parsed["reasoning"],
            citations=citations,
            session_id=request.session_id,
            patient_id=request.patient_id,
            extracted_keywords=keywords,
        )

    # ── Step 1: Keyword extraction ────────────────────────────────────────────

    async def _extract_keywords(self, transcript: str) -> list[str]:
        """
        Fast LLM call to extract Dosha-relevant symptom keywords.
        Falls back to simple regex extraction if LLM call fails.
        """
        try:
            prompt = KEYWORD_EXTRACTION_USER.format(transcript=transcript[:3000])  # cap at 3k chars
            raw = await self._call_llm(
                system=KEYWORD_EXTRACTION_SYSTEM,
                user=prompt,
            )
            # Parse JSON array
            raw = raw.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
            keywords = json.loads(raw)
            if isinstance(keywords, list):
                return [str(k).lower().strip() for k in keywords[:15]]
        except Exception as e:
            logger.warning(f"  Keyword LLM extraction failed ({e}), using fallback")

        # Fallback: extract known Dosha keywords via simple pattern matching
        return self._fallback_keyword_extract(transcript)

    def _fallback_keyword_extract(self, transcript: str) -> list[str]:
        """Simple keyword matching as fallback when LLM call fails."""
        known_keywords = [
            # Vata
            "dry skin", "constipation", "bloating", "anxiety", "insomnia",
            "joint cracking", "weight loss", "cold hands", "forgetfulness", "irregular",
            # Pitta
            "acidity", "heartburn", "rashes", "inflammation", "anger",
            "burning", "excessive hunger", "loose stools", "sweating",
            # Kapha
            "weight gain", "lethargy", "congestion", "mucus", "slow digestion",
            "oversleeping", "depression", "oily skin", "water retention",
            # Sanskrit/Ayurvedic
            "vata", "pitta", "kapha", "agni", "ama", "ojas",
        ]
        text_lower = transcript.lower()
        return [kw for kw in known_keywords if kw in text_lower][:12]

    # ── Step 2: RAG query construction ───────────────────────────────────────

    def _build_rag_query(self, keywords: list[str]) -> str:
        """
        Convert keywords into a semantic query string for Pinecone.
        Prefers Ayurvedic terminology to maximize classical text retrieval.

        Simple heuristic:
          - If many Vata keywords → bias query toward Vata
          - If many Pitta keywords → bias toward Pitta
          - etc.
        """
        vata_kws  = {"dry skin","constipation","bloating","anxiety","insomnia","cold hands","vata","apana","prana"}
        pitta_kws = {"acidity","heartburn","rashes","inflammation","anger","burning","pitta","pachaka","sadhaka"}
        kapha_kws = {"weight gain","lethargy","congestion","mucus","oversleeping","kapha","avalambaka","tarpaka"}

        kw_set    = set(keywords)
        vata_cnt  = len(kw_set & vata_kws)
        pitta_cnt = len(kw_set & pitta_kws)
        kapha_cnt = len(kw_set & kapha_kws)

        dominant  = max(
            [("Vata", vata_cnt), ("Pitta", pitta_cnt), ("Kapha", kapha_cnt)],
            key=lambda x: x[1]
        )[0]

        base_query = f"{dominant} Dosha lakshanas symptoms qualities imbalance prakopa"
        if keywords:
            base_query += f" {' '.join(keywords[:6])}"

        return base_query

    # ── Step 5: LLM call ─────────────────────────────────────────────────────

    async def _call_llm(self, system: str, user: str) -> str:
        """
        Call Mistral Chat API.

        Returns raw text response string.
        Raises httpx.HTTPError on network failure.
        """
        headers = {
            "Authorization": f"Bearer {settings.mistral_api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": settings.mistral_model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "temperature": 0.2,
            "max_tokens": 800,
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                MISTRAL_API_URL, headers=headers, json=payload
            )
            response.raise_for_status()
            data = response.json()

        try:
            return data["choices"][0]["message"]["content"]
        except (KeyError, IndexError) as e:
            raise ValueError(f"Unexpected Mistral response structure: {e}\n{data}")

    # ── Step 6: Parse LLM assessment response ─────────────────────────────────

    def _parse_assessment(self, raw: str) -> dict:
        """
        Parse and validate the LLM JSON response.

        Handles:
          - JSON wrapped in ```json ... ``` markdown fences
          - Minor score rounding (e.g. sums to 99 or 101)
          - Missing fields (auto-derived)

        Raises:
            ValueError if response cannot be parsed or scores are invalid.
        """
        cleaned = re.sub(r"```json\s*|```\s*", "", raw).strip()

        start = cleaned.find("{")
        end   = cleaned.rfind("}") + 1
        if start == -1 or end == 0:
            raise ValueError(f"No JSON object found in LLM response:\n{raw[:300]}")

        try:
            data = json.loads(cleaned[start:end])
        except json.JSONDecodeError as e:
            raise ValueError(f"JSON parse error: {e}\nRaw:\n{cleaned[start:end][:300]}")

        # ── Validate prakriti ───────────────────────────────────────────────
        prakriti = data.get("prakriti")
        if not prakriti:
            raise ValueError("Missing 'prakriti' in LLM response")
        self._normalize_scores(prakriti, "prakriti")
        if not prakriti.get("dominant") or "<" in str(prakriti.get("dominant", "")):
            prakriti["dominant"] = self._derive_prakriti_fields(prakriti)["dominant"]
        if not prakriti.get("secondary") or "<" in str(prakriti.get("secondary", "")):
            prakriti["secondary"] = self._derive_prakriti_fields(prakriti)["secondary"]
        if not prakriti.get("type") or "<" in str(prakriti.get("type", "")):
            prakriti["type"] = self._derive_prakriti_fields(prakriti)["type"]

        # ── Validate vikriti ────────────────────────────────────────────────
        vikriti = data.get("vikriti")
        if not vikriti:
            raise ValueError("Missing 'vikriti' in LLM response")
        self._normalize_scores(vikriti, "vikriti")
        if not vikriti.get("imbalance") or "<" in str(vikriti.get("imbalance", "")):
            vikriti["imbalance"] = self._derive_imbalance(vikriti)

        # Validate confidence
        conf = float(data.get("confidence", 0.7))
        data["confidence"] = max(0.0, min(1.0, conf))

        if not data.get("reasoning"):
            data["reasoning"] = "Assessment based on Dosha analysis of consultation transcript."

        return data

    def _normalize_scores(self, block: dict, label: str):
        """Ensure vata/pitta/kapha are present and sum to 100."""
        for d in ["vata", "pitta", "kapha"]:
            if d not in block:
                raise ValueError(f"Missing '{d}' in {label}")
            block[d] = float(block[d])

        total = block["vata"] + block["pitta"] + block["kapha"]
        if total > 0 and abs(total - 100) > 5:
            raise ValueError(f"{label} scores sum to {total}, too far from 100")
        if total > 0 and total != 100:
            factor = 100 / total
            block["vata"]  = round(block["vata"]  * factor)
            block["pitta"] = round(block["pitta"] * factor)
            block["kapha"] = 100 - block["vata"] - block["pitta"]

    def _derive_prakriti_fields(self, block: dict) -> dict:
        """Derive dominant, secondary, type from scores."""
        pairs = sorted(
            [("Vata", block["vata"]), ("Pitta", block["pitta"]), ("Kapha", block["kapha"])],
            key=lambda x: -x[1]
        )
        dominant_name = pairs[0][0]
        secondary_name = pairs[1][0]
        high_scores = [name for name, score in pairs if score >= 30]
        type_str = "-".join(high_scores) if high_scores else dominant_name
        return {
            "dominant": dominant_name,
            "secondary": secondary_name if len(high_scores) > 1 else dominant_name,
            "type": type_str,
        }

    def _derive_imbalance(self, block: dict) -> str:
        """Derive imbalance string from scores."""
        pairs = sorted(
            [("Vata", block["vata"]), ("Pitta", block["pitta"]), ("Kapha", block["kapha"])],
            key=lambda x: -x[1]
        )
        return f"{pairs[0][0]} aggravation"


# ── Module-level singleton ────────────────────────────────────────────────────

prakriti_service = PrakritiService()

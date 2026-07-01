"""
prompts/prakriti.py
===================
All LLM prompt templates for the Prakriti / Vikriti RAG pipeline.

Design principles:
  - Prompts are pure strings / functions, zero business logic here
  - Every prompt specifies output format explicitly (JSON schema)
  - System prompt grounds the LLM in Ayurvedic clinical reasoning
  - Retrieved chunks are injected via build_assessment_prompt()

Owner: Khagendra Neupane (Prakriti Engine)
"""


# ── 1. Keyword extraction prompt ──────────────────────────────────────────────
# Used BEFORE RAG retrieval to pull symptom signals from the transcript.
# Short, fast, cheap call — does not need classical text context.

KEYWORD_EXTRACTION_SYSTEM = """
You are a clinical Ayurvedic text analyst. 
Extract symptom and lifestyle keywords from consultation transcripts 
that are relevant to Dosha (Vata, Pitta, Kapha) assessment.
Return ONLY a JSON array of strings. No explanation, no markdown.
""".strip()

KEYWORD_EXTRACTION_USER = """
Extract Ayurvedic-relevant symptom and lifestyle keywords from this transcript.
Focus on: physical symptoms, digestion, sleep, skin, elimination, emotional state, diet, energy.
Include both English terms and any Ayurvedic/Sanskrit terms present.

Transcript:
{transcript}

Return format: ["keyword1", "keyword2", ...]
Maximum 15 keywords. Most clinically significant first.
""".strip()


# ── 2. Main assessment prompt ─────────────────────────────────────────────────
# Used AFTER RAG retrieval. Injects retrieved classical text chunks.

ASSESSMENT_SYSTEM = """
You are a senior Ayurvedic physician (Vaidya) with deep knowledge of 
classical Ayurvedic texts including Charaka Samhita, Sushruta Samhita, 
and Ashtanga Hridayam.

Your task: assess a patient's Prakriti (constitutional type) and Vikriti 
(current Dosha imbalance) from a consultation transcript, using the 
provided classical text passages as your reference.

Clinical reasoning rules:
1. Prakriti = long-term constitution (birth traits, lifelong tendencies). 
   It is relatively stable. If prior_prakriti is provided, use it as a 
   strong anchor and only update marginally.
2. Vikriti = current imbalance. Can differ significantly from Prakriti.
   This is what needs treatment.
3. Always ground your assessment in the retrieved classical passages.
4. Vata, Pitta, Kapha scores MUST each be between 0–100 and sum to exactly 100.
5. Confidence reflects how clearly the transcript supports your assessment.
   Low confidence (< 0.6) = ambiguous or very short transcript.

Output ONLY valid JSON. No markdown. No explanation outside the JSON.
""".strip()


def build_assessment_prompt(
    transcript: str,
    keywords: list[str],
    retrieved_chunks: list[dict],
    prior_prakriti: dict | None = None,
    language: str = "english"
) -> str:
    """
    Build the main assessment prompt by injecting:
      - the consultation transcript
      - extracted symptom keywords
      - retrieved classical text passages (RAG context)
      - prior Prakriti if available

    Args:
        transcript:       Full consultation text
        keywords:         Extracted symptom keywords
        retrieved_chunks: List of {"text": ..., "source": ..., "relevance": ...}
        prior_prakriti:   {"vata": int, "pitta": int, "kapha": int} or None
        language:         Transcript language hint

    Returns:
        Formatted user prompt string ready for LLM
    """
    # Format retrieved chunks
    if retrieved_chunks:
        chunks_text = "\n\n".join(
            f"[{i+1}] Source: {c['source']} (relevance: {c['relevance']:.2f})\n{c['text']}"
            for i, c in enumerate(retrieved_chunks)
        )
    else:
        chunks_text = "No classical text passages retrieved. Reason from general Ayurvedic principles."

    # Format prior Prakriti
    if prior_prakriti:
        prior_text = (
            f"Prior assessed Prakriti → "
            f"Vata: {prior_prakriti.get('vata')}%, "
            f"Pitta: {prior_prakriti.get('pitta')}%, "
            f"Kapha: {prior_prakriti.get('kapha')}%\n"
            f"Use this as a strong prior. Only update if transcript strongly contradicts it."
        )
    else:
        prior_text = "No prior Prakriti on record. Assess fresh from transcript."

    lang_note = {
        "hindi":   "Note: Transcript is in Hindi. Ayurvedic terms may appear in Devanagari.",
        "nepali":  "Note: Transcript is in Nepali. Ayurvedic terms may appear in Devanagari.",
        "sanskrit":"Note: Transcript uses Sanskrit Ayurvedic terminology extensively.",
        "english": ""
    }.get(language, "")

    return f"""
{f"Language note: {lang_note}" if lang_note else ""}

CLASSICAL TEXT CONTEXT (use these to ground your assessment):
{chunks_text}

EXTRACTED SYMPTOM KEYWORDS:
{", ".join(keywords) if keywords else "None extracted"}

PRIOR PRAKRITI:
{prior_text}

CONSULTATION TRANSCRIPT:
{transcript}

---
Based on the classical text passages above and the consultation transcript,
provide your Prakriti and Vikriti assessment.

Return ONLY this JSON (no markdown, no explanation outside it):
{{
  "prakriti": {{
    "vata": <integer 0-100>,
    "pitta": <integer 0-100>,
    "kapha": <integer 0-100>,
    "dominant": "<single highest Dosha, e.g. Vata>",
    "secondary": "<second highest Dosha, e.g. Pitta>",
    "type": "<combined classification, e.g. Vata-Pitta or Vata>"
  }},
  "vikriti": {{
    "vata": <integer 0-100>,
    "pitta": <integer 0-100>,
    "kapha": <integer 0-100>,
    "imbalance": "<descriptive imbalance, e.g. Vata aggravation>"
  }},
  "confidence": <float 0.0-1.0>,
  "reasoning": "<2-3 sentences explaining the assessment, referencing specific symptoms and classical text sources>"
}}

Validation rules your response MUST satisfy:
- prakriti.vata + prakriti.pitta + prakriti.kapha = 100
- vikriti.vata  + vikriti.pitta  + vikriti.kapha  = 100
- All scores are non-negative integers
- prakriti.dominant is the single Dosha with the highest score
- prakriti.secondary is the Dosha with the second-highest score
- prakriti.type combines dominant and secondary (e.g. "Vata-Pitta") or just the dominant if a single Dosha clearly dominates
- vikriti.imbalance is a short descriptive string like "{{Vata}} aggravation" or "{{Pitta}} excess"
""".strip()


# ── 3. Query generation prompt ────────────────────────────────────────────────
# Converts symptom keywords into a semantic search query for Pinecone.

QUERY_GENERATION_SYSTEM = """
You are an Ayurvedic scholar. Convert symptom keywords into a semantic 
search query optimized to retrieve relevant passages from classical 
Ayurvedic texts (Charaka Samhita, Sushruta Samhita, Ashtanga Hridayam).
Return ONLY the query string. No explanation.
""".strip()

QUERY_GENERATION_USER = """
Convert these symptom keywords into a search query for Ayurvedic classical texts:
Keywords: {keywords}

The query should use Ayurvedic terminology where possible.
Return a single descriptive query string (1-2 sentences max).
""".strip()

"""
services/rag_service.py
=======================
Handles all Pinecone vector database operations for the RAG pipeline.

Responsibilities:
  - Embed query text into vectors (via Mistral Embed API)
  - Query Pinecone for relevant Ayurvedic text chunks
  - Return ranked passages with source citations

Coordinate with Sangam Silwal (Knowledge Base) for:
  - Pinecone index name         → PINECONE_INDEX_NAME in config
  - Namespace conventions       → see NAMESPACES below

Owner: Khagendra Neupane (Prakriti Engine)
"""

import logging
from typing import Optional

import httpx
from pinecone import Pinecone

from app.config import settings

logger = logging.getLogger(__name__)

NAMESPACES = [
    "charaka-samhita",
    "sushruta-samhita",
    "ashtanga-hridayam",
]

TOP_K_PER_NS  = 3
MIN_RELEVANCE = 0.45

MISTRAL_EMBED_URL = "https://api.mistral.ai/v1/embeddings"


class RAGService:
    """
    Singleton-style service. Loaded once at startup via lifespan in main.py.
    Pinecone client is initialized once and reused. Embeddings via Mistral API.
    """

    def __init__(self):
        self._pc: Optional[Pinecone] = None
        self._index                  = None
        self._ready: bool            = False

    def initialize(self):
        """
        Call this once at app startup (from main.py lifespan).
        Connects to Pinecone. Embeddings are done live via Mistral API.
        """
        try:
            logger.info("RAGService: connecting to Pinecone...")
            self._pc    = Pinecone(api_key=settings.pinecone_api_key)
            self._index = self._pc.Index(settings.pinecone_index_name)

            stats = self._index.describe_index_stats()
            total = stats.get("total_vector_count", 0)
            logger.info(f"RAGService: ready — {total} vectors in index")
            self._ready = True

        except Exception as e:
            logger.error(f"RAGService: initialization failed — {e}")
            self._ready = False

    @property
    def ready(self) -> bool:
        return self._ready

    def _embed(self, text: str) -> list[float]:
        """
        Embed text via Mistral Embed API.

        Returns a list of floats.
        Raises RuntimeError if API call fails.
        """
        headers = {
            "Authorization": f"Bearer {settings.mistral_api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": settings.embedding_model,
            "input": text,
        }

        with httpx.Client(timeout=15.0) as client:
            resp = client.post(MISTRAL_EMBED_URL, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()

        try:
            return data["data"][0]["embedding"]
        except (KeyError, IndexError) as e:
            raise RuntimeError(f"Mistral Embed API unexpected response: {e}\n{data}")

    def retrieve(
        self,
        query: str,
        top_k: int = TOP_K_PER_NS,
        namespaces: list[str] = NAMESPACES,
        min_relevance: float = MIN_RELEVANCE,
    ) -> list[dict]:
        """
        Embed query via Mistral → search Pinecone across namespaces → return ranked chunks.

        Args:
            query:         Semantic search query (symptom keywords or generated query)
            top_k:         Number of results to fetch per namespace
            namespaces:    Pinecone namespaces to query
            min_relevance: Minimum cosine similarity threshold

        Returns:
            List of dicts: [{"text": ..., "source": ..., "relevance": ...}, ...]
            Sorted by relevance descending. Empty list if RAGService not ready.
        """
        if not self._ready:
            logger.warning("RAGService.retrieve called but service not ready — returning empty")
            return []

        if not query or not query.strip():
            logger.warning("RAGService.retrieve: empty query — returning empty")
            return []

        try:
            vector = self._embed(query)

            all_results: list[dict] = []

            for ns in namespaces:
                try:
                    response = self._index.query(
                        vector=vector,
                        top_k=top_k,
                        namespace=ns,
                        include_metadata=True,
                    )
                    for match in response.get("matches", []):
                        score    = match.get("score", 0.0)
                        metadata = match.get("metadata", {})

                        if score < min_relevance:
                            continue

                        all_results.append({
                            "text":      metadata.get("text", ""),
                            "source":    metadata.get("source", ns),
                            "relevance": round(float(score), 4),
                            "namespace": ns,
                        })
                except Exception as ns_err:
                    logger.warning(f"RAGService: namespace '{ns}' query failed — {ns_err}")
                    continue

            seen_texts = set()
            unique_results = []
            for r in sorted(all_results, key=lambda x: -x["relevance"]):
                text_key = r["text"][:80]
                if text_key not in seen_texts:
                    seen_texts.add(text_key)
                    unique_results.append(r)
                if len(unique_results) >= 6:
                    break

            logger.info(f"RAGService.retrieve: query='{query[:60]}...' → {len(unique_results)} chunks")
            return unique_results

        except Exception as e:
            logger.error(f"RAGService.retrieve error: {e}")
            return []

    def embed(self, text: str) -> list[float]:
        """
        Embed arbitrary text via Mistral Embed API.
        """
        if not self._ready:
            raise RuntimeError("RAGService not initialized")
        return self._embed(text)

    def health(self) -> dict:
        """Health check payload for /health endpoint."""
        return {
            "rag_service": "ok" if self._ready else "unavailable",
            "embedding_model": settings.embedding_model,
            "pinecone_index": settings.pinecone_index_name if self._ready else None,
        }


rag_service = RAGService()

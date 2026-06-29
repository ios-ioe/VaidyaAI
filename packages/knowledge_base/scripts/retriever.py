"""
Hybrid retrieval for the VaidyaAI knowledge base.

This module provides dense (semantic), sparse (BM25), and hybrid retrieval
over the indexed Ayurvedic corpus stored in Pinecone.

Retrieval strategies:
    - Dense Search:
        Uses Mistral embeddings and Pinecone vector similarity search to
        retrieve semantically relevant document chunks.

    - Sparse Search:
        Uses BM25 keyword matching over the indexed corpus for exact term
        and citation-based retrieval.

    - Hybrid Search:
        Combines dense and sparse rankings using Reciprocal Rank Fusion (RRF)
        to leverage the strengths of both semantic and lexical retrieval.

The primary entry point is `hybrid_search()`, which supports:
    - Dense-only retrieval
    - Sparse-only retrieval
    - Hybrid retrieval
    - Filtering by source document
Note: Using Both Dense search and Sparse Search may be little bit slow as it fetch all the corpus from the Database
It is Recommended to use Dense search only for normal searching and for deep searching use both Sparse search and Dense search
This module is intended to be used by downstream RAG pipelines and agents
to retrieve relevant context before passing it to a language model.
"""

from __future__ import annotations
import logging
import os
from pinecone import Pinecone
from packages.knowledge_base.scripts.ingest import get_embedder
from packages.knowledge_base.scripts.config import EMBEDDING_MODEL, PINECONE_INDEX_NAME, TOKEN_PATTERN, FETCH_BATCH_SIZE
from packages.knowledge_base.scripts.models import SearchResult
from rank_bm25 import BM25Okapi


logging.basicConfig(
    level=logging.INFO, format="%(asctime)s | %(levelname)-7s | %(message)s", datefmt="%H:%M:%S"
)
log = logging.getLogger("hybrid_search")


def get_index():
    api_key = os.environ.get("PINECONE_API_KEY")
    if not api_key:
        raise RuntimeError("PINECONE_API_KEY environment variable is not set")
    pc = Pinecone(api_key=api_key)
    existing = [info["name"] for info in pc.list_indexes()]
    if PINECONE_INDEX_NAME not in existing:
        raise RuntimeError(
            f"Index '{PINECONE_INDEX_NAME}' does not exist. "
        )
    return pc.Index(PINECONE_INDEX_NAME)

def dense_search(index, embedder, query:str, top_k:int, source_filter:str | None) -> list[SearchResult]:
    query_vector = embedder.embed_query(query)
    filter_dict = {"source":{"$eq":source_filter}} if source_filter else None
    response = index.query(vector=query_vector, top_k=top_k, include_metadata=True,filter=filter_dict)
    matches = response.matches if hasattr(response, "matches") else response.get("matches", [])
    results = []
    for rank, match in enumerate(matches):
        if hasattr(match, "metadata"):
            metadata = match.metadata or {}
            match_id = match.id
        else:
            metadata = match.get("metadata", {}) or {}
            match_id = match["id"]
        results.append(
            SearchResult(
                chunk_id=match_id,
                text=metadata.get("text", ""),
                metadata=metadata,
                dense_rank=rank,
            )
        )
    return results

def fetch_full_corpus(index, source_filter: str | None=None) -> list[SearchResult]:
    all_ids: list[str] = []
    for id_batch in index.list():
        all_ids.extend(id_batch)
    if not all_ids:
        return []
    corpus: list[SearchResult] = []
    for i in range(0, len(all_ids), FETCH_BATCH_SIZE):
        batch_ids = all_ids[i : i + FETCH_BATCH_SIZE]
        fetched = index.fetch(ids=batch_ids)
        if hasattr(fetched, "vectors"):
            vectors = fetched.vectors
        else:
            vectors = fetched.get("vectors", {})
        for chunk_id, record in vectors.items():
            if hasattr(record, "metadata"):
                metadata = record.metadata or {}
            else:
                metadata = record.get("metadata", {}) or {}
            if source_filter and metadata.get("source") != source_filter:
                continue
            corpus.append(SearchResult(chunk_id=chunk_id, text=metadata.get("text", ""), metadata=metadata))
    return corpus



def tokenize(text: str) -> list[str]:
    return TOKEN_PATTERN.findall(text.lower())

def sparse_search(corpus: list[SearchResult], query: str, top_k: int) -> list[SearchResult]:
    if not corpus:
        return []
    tokenized_corpus = [tokenize(r.text) for r in corpus]
    bm25 = BM25Okapi(tokenized_corpus)
    query_tokens = tokenize(query)
    scores = bm25.get_scores(query_tokens)
    ranked_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:top_k]
    results = []
    for rank, idx in enumerate(ranked_indices):
        if scores[idx] <= 0:
            continue  
        original = corpus[idx]
        results.append(
            SearchResult(
                chunk_id=original.chunk_id,
                text=original.text,
                metadata=original.metadata,
                sparse_rank=rank,
            )
        )
    return results


def reciprocal_rank_fusion(
        dense_results: list[SearchResult],
        sparse_results: list[SearchResult],
        top_k: int,
        rrf_k: int = 60,
        alpha: float = 0.5
) -> list[SearchResult]:
    merged: dict[str, SearchResult] = {}

    for r in dense_results:
        merged[r.chunk_id] = r
        merged[r.chunk_id].rrf_score += alpha * (1.0 / (rrf_k + r.dense_rank + 1))

    for r in sparse_results:
        if r.chunk_id in merged:
            merged[r.chunk_id].sparse_rank = r.sparse_rank
        else:
            merged[r.chunk_id] = r
        merged[r.chunk_id].rrf_score += (1 - alpha) * (1.0 / (rrf_k + r.sparse_rank + 1))

    fused = sorted(merged.values(), key=lambda r: r.rrf_score, reverse=True)
    return fused[:top_k]

def hybrid_search(
    query: str,
    top_k: int = 5,
    source_filter: str | None = None,
    alpha: float = 0.5,
    dense_only: bool = False,
    sparse_only: bool = False,
) -> list[SearchResult]:
    """
    Retrieve the most relevant document chunks using dense, sparse, or
    hybrid retrieval.

    By default, this function performs hybrid retrieval by combining
    semantic vector search (Pinecone + Mistral embeddings) with BM25
    keyword search using Reciprocal Rank Fusion (RRF). The returned
    results are ranked by their fused RRF score.

    Args:
        query: User query to search for.
        top_k: Maximum number of results to return.
        source_filter: Optional source name (e.g. "charaka-samhita") to
            restrict retrieval to a single corpus.
        alpha: Weight assigned to dense retrieval during RRF fusion.
            Values closer to 1.0 favor semantic search, while values
            closer to 0.0 favor keyword search.
        dense_only: If True, perform only semantic vector search.
        sparse_only: If True, perform only BM25 keyword search.

    Returns:
        A list of SearchResult objects sorted by relevance.

    Raises:
        RuntimeError: If the Pinecone index or embedding model cannot be
            initialized.
        ValueError: If both `dense_only` and `sparse_only` are True.
    """
    index = get_index()
    candidate_k = max(top_k * 4, 20)

    dense_results: list[SearchResult] = []
    sparse_results: list[SearchResult] = []

    if not sparse_only:
        embedder = get_embedder()
        log.info("Running dense (semantic) search...")
        dense_results = dense_search(index, embedder, query, candidate_k, source_filter)

    if not dense_only:
        log.info("Fetching corpus for BM25 (this may take a moment)...")
        corpus = fetch_full_corpus(index, source_filter)
        log.info(f"Running sparse (keyword) search over {len(corpus)} chunk(s)...")
        sparse_results = sparse_search(corpus, query, candidate_k)

    if dense_only:
        for rank, r in enumerate(dense_results):
            r.rrf_score = 1.0 / (60 + rank + 1)
        return dense_results[:top_k]

    if sparse_only:
        for rank, r in enumerate(sparse_results):
            r.rrf_score = 1.0 / (60 + rank + 1)
        return sparse_results[:top_k]

    return reciprocal_rank_fusion(dense_results, sparse_results, top_k, alpha=alpha)

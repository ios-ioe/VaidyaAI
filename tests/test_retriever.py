import pytest
from packages.knowledge_base.scripts.retriever import hybrid_search

def test_hybrid_search():
    results = hybrid_search(
        query="What is Vata?",
        top_k=5,
        dense_only=True
    )

    print("\nHybrid Search Results\n")
    print(f"Results returned: {len(results)}")

    for i, result in enumerate(results, start=1):
        print(f"\nResult {i}")
        print(f"  Chunk ID   : {result.chunk_id}")
        print(f"  Dense Rank : {result.dense_rank}")
        print(f"  Sparse Rank: {result.sparse_rank}")
        print(f"  RRF Score  : {result.rrf_score:.6f}")
        print(f"  Source     : {result.metadata.get('source')}")
        print(f"  Text       : {result.text[:200]}")

    assert len(results) > 0

    for result in results:
        assert result.chunk_id is not None
        assert result.text
        assert result.metadata is not None
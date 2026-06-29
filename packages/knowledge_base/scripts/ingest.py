"""
Knowledge Base Ingestion

This script loads Ayurvedic source texts, splits them into chunks, generates
embeddings, and uploads them to the Pinecone knowledge base used by the RAG
service.

The pipeline is intentionally format-agnostic. It currently supports `.txt`,
`.md`, and `.json` files under the `texts/` directory and converts them into a
common document format before chunking. This makes it easy to add new data
sources later without changing the embedding or indexing logic.

If the source material changes (for example, one JSON object per verse or a
different folder structure), you will most likely only need to update the
document loading code.

Using this Data Ingestion Pipeline:
    python scripts/ingest.py
    python scripts/ingest.py --dry-run
    python scripts/ingest.py --source charaka-samhita
    python scripts/ingest.py --chunk-size 800 --chunk-overlap 100
"""

from __future__ import annotations
import argparse
import json
import logging
import os
import sys
import time
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable
from packages.knowledge_base.scripts.config import *
from langchain_mistralai import MistralAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pinecone import Pinecone, ServerlessSpec
from packages.knowledge_base.scripts.models import RawDocument, Chunk

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("ingest")


def load_documents(source_filter: str | None = None) -> list[RawDocument]:
    if not TEXTS_DIR.exists():
        log.warning(f"Texts directory not found: {TEXTS_DIR}")
        return []

    documents: list[RawDocument] = []
    source_dirs = [d for d in TEXTS_DIR.iterdir() if d.is_dir()]

    if source_filter:
        source_dirs = [d for d in source_dirs if d.name == source_filter]
        if not source_dirs:
            log.warning(
                f"No folder named '{source_filter}' found under {TEXTS_DIR}"
            )
            return []

    if not source_dirs:
        log.warning(
            f"No source subfolders found under {TEXTS_DIR}. "
            f"Expected e.g. texts/charaka-samhita/, texts/sushruta-samhita/ ..."
        )
        return []

    for source_dir in sorted(source_dirs):
        source_name = source_dir.name
        files = sorted(
            p for p in source_dir.rglob("*") if p.suffix.lower() in SUPPORTED_EXTENSIONS
        )

        if not files:
            log.warning(f"No supported files found in {source_dir}")
            continue

        log.info(f"Loading {len(files)} file(s) from '{source_name}'...")

        for path in files:
            try:
                documents.extend(_load_single_file(path, source_name))
            except Exception as exc:
                log.error(f"Failed to load {path}: {exc}")

    log.info(f"Loaded {len(documents)} raw document(s) total.")
    return documents


def _load_single_file(path: Path, source_name: str) -> list[RawDocument]:
    base_metadata = {
        "source": source_name,
        "file_name": path.name,
    }

    if path.suffix.lower() in (".txt", ".md"):
        text = path.read_text(encoding="utf-8", errors="replace")
        if not text.strip():
            return []
        return [RawDocument(text=text, metadata=base_metadata)]

    if path.suffix.lower() == ".json":
        raw = json.loads(path.read_text(encoding="utf-8"))
        items = raw if isinstance(raw, list) else [raw]
        docs: list[RawDocument] = []

        for item in items:
            if not isinstance(item, dict):
                continue

            text = item.get("text") or item.get("content") or item.get("verse")
            if not text:
                log.warning(
                    f"Skipping item in {path.name} with no 'text'/'content'/'verse' field"
                )
                continue
            item_metadata = {
                **base_metadata,
                **{k: v for k, v in item.items() if k not in ("text", "content", "verse")},
            }
            docs.append(RawDocument(text=text, metadata=item_metadata))

        return docs

    return []

def chunk_documents(
    documents: list[RawDocument],
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    chunk_overlap: int = DEFAULT_CHUNK_OVERLAP,
) -> list[Chunk]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    chunks: list[Chunk] = []

    for doc in documents:
        pieces = splitter.split_text(doc.text)
        file_name = doc.metadata.get("file_name", "unknown")
        source = doc.metadata.get("source", "unknown")

        for i, piece in enumerate(pieces):
            piece = piece.strip()
            if not piece:
                continue

            chunk_id = f"{source}__{file_name}__{i}"
            chunk_metadata = {
                **doc.metadata,
                "chunk_index": i,
                "chunk_count": len(pieces),
                "text": piece,
            }
            chunks.append(Chunk(id=chunk_id, text=piece, metadata=chunk_metadata))

    log.info(f"Produced {len(chunks)} chunk(s) from {len(documents)} document(s).")
    return chunks

def get_or_create_index():
    api_key = os.environ.get("PINECONE_API_KEY")
    if not api_key:
        raise RuntimeError("PINECONE_API_KEY environment variable is not set.")

    pc = Pinecone(api_key=api_key)
    existing = [info["name"] for info in pc.list_indexes()]

    if PINECONE_INDEX_NAME not in existing:
        log.info(
            f"Index '{PINECONE_INDEX_NAME}' not found — creating it "
            f"(dimension={EMBEDDING_DIMENSIONS}, metric=cosine)..."
        )
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=EMBEDDING_DIMENSIONS,
            metric="cosine",
            spec=ServerlessSpec(cloud=PINECONE_CLOUD, region=PINECONE_REGION),
        )
        while not pc.describe_index(PINECONE_INDEX_NAME).status["ready"]:
            time.sleep(1)
    else:
        existing_dim = pc.describe_index(PINECONE_INDEX_NAME).dimension
        if existing_dim != EMBEDDING_DIMENSIONS:
            raise RuntimeError(
                f"Pinecone index '{PINECONE_INDEX_NAME}' exists with dimension "
                f"{existing_dim}, but {EMBEDDING_MODEL} produces "
                f"{EMBEDDING_DIMENSIONS}-dim vectors. Delete/recreate the index "
                f"or point PINECONE_INDEX_NAME at a different one."
            )

    return pc.Index(PINECONE_INDEX_NAME)


def get_embedder():
    api_key = os.environ.get("MISTRAL_API_KEY")
    if not api_key:
        raise RuntimeError("MISTRAL_API_KEY environment variable is not set.")

    return MistralAIEmbeddings(model=EMBEDDING_MODEL, api_key=api_key)


def upsert_chunks(chunks: list[Chunk], batch_size: int = 50) -> int:
    if not chunks:
        log.warning("No chunks to upsert.")
        return 0

    index = get_or_create_index()
    embedder = get_embedder()

    total_upserted = 0

    for batch_start in range(0, len(chunks), batch_size):
        batch = chunks[batch_start : batch_start + batch_size]
        texts = [c.text for c in batch]

        try:
            vectors = embedder.embed_documents(texts)
        except Exception as exc:
            log.error(
                f"Embedding failed for batch starting at index {batch_start}: {exc}"
            )
            continue

        records = [
            {"id": chunk.id, "values": vector, "metadata": chunk.metadata}
            for chunk, vector in zip(batch, vectors)
        ]

        try:
            index.upsert(vectors=records)
            total_upserted += len(records)
            log.info(
                f"Upserted batch {batch_start // batch_size + 1} "
                f"({len(records)} vectors, {total_upserted}/{len(chunks)} total)"
            )
        except Exception as exc:
            log.error(f"Upsert failed for batch starting at index {batch_start}: {exc}")

    return total_upserted


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--source",
        default=None,
        help="Only ingest one source folder under texts/ (e.g. charaka-samhita).",
    )
    parser.add_argument(
        "--chunk-size", type=int, default=DEFAULT_CHUNK_SIZE,
        help=f"Max characters per chunk (default: {DEFAULT_CHUNK_SIZE}).",
    )
    parser.add_argument(
        "--chunk-overlap", type=int, default=DEFAULT_CHUNK_OVERLAP,
        help=f"Overlap between chunks in characters (default: {DEFAULT_CHUNK_OVERLAP}).",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Load and chunk documents but skip embedding/upserting. "
             "Use this to sanity-check chunking before spending API calls.",
    )
    args = parser.parse_args()

    log.info(f"Looking for source texts in: {TEXTS_DIR}")
    documents = load_documents(source_filter=args.source)

    if not documents:
        log.warning(
            "No documents found to ingest. Add files under "
            f"{TEXTS_DIR}/<source-name>/ and re-run."
        )
        sys.exit(0)

    chunks = chunk_documents(
        documents, chunk_size=args.chunk_size, chunk_overlap=args.chunk_overlap
    )

    if args.dry_run:
        log.info("Dry run — skipping embedding/upsert. Sample of first 3 chunks:")
        for c in chunks[:3]:
            preview = c.text[:120].replace("\n", " ")
            log.info(f"  [{c.id}] {preview}...")
        log.info(f"Total: would upsert {len(chunks)} vector(s).")
        return

    log.info(
        f"Embedding {len(chunks)} chunk(s) with {EMBEDDING_MODEL} "
        f"and upserting into Pinecone index '{PINECONE_INDEX_NAME}'..."
    )
    count = upsert_chunks(chunks)
    log.info(f"Done. {count} vector(s) upserted into '{PINECONE_INDEX_NAME}'.")


if __name__ == "__main__":
    main()
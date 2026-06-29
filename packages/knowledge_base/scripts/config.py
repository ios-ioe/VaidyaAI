from pathlib import Path
import os
import re

SCRIPT_DIR = Path(__file__).resolve().parent
KB_ROOT = SCRIPT_DIR.parent                 
TEXTS_DIR = KB_ROOT / "texts"          
EMBEDDING_MODEL = "mistral-embed"
EMBEDDING_DIMENSIONS = 1024                 
PINECONE_INDEX_NAME = os.environ.get("PINECONE_INDEX_NAME", "vaidya-knowledge")
PINECONE_CLOUD = os.environ.get("PINECONE_CLOUD", "aws")
PINECONE_REGION = os.environ.get("PINECONE_REGION", "us-east-1")
DEFAULT_CHUNK_SIZE = 1000        
DEFAULT_CHUNK_OVERLAP = 150      
SUPPORTED_EXTENSIONS = {".txt", ".md", ".json"}
FETCH_BATCH_SIZE = 100
TOKEN_PATTERN = re.compile(r"[a-zA-Z0-9]+")
from dataclasses import dataclass,field

@dataclass
class SearchResult:
    chunk_id: str
    text: str
    metadata: dict
    dense_rank: int | None = None
    sparse_rank: int | None = None
    rrf_score: float = 0.0

@dataclass
class RawDocument:
    text: str
    metadata: dict = field(default_factory=dict)

    def __post_init__(self) -> None:
        self.text = self.text.strip()

@dataclass
class Chunk:
    id: str
    text: str
    metadata: dict
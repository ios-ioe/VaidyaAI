from pydantic import BaseModel, Field, model_validator
from typing import Optional


class PrakritiBlock(BaseModel):
    vata:  float = Field(..., ge=0, le=100, description="Vata score (0–100)")
    pitta: float = Field(..., ge=0, le=100, description="Pitta score (0–100)")
    kapha: float = Field(..., ge=0, le=100, description="Kapha score (0–100)")
    dominant: str = Field(..., description="Single dominant Dosha e.g. 'Vata'")
    secondary: str = Field(..., description="Second dominant Dosha e.g. 'Pitta'")
    type: str = Field(..., description="Combined type e.g. 'Vata-Pitta' or 'Vata'")

    @model_validator(mode="after")
    def scores_sum_to_100(self) -> "PrakritiBlock":
        total = self.vata + self.pitta + self.kapha
        if not (98 <= total <= 102):
            raise ValueError(f"Dosha scores must sum to 100, got {total:.1f}")
        return self


class VikritiBlock(BaseModel):
    vata:  float = Field(..., ge=0, le=100, description="Vata score (0–100)")
    pitta: float = Field(..., ge=0, le=100, description="Pitta score (0–100)")
    kapha: float = Field(..., ge=0, le=100, description="Kapha score (0–100)")
    imbalance: str = Field(..., description="Descriptive imbalance e.g. 'Vata aggravation'")

    @model_validator(mode="after")
    def scores_sum_to_100(self) -> "VikritiBlock":
        total = self.vata + self.pitta + self.kapha
        if not (98 <= total <= 102):
            raise ValueError(f"Dosha scores must sum to 100, got {total:.1f}")
        return self


class RetrievedChunk(BaseModel):
    text:       str = Field(..., description="Passage text from classical text")
    source:     str = Field(..., description="e.g. 'Charaka Samhita, Sutrasthana 17'")
    relevance:  float = Field(..., ge=0, le=1, description="Cosine similarity score")


class PrakritiRequest(BaseModel):
    transcript:      str = Field(
        ...,
        min_length=50,
        description="Full consultation transcript text (doctor + patient dialogue)"
    )
    patient_id:      str = Field(..., description="UUID of the patient record")
    session_id:      Optional[str] = Field(
        default=None,
        description="UUID of the consultation session (auto-generated if not provided)"
    )
    language:        str = Field(
        default="english",
        description="Transcript language: 'english' | 'hindi' | 'nepali' | 'sanskrit'"
    )
    prior_prakriti:  Optional[PrakritiBlock] = Field(
        default=None,
        description="Patient's previously assessed Prakriti, if available"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "transcript": "D: What brings you in today?\nP: I've been having very dry skin, can't sleep well, and my stomach is always bloated...",
                "patient_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                "session_id": None,
                "language": "english",
                "prior_prakriti": None
            }
        }


class PrakritiResponse(BaseModel):
    prakriti:           PrakritiBlock = Field(
        ..., description="Constitutional Dosha type — stable across visits"
    )
    vikriti:            VikritiBlock = Field(
        ..., description="Current Dosha imbalance — changes with lifestyle/season"
    )
    confidence:         float = Field(
        ..., ge=0, le=1,
        description="Model confidence in the assessment (0–1)"
    )
    reasoning:          str = Field(
        ..., description="Plain-language explanation of the Dosha assessment"
    )
    citations:          list[RetrievedChunk] = Field(
        default=[],
        description="Classical text passages used to ground the assessment"
    )
    session_id:         Optional[str] = Field(
        default=None,
        description="Echo of the input session_id"
    )
    patient_id:         str = Field(
        ..., description="Echo of the input patient_id"
    )
    extracted_keywords: list[str] = Field(
        default=[],
        description="Symptom keywords extracted from transcript before RAG retrieval"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "prakriti": {
                    "vata": 60, "pitta": 25, "kapha": 15,
                    "dominant": "Vata", "secondary": "Pitta", "type": "Vata-Pitta"
                },
                "vikriti": {
                    "vata": 75, "pitta": 18, "kapha": 7,
                    "imbalance": "Vata aggravation"
                },
                "confidence": 0.84,
                "reasoning": "Patient exhibits classic Vata aggravation: dry skin, insomnia, bloating, and anxiety suggest Vata prakopa with disturbance in Apana and Prana Vata.",
                "citations": [
                    {
                        "text": "Ruksha, laghu, sheeta, khara, sookshma and chala are the qualities of Vata...",
                        "source": "Charaka Samhita, Sutrasthana 12.8",
                        "relevance": 0.91
                    }
                ],
                "session_id": "s1e2s3s4-i5o6-7890-abcd-ef1234567890",
                "patient_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                "extracted_keywords": ["dry skin", "insomnia", "bloating", "anxiety"]
            }
        }

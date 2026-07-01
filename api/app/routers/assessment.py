"""
routers/assessment.py
=====================
FastAPI router for Prakriti / Vikriti assessment endpoints.

Endpoints:
  POST /api/assessment/prakriti   ← main assessment endpoint
  GET  /api/assessment/health     ← RAG service health check

Design: thin router — no business logic here.
All logic lives in prakriti_service.py.

Owner: Khagendra Neupane (Prakriti Engine)
"""

import logging
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse

from app.models.dosha import PrakritiRequest, PrakritiResponse
from app.services.prakriti_service import prakriti_service
from app.services.rag_service import rag_service

# TODO: uncomment when Sambhav's auth middleware is merged
# from app.middleware.auth import get_current_practitioner

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/assessment",
    tags=["Prakriti Engine"],
)


# ── POST /api/assessment/prakriti ─────────────────────────────────────────────

@router.post(
    "/prakriti",
    response_model=PrakritiResponse,
    status_code=status.HTTP_200_OK,
    summary="Assess patient Prakriti and Vikriti",
    description="""
    Runs the full RAG pipeline on a consultation transcript to assess:
    - **Prakriti** — patient's constitutional Dosha type (stable)
    - **Vikriti** — patient's current Dosha imbalance (dynamic)

    Pipeline:
    1. Extracts symptom keywords from transcript
    2. Retrieves relevant classical Ayurvedic text passages (Charaka, Sushruta, Ashtanga)
    3. Grounds LLM reasoning in retrieved passages
    4. Returns structured Dosha scores with citations and reasoning

    **Note:** Requires RAG service (Pinecone) to be initialized.
    If Pinecone is unavailable, assessment proceeds without classical text grounding.
    """,
)
async def assess_prakriti(
    request: PrakritiRequest,
    # current_user = Depends(get_current_practitioner),  # TODO: enable after auth is merged
) -> PrakritiResponse:
    """
    Main Prakriti/Vikriti assessment endpoint.

    Called by:
      - Frontend: consultation/[sessionId]/assessment view
      - Treatment Advisor (Sangam): passes PrakritiResponse to treatment pipeline
      - Patient Reports (Sambhav): includes assessment in PDF generation
    """
    logger.info(
        f"POST /assessment/prakriti | "
        f"patient={request.patient_id} | "
        f"session={request.session_id} | "
        f"lang={request.language} | "
        f"transcript_len={len(request.transcript)}"
    )

    try:
        result = await prakriti_service.assess(request)
        logger.info(
            f"  Assessment complete | "
            f"prakriti={result.prakriti.dominant} | "
            f"vikriti={result.vikriti.imbalance} | "
            f"confidence={result.confidence:.2f}"
        )
        return result

    except ValueError as e:
        # LLM parse failure or invalid input
        logger.warning(f"  Assessment ValueError: {e}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Assessment failed: {str(e)}"
        )

    except Exception as e:
        # Unexpected error — log full traceback
        logger.exception(f"  Assessment unexpected error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal error during Prakriti assessment. Please try again."
        )


# ── GET /api/assessment/health ────────────────────────────────────────────────

@router.get(
    "/health",
    summary="Prakriti engine health check",
    description="Returns status of the RAG service and Pinecone connection.",
)
async def health_check() -> JSONResponse:
    """
    Health check for the Prakriti module.
    Called by CI/CD and monitoring to verify RAG service is live.
    """
    health = rag_service.health()
    status_code = status.HTTP_200_OK if health["rag_service"] == "ok" else status.HTTP_503_SERVICE_UNAVAILABLE
    return JSONResponse(content=health, status_code=status_code)


# ── GET /api/assessment/test ──────────────────────────────────────────────────
# Development-only endpoint to quickly test the pipeline with a sample transcript.
# Remove or guard behind env check before production.

@router.get(
    "/test",
    summary="[DEV ONLY] Run assessment on sample transcript",
    include_in_schema=False,   # hidden from Swagger in production
)
async def test_assessment() -> PrakritiResponse:
    """Quick smoke test — uses a hardcoded Vata sample transcript."""
    sample_request = PrakritiRequest(
        transcript=(
            "D: What brings you in today?\n"
            "P: I've been having very dry skin, and I can't sleep well at night. "
            "My stomach is always bloated and I feel anxious all the time.\n"
            "D: How long has this been going on?\n"
            "P: About 3 months now, since I changed jobs. I travel a lot for work.\n"
            "D: How is your digestion?\n"
            "P: Very irregular. Sometimes I'm not hungry at all, other times I eat too much.\n"
            "D: Any joint pain or cracking sounds?\n"
            "P: Yes, my knees crack when I sit down.\n"
            "D: What does your diet look like?\n"
            "P: Mostly cold food, salads, a lot of raw vegetables. I skip breakfast often.\n"
            "D: How is your sleep?\n"
            "P: I wake up between 2 and 4 AM and my mind won't stop racing."
        ),
        patient_id="test-patient-001",
        session_id="test-session-001",
        language="english",
    )
    return await prakriti_service.assess(sample_request)

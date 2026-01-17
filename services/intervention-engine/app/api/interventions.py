from fastapi import APIRouter
from app.services.intervention_service import (
    fetch_dispersion,
    apply_interventions
)
from app.schemas.intervention_schema import (
    InterventionRequest,
    InterventionResponse
)

router = APIRouter(prefix="/interventions", tags=["Interventions"])


@router.post("", response_model=InterventionResponse)
def run_interventions(payload: InterventionRequest):
    concentrations = fetch_dispersion()
    updated = apply_interventions(
        concentrations,
        [i.dict() for i in payload.interventions]
    )

    return {
        "results": [
            {
                "grid_id": gid,
                "concentration": round(val, 4)
            }
            for gid, val in updated.items()
        ]
    }

@router.get("")
def interventions_info():
    return {
        "message": "Use POST /interventions to apply mitigation actions"
    }


from fastapi import APIRouter
from app.services.dispersion_service import (
    fetch_adjacency,
    fetch_emissions,
    simulate_dispersion
)
from app.schemas.dispersion_schema import DispersionResponse
from config import TIME_STEPS

router = APIRouter(prefix="/dispersion", tags=["Dispersion"])


@router.get("", response_model=DispersionResponse)
def run_dispersion():
    adjacency = fetch_adjacency()
    emissions = fetch_emissions()

    final_state = simulate_dispersion(adjacency, emissions)

    return {
        "time_steps": TIME_STEPS,
        "results": [
            {
                "grid_id": gid,
                "concentration": round(val, 4)
            }
            for gid, val in final_state.items()
        ]
    }

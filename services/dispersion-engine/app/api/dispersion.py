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
def run_dispersion(wind_speed: float = 0, wind_deg: float = 0, temp: float = 25.0, humidity: float = 60.0):
    adj_data, centroids, obstructions = fetch_adjacency()
    emissions = fetch_emissions()

    final_state = simulate_dispersion(adj_data, emissions, centroids, wind_speed, wind_deg, obstructions, temp, humidity)

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

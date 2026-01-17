from fastapi import APIRouter
from app.services.emission_service import fetch_grids, compute_emissions
from app.schemas.emission_schema import EmissionResponse

router = APIRouter(prefix="/emissions", tags=["Emissions"])


@router.get("", response_model=EmissionResponse)
def get_emissions():
    grids = fetch_grids()
    emissions = compute_emissions(grids)

    return {
        "total_grids": len(emissions),
        "emissions": [
            {
                "grid_id": e.grid_id,
                "emission": e.value
            } for e in emissions
        ]
    }

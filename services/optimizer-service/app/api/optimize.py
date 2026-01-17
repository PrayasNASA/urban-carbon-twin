from fastapi import APIRouter
from app.services.optimizer_service import optimize
from app.schemas.optimizer_schema import OptimizeRequest, OptimizeResponse

router = APIRouter(prefix="/optimize", tags=["Optimization"])


@router.post("", response_model=OptimizeResponse)
def run_optimization(payload: OptimizeRequest):
    plan, spent = optimize(payload.budget)

    return {
        "total_budget": payload.budget,
        "budget_used": round(spent, 2),
        "plan": [
            {
                "grid_id": p.grid_id,
                "intervention": p.intervention,
                "units": p.units,
                "cost": p.cost,
                "expected_reduction": round(p.gain, 4)
            }
            for p in plan
        ]
    }

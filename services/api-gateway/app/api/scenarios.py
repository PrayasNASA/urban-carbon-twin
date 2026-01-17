from fastapi import APIRouter
from app.schemas.scenario_schema import ScenarioRequest, ScenarioResponse
from app.services.orchestrator import (
    run_emissions,
    run_dispersion,
    run_optimization,
    run_interventions
)

router = APIRouter(prefix="/scenario", tags=["Scenario"])


@router.post("", response_model=ScenarioResponse)
def run_scenario(payload: ScenarioRequest):

    emissions = run_emissions()
    dispersion = run_dispersion()
    optimization = run_optimization(payload.budget)

    post_intervention = None
    if payload.interventions:
        post_intervention = run_interventions(
            [i.dict() for i in payload.interventions]
        )

    return {
        "emissions": emissions,
        "dispersion": dispersion,
        "optimization_plan": optimization,
        "post_intervention": post_intervention
    }

from pydantic import BaseModel
from typing import List, Optional


class InterventionInput(BaseModel):
    grid_id: str
    type: str
    units: int


class ScenarioRequest(BaseModel):
    budget: float
    interventions: Optional[List[InterventionInput]] = None


class ScenarioResponse(BaseModel):
    emissions: dict
    dispersion: dict
    optimization_plan: dict
    post_intervention: Optional[dict]

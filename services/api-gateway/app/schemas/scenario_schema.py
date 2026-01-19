from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class Intervention(BaseModel):
    grid_id: str
    type: str # 'roadside_capture', 'green_buffer'
    units: int

class ScenarioRequest(BaseModel):
    budget: float
    interventions: List[Intervention] = []

class ScenarioResponse(BaseModel):
    emissions: Dict[str, Any]
    dispersion: Dict[str, Any]
    optimization_plan: Dict[str, Any]
    post_intervention: Optional[Dict[str, Any]] = None

class ComparisonRequest(BaseModel):
    scenario_a_budget: float
    scenario_b_budget: float

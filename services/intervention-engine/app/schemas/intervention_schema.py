from pydantic import BaseModel
from typing import List


class InterventionInput(BaseModel):
    grid_id: str
    type: str
    units: int


class InterventionRequest(BaseModel):
    interventions: List[InterventionInput]


class GridResult(BaseModel):
    grid_id: str
    concentration: float


class InterventionResponse(BaseModel):
    results: List[GridResult]

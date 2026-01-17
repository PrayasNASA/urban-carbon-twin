from pydantic import BaseModel
from typing import List


class OptimizeRequest(BaseModel):
    budget: float


class PlanItemSchema(BaseModel):
    grid_id: str
    intervention: str
    units: int
    cost: float
    expected_reduction: float


class OptimizeResponse(BaseModel):
    total_budget: float
    budget_used: float
    plan: List[PlanItemSchema]

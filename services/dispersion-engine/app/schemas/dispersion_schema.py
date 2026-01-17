from pydantic import BaseModel
from typing import List


class GridDispersion(BaseModel):
    grid_id: str
    concentration: float


class DispersionResponse(BaseModel):
    time_steps: int
    results: List[GridDispersion]

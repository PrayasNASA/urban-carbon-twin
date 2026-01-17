from pydantic import BaseModel
from typing import List


class EmissionSchema(BaseModel):
    grid_id: str
    emission: float


class EmissionResponse(BaseModel):
    total_grids: int
    emissions: List[EmissionSchema]

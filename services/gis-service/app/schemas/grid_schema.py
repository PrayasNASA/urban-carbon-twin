from pydantic import BaseModel
from typing import List


class GridSchema(BaseModel):
    grid_id: str
    road_length: float
    building_count: int
    avg_building_height: float
    polygon: List[list[float]]

from dataclasses import dataclass
from shapely.geometry import Polygon

@dataclass
class Grid:
    grid_id: str
    polygon: Polygon
    road_length: float = 0.0
    building_count: int = 0
    avg_building_height: float = 0.0

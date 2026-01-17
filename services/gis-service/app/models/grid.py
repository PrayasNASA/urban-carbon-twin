from shapely.geometry import Polygon

class Grid:
    def __init__(self, grid_id: str, polygon: Polygon):
        self.grid_id = grid_id
        self.polygon = polygon

        # Road attributes
        self.road_length = 0.0

        # Building attributes
        self.building_count = 0
        self.avg_building_height = 0.0

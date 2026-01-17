import geopandas as gpd
from app.models.grid import Grid

ROADS_FILE = "data/raw/roads.geojson"


def load_roads():
    roads = gpd.read_file(ROADS_FILE)
    return roads.to_crs(epsg=4326)


def attach_roads_to_grids(grids: list[Grid], roads_gdf):
    for grid in grids:
        intersecting = roads_gdf[roads_gdf.intersects(grid.polygon)]

        total_length = 0.0
        for geom in intersecting.geometry:
            clipped = geom.intersection(grid.polygon)
            total_length += clipped.length

        grid.road_length = total_length

    return grids

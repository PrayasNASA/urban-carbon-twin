from functools import lru_cache
import geopandas as gpd
from app.models.grid import Grid
from app.utils.gcs_loader import load_geojson


@lru_cache(maxsize=1)
def load_roads():
    """
    Load roads GeoJSON from Google Cloud Storage
    """
    geojson = load_geojson("raw/roads.geojson")

    gdf = gpd.GeoDataFrame.from_features(geojson["features"])
    gdf = gdf.set_crs(epsg=4326, allow_override=True)

    return gdf


def attach_roads_to_grids(grids: list[Grid], roads_gdf):
    """
    Attach total road length to each grid
    """
    for grid in grids:
        intersecting = roads_gdf[roads_gdf.intersects(grid.polygon)]

        total_length = 0.0
        for geom in intersecting.geometry:
            clipped = geom.intersection(grid.polygon)
            total_length += clipped.length

        grid.road_length = total_length

    return grids

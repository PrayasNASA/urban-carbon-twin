from fastapi import APIRouter
from app.services.grid_service import generate_grids
from app.services.road_service import load_roads, attach_roads_to_grids
from app.services.building_service import load_buildings, attach_buildings_to_grids
from app.schemas.grid_schema import GridSchema

router = APIRouter(prefix="/city", tags=["GIS"])


@router.get("/grids", response_model=list[GridSchema])
def get_city_grids():
    # ✅ Load data INSIDE request
    roads_gdf = load_roads()
    buildings_gdf = load_buildings()

    grids = generate_grids()

    grids = attach_roads_to_grids(grids, roads_gdf)
    grids = attach_buildings_to_grids(grids, buildings_gdf)

    response = []
    for g in grids:
        response.append({
            "grid_id": g.grid_id,
            "road_length": round(g.road_length, 4),
            "building_count": g.building_count,
            "avg_building_height": round(g.avg_building_height, 2),
            "polygon": list(g.polygon.exterior.coords)
        })

    return response

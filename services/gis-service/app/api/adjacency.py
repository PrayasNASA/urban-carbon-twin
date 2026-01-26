from fastapi import APIRouter
from app.services.grid_service import generate_grids
from app.services.adjacency_service import build_adjacency
from app.schemas.adjacency_schema import AdjacencySchema

router = APIRouter(prefix="/city", tags=["Adjacency"])


@router.get("/adjacency", response_model=AdjacencySchema)
def get_grid_adjacency():
    grids = generate_grids()
    return build_adjacency(grids)

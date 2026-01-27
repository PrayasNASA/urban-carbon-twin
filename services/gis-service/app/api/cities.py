from fastapi import APIRouter
from app.services.city_service import get_cities

router = APIRouter(prefix="/city", tags=["Cities"])

@router.get("/presets")
def list_city_presets():
    """
    Get list of all configured city presets.
    """
    return get_cities()

from fastapi import APIRouter
import requests
from config import GIS_BASE_URL

router = APIRouter(prefix="/gis", tags=["GIS Proxy"])

@router.get("/city/presets")
def get_city_presets():
    """
    Proxy request to GIS Service for city presets.
    """
    try:
        r = requests.get(f"{GIS_BASE_URL}/city/presets")
        r.raise_for_status()
        return r.json()
    except Exception as e:
        return {"error": str(e)}

@router.get("/city/grids")
def get_city_grids():
    """
    Proxy request to GIS Service for city grids.
    """
    try:
        r = requests.get(f"{GIS_BASE_URL}/city/grids")
        r.raise_for_status()
        return r.json()
    except Exception as e:
        return {"error": str(e)}

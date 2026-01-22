
from fastapi import APIRouter, HTTPException, Query
from app.services.gee_service import get_co2_data

router = APIRouter()

@router.get("/co2")
def get_carbon_data(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    start_date: str = Query(None, description="Start Date YYYY-MM-DD"),
    end_date: str = Query(None, description="End Date YYYY-MM-DD")
):
    """
    Get satellite-based Carbon/CO data for a specific coordinate from Google Earth Engine.
    """
    data = get_co2_data(lat, lon, start_date, end_date)
    if not data:
        raise HTTPException(status_code=404, detail="No data found for this location/period")
    if "error" in data:
         raise HTTPException(status_code=500, detail=data["error"])
         
    return data

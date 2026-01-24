
from fastapi import APIRouter, HTTPException, Query
from app.services.aqi_service import get_aqi_data

router = APIRouter()

@router.get("/co2")  # Keeping endpoint name to avoid breaking frontend immediately, or we could alias it.
def get_carbon_data(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    start_date: str = Query(None, description="Start Date YYYY-MM-DD"),
    end_date: str = Query(None, description="End Date YYYY-MM-DD")
):
    """
    Get Real-Time Air Quality (AQI) for a specific coordinate.
    (Previously Satellite CO2)
    """
    # Simply ignore dates for real-time AQI
    data = get_aqi_data(lat, lon)
    
    if not data:
        raise HTTPException(status_code=404, detail="No data found for this location")
    if "error" in data:
         raise HTTPException(status_code=500, detail=data["error"])
         
    return data

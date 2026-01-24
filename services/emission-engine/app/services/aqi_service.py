import requests
from datetime import datetime

def get_aqi_data(lat: float, lon: float):
    """
    Fetch Real-Time AQI from Open-Meteo.
    Returns a dictionary structure compatible with the frontend.
    """
    url = "https://air-quality-api.open-meteo.com/v1/air-quality"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "us_aqi,pm2_5",
        "timezone": "auto"
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        current = data.get("current", {})
        aqi = current.get("us_aqi", 0)
        pm25 = current.get("pm2_5", 0.0)
        
        # Geocoding (Basic reverse lookup or identical to previous logic)
        # For simplicity, we can do a quick lookup if needed, 
        # but let's just return "Selected Location" or try to import the existing logic if easy.
        # For now, minimal implementation.
        place_name = f"Location ({lat:.2f}, {lon:.2f})"
        try:
             # Attempt to use the same geopy logic if available? 
             # Or just skip it to keep this service focused. 
             # The previous service had geocopy builtin.
             pass
        except:
            pass

        return {
            "location": {"lat": lat, "lon": lon},
            "place_name": place_name, # Can be updated by the caller if they have geocoding
            "period": {"from": datetime.now().isoformat(), "to": datetime.now().isoformat()},
            "value": aqi,
            "unit": "US AQI",
            "full_details": {
                "aqi": aqi,
                "pm2_5": pm25,
                "unit": "µg/m³"
            },
            "sensor": "Open-Meteo (Real-Time)"
        }

    except Exception as e:
        print(f"AQI Fetch failed: {e}")
        # Fallback / Error
        return {
            "error": str(e),
            "location": {"lat": lat, "lon": lon},
            "value": 0,
            "unit": "N/A"
        }

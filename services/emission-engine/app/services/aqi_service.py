import requests
from datetime import datetime

def get_aqi_data(lat: float, lon: float):
    """
    Fetch Comprehensive Environmental Data (AQI, Pollutants, Weather) from Open-Meteo.
    Returns a dictionary structure compatible with the frontend.
    """
    # 1. Fetch Air Quality Data
    aqi_url = "https://air-quality-api.open-meteo.com/v1/air-quality"
    aqi_params = {
        "latitude": lat,
        "longitude": lon,
        "current": "us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,sulphur_dioxide,carbon_monoxide",
        "timezone": "auto"
    }

    # 2. Fetch Weather Data
    weather_url = "https://api.open-meteo.com/v1/forecast"
    weather_params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,wind_speed_10m,wind_direction_10m",
        "timezone": "auto"
    }

    try:
        # Parallel fetch could be better, but sequential is fine for now
        aqi_res = requests.get(aqi_url, params=aqi_params, timeout=5)
        aqi_res.raise_for_status()
        aqi_data = aqi_res.json().get("current", {})

        weather_res = requests.get(weather_url, params=weather_params, timeout=5)
        weather_res.raise_for_status()
        weather_data = weather_res.json().get("current", {})
        
        # Place Name Resolution
        place_name = f"Location ({lat:.2f}, {lon:.2f})"
        
        # Construct rich response
        return {
            "location": {"lat": lat, "lon": lon},
            "place_name": place_name, 
            "period": {"from": datetime.now().isoformat(), "to": datetime.now().isoformat()},
            "value": aqi_data.get("us_aqi", 0), # Primary Metric for Map Color
            "unit": "US AQI",
            
            # Detailed breakdown for "Environmental Panel"
            "full_details": {
                "aqi": aqi_data.get("us_aqi", 0),
                "pollutants": {
                    "pm2_5": {"value": aqi_data.get("pm2_5", 0), "unit": "µg/m³", "label": "PM2.5"},
                    "pm10": {"value": aqi_data.get("pm10", 0), "unit": "µg/m³", "label": "PM10"},
                    "no2": {"value": aqi_data.get("nitrogen_dioxide", 0), "unit": "µg/m³", "label": "NO₂"},
                    "so2": {"value": aqi_data.get("sulphur_dioxide", 0), "unit": "µg/m³", "label": "SO₂"},
                    "o3": {"value": aqi_data.get("ozone", 0), "unit": "µg/m³", "label": "O₃"},
                    "co": {"value": aqi_data.get("carbon_monoxide", 0), "unit": "µg/m³", "label": "CO"}
                },
                "weather": {
                    "temp": weather_data.get("temperature_2m", 0),
                    "humidity": weather_data.get("relative_humidity_2m", 0),
                    "wind_speed": weather_data.get("wind_speed_10m", 0),
                    "wind_dir": weather_data.get("wind_direction_10m", 0),
                    "precipitation": weather_data.get("precipitation", 0),
                    "feels_like": weather_data.get("apparent_temperature", 0)
                }
            },
            "sensor": "Open-Meteo (Real-Time Station)"
        }

    except Exception as e:
        print(f"Data Fetch failed: {e}")
        return {
            "error": str(e),
            "location": {"lat": lat, "lon": lon},
            "value": 0,
            "unit": "N/A"
        }

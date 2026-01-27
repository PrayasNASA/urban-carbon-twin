import os
import requests
import time
import math
from typing import Optional

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

# Simple in-memory cache
_cache = {}
CACHE_TTL = 900 # 15 minutes

def get_live_weather(lat: float, lon: float):
    cache_key = f"{round(lat, 2)}_{round(lon, 2)}"
    now = time.time()
    
    if cache_key in _cache:
        data, ts = _cache[cache_key]
        if now - ts < CACHE_TTL:
            return data

    if not OPENWEATHER_API_KEY:
        raise ValueError("OPENWEATHER_API_KEY is not set. Live weather data is required.")

    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        r = requests.get(url, timeout=5)
        r.raise_for_status()
        w = r.json()
        
        result = {
            "wind_speed": w["wind"]["speed"],
            "wind_deg": w["wind"]["deg"],
            "temp": w["main"]["temp"],
            "humidity": w["main"]["humidity"],
            "source": "OpenWeatherMap"
        }
        _cache[cache_key] = (result, now)
        return result
    except Exception as e:
        print(f"Error fetching real weather: {e}")
        # Re-raise exception to ensure no mock data is used
        raise e

import os
import requests
import time
import math
from typing import Optional

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

# Simple in-memory cache
_cache = {}
CACHE_TTL = 900  # 15 minutes


def _synthetic_weather(lat: float, lon: float) -> dict:
    """Generate realistic synthetic weather based on lat/lon so simulations never fail."""
    # Estimate temperature from latitude (tropical = warm, polar = cold)
    base_temp = 30.0 - abs(lat) * 0.5
    # Add a time-based variation so it feels live
    hour_variation = math.sin(time.time() / 3600) * 3.0
    temp = round(base_temp + hour_variation, 1)

    # Wind from lat/lon hash to make it deterministic but varied
    seed = (abs(lat) * 13 + abs(lon) * 7) % 360
    wind_deg = round(seed % 360)
    wind_speed = round(2.5 + abs(math.sin(seed)) * 4.5, 1)
    humidity = round(50 + abs(math.cos(lat)) * 30)

    return {
        "wind_speed": wind_speed,
        "wind_deg": wind_deg,
        "temp": temp,
        "humidity": humidity,
        "precipitation": 0,
        "source": "Synthetic Environmental Feed (Fallback)"
    }


def get_live_weather(lat: float, lon: float):
    cache_key = f"{round(lat, 2)}_{round(lon, 2)}"
    now = time.time()

    if cache_key in _cache:
        data, ts = _cache[cache_key]
        if now - ts < CACHE_TTL:
            return data

    if not OPENWEATHER_API_KEY:
        print("⚠️ Warning: OPENWEATHER_API_KEY not set. Using Synthetic Environmental Feed.")
        result = _synthetic_weather(lat, lon)
        _cache[cache_key] = (result, now)
        return result

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
            "precipitation": w.get("rain", {}).get("1h", 0),
            "source": "OpenWeatherMap"
        }
        _cache[cache_key] = (result, now)
        return result
    except Exception as e:
        print(f"⚠️ Weather API error ({type(e).__name__}): {e}. Falling back to synthetic data.")
        # ALWAYS fall back — never crash the simulation for a weather issue
        result = _synthetic_weather(lat, lon)
        _cache[cache_key] = (result, now)
        return result

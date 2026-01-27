import requests
from config import (
    GIS_BASE_URL,
    EMISSION_ENGINE_URL,
    DISPERSION_ENGINE_URL,
    INTERVENTION_ENGINE_URL,
    OPTIMIZER_ENGINE_URL,
    GOOGLE_CLOUD_PROJECT,
    GOOGLE_CLOUD_LOCATION
)
import json
from .weather_service import get_live_weather

def run_emissions():
    r = requests.get(f"{EMISSION_ENGINE_URL}/emissions")
    r.raise_for_status()
    return r.json()


def fetch_grid_geometries():
    """
    Fetches the full grid geometries from GIS Service.
    """
    try:
        r = requests.get(f"{GIS_BASE_URL}/city/grids")
        r.raise_for_status()
        grids = r.json()
        # Map of grid_id -> polygon coords
        return {g["grid_id"]: g["polygon"] for g in grids}
    except Exception as e:
        print(f"Error fetching grid geometries: {e}")
        return {}


def run_dispersion(wind_speed: float = 0, wind_deg: float = 0, temp: float = 25.0, humidity: float = 60.0):
    r = requests.get(
        f"{DISPERSION_ENGINE_URL}/dispersion",
        params={"wind_speed": wind_speed, "wind_deg": wind_deg, "temp": temp, "humidity": humidity}
    )
    r.raise_for_status()
    data = r.json()
    
    # Enrich with geometries if available
    geoms = fetch_grid_geometries()
    if geoms:
        for res in data.get("results", []):
            gid = res.get("grid_id")
            if gid in geoms:
                res["geometry"] = {
                    "type": "Polygon",
                    "coordinates": [geoms[gid]]
                }
    
    return data


def run_optimization(budget: float):
    r = requests.post(
        f"{OPTIMIZER_ENGINE_URL}/optimize",
        json={"budget": budget}
    )
    r.raise_for_status()
    return r.json()


def run_interventions(interventions: list):
    try:
        r = requests.post(
            f"{INTERVENTION_ENGINE_URL}/interventions",
            json={"interventions": interventions}
        )
        r.raise_for_status()
        data = r.json()
        
        # Enrich with geometries for map rendering
        geoms = fetch_grid_geometries()
        if geoms:
            results = data if isinstance(data, list) else data.get("results", [])
            for res in results:
                gid = res.get("grid_id")
                if gid in geoms:
                    res["geometry"] = {
                        "type": "Polygon",
                        "coordinates": [geoms[gid]]
                    }
        return data
    except Exception as e:
        print(f"Intervention Run Failed: {e}")
        return []


def get_gee_co2(lat: float, lon: float):
    r = requests.get(f"{EMISSION_ENGINE_URL}/api/v1/gee/co2?lat={lat}&lon={lon}")
    r.raise_for_status()
    return r.json()


def init_simulation(lat: float, lon: float, budget: float, initial_aqi: float = None):
    payload = {"lat": lat, "lon": lon, "budget": budget}
    if initial_aqi is not None:
        payload["initial_aqi"] = initial_aqi
        
    r = requests.post(
        f"{EMISSION_ENGINE_URL}/simulation/initialize",
        json=payload
    )
    r.raise_for_status()
    return r.json()


def run_full_simulation(lat, lon, budget, initial_aqi=None):
    """
    Orchestrates the entire simulation: Weather -> Emissions -> Dispersion -> Optimization.
    """
    weather = get_live_weather(lat, lon)
    emissions_resp = init_simulation(lat, lon, budget, initial_aqi)
    
    dispersion_resp = run_dispersion(
        weather["wind_speed"], 
        weather["wind_deg"],
        weather["temp"],
        weather["humidity"]
    )
    
    optimization_resp = run_optimization(budget)
    sentiment = calculate_sentiment(optimization_resp)
    
    emissions_disp = emissions_resp.get("dispersion", {})
    voronoi_results = emissions_disp.get("results", [])
    is_dynamic = len(voronoi_results) > 0 and voronoi_results[0].get("geometry")
    
    if is_dynamic:
        final_dispersion = emissions_disp
        final_optimization = emissions_resp.get("optimization_plan")
        if final_optimization is None:
            final_optimization = {"error": "Optimization plan missing", "status": "FAILED_DIAGNOSTIC"}
    else:
        final_dispersion = dispersion_resp
        final_optimization = optimization_resp
        if final_optimization is None:
            final_optimization = {"error": "Optimizer service returned no plan", "status": "FAILED_DIAGNOSTIC"}
        
        if final_optimization and "plan" in final_optimization:
            for item in final_optimization["plan"]:
                if "gain" in item and "expected_reduction" not in item:
                    item["expected_reduction"] = item["gain"]

    return {
        "weather": weather,
        "emissions": emissions_resp,
        "dispersion": final_dispersion,
        "optimization_plan": final_optimization,
        "sentiment": sentiment
    }


def analyze_scenario(results: dict):
    """
    Use Gemini 1.5 Pro to analyze simulation results.
    Returns analysis + actual model stats.
    """
    import time
    start_time = time.time()
    latency_ms = 0
    
    try:
        import vertexai
        from vertexai.generative_models import GenerativeModel
        
        vertexai.init(project=GOOGLE_CLOUD_PROJECT, location=GOOGLE_CLOUD_LOCATION)
        gen_model = GenerativeModel("gemini-1.5-flash-001")
        
        prompt = f"""
        You are the "Urban Carbon Twin" Strategic Intelligence Engine. 
        Analyze these urban CO2 sequestration results and provide expert strategic insights.

        CONTEXT DATA:
        {json.dumps(results, indent=2)}

        TASK:
        1. SUMMARY: Provide a 2-3 sentence executive overview of the climate impact.
        2. JUSTIFICATION: Explain the scientific or economic logic behind the deployment pattern.
        3. INNOVATIVE SUGGESTION: Suggest one creative, high-impact policy/technical move.
        4. CONFIDENCE: Give a numerical score (0.0 to 1.0).

        STYLE: Professional, Solarpunk, and actionable.
        RESPONSE FORMAT: Strict JSON only.
        {{
            "summary": "...",
            "justification": "...",
            "insight": "...",
            "confidence": 0.XX
        }}
        """
        
        response = gen_model.generate_content(prompt)
        latency_ms = int((time.time() - start_time) * 1000)
        
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
            
        analysis = json.loads(text)
        
        tokens = 0
        try:
            tokens = response.usage_metadata.candidates_token_count + response.usage_metadata.prompt_token_count
        except:
            pass
            
        analysis["_stats"] = {"latency": latency_ms, "tokens": tokens}
        return analysis
        
    except Exception as e:
        latency_ms = int((time.time() - start_time) * 1000)
        print(f"CRITICAL AI FAILURE: {e}")
        return {
            "summary": "AI Intelligence Engine is recalibrating.",
            "justification": f"Diagnostic: {str(e)}",
            "insight": "Run another simulation or check Vertex AI permissions.",
            "confidence": 0.1,
            "_stats": {"latency": latency_ms, "tokens": 0}
        }


def get_market_pulse():
    import random
    from datetime import datetime, timedelta
    history = []
    base_price = 45.50
    for i in range(20):
        base_price += random.uniform(-1.2, 1.5)
        history.append({
            "timestamp": (datetime.now() - timedelta(minutes=5*(20-i))).isoformat(),
            "price": round(base_price, 2)
        })

    return {
        "current_price": history[-1]["price"],
        "price_unit": "USD/tCO2",
        "trend": "UP" if history[-1]["price"] > history[-2]["price"] else "DOWN",
        "history": history,
        "market_status": "VOLATILE",
        "source": "Synthetic Market Feed"
    }


def calculate_sentiment(optimization_plan: dict):
    if "error" in optimization_plan or not optimization_plan.get("plan"):
        return {"approval": 0.5, "tag": "NEUTRAL", "reason": "No data available."}
    
    score = 0.6
    green_boost = ["Urban Reforestation", "Green Rooftops", "Algae Panels"]
    industrial_penalty = ["Carbon Scrubbers", "DAC Modules", "Roadside Capture"]
    
    plan = optimization_plan.get("plan", [])
    for item in plan:
        iv = item.get("intervention")
        if any(g in iv for g in green_boost):
            score += 0.05
        elif any(i in iv for i in industrial_penalty):
            score -= 0.02
            
    score = max(0.1, min(0.95, score))
    tags = {(0.8, 1.0): "ENTHUSIASTIC", (0.6, 0.8): "FAVORABLE", (0.4, 0.6): "NEUTRAL", (0.2, 0.4): "SKEPTICAL", (0.0, 0.2): "HOSTILE"}
    tag = "NEUTRAL"
    for (low, high), t in tags.items():
        if low <= score < high:
            tag = t
            break
            
    return {
        "approval": round(score, 2),
        "tag": tag,
        "metrics": {"eco_index": round(score * 1.2, 2), "disruption_index": round((1-score) * 0.5, 2)}
    }

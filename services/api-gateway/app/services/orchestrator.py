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
import vertexai
from vertexai.generative_models import GenerativeModel, Part
import json

# Initialize Vertex AI
vertexai.init(project=GOOGLE_CLOUD_PROJECT, location=GOOGLE_CLOUD_LOCATION)
model = GenerativeModel("gemini-1.5-flash-001")
import math


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


def run_dispersion(wind_speed: float = 0, wind_deg: float = 0):
    r = requests.get(
        f"{DISPERSION_ENGINE_URL}/dispersion",
        params={"wind_speed": wind_speed, "wind_deg": wind_deg}
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


def get_live_weather(lat: float, lon: float):
    # In a real app, call OpenWeatherMap/Apple Weather
    # For now, simulate live variations based on coordinates and time
    import time
    t = time.time()
    return {
        "wind_speed": 5.0 + math.sin(t/3600) * 3,
        "wind_deg": (180 + math.cos(t/3600) * 90) % 360,
        "temp": 25.0 + math.sin(t/86400) * 5,
        "humidity": 60 + math.cos(t/3600) * 20
    }


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
            # Result usually has a 'grids' or list structure. Adjust based on intervention service.
            # Assuming data is list of grids or data['results']
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
    # 1. Get Live Weather
    weather = get_live_weather(lat, lon)
    
    # 2. Start simulation on emission engine (Baseline)
    emissions_resp = init_simulation(lat, lon, budget, initial_aqi)
    
    # 3. Run Dispersion with Live Wind
    dispersion_resp = run_dispersion(weather["wind_speed"], weather["wind_deg"])
    
    # 4. Run Optimization
    optimization_resp = run_optimization(budget)
    
    # 5. Calculate Social Sentiment
    sentiment = calculate_sentiment(optimization_resp)
    
    # 6. Result Consolidation Logic
    # ----------------------------
    # Priority: Dynamic (Voronoi) > Static (Rectangular)
    
    # Check if emissions engine produced a full optimized simulation (Voronoi)
    emissions_disp = emissions_resp.get("dispersion", {})
    voronoi_results = emissions_disp.get("results", [])
    
    # We define it as dynamic if it has results with explicit geometries (Voronoi)
    is_dynamic = len(voronoi_results) > 0 and voronoi_results[0].get("geometry")
    
    if is_dynamic:
        # For Dynamic: Use the self-contained dispersion and plan from emissions engine
        final_dispersion = emissions_disp
        final_optimization = emissions_resp.get("optimization_plan", optimization_resp)
    else:
        # For Static: Use the dispersion engine results (enriched with GIS geoms)
        final_dispersion = dispersion_resp
        final_optimization = optimization_resp
        
        # SCHEMA UNIFICATION: ResultsPanel expects 'expected_reduction'
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
    Use Gemini 1.5 Pro to analyze the simulation results and provide strategic insights.
    """
    prompt = f"""
    You are the Urban Carbon Twin AI Strategy Engine. 
    Analyze the following urban CO2 simulation results and provide a professional, 
    insightful summary for city planners.

    Simulation Results:
    {json.dumps(results, indent=2)}

    Your response should include:
    1. A high-level executive summary (2-3 sentences).
    2. Strategic justification for the proposed interventions.
    3. One "Creative Insight" based on spatial or environmental patterns.
    4. A confidence rating for the plan.

    Keep the tone professional, futuristic (Solarpunk), and actionable.
    Format your response as a JSON object with keys: "summary", "justification", "insight", "confidence".
    """
    
    response = model.generate_content(prompt)
    
    try:
        # Attempt to parse JSON from response
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
            
        return json.loads(text)
    except Exception as e:
        print(f"Error parsing Gemini response: {e}")
        return {
            "summary": "AI analysis completed but format was unexpected.",
            "justification": "Analysis suggests the current plan is viable for the defined budget.",
            "insight": "Focus on high-density traffic zones for maximum ROI.",
            "confidence": 0.85,
            "raw_text": response.text
        }


def get_market_pulse():
    """
    Simulates a dynamic carbon market with price fluctuations and history.
    """
    import random
    import time
    
    # Current base price $42.50
    current_price = 42.50 + random.uniform(-2, 2)
    
    # Generate mock history for the last 24 hours
    history = []
    now = time.time()
    for i in range(24):
        t = now - (24 - i) * 3600
        # Random walk for history
        if i == 0:
            p = 40.0
        else:
            p = history[-1]["price"] + random.uniform(-1.5, 1.5)
        
        history.append({
            "timestamp": time.strftime('%H:%M', time.gmtime(t)),
            "price": round(p, 2)
        })
    
    return {
        "current_price": round(current_price, 2),
        "history": history,
        "market_status": "VOLATILE" if abs(current_price - 42.5) > 1 else "STABLE",
        "trend": "UP" if current_price > history[-1]["price"] else "DOWN"
    }


def calculate_sentiment(optimization_plan: dict):
    """
    Calculates public sentiment based on the chosen interventions.
    """
    if "error" in optimization_plan or not optimization_plan.get("plan"):
        return {"approval": 0.5, "tag": "NEUTRAL", "reason": "No data available."}
    
    score = 0.6  # Base approval
    
    # Interventions that increase sentiment
    green_boost = ["Urban Reforestation", "Green Rooftops", "Algae Panels"]
    # Interventions that might be neutral or slightly intrusive
    industrial_penalty = ["Carbon Scrubbers", "DAC Modules", "Roadside Capture"]
    
    plan = optimization_plan.get("plan", [])
    for item in plan:
        iv = item.get("intervention")
        if any(g in iv for g in green_boost):
            score += 0.05
        elif any(i in iv for i in industrial_penalty):
            score -= 0.02
            
    score = max(0.1, min(0.95, score))
    
    tags = {
        (0.8, 1.0): "ENTHUSIASTIC",
        (0.6, 0.8): "FAVORABLE",
        (0.4, 0.6): "NEUTRAL",
        (0.2, 0.4): "SKEPTICAL",
        (0.0, 0.2): "HOSTILE"
    }
    
    tag = "NEUTRAL"
    for (low, high), t in tags.items():
        if low <= score < high:
            tag = t
            break
            
    return {
        "approval": round(score, 2),
        "tag": tag,
        "metrics": {
            "eco_index": round(score * 1.2, 2),
            "disruption_index": round((1-score) * 0.5, 2)
        }
    }

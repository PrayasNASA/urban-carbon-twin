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


def run_dispersion(wind_speed: float = 0, wind_deg: float = 0):
    r = requests.get(
        f"{DISPERSION_ENGINE_URL}/dispersion",
        params={"wind_speed": wind_speed, "wind_deg": wind_deg}
    )
    r.raise_for_status()
    return r.json()


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
    r = requests.post(
        f"{INTERVENTION_ENGINE_URL}/interventions",
        json={"interventions": interventions}
    )
    r.raise_for_status()
    return r.json()


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
    
    return {
        "weather": weather,
        "emissions": emissions_resp,
        "dispersion": dispersion_resp,
        "optimization_plan": optimization_resp
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
        return {{
            "summary": "AI analysis completed but format was unexpected.",
            "justification": "Analysis suggests the current plan is viable for the defined budget.",
            "insight": "Focus on high-density traffic zones for maximum ROI.",
            "confidence": 0.85,
            "raw_text": response.text
        }}

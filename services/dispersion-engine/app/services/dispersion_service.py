import requests
from app.models.state import GridState
from config import (
    GIS_BASE_URL,
    EMISSION_ENGINE_URL,
    DIFFUSION_FACTOR,
    DECAY_FACTOR,
    TIME_STEPS
)


def fetch_adjacency():
    r = requests.get(f"{GIS_BASE_URL}/city/adjacency")
    r.raise_for_status()
    data = r.json()
    return data["adjacency"], data.get("centroids", {}), data.get("obstructions", {})


def fetch_emissions():
    r = requests.get(f"{EMISSION_ENGINE_URL}/emissions")
    r.raise_for_status()
    data = r.json()["emissions"]
    return {e["grid_id"]: e["emission"] for e in data}


import math

def simulate_dispersion(adjacency, emissions, centroids=None, wind_speed=0, wind_deg=0, obstructions=None, temp=25.0, humidity=60.0):
    state = emissions.copy()
    obstructions = obstructions or {}
    
    # Atmospheric adjustments
    # Higher temp = faster diffusion (Boyles Law approximation)
    temp_factor = 1.0 + (temp - 25.0) * 0.02
    # Higher humidity = heavier particles = slower diffusion
    humidity_factor = 1.0 - (humidity - 60.0) * 0.005
    
    effective_diffusion = DIFFUSION_FACTOR * temp_factor * humidity_factor
    # Higher temp might increase natural decay slightly
    effective_decay = DECAY_FACTOR * (1.0 + max(0, temp - 25.0) * 0.01)

    # Pre-calculate wind vector if wind_speed > 0
    flow_deg = (270 - wind_deg) % 360
    flow_rad = math.radians(flow_deg)
    ux, uy = math.cos(flow_rad), math.sin(flow_rad)

    for _ in range(TIME_STEPS):
        new_state = state.copy()

        for grid_id, value in state.items():
            neighbors = adjacency.get(grid_id, [])
            if not neighbors:
                continue

            # Base spread
            spread_amount = value * effective_diffusion
            
            # 🏙️ Urban Canyon Effect: Buildings obstruct air flow
            # Higher buildings = higher roughness = lower dispersion rate
            h_base = obstructions.get(grid_id, 0)
            # Reduce spread by up to 40% based on building height (capped at 50m)
            obstruction_multiplier = 1.0 - (min(h_base, 50) / 50) * 0.4
            spread_amount *= obstruction_multiplier
            
            # Wind influence
            # Neighbor scores based on alignment with wind vector
            neighbor_scores = {}
            total_score = 0
            
            c_base = centroids.get(grid_id) if centroids else None
            
            for n in neighbors:
                score = 1.0 # default weight
                if c_base and centroids and n in centroids:
                    c_n = centroids[n]
                    # direction vector to neighbor
                    dx, dy = c_n[0] - c_base[0], c_n[1] - c_base[1]
                    dist = math.sqrt(dx**2 + dy**2) or 1
                    dx, dy = dx/dist, dy/dist
                    
                    # dot product with wind flow vector
                    dot = dx*ux + dy*uy
                    # Increase weight if neighbor is downwind
                    # scale by wind speed (normalized)
                    bias = max(0, dot) * (wind_speed * 0.1) 
                    score += bias
                
                neighbor_scores[n] = score
                total_score += score

            new_state[grid_id] -= spread_amount

            for n in neighbors:
                # Distribute based on scores
                per_neighbor = spread_amount * (neighbor_scores[n] / total_score)
                new_state[n] += per_neighbor

        # Natural decay
        for g in new_state:
            new_state[g] *= (1 - effective_decay)

        state = new_state

    return state

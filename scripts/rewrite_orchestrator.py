import re

with open('services/api-gateway/app/services/orchestrator.py', 'r') as f:
    content = f.read()

# Replace config imports since we don't need remote URLs anymore
content = re.sub(r'from config import \([^)]+\)', 'from config import (\n    GOOGLE_CLOUD_PROJECT,\n    GOOGLE_CLOUD_LOCATION,\n    TIME_STEPS\n)', content)

# Remove the remote fetchers
remote_funcs = ['run_emissions', 'fetch_grid_geometries', 'run_dispersion', 'run_optimization', 'run_interventions', 'get_gee_co2', 'init_simulation']

# Instead of removing them, simply replace them with mock/local forms
# 1. get_gee_co2
new_get_gee = """def get_gee_co2(lat: float, lon: float):
    from .aqi_service import get_aqi_data
    return get_aqi_data(lat, lon)
"""
content = re.sub(r'def get_gee_co2.*?return r\.json\(\)\s*', new_get_gee, content, flags=re.DOTALL)

# 2. init_simulation
# We'll embed the math logic
new_init = """def init_simulation(lat: float, lon: float, budget: float, initial_aqi: float = None):
    import math, numpy as np
    from shapely.geometry import Polygon, box
    from scipy.spatial import Voronoi
    from .aqi_service import get_aqi_data

    def generate_voronoi_regions(center_lat, center_lon, num_points=120, radius_deg=0.03):
        points = [[center_lon, center_lat]]
        phi = (1 + 5**0.5) / 2
        for i in range(1, num_points):
            angle = 2 * math.pi * i / (phi**2)
            r = radius_deg * math.sqrt(i / num_points)
            jx = math.sin(i * 123.456) * (radius_deg / 20)
            jy = math.cos(i * 789.012) * (radius_deg / 20)
            points.append([center_lon + r * math.cos(angle) + jx, center_lat + r * math.sin(angle) + jy])
        vor = Voronoi(np.array(points))
        regions = []
        bbox = box(center_lon - radius_deg, center_lat - radius_deg, center_lon + radius_deg, center_lat + radius_deg)
        for pt_idx, reg_idx in enumerate(vor.point_region):
            reg = vor.regions[reg_idx]
            if -1 in reg or len(reg) == 0: continue
            poly = Polygon(vor.vertices[reg])
            clipped = poly.intersection(bbox)
            if not clipped.is_empty and isinstance(clipped, Polygon):
                regions.append({
                    "id": str(pt_idx),
                    "geometry": {"type": "Polygon", "coordinates": [list(clipped.exterior.coords)]},
                    "lat": clipped.centroid.y,
                    "lon": clipped.centroid.x
                })
        return regions

    sim_id = f"sim_{hash(f'{lat}{lon}{budget}')}"
    base_aqi = initial_aqi if initial_aqi else get_aqi_data(lat, lon).get("value", 50)
    
    voronoi_cells = generate_voronoi_regions(lat, lon)
    results = []
    total_ideal_cost = 0
    
    for i, cell in enumerate(voronoi_cells):
        dist = ((cell["lat"] - lat)**2 + (cell["lon"] - lon)**2)**0.5
        factor = max(0, 1 - (dist / 0.04))
        noise = 1.0 + 0.3 * math.sin(i * 0.7) * math.cos(i * 0.3)
        conc = base_aqi * (0.8 + factor * 0.4) * noise
        if conc > 80:
             total_ideal_cost += 5000 * (2.0 if conc > 150 else 1.0)
        results.append({"grid_id": f"Desc-{i:03d}", "concentration": conc, "lat": cell["lat"], "lon": cell["lon"], "geometry": cell["geometry"]})

    total_ideal_cost = max(80000, total_ideal_cost)
    mitigation_power = min(0.95, budget / total_ideal_cost)
    deployment_plan = []
    
    sorted_results = sorted(results, key=lambda x: x["concentration"], reverse=True)
    
    for grid in results:
        eff = mitigation_power * (1.2 if grid["concentration"] > 100 else 0.8)
        grid["concentration"] *= (1 - min(0.9, eff))
        
    budget_remaining = budget
    for grid in sorted_results[:15]:
        if budget_remaining <= 0: break
        cost_share = min(budget_remaining, budget / 15)
        budget_remaining -= cost_share
        
        curr = grid["concentration"]
        eff = min(0.9, mitigation_power * (1.2 if curr > 80 else 0.8))
        orig = curr / (1 - eff) if eff < 1 else curr
        
        deployment_plan.append({
            "grid_id": grid["grid_id"],
            "intervention": "Smog Tower" if orig > 150 else "Nano-Mist Ops",
            "cost": cost_share,
            "expected_reduction": orig - curr,
            "units": "AQI"
        })

    return {
        "dispersion": {"results": results},
        "optimization_plan": {
            "simulation_id": sim_id, "status": "Analysis Optimized", "solver": "Monotonic-Spiral-V3",
            "total_budget": budget, "budget_used": budget - budget_remaining,
            "ideal_budget_required": total_ideal_cost, "plan": deployment_plan
        }
    }
"""
content = re.sub(r'def init_simulation.*?return r\.json\(\)\s*', new_init, content, flags=re.DOTALL)

# Stub out run_dispersion and run_optimization since run_full_simulation avoids them if dynamic
content = re.sub(r'def run_dispersion.*?return data\s*', 'def run_dispersion(*args, **kwargs):\n    return {"results": []}\n\n', content, flags=re.DOTALL)
content = re.sub(r'def run_optimization.*?return r\.json\(\)\s*', 'def run_optimization(*args, **kwargs):\n    return {"plan": []}\n\n', content, flags=re.DOTALL)

with open('services/api-gateway/app/services/orchestrator.py', 'w') as f:
    f.write(content)

print("Orchestrator rewritten successfully!")

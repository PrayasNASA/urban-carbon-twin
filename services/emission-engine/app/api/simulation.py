
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Any
import math
import numpy as np
from scipy.spatial import Voronoi
from shapely.geometry import Polygon, box, Point
from shapely.ops import clip_by_rect

router = APIRouter()

class SimulationRequest(BaseModel):
    lat: float
    lon: float
    budget: float = 50000.0

class GridResult(BaseModel):
    grid_id: str
    concentration: float
    lat: float
    lon: float
    geometry: Optional[Any] = None # GeoJSON Polygon
    
class DispersionData(BaseModel):
    results: List[GridResult]

class SimulationResponse(BaseModel):
    dispersion: DispersionData
    optimization_plan: Optional[dict] = None


from app.services.aqi_service import get_aqi_data


def generate_voronoi_regions(center_lat, center_lon, num_points=120, radius_deg=0.03):
    # Purely mathematical point generation (Spiral-Grid)
    # No np.random involved to ensure 100% stability
    points = []
    
    # 1. Add center point
    points.append([center_lon, center_lat])
    
    # 2. Add points in a Fermat's Spiral pattern
    # This creates a very even, natural-looking distribution
    phi = (1 + 5**0.5) / 2 # Golden ratio
    for i in range(1, num_points):
        # Calculate angle and distance based on golden ratio
        angle = 2 * math.pi * i / (phi**2)
        r = radius_deg * math.sqrt(i / num_points)
        
        # Add a tiny deterministic jitter using sine waves
        # This keeps the "irregular" district look without randomness
        jitter_x = math.sin(i * 123.456) * (radius_deg / 20)
        jitter_y = math.cos(i * 789.012) * (radius_deg / 20)
        
        p_lon = center_lon + r * math.cos(angle) + jitter_x
        p_lat = center_lat + r * math.sin(angle) + jitter_y
        points.append([p_lon, p_lat])
        
    points = np.array(points)
    
    # helper to voronoi
    vor = Voronoi(points)
    
    regions = []
    bbox = box(center_lon - radius_deg, center_lat - radius_deg, center_lon + radius_deg, center_lat + radius_deg)
    
    for point_idx, region_idx in enumerate(vor.point_region):
        region = vor.regions[region_idx]
        if -1 in region or len(region) == 0: continue
            
        polygon_points = vor.vertices[region]
        poly = Polygon(polygon_points)
        clipped = poly.intersection(bbox)
        
        if not clipped.is_empty and isinstance(clipped, Polygon):
            coords = list(clipped.exterior.coords)
            centroid = clipped.centroid
            
            regions.append({
                "id": str(point_idx),
                "geometry": {"type": "Polygon", "coordinates": [coords]},
                "lat": centroid.y,
                "lon": centroid.x
            })
            
    return regions

@router.post("/initialize", response_model=SimulationResponse)
def initialize_simulation(req: SimulationRequest):
    # Hash for tracking this specific run
    sim_id = f"sim_{hash(f'{req.lat}{req.lon}{req.budget}')}"
    
    # Fetch real baseline (stable) from AQI Service
    real_data = get_aqi_data(req.lat, req.lon)
    # Get AQI, default to 50 if missing
    base_aqi = real_data.get("value", 50) if real_data else 50
    
    # Map AQI to Grid Concentration Logic for Colors
    # CityMap Logic: Red >= 80, Amber >= 50, Green < 50
    # AQI Logic: Hazardous > 300, Unhealthy > 100, Moderate > 50
    
    # Scaling Factor:
    # If AQI = 300 (Hazardous) -> Concentration should be ~90 (Red)
    # If AQI = 150 (Unhealthy) -> Concentration should be ~60 (Amber)
    # If AQI = 30 (Good) -> Concentration should be ~20 (Green)
    
    display_base = base_aqi * 0.35 # 300 * 0.35 = 105 (Red), 150 * 0.35 = 52.5 (Amber)
    
    # Generate stable map
    voronoi_cells = generate_voronoi_regions(req.lat, req.lon)
    
    results = []
    total_ideal_cost = 0
    
    # 1. GENERATE BASELINE (Fixed for Location)
    for i, cell in enumerate(voronoi_cells):
        dist = ((cell["lat"] - req.lat)**2 + (cell["lon"] - req.lon)**2)**0.5
        factor = max(0, 1 - (dist / 0.04))
        
        # Use a deterministic noise function (sinusoidal) instead of random
        noise = 1.0 + 0.3 * math.sin(i * 0.7) * math.cos(i * 0.3)
        concentration = display_base * (0.8 + factor * 0.4) * noise
        
        if concentration > 40:
             multiplier = 2.0 if concentration > 80 else 1.0
             total_ideal_cost += 4000 * multiplier
             
        results.append(GridResult(
            grid_id=f"Zone-{i:03d}",
            concentration=concentration,
            lat=cell["lat"],
            lon=cell["lon"],
            geometry=cell["geometry"]
        ))

    # 2. APPLY BUDGET (Strictly Monotonic)
    total_budget = req.budget
    total_ideal_cost = max(80000, total_ideal_cost)
    
    # Factor is strictly tied to budget ratio
    mitigation_factor = min(0.98, total_budget / total_ideal_cost)
    
    deployment_plan = []
    
    # Sort for the plan display
    high_concentration_grids = sorted(results, key=lambda x: x.concentration, reverse=True)

    # Reduction Step
    for grid in results:
        # Hotspots get penalized/mitigated slightly more efficiently if there's budget
        power = 1.1 if grid.concentration > 70 else 1.0
        grid.concentration = grid.concentration * (1 - (mitigation_factor ** (1/power)))

    # Plan Summary (UI only)
    budget_remaining = total_budget
    for grid in high_concentration_grids[:15]:
        if budget_remaining <= 0: break
        cost_share = min(budget_remaining, total_budget / 15)
        budget_remaining -= cost_share
        deployment_plan.append({
            "grid_id": grid.grid_id,
            "intervention": "Quantum Filtration" if grid.concentration > 30 else "Bio-Regrid",
            "cost": cost_share,
            "expected_reduction": mitigation_factor * 100
        })

    return SimulationResponse(
        dispersion=DispersionData(results=results),
        optimization_plan={
            "simulation_id": sim_id,
            "status": "Analysis Optimized",
            "solver": "Monotonic-Spiral-V3",
            "total_budget": total_budget,
            "budget_used": total_budget - budget_remaining,
            "ideal_budget_required": total_ideal_cost,
            "plan": deployment_plan
        }
    )



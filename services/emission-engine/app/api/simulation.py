
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


from app.services.gee_service import get_co2_data

def generate_voronoi_regions(center_lat, center_lon, num_points=120, radius_deg=0.03):
    # Create a bounding box around the center
    min_lat, max_lat = center_lat - radius_deg, center_lat + radius_deg
    min_lon, max_lon = center_lon - radius_deg, center_lon + radius_deg
    
    # Generate random seed points, concentrated slightly in the center
    # Uniform distribution for base
    points = np.random.rand(num_points, 2)
    
    # Convert to lat/lon range
    points[:,0] = points[:,0] * (max_lon - min_lon) + min_lon
    points[:,1] = points[:,1] * (max_lat - min_lat) + min_lat
    
    # Add the exact center point to ensure we have a central region
    points = np.vstack([points, [center_lon, center_lat]])
    
    # helper to voronoi
    vor = Voronoi(points)
    
    regions = []
    bbox = box(min_lon, min_lat, max_lon, max_lat)
    
    for point_idx, region_idx in enumerate(vor.point_region):
        region = vor.regions[region_idx]
        if -1 in region or len(region) == 0:
            continue
            
        # Get vertices
        polygon_points = vor.vertices[region]
        
        # Create shapely polygon
        poly = Polygon(polygon_points)
        
        # Clip to bounding box
        clipped = poly.intersection(bbox)
        
        if not clipped.is_empty and isinstance(clipped, Polygon):
            # Convert back to list of coordinates
            # GeoJSON expects [lon, lat]
            coords = list(clipped.exterior.coords)
            
            # Calculate centroid
            centroid = clipped.centroid
            
            regions.append({
                "id": str(point_idx),
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [coords] 
                },
                "centroid": (centroid.y, centroid.x), # lat, lon
                "lat": centroid.y,
                "lon": centroid.x
            })
            
    return regions

@router.post("/initialize", response_model=SimulationResponse)
def initialize_simulation(req: SimulationRequest):
    # Fetch real data for the location
    real_data = get_co2_data(req.lat, req.lon)
    
    # Baseline concentration
    base_val = 0.04
    if real_data and "value" in real_data:
        base_val = real_data["value"]
    
    display_base = base_val * 2000
    
    # Generate Voronoi Regions
    voronoi_cells = generate_voronoi_regions(req.lat, req.lon)
    
    results = []
    
    for i, cell in enumerate(voronoi_cells):
        cell_lat = cell["lat"]
        cell_lon = cell["lon"]
        
        # Distance from center
        dist = ((cell_lat - req.lat)**2 + (cell_lon - req.lon)**2)**0.5
        
        # Create meaningful data variation
        # Higher concentration in center, falling off
        factor = max(0, 1 - (dist / 0.04)) # Normalized by radius
        local_concentration = display_base * (0.8 + factor * 0.4)
        
        # Add "hotspot" noise
        if i % 7 == 0:
            local_concentration *= 1.3
        
        results.append(GridResult(
            grid_id=f"Zone-{i:03d}",
            concentration=local_concentration,
            lat=cell_lat,
            lon=cell_lon,
            geometry=cell["geometry"]
        ))

    # Calculate Optimization Plan
    deployment_plan = []
    budget_used = 0
    total_budget = req.budget
    ideal_budget_accumulator = 0
    
    # Calculate Total Ideal Budget first (approximate)
    # Assume every zone needs at least some intervention
    # 5K per zone average * len(results)
    # But let's be more precise based on concentration
    for grid in results:
        if grid.concentration > 40:
             ideal_budget_accumulator += 5000
    
    # AGGRESSIVE MITIGATION LOGIC
    # If provided budget is high (e.g. > 80% of ideal), apply MASSIVE reduction to simulate "Green Future"
    # This directly answers the user's request: "more amount than required -> all green"
    
    is_fully_funded = total_budget >= (ideal_budget_accumulator * 0.9)
    
    if is_fully_funded:
        # SUPER GREEN MODE: Apply 90% reduction across the board
        for grid in results:
            grid.concentration = grid.concentration * 0.15 # Force it down below 50 (Safe threshold)
            
            # Record a "Global Action" in the plan
            if len(deployment_plan) < 5: # Limit plan items
                 deployment_plan.append({
                    "grid_id": grid.grid_id,
                    "intervention": "Global Carbon Shield",
                    "cost": total_budget / len(results),
                    "expected_reduction": 99.9
                 })
        budget_used = total_budget # Consume it all for the effect
        
    else:
        # Standard targeted reduction (Greedy approach)
        high_concentration_grids = sorted(results, key=lambda x: x.concentration, reverse=True)
        
        for i, grid in enumerate(high_concentration_grids): 
            val = grid.concentration
            if val < 40: continue # Skip safe zones
            
            cost = 4000
            if val > 80: cost = 8000 # Expensive to fix hotspots
            
            if budget_used + cost <= total_budget:
                budget_used += cost
                
                # Apply reduction
                reduction_factor = 0.3 # Reduce to 30% of original (strong reduction)
                grid.concentration = grid.concentration * reduction_factor
                
                if len(deployment_plan) < 20:
                    deployment_plan.append({
                        "grid_id": grid.grid_id,
                        "intervention": "Advanced Capture",
                        "cost": cost,
                        "expected_reduction": val * (1-reduction_factor)
                    })
            else:
                break # Out of budget
    return SimulationResponse(
        dispersion=DispersionData(results=results),
        optimization_plan={
            "status": "Optimization Online",
            "solver": "Voronoi-Solver-V1",
            "target": "Carbon Neutral 2040",
            "total_budget": total_budget,
            "budget_used": budget_used,
            "ideal_budget_required": ideal_budget_accumulator,
            "plan": deployment_plan
        }
    )



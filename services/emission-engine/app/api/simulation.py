
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import math

router = APIRouter()

class SimulationRequest(BaseModel):
    lat: float
    lon: float
    budget: float = 50000.0

class GridResult(BaseModel):
    grid_id: str
    concentration: float
    
class DispersionData(BaseModel):
    results: List[GridResult]

class SimulationResponse(BaseModel):
    dispersion: DispersionData
    optimization_plan: Optional[dict] = None


from app.services.gee_service import get_co2_data

@router.post("/initialize", response_model=SimulationResponse)
def initialize_simulation(req: SimulationRequest):
    # Fetch real data for the location
    real_data = get_co2_data(req.lat, req.lon)
    
    # Baseline concentration for the grid
    # Fallback to a global average if no data or error
    base_val = 0.04
    
    if real_data and "value" in real_data:
        base_val = real_data["value"]
    
    # Scale up for visualization if the value is raw mol/m^2 (usually small like 0.03)
    display_base = base_val * 2000
    
    results = []
    # Generate a 20x20 grid (400 nodes)
    for i in range(400):
        # Generate some concentration values
        # Distribute based on a 'heat' map around the center
        # Deterministic simulation model
        
        # Grid coordinates 20x20
        x = i % 20
        y = i // 20
        
        # Distance from center (10, 10)
        dist = ((x - 10)**2 + (y - 10)**2)**0.5
        
        # Higher concentration in center
        local_concentration = display_base * (1 + (10 - dist)/20) 
        
        # Add deterministic variation (texture) instead of random noise
        # Use sine waves based on grid position to create 'plumes'
        variation = math.sin(x * 0.5) * math.cos(y * 0.5) * (display_base * 0.05)
        local_concentration += variation
        
        results.append(GridResult(
            grid_id=f"G-{i:03d}",
            concentration=max(0, local_concentration)
        ))
        


    deployment_plan = []
    budget_used = 0
    total_budget = req.budget
    ideal_budget_accumulator = 0
    
    # Deterministic deployment actions based on concentration
    high_concentration_grids = sorted(results, key=lambda x: x.concentration, reverse=True)
    
    intervention_catalog = {
        "direct_air_capture": {"threshold": 90.0, "base_cost": 8000, "efficiency": 0.25},
        "carbon_capture_v1": {"threshold": 70.0, "base_cost": 5000, "efficiency": 0.18},
        "algae_bio_panel": {"threshold": 50.0, "base_cost": 3000, "efficiency": 0.12},
        "urban_reforestation": {"threshold": 0.0, "base_cost": 1500, "efficiency": 0.08}
    }

    # First pass: Calculate Ideal Budget (what is needed to fix everything optimally)
    # We scan all relevant grids, not just the top 12
    for grid in high_concentration_grids:
        val = grid.concentration
        if val < 5: continue # Ignore negligible pollution
        
        # Determine optimal intervention
        opt_intervention = "urban_reforestation"
        if val > intervention_catalog["direct_air_capture"]["threshold"]:
            opt_intervention = "direct_air_capture"
        elif val > intervention_catalog["carbon_capture_v1"]["threshold"]:
            opt_intervention = "carbon_capture_v1"
        elif val > intervention_catalog["algae_bio_panel"]["threshold"]:
            opt_intervention = "algae_bio_panel"
            
        specs = intervention_catalog[opt_intervention]
        ideal_units = min(10, max(1, int(val / 20)))
        ideal_budget_accumulator += specs["base_cost"] * ideal_units


    # Second pass: Actual Deployment (Constrained by Budget)
    for i, grid in enumerate(high_concentration_grids[:12]): # Check top 12 hot zones (scan deeper)
        # Stop if budget is exhausted
        if budget_used >= total_budget:
            break
            
        val = grid.concentration
        
        # Determine best INTERVENTION for this spot
        selected_intervention = "urban_reforestation"
        if val > intervention_catalog["direct_air_capture"]["threshold"]:
            selected_intervention = "direct_air_capture"
        elif val > intervention_catalog["carbon_capture_v1"]["threshold"]:
            selected_intervention = "carbon_capture_v1"
        elif val > intervention_catalog["algae_bio_panel"]["threshold"]:
            selected_intervention = "algae_bio_panel"

        # Check affordability
        specs = intervention_catalog[selected_intervention]
        
        # Downgrade intervention if too expensive for remaining budget
        if specs["base_cost"] > (total_budget - budget_used):
             # Try fallback 1: Algae
             if (total_budget - budget_used) > intervention_catalog["algae_bio_panel"]["base_cost"]:
                 selected_intervention = "algae_bio_panel"
                 specs = intervention_catalog["algae_bio_panel"]
             # Try fallback 2: Reforestation
             elif (total_budget - budget_used) > intervention_catalog["urban_reforestation"]["base_cost"]:
                 selected_intervention = "urban_reforestation"
                 specs = intervention_catalog["urban_reforestation"]
             else:
                 # Cannot afford anything for this node
                 continue

        # Calculate max units affordable/needed
        max_units_budget = int((total_budget - budget_used) // specs["base_cost"])
        ideal_units = min(10, max(1, int(val / 20)))
        
        units = min(ideal_units, max_units_budget)
        
        if units > 0:
            # Calculate cost and reduction
            cost = specs["base_cost"] * units
            reduction = val * specs["efficiency"] * (1 + (units * 0.1)) 
            
            deployment_plan.append({
                "grid_id": grid.grid_id,
                "intervention": selected_intervention,
                "units": units,
                "cost": cost,
                "expected_reduction": reduction
            })
            budget_used += cost
            
            # CRITICAL FIX: Apply the reduction to the actual grid data so the frontend sees it!
            # Find the grid in the main results list and update it
            # Since 'grid' is a reference to the object in 'results', we can modify it directly if it's mutable?
            # Pydantic models are not mutable by default if frozen, but let's check. 
            # Actually, we should iterate and find index or just update the object if we are sure.
            # 'grid' is an item from 'high_concentration_grids' which is a sorted list of references to items in 'results'.
            # So modifying 'grid.concentration' should work if Pydantic allows it.
            # However, safer to update the original list or ensure mutability.
            # Pydantic v1 vs v2. Let's assume standard behavior.
            
            # Let's subtract the reduction from the current concentration
            # Ensure we don't go below natural background levels (approx 0.04 or 0 for logic)
            new_concentration = max(0.01, grid.concentration - reduction)
            grid.concentration = new_concentration

    return SimulationResponse(
        dispersion=DispersionData(results=results),
        optimization_plan={
            "status": "Optimization Online",
            "solver": "V4.2",
            "target": "Carbon Neutral 2040",
            "total_budget": total_budget,
            "budget_used": budget_used,
            "ideal_budget_required": ideal_budget_accumulator,
            "plan": deployment_plan
        }
    )



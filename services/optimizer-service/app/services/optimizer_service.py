import requests
from config import DISPERSION_ENGINE_URL, INTERVENTIONS
from app.models.plan import PlanItem


def fetch_baseline():
    r = requests.get(f"{DISPERSION_ENGINE_URL}/dispersion")
    r.raise_for_status()
    data = r.json()["results"]
    return {d["grid_id"]: d["concentration"] for d in data}


def marginal_gain(base_value: float, efficiency: float) -> float:
    return base_value * efficiency


def optimize(budget: float):
    baseline = fetch_baseline()

    # Incremental candidates
    candidates: list[PlanItem] = []

    for grid_id, value in baseline.items():
        for kind, cfg in INTERVENTIONS.items():
            current_val = value
            
            for unit_idx in range(1, cfg["max_units_per_grid"] + 1):
                # Calculate incremental gain for THIS unit step
                reduction = current_val * cfg["efficiency"]
                cost = cfg["cost_per_unit"]
                
                # Update value for next iteration (diminishing returns)
                current_val -= reduction
                
                candidates.append(
                    PlanItem(
                        grid_id=grid_id,
                        intervention=kind,
                        units=1, # Each item represents 1 unit step
                        cost=cost,
                        gain=reduction
                    )
                )

    # Sort by gain / cost ratio
    candidates.sort(key=lambda x: x.gain / x.cost, reverse=True)

    final_plan_map = {} # (grid_id, kind) -> units
    spent = 0.0

    for c in candidates:
        if spent + c.cost > budget:
            continue

        key = (c.grid_id, c.intervention)
        if key not in final_plan_map:
            final_plan_map[key] = 0
            
        final_plan_map[key] += 1
        spent += c.cost

    # Convert map back to list of PlanItems
    plan = []
    for (grid_id, kind), units in final_plan_map.items():
        cfg = INTERVENTIONS[kind]
        total_cost = units * cfg["cost_per_unit"]
        # We don't strictly need precise total 'gain' in the output object for the frontend to work, 
        # but if we wanted it, we'd recalculate. For now, let's just return the plan structure.
        # However, the previous code returned a list of PlanItems.
        # We should probably recalculate the total gain for that block to be accurate in the response.
        
        # Recalculate total gain from baseline
        original_val = baseline[grid_id]
        new_val = original_val
        for _ in range(units):
            new_val *= (1 - cfg["efficiency"])
        total_gain = original_val - new_val

        plan.append(
            PlanItem(
                grid_id=grid_id,
                intervention=kind,
                units=units,
                cost=total_cost,
                gain=total_gain
            )
        )

    return plan, spent

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

    candidates: list[PlanItem] = []

    # Build candidate actions
    for grid_id, value in baseline.items():
        for kind, cfg in INTERVENTIONS.items():
            for unit in range(1, cfg["max_units_per_grid"] + 1):
                cost = cfg["cost_per_unit"] * unit

                gain = 0.0
                temp = value
                for _ in range(unit):
                    reduction = temp * cfg["efficiency"]
                    gain += reduction
                    temp -= reduction

                candidates.append(
                    PlanItem(
                        grid_id=grid_id,
                        intervention=kind,
                        units=unit,
                        cost=cost,
                        gain=gain
                    )
                )

    # Sort by gain / cost ratio (greedy knapsack)
    candidates.sort(key=lambda x: x.gain / x.cost, reverse=True)

    plan = []
    spent = 0.0
    covered_grids = set()

    for c in candidates:
        if spent + c.cost > budget:
            continue

        # avoid stacking multiple interventions on same grid in one plan
        if c.grid_id in covered_grids:
            continue

        plan.append(c)
        spent += c.cost
        covered_grids.add(c.grid_id)

    return plan, spent

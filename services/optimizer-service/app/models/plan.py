class PlanItem:
    def __init__(self, grid_id: str, intervention: str, units: int, cost: float, gain: float):
        self.grid_id = grid_id
        self.intervention = intervention
        self.units = units
        self.cost = cost
        self.gain = gain

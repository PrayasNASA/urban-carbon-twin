from shapely.prepared import prep
from app.models.grid import Grid


def build_adjacency(grids: list[Grid]) -> dict[str, list[str]]:
    """
    Builds adjacency graph where two grids are neighbors
    if their polygons touch (edge or corner).
    """
    adjacency: dict[str, list[str]] = {}

    # Prepare geometries for faster spatial predicates
    prepared = {g.grid_id: prep(g.polygon) for g in grids}

    for i, g1 in enumerate(grids):
        neighbors = []
        poly1 = prepared[g1.grid_id]

        for j, g2 in enumerate(grids):
            if i == j:
                continue

            # touching includes edge + corner adjacency
            if poly1.touches(g2.polygon):
                neighbors.append(g2.grid_id)

        adjacency[g1.grid_id] = neighbors

    return adjacency

from pydantic import BaseModel
from typing import Dict, List


class AdjacencySchema(BaseModel):
    adjacency: Dict[str, List[str]]
    centroids: Dict[str, List[float]]
    obstructions: Dict[str, float]

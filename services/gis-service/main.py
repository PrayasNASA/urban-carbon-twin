from fastapi import FastAPI
from app.api.grids import router as grid_router
from app.api.adjacency import router as adjacency_router

app = FastAPI(
    title="GIS Service",
    version="1.0.0"
)

app.include_router(grid_router)
app.include_router(adjacency_router)


@app.get("/")
def health():
    return {
        "service": "gis-service",
        "status": "running"
    }


# Then always run:

# python
# uvicorn main:app --reload

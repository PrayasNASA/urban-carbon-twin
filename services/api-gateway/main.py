from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.scenarios import router as scenario_router
from app.api.gis import router as gis_router

app = FastAPI(
    title="API Gateway",
    version="1.0.0"
)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://urban-carbon-twin.vercel.app",
    "https://next-dashboard-owkex2u2ca-uc.a.run.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scenario_router)
app.include_router(gis_router)


@app.get("/")
def health():
    return {
        "service": "api-gateway",
        "status": "running"
    }


if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)

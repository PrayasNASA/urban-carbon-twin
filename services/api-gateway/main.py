from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.scenarios import router as scenario_router

app = FastAPI(
    title="API Gateway",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scenario_router)


@app.get("/")
def health():
    return {
        "service": "api-gateway",
        "status": "running"
    }

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.scenarios import router as scenario_router

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
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
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

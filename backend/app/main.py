from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.interfaces.api.routers.health import router as health_router
from app.interfaces.api.routers.professionals import router as professionals_router
from app.logging_config import BasicRateLimitMiddleware, RequestLogMiddleware, configure_logging

settings = get_settings()
configure_logging()

app = FastAPI(
    title="WeWork API",
    description="Sistema de cadastro de profissionais",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestLogMiddleware)
app.add_middleware(BasicRateLimitMiddleware)

app.include_router(health_router)
app.include_router(professionals_router)

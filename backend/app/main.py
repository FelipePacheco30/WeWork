import logging
import time
from collections import defaultdict, deque
from collections.abc import AsyncGenerator, Callable
from contextlib import asynccontextmanager

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import get_settings
from app.domain.exceptions import ConflictError, NotFoundError, ValidationError
from app.infra.db.session import AsyncSessionLocal
from app.infra.email.sender import EmailSender
from app.infra.events.queue import EventQueue
from app.infra.scheduler.contracts import ContractDueScheduler
from app.logging_config import configure_logging
from app.api.v1.health import router as health_router
from app.api.v1.professionals import router as professionals_router

settings = get_settings()
configure_logging(settings.log_level)
logger = logging.getLogger("wework.api")


class RequestLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start = time.perf_counter()
        response = await call_next(request)
        elapsed = round((time.perf_counter() - start) * 1000, 2)
        logger.info(
            "request path=%s method=%s status=%s duration_ms=%s",
            request.url.path,
            request.method,
            response.status_code,
            elapsed,
        )
        return response


class BasicRateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 120, window_seconds: int = 60) -> None:
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.hits: dict[str, deque[float]] = defaultdict(deque)

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        key = request.client.host if request.client else "anonymous"
        now = time.time()
        entries = self.hits[key]
        while entries and now - entries[0] > self.window_seconds:
            entries.popleft()
        if len(entries) >= self.max_requests:
            return JSONResponse(
                {
                    "error": {
                        "code": "RATE_LIMIT_EXCEEDED",
                        "message": "limite de requisições excedido",
                    }
                },
                status_code=429,
                headers={"Retry-After": str(self.window_seconds)},
            )
        entries.append(now)
        return await call_next(request)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncGenerator[None, None]:
    scheduler = AsyncIOScheduler(timezone="UTC")
    if settings.scheduler_enabled:
        worker = ContractDueScheduler(
            session_factory=AsyncSessionLocal,
            queue=EventQueue(),
            email_sender=EmailSender(),
        )
        scheduler.add_job(
            worker.check_due_contracts,
            "interval",
            hours=24,
            kwargs={"days": settings.contracts_due_window_days},
            id="contracts_due_job",
            replace_existing=True,
        )
        scheduler.start()
        logger.info("scheduler started")
    try:
        yield
    finally:
        if scheduler.running:
            scheduler.shutdown(wait=False)
            logger.info("scheduler stopped")

app = FastAPI(
    title=settings.app_name,
    description="Sistema de cadastro de profissionais",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestLogMiddleware)
app.add_middleware(BasicRateLimitMiddleware)

@app.exception_handler(NotFoundError)
async def not_found_handler(_: Request, exc: NotFoundError) -> JSONResponse:
    return JSONResponse(
        status_code=404,
        content={"error": {"code": "NOT_FOUND", "message": str(exc)}},
    )


@app.exception_handler(ConflictError)
async def conflict_handler(_: Request, exc: ConflictError) -> JSONResponse:
    return JSONResponse(
        status_code=409,
        content={"error": {"code": "CONFLICT", "message": str(exc)}},
    )


@app.exception_handler(ValidationError)
async def validation_handler(_: Request, exc: ValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={"error": {"code": "VALIDATION_ERROR", "message": str(exc)}},
    )


@app.exception_handler(Exception)
async def unhandled_handler(_: Request, exc: Exception) -> JSONResponse:
    logger.exception("unhandled_error: %s", exc)
    return JSONResponse(
        status_code=500,
        content={"error": {"code": "INTERNAL_SERVER_ERROR", "message": "erro interno"}},
    )


app.include_router(health_router, prefix="/api/v1")
app.include_router(professionals_router, prefix="/api/v1")

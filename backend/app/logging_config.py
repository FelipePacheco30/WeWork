import json
import logging
import time
from collections import defaultdict, deque
from collections.abc import Callable

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse, Response


def configure_logging() -> None:
    class JsonFormatter(logging.Formatter):
        def format(self, record: logging.LogRecord) -> str:
            payload = {
                "level": record.levelname,
                "logger": record.name,
                "message": record.getMessage(),
                "time": self.formatTime(record, self.datefmt),
            }
            return json.dumps(payload, ensure_ascii=True)

    handler = logging.StreamHandler()
    handler.setFormatter(JsonFormatter())
    logging.basicConfig(level=logging.INFO, handlers=[handler], force=True)


class RequestLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start = time.perf_counter()
        response = await call_next(request)
        elapsed = round((time.perf_counter() - start) * 1000, 2)
        logging.getLogger("wework.api").info(
            "request",
            extra={
                "path": str(request.url.path),
                "method": request.method,
                "status_code": response.status_code,
                "duration_ms": elapsed,
            },
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
                {"detail": "rate limit excedido"},
                status_code=429,
                headers={"Retry-After": str(self.window_seconds)},
            )
        entries.append(now)
        return await call_next(request)

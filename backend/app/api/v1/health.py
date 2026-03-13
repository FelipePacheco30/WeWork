from fastapi import APIRouter, Response

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@router.head("")
async def healthcheck_head() -> Response:
    # Usado por ferramentas como UptimeRobot; so precisa responder 200.
    return Response(status_code=200)

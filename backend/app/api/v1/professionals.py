from datetime import date
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status

from app.api.dependencies import get_professional_service
from app.schemas.professional import (
    ProfessionalCreate,
    ProfessionalListResponse,
    ProfessionalRead,
    ProfessionalReplace,
    ProfessionalUpdate,
)
from app.services.professional_service import ProfessionalService

router = APIRouter(prefix="/professionals", tags=["professionals"])


@router.post("", response_model=ProfessionalRead, status_code=status.HTTP_201_CREATED)
async def create_professional(
    payload: ProfessionalCreate,
    service: ProfessionalService = Depends(get_professional_service),
) -> ProfessionalRead:
    return await service.create(payload)


@router.get("", response_model=ProfessionalListResponse)
async def list_professionals(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=200),
    q: str | None = Query(default=None),
    cargo: str | None = Query(default=None),
    departamento: str | None = Query(default=None),
    start_from: date | None = Query(default=None),
    start_to: date | None = Query(default=None),
    contract_due_within_days: int | None = Query(default=None, ge=0, le=365),
    service: ProfessionalService = Depends(get_professional_service),
) -> ProfessionalListResponse:
    return await service.list(
        page=page,
        page_size=page_size,
        q=q,
        cargo=cargo,
        departamento=departamento,
        start_from=start_from,
        start_to=start_to,
        contract_due_within_days=contract_due_within_days,
    )


@router.get("/export/csv", response_class=Response)
async def export_professionals_csv(
    q: str | None = Query(default=None),
    cargo: str | None = Query(default=None),
    departamento: str | None = Query(default=None),
    start_from: date | None = Query(default=None),
    start_to: date | None = Query(default=None),
    contract_due_within_days: int | None = Query(default=None, ge=0, le=365),
    service: ProfessionalService = Depends(get_professional_service),
) -> Response:
    csv_data = await service.export_csv(
        q=q,
        cargo=cargo,
        departamento=departamento,
        start_from=start_from,
        start_to=start_to,
        contract_due_within_days=contract_due_within_days,
    )
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="professionals.csv"'},
    )


@router.get("/{professional_id}", response_model=ProfessionalRead)
async def get_professional(
    professional_id: UUID,
    service: ProfessionalService = Depends(get_professional_service),
) -> ProfessionalRead:
    return await service.get(professional_id)


@router.put("/{professional_id}", response_model=ProfessionalRead)
async def replace_professional(
    professional_id: UUID,
    payload: ProfessionalReplace,
    service: ProfessionalService = Depends(get_professional_service),
) -> ProfessionalRead:
    return await service.replace(professional_id, payload)


@router.patch("/{professional_id}", response_model=ProfessionalRead)
async def patch_professional(
    professional_id: UUID,
    payload: ProfessionalUpdate,
    service: ProfessionalService = Depends(get_professional_service),
) -> ProfessionalRead:
    return await service.patch(professional_id, payload)


@router.delete("/{professional_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_professional(
    professional_id: UUID,
    service: ProfessionalService = Depends(get_professional_service),
) -> Response:
    await service.soft_delete(professional_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

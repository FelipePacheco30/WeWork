from datetime import date

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.exc import IntegrityError

from app.application.dto import ProfessionalFilter, ProfessionalInput, ProfessionalOutput
from app.application.usecases.professional_usecases import ProfessionalUseCases
from app.interfaces.api.dependencies import get_professional_usecases
from app.interfaces.api.errors import conflict, not_found

router = APIRouter(prefix="/professionals", tags=["professionals"])


@router.post(
    "",
    response_model=ProfessionalOutput,
    status_code=status.HTTP_201_CREATED,
    summary="Criar profissional",
)
async def create_professional(
    payload: ProfessionalInput,
    usecases: ProfessionalUseCases = Depends(get_professional_usecases),
) -> ProfessionalOutput:
    try:
        return await usecases.create(payload)
    except IntegrityError as exc:
        raise conflict("email já cadastrado") from exc


@router.get(
    "",
    response_model=list[ProfessionalOutput],
    summary="Listar profissionais com filtros",
)
async def list_professionals(
    nome: str | None = Query(default=None, description="Filtro parcial por nome"),
    cargo: str | None = Query(default=None),
    departamento: str | None = Query(default=None),
    data_inicio_de: date | None = Query(default=None),
    data_inicio_ate: date | None = Query(default=None),
    vencendo_em_dias: int | None = Query(default=None, ge=0, le=365),
    usecases: ProfessionalUseCases = Depends(get_professional_usecases),
) -> list[ProfessionalOutput]:
    filters = ProfessionalFilter(
        nome=nome,
        cargo=cargo,
        departamento=departamento,
        data_inicio_de=data_inicio_de,
        data_inicio_ate=data_inicio_ate,
        vencendo_em_dias=vencendo_em_dias,
    )
    return await usecases.list_filtered(filters)


@router.get("/{professional_id}", response_model=ProfessionalOutput, summary="Buscar por id")
async def get_professional(
    professional_id: int,
    usecases: ProfessionalUseCases = Depends(get_professional_usecases),
) -> ProfessionalOutput:
    item = await usecases.get(professional_id)
    if not item:
        raise not_found("Profissional")
    return item


@router.put("/{professional_id}", response_model=ProfessionalOutput, summary="Atualizar")
async def update_professional(
    professional_id: int,
    payload: ProfessionalInput,
    usecases: ProfessionalUseCases = Depends(get_professional_usecases),
) -> ProfessionalOutput:
    try:
        updated = await usecases.update(professional_id, payload)
    except IntegrityError as exc:
        raise conflict("email já cadastrado") from exc
    if not updated:
        raise not_found("Profissional")
    return updated


@router.delete("/{professional_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Excluir")
async def delete_professional(
    professional_id: int,
    usecases: ProfessionalUseCases = Depends(get_professional_usecases),
) -> Response:
    success = await usecases.delete(professional_id)
    if not success:
        raise not_found("Profissional")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/export/csv", summary="Exportar listagem em CSV")
async def export_professionals_csv(
    nome: str | None = Query(default=None),
    cargo: str | None = Query(default=None),
    departamento: str | None = Query(default=None),
    data_inicio_de: date | None = Query(default=None),
    data_inicio_ate: date | None = Query(default=None),
    vencendo_em_dias: int | None = Query(default=None, ge=0, le=365),
    usecases: ProfessionalUseCases = Depends(get_professional_usecases),
) -> Response:
    filters = ProfessionalFilter(
        nome=nome,
        cargo=cargo,
        departamento=departamento,
        data_inicio_de=data_inicio_de,
        data_inicio_ate=data_inicio_ate,
        vencendo_em_dias=vencendo_em_dias,
    )
    csv_data = await usecases.export_csv(filters)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="professionals.csv"'},
    )

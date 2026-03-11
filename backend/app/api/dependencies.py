from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.infra.db.session import get_db_session
from app.infra.db.sql_professional_repository import SQLProfessionalRepository
from app.services.professional_service import ProfessionalService


def get_professional_service(
    session: AsyncSession = Depends(get_db_session),
) -> ProfessionalService:
    repository = SQLProfessionalRepository(session)
    return ProfessionalService(repository)

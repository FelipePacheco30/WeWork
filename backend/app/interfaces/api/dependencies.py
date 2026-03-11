from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.usecases.professional_usecases import ProfessionalUseCases
from app.infrastructure.db.session import get_db_session
from app.infrastructure.repositories.professional_sqlalchemy_repository import (
    ProfessionalSqlAlchemyRepository,
)


def get_professional_usecases(
    session: AsyncSession = Depends(get_db_session),
) -> ProfessionalUseCases:
    repository = ProfessionalSqlAlchemyRepository(session)
    return ProfessionalUseCases(repository)

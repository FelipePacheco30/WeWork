import logging
from datetime import date

from sqlalchemy.ext.asyncio import async_sessionmaker

from app.infra.db.sql_professional_repository import SQLProfessionalRepository
from app.infra.email.sender import EmailSender
from app.infra.events.queue import EventQueue

logger = logging.getLogger("wework.scheduler")


class ContractDueScheduler:
    def __init__(
        self,
        session_factory: async_sessionmaker,
        queue: EventQueue,
        email_sender: EmailSender,
    ) -> None:
        self.session_factory = session_factory
        self.queue = queue
        self.email_sender = email_sender

    async def check_due_contracts(self, days: int = 30) -> None:
        async with self.session_factory() as session:
            repository = SQLProfessionalRepository(session)
            due_items = await repository.list_contracts_due_within_days(days)

        for item in due_items:
            days_left = (item.data_vencimento_contrato - date.today()).days
            payload = {
                "professional_id": str(item.id),
                "email": item.email,
                "nome": item.nome,
                "days_left": days_left,
                "contract_due_date": item.data_vencimento_contrato.isoformat(),
            }
            await self.queue.publish("contracts.due", payload)
            await self.email_sender.send_contract_due_alert(item.email, item.nome, days_left)
            logger.info("contract_due_detected payload=%s", payload)

import logging

logger = logging.getLogger("wework.email")


class EmailSender:
    async def send_contract_due_alert(self, to_email: str, nome: str, days_left: int) -> None:
        logger.info(
            "email.stub contract_due to=%s nome=%s days_left=%s",
            to_email,
            nome,
            days_left,
        )

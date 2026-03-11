import logging
from typing import Any

logger = logging.getLogger("wework.events")


class EventQueue:
    async def publish(self, topic: str, payload: dict[str, Any]) -> None:
        logger.info("queue.publish topic=%s payload=%s", topic, payload)

import contextvars
import json
import logging
import sys
import time
import uuid
from enum import Enum
from typing import Any, ItemsView, KeysView, ValuesView

from loguru import logger # type: ignore
from ..config.config import Config

# Контекст для trace_id и старта
trace_id_var = contextvars.ContextVar("trace_id", default=None)
start_time_var = contextvars.ContextVar("time_start", default=None)


class StructuredLogger:
    @staticmethod
    def _get_trace_id():
        return trace_id_var.get() or str(uuid.uuid4())

    @staticmethod
    def _add_context(kwargs):
        start_time = start_time_var.get() or time.time()
        return {
            "trace_id": StructuredLogger._get_trace_id(),
            "time_from_start_ms": round((time.time() - start_time) * 1000, 2),
            **kwargs
        }

    @staticmethod
    def info(event, **kwargs):
        logger.bind(**StructuredLogger._add_context(kwargs)).info(event)

    @staticmethod
    def warning(event, **kwargs):
        logger.bind(**StructuredLogger._add_context(kwargs)).warning(event)

    @staticmethod
    def error(event, **kwargs):
        logger.bind(**StructuredLogger._add_context(kwargs)).error(event)

    @staticmethod
    def exception(event, **kwargs):
        logger.bind(**StructuredLogger._add_context(kwargs)).exception(event)

    @staticmethod
    def debug(event, **kwargs):
        logger.bind(**StructuredLogger._add_context(kwargs)).debug(event)

    @staticmethod
    def simplify(value: Any, max_depth: int = 5) -> Any:
        return StructuredLogger._simplify_internal(value, visited_ids=set(), depth=0, max_depth=max_depth)

    @staticmethod
    def _simplify_internal(value: Any, visited_ids: set, depth: int, max_depth: int) -> Any:
        if depth > max_depth:
            return f"<max-depth-exceeded-{type(value).__name__}>"

        if id(value) in visited_ids:
            return f"<circular-ref {type(value).__name__}>"

        visited_ids.add(id(value))

        if isinstance(value, Enum):
            return value.value

        elif isinstance(value, (KeysView, ValuesView, ItemsView)):
            return StructuredLogger._simplify_internal(list(value), visited_ids, depth + 1, max_depth)

        elif hasattr(value, "__dict__"):
            return {
                k: StructuredLogger._simplify_internal(v, visited_ids, depth + 1, max_depth)
                for k, v in value.__dict__.items()
            }

        elif isinstance(value, dict):
            return {
                StructuredLogger._simplify_internal(k, visited_ids, depth + 1, max_depth):
                    StructuredLogger._simplify_internal(v, visited_ids, depth + 1, max_depth)
                for k, v in value.items()
            }

        elif isinstance(value, (list, tuple, set)):
            return [StructuredLogger._simplify_internal(v, visited_ids, depth + 1, max_depth) for v in value]

        else:
            return value

    @staticmethod
    def setup():
        global logger  # noqa:
        logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
        logger.remove()

        def serialize(record):
            return json.dumps({
                "timestamp": record["time"].timestamp(),
                "level": record["level"].name,
                "message": record["message"],
                "trace_id": record["extra"].pop("trace_id"),
                "time_from_start_ms": record["extra"].pop("time_from_start_ms"),
                "extra": StructuredLogger.simplify(record["extra"]),
                **({"exception": str(record["exception"])} if record["exception"] else {})
            })

        # Поверх patch добавляем в extra.serialized
        logger = logger.patch(lambda record: record["extra"].update({"serialized": serialize(record)}))

        # Используем формат с {extra[serialized]} как JSON
        logger.add(
            sys.stdout,
            level=Config.LOG_LEVEL,
            format="{extra[serialized]}\n",
            serialize=False
        )

        StructuredLogger.info("init.logger_initialized")

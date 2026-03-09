from graphql import GraphQLError
from pydantic import ValidationError
from strawberry.exceptions import StrawberryGraphQLError
from strawberry.extensions import SchemaExtension

from ...extensions.graphql_error_code import GraphqlErrorCode
from ...utils.graphql_utils import MessageException
from ...utils.logging import StructuredLogger


class MaskErrors(SchemaExtension):
    def on_request_end(self):
        result = self.execution_context.result

        if result.errors:
            processed_errors = []
            for error in result.errors:
                if (
                        isinstance(error.original_error, ValidationError)
                ):
                    StructuredLogger.warning("mask_errors.validation_error", details=str(error))
                    error.extensions = {"code": GraphqlErrorCode.BAD_REQUEST}
                    processed_errors.append(
                        error
                    )
                elif isinstance(error.original_error, MessageException):
                    StructuredLogger.warning("mask_errors.message_error", details=str(error))
                    processed_errors.append(
                        error
                    )
                elif isinstance(error.original_error, ValueError):
                    StructuredLogger.warning("mask_errors.short_error", details=str(error))
                    error.extensions = {"code": GraphqlErrorCode.BAD_REQUEST}
                    processed_errors.append(
                        error
                    )
                elif (isinstance(error.original_error, StrawberryGraphQLError)
                      or isinstance(error.original_error, GraphQLError)):
                    StructuredLogger.warning(
                        "mask_errors.graphql_error",
                        original_error=str(error),
                        path=error.path
                    )
                    processed_errors.append(
                        error
                    )
                elif error.original_error is None and error.path is None:
                    StructuredLogger.warning(
                        "mask_errors.parse_error",
                        original_error=str(error),
                        path=error.path
                    )
                    processed_errors.append(
                        error
                    )
                else:
                    StructuredLogger.error(
                        "mask_errors.unexpected_error",
                        original_error=str(error),
                        path=error.path
                    )
                    processed_errors.append(
                        GraphQLError(
                            message="Неожиданная ошибка, повторите попытку позже",
                            path=error.path,
                            extensions={"code": GraphqlErrorCode.INTERNAL_SERVER_ERROR},
                        )
                    )

                # ✅ Оставляем `data` нетронутыми, даже если есть ошибки
                result.errors = processed_errors if processed_errors else None

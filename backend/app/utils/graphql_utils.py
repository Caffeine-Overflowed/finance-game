from ..extensions.graphql_error_code import GraphqlErrorCode


class MessageException(Exception):
    def __init__(self, message: str, code: GraphqlErrorCode = GraphqlErrorCode.BAD_REQUEST):
        self.message = message
        self.extensions = {
            "code": code
        }

    def with_extensions(self, **extensions):
        self.extensions.update(extensions)

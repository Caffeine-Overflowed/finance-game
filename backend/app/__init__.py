from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter

from .graphql.context.getter import context_getter
from .graphql.middlewares.auth import AuthMiddleware
from .graphql.middlewares.participant_auth import ParticipantAuthMiddleware
from .graphql.middlewares.traceid import TraceIDMiddleware
from .graphql.schema import schema
from .utils.lifespan import lifespan

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,  # type: ignore
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

app.add_middleware(ParticipantAuthMiddleware)
app.add_middleware(AuthMiddleware)
app.add_middleware(TraceIDMiddleware)

graphql_app = GraphQLRouter(schema=schema, context_getter=context_getter)

app.include_router(graphql_app, prefix="/graphql")

"use client";

import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";


const apiUrl = process.env.NODE_ENV === "production" && typeof window !== "undefined" ? `${window.location.origin}/graphql` : `https://${process.env.NEXT_PUBLIC_URL}/graphql`;
const authLink = new ApolloLink((operation, forward) => {
    let participantToken = localStorage.getItem("participantToken");
    if (!participantToken) {
        participantToken = crypto.randomUUID();
        localStorage.setItem("participantToken", participantToken);
    }

    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            ParticipantSessionId: `${participantToken}`,
        },
    }));

    return forward(operation).map((response) => {
        response.errors?.forEach((error) => {
            const errorCode = error.extensions?.code;
        });
        return response;
    });
});

const httpLink = new HttpLink({
    uri: apiUrl,
});

export const client = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
});

"use client";

import { FC, useCallback, useEffect, useRef } from "react";
import { ApolloError } from "@apollo/client";
import { useRouter } from "next/navigation";


import { OAuthInput, OAuthProvider, useOauthAuthenticateMutation } from "@/shared/api";
import { useUserStore } from "@/shared/store/user-store";
import { useOAuthParams } from "@/shared/hooks/useOAuthParams";

interface Props {

  provider: OAuthProvider;
}


export const AuthContainer: FC<Props> = ({ provider }) => {
  const {code, state } = useOAuthParams();
  const { authorize } = useUserStore();
  const [auth] = useOauthAuthenticateMutation();
  const router = useRouter();

  const hasFetched = useRef(false);

  const fetchTokens = useCallback(
    async (data: OAuthInput) => {
      try {
        const resp = await auth({ variables: { data } });

        if (!resp.data) return;

        const tokenAndUser = resp.data.oauthAuthenticate

        authorize(tokenAndUser);

      } catch (e) {
        if (e instanceof ApolloError) {
          console.error(
            "Failed to authenticate:",
            e.graphQLErrors.map((err) => err.message).join(", "),
          );
        }
      } finally {
        router.push("/");
      }
    },
    [auth, authorize, router],
  );

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    if (
      (provider === OAuthProvider.Google) &&
      (!code || !state)
    ) {
      console.error("code or state is missing");
      return;
    }

    const data: OAuthInput = {
      code: code ||  "",
      state: state || "",
    };

     fetchTokens(data).then();
  }, [provider, state, code, fetchTokens]);

  return null;
};

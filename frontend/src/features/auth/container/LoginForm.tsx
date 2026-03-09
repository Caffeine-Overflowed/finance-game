"use client"

import { FC, FormEventHandler, useCallback, useState } from "react";
import Link from "next/link";
import { TextWithSuporting } from "@/features/auth/ui/TextWithSuporting";
import {
    AuthenticateType,
    OAuthProvider,
    RegisterInput,
    useCreateOauthUrlMutation,
    useLoginLazyQuery
} from "@/shared/api";
import { Button } from "@/shared/components/base/buttons/button";
import { SocialButton } from "@/shared/components/base/buttons/social-button";
import { Input } from "@/shared/components/base/input/input";
import { useUserStore } from "@/shared/store/user-store";

export const LoginForm: FC = () => {
    const [loginUser] = useLoginLazyQuery();
    const { authorize } = useUserStore();

    const [info, setInfo] = useState<RegisterInput>({
        email: "",
        password: "",
    });

    const [getAuthUrl] = useCreateOauthUrlMutation();
    const login = async (oauthProvider: OAuthProvider) => {
        try {
            const url = window.location.origin;
            const r = await getAuthUrl({
                variables: {
                    data: {
                        provider: oauthProvider,
                        redirectUri: `${url}/auth/oauth/${oauthProvider.toLowerCase()}`,
                    },
                },
            });

            if (r.data?.createOauthUrl) {
                window.location.assign(r.data.createOauthUrl);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleSubmit: FormEventHandler = useCallback(
        async (e) => {
            e.preventDefault();
            const response = await loginUser({ variables: { email: info.email, password: info.password } });

            if (response.data?.login) {
                authorize(response.data.login as AuthenticateType);
            }
        },
        [loginUser, info],
    );

    return (
        <div className="flex w-[360px] flex-col items-center gap-8">
            <TextWithSuporting mainText={"Log in"} suportingText={"Welcome back! Please enter your info."} />

            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 self-stretch">
                <div className="flex flex-col items-start gap-5 self-stretch">
                    <Input label="Email" placeholder="Enter your email" onChange={(value) => setInfo({ ...info, email: value })} value={info.email} />
                    <Input
                        label="Password"
                        placeholder="Enter your password"
                        onChange={(value) => setInfo({ ...info, password: value })}
                        value={info.password}
                    />
                </div>

                <div className="flex flex-col items-start gap-4 self-stretch">
                    <Button type={"submit"} color="primary" size="md" className="self-stretch">
                        Sign in
                    </Button>
                    <SocialButton social="google" theme="brand" className="self-stretch" onClick={() => login(OAuthProvider.Google)}>
                        Sign in with Google
                    </SocialButton>
                </div>
            </form>

            <div className="flex items-start justify-center gap-1 self-stretch">
                <p className="font-sans text-sm leading-5 font-normal text-primary">Don't have an account?</p>

                <Button color="link-color" size="md">
                    <Link href="/auth/signup">Sign up</Link>
                </Button>
            </div>
        </div>
    );
};
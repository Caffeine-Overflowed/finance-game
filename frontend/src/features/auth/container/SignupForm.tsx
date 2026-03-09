"use client"

import { FC, FormEventHandler, useCallback, useState } from "react";
import { Input } from "@/shared/components/base/input/input";
import { Button } from "@/shared/components/base/buttons/button";
import { SocialButton } from "@/shared/components/base/buttons/social-button";
import { TextWithSuporting } from "@/features/auth/ui/TextWithSuporting";
import Link from "next/link";
import { AuthenticateType, RegisterInput, useRegisterMutation } from "@/shared/api";
import { useUserStore } from "@/shared/store/user-store";



export const SignUpForm: FC = () => {

    const [registerUser] = useRegisterMutation()
    const {authorize} = useUserStore()

    const [info, setInfo] = useState<RegisterInput>({
        email: "",
        password: ""
    })


    const handleSubmit: FormEventHandler = useCallback( async (e) => {
        e.preventDefault();
        const response = await registerUser({variables: {data: info}})

        if (response.data?.register.accessToken){
            authorize(response.data.register as AuthenticateType)
        }
    }, [registerUser, info])

    return <div className="flex flex-col items-center w-[360px] gap-8">


                <TextWithSuporting mainText={"Sign up"} />


                <form onSubmit={handleSubmit} className="flex flex-col gap-6 items-center self-stretch">
                    <div className="flex flex-col gap-5 items-start self-stretch">
                        <Input isRequired label="Email"
                               placeholder="Enter your email"
                               onChange={(value) => setInfo({...info, email: value})}
                               value={info.email} />
                        <Input isRequired
                               label="Password"
                               hint="Must be at least 8 symbols"
                               placeholder="Create password"
                               onChange={(value) => setInfo({...info, password: value})}
                               value={info.password}/>

                    </div>

                    <div className="flex flex-col gap-4 items-start self-stretch">
                        <Button type={"submit"} color="primary" size="md" className="self-stretch">Sign in</Button>
                        <SocialButton social="google" theme="brand" className="self-stretch">
                            Sign in with Google
                        </SocialButton>
                    </div>
                </form>

                <div className="flex justify-center items-start gap-1 self-stretch">
                    <p className="text-primary font-sans text-sm font-normal leading-5">
                        Already have an account?
                    </p>

                    <Button color="link-color" size="md"><Link href="/auth/login">Log in</Link></Button>
                </div>
            </div>



}
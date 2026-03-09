import { FC, PropsWithChildren, ReactNode } from "react";
import { SignUpForm } from "@/features/auth/container/SignupForm";
import { LoginForm } from "@/features/auth/container/LoginForm";
import { Button } from "@/shared/components/base/buttons/button";

interface Props{
    children: ReactNode
}

export const AuthLayout: FC<Props> = ({children})=> {

    return <div className="flex items-center self-stretch min-h-full min-w-full">

        {/* login/signup section */}
        <section className="flex flex-col md:justify-between items-center md:flex-1 self-stretch ">
            <header className="flex h-[96px] p-8 items-start self-stretch">
                <Button href="https://www.untitledui.com/" color="link-gray" size="xl">Untitled ui</Button>
            </header>

            {/* form itself */}
            <main className="flex flex-col items-center self-stretch px-4 md:px-8">
                {children}
            </main>

            <footer className="hidden md:flex h-[96px] p-8 items-end self-stretch">
                <p className="text-primary font-sans text-sm font-normal leading-5">
                    untitled ui blabblalalalal
                </p>
            </footer>
        </section>

        {/*Colored section*/}
        <section className="hidden md:flex flex-1 self-stretch rounded-l-[80px] bg-brand-100"></section>
    </div>
}
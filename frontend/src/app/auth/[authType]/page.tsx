import { LoginForm } from "@/features/auth/container/LoginForm";
import { SignUpForm } from "@/features/auth/container/SignupForm";
import { AuthLayout } from "@/features/auth/ui/AuthLayout";


interface Props{
    params: Promise<{
        "authType": "signup" | "login"
    }>
}

export default async function AuthenticationPage({params}: Props) {
    const { authType } = await params;

    return <AuthLayout>
        {authType=== "signup" ? <SignUpForm/> : <LoginForm/>}
    </AuthLayout>


}



import { type FC, Suspense } from "react";

import { AuthContainer } from "@/features/auth/container/AuthContainer";
import { OAuthProvider } from "@/shared/api";

export const dynamic = "force-static";
export const revalidate = false;

interface Params {
  authProvider: OAuthProvider;
}

interface Props {
  params: Promise<Params>;
}

export default async function AuthPage ({ params }: Props)  {
  const { authProvider } = await params;
  return (
    <Suspense fallback={null}>
      <AuthContainer provider={authProvider.toUpperCase() as OAuthProvider} />
    </Suspense>
  );
};



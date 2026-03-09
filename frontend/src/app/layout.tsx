import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import ApolloWrapper from "@/shared/api/apollo/apolloProvider";
import { RouteProvider } from "@/shared/providers/router-provider";
import { Theme } from "@/shared/providers/theme";
import { Toaster } from "@/shared/ui/Sonner";
import { cx } from "@/shared/utils/cx";
import "@/styles/globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "The finance game",
    description: "The finance game for bla bla bla",
};

export const viewport: Viewport = {
    themeColor: "#7f56d9",
    colorScheme: "light dark",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className="flex h-full w-full">
            <body className={cx(inter.variable, "flex min-h-screen w-full flex-col items-center self-stretch bg-primary antialiased")}>
                <ApolloWrapper>
                    <RouteProvider>
                        <Theme>{children}</Theme>
                    </RouteProvider>
                </ApolloWrapper>
                <Toaster />
            </body>
        </html>
    );
}

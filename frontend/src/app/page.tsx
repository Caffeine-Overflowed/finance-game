"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/features/mainpage/ui/Footer";
import { Header } from "@/features/mainpage/ui/Header";
import { Main } from "@/features/mainpage/ui/Main";

export default function MainPage() {
    const router = useRouter();
    const [code, setCode] = useState("");

    return (
        <>

            <div className="mx-auto max-w-[1200px] px-4 h-full">
                <Header />
                <Main router={router} />

                <Footer router={router} />
            </div>
        </>
    );
}

import { FC, useState } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { CardWithPicture } from "@/features/mainpage/ui/CardWithPicture";
import { HeadAndSupportNotCentered } from "@/features/mainpage/ui/HeadAndSupportNotCentered";
import { Button } from "@/shared/components/base/buttons/button";
import { Input } from "@/shared/components/base/input/input";

interface Props {
    router: AppRouterInstance;
}

export const Main: FC<Props> = ({ router }) => {
    const [code, setCode] = useState("");

    const handleJoinClick = () => {
        router.push(`/game/${code}`);
    };

    return (
        <main className="relative flex flex-col items-center gap-20 self-stretch md:px-28 pt-24 pb-12 overflow-hidden">
            {/* Electrical impulse background animation */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Horizontal impulses */}
                <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60 animate-pulse-horizontal-1"></div>
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50 animate-pulse-horizontal-2"></div>
                <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70 animate-pulse-horizontal-3"></div>
                <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-45 animate-pulse-horizontal-4"></div>

                {/* Vertical impulses */}
                <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-40 animate-pulse-vertical-1"></div>
                <div className="absolute right-1/3 top-0 w-px h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-50 animate-pulse-vertical-2"></div>
                <div className="absolute left-1/6 top-0 w-px h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent opacity-35 animate-pulse-vertical-3"></div>
                <div className="absolute right-1/5 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-55 animate-pulse-vertical-4"></div>

                {/* Diagonal impulses */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-pink-400 to-transparent opacity-30 animate-pulse-diagonal-1 transform rotate-45 origin-top-left" style={{left: '20%'}}></div>
                    <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-indigo-400 to-transparent opacity-40 animate-pulse-diagonal-2 transform -rotate-45 origin-top-right" style={{right: '25%'}}></div>
                    <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-green-400 to-transparent opacity-25 animate-pulse-diagonal-3 transform rotate-30 origin-bottom-left" style={{left: '40%'}}></div>
                    <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent opacity-35 animate-pulse-diagonal-4 transform -rotate-30 origin-bottom-right" style={{right: '35%'}}></div>
                </div>

                {/* Pulsing electrical nodes */}
                <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse-node-1 opacity-80"></div>
                <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse-node-2 opacity-70"></div>
                <div className="absolute bottom-32 left-1/3 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse-node-3 opacity-60"></div>
                <div className="absolute bottom-20 right-20 w-1 h-1 bg-pink-400 rounded-full animate-pulse-node-4 opacity-90"></div>
                <div className="absolute top-1/3 left-16 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse-node-5 opacity-75"></div>
                <div className="absolute top-2/3 right-24 w-2 h-2 bg-green-400 rounded-full animate-pulse-node-6 opacity-65"></div>
                <div className="absolute bottom-40 left-1/5 w-1 h-1 bg-yellow-400 rounded-full animate-pulse-node-7 opacity-85"></div>

                {/* Circuit-like connections */}
                <div className="absolute top-1/4 left-1/4 w-32 h-px bg-gradient-to-r from-blue-400 to-transparent opacity-40 animate-pulse-circuit-1"></div>
                <div className="absolute top-1/2 right-1/4 w-24 h-px bg-gradient-to-l from-purple-400 to-transparent opacity-35 animate-pulse-circuit-2"></div>
                <div className="absolute bottom-1/3 left-1/3 w-28 h-px bg-gradient-to-r from-cyan-400 to-transparent opacity-50 animate-pulse-circuit-3"></div>
            </div>

            <div className="relative z-10 flex flex-row items-start gap-8 self-stretch rounded-2xl bg-brand-50 px-8 py-10 backdrop-blur-sm">
                <HeadAndSupportNotCentered
                    heading={"Join a Game with a Code"}
                    supportingText={"Already have a code? Enter it below and jump into the game with other players"}
                />

                <div className="flex flex-1 flex-col items-start gap-3">
                    <Input placeholder={"code"} onChange={(value) => setCode(value)} className="flex flex-col items-start self-stretch" />

                    <Button onClick={handleJoinClick} color="primary" className="flex items-center justify-center gap-2 self-stretch px-4.5 py-3">
                        Join game
                    </Button>
                </div>
            </div>

            {/* img container */}
            <div className="relative z-10 flex flex-col items-start">
                <HeadAndSupportNotCentered
                    heading={"Choose How You Want to Play"}
                    supportingText={"Play for fun with friends or bring the game to your classroom for a powerful learning experience"}
                />

                <div className="flex w-full items-start justify-between">
                    <CardWithPicture
                        text={"Up to 6 players in one session. Create a room or join with a code. Compare your life choices in real time."}
                        picturePath={"/p1.png"}
                        labelText={"With Friends"}
                        badgeLabel={"FREE"}
                    />
                    <CardWithPicture
                        text={
                            "Special educational edition for classrooms. Teacher tools for hosting and tracking sessions. Age-based scenarios for different student groups"
                        }
                        picturePath={"/p2.png"}
                        labelText={"For Schools & Universities"}
                        badgeLabel={"FREE"}
                    />
                    <CardWithPicture
                        text={"Play at your own pace. Create a room or join with a code. Compare your life choices in real time."}
                        picturePath={"/p3.png"}
                        labelText={"Solo Mode"}
                        badgeLabel={"FREE"}
                    />
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse-horizontal-1 {
                    0% { transform: translateX(-100%); opacity: 0; }
                    50% { opacity: 0.6; }
                    100% { transform: translateX(100%); opacity: 0; }
                }
                
                @keyframes pulse-horizontal-2 {
                    0% { transform: translateX(100%); opacity: 0; }
                    50% { opacity: 0.5; }
                    100% { transform: translateX(-100%); opacity: 0; }
                }
                
                @keyframes pulse-horizontal-3 {
                    0% { transform: translateX(-100%); opacity: 0; }
                    50% { opacity: 0.7; }
                    100% { transform: translateX(100%); opacity: 0; }
                }
                
                @keyframes pulse-horizontal-4 {
                    0% { transform: translateX(100%); opacity: 0; }
                    50% { opacity: 0.45; }
                    100% { transform: translateX(-100%); opacity: 0; }
                }
                
                @keyframes pulse-vertical-1 {
                    0% { transform: translateY(-100%); opacity: 0; }
                    50% { opacity: 0.4; }
                    100% { transform: translateY(100%); opacity: 0; }
                }
                
                @keyframes pulse-vertical-2 {
                    0% { transform: translateY(100%); opacity: 0; }
                    50% { opacity: 0.5; }
                    100% { transform: translateY(-100%); opacity: 0; }
                }
                
                @keyframes pulse-vertical-3 {
                    0% { transform: translateY(-100%); opacity: 0; }
                    50% { opacity: 0.35; }
                    100% { transform: translateY(100%); opacity: 0; }
                }
                
                @keyframes pulse-vertical-4 {
                    0% { transform: translateY(100%); opacity: 0; }
                    50% { opacity: 0.55; }
                    100% { transform: translateY(-100%); opacity: 0; }
                }
                
                @keyframes pulse-diagonal-1 {
                    0% { transform: rotate(45deg) translateY(-100%); opacity: 0; }
                    50% { opacity: 0.3; }
                    100% { transform: rotate(45deg) translateY(100%); opacity: 0; }
                }
                
                @keyframes pulse-diagonal-2 {
                    0% { transform: rotate(-45deg) translateY(-100%); opacity: 0; }
                    50% { opacity: 0.4; }
                    100% { transform: rotate(-45deg) translateY(100%); opacity: 0; }
                }
                
                @keyframes pulse-diagonal-3 {
                    0% { transform: rotate(30deg) translateY(100%); opacity: 0; }
                    50% { opacity: 0.25; }
                    100% { transform: rotate(30deg) translateY(-100%); opacity: 0; }
                }
                
                @keyframes pulse-diagonal-4 {
                    0% { transform: rotate(-30deg) translateY(100%); opacity: 0; }
                    50% { opacity: 0.35; }
                    100% { transform: rotate(-30deg) translateY(-100%); opacity: 0; }
                }
                
                @keyframes pulse-node-1 {
                    0%, 100% { 
                        transform: scale(1); 
                        opacity: 0.8;
                        box-shadow: 0 0 0 0 rgb(96 165 250 / 0.7);
                    }
                    50% { 
                        transform: scale(1.5); 
                        opacity: 1;
                        box-shadow: 0 0 0 10px rgb(96 165 250 / 0);
                    }
                }
                
                @keyframes pulse-node-2 {
                    0%, 100% { 
                        transform: scale(1); 
                        opacity: 0.7;
                        box-shadow: 0 0 0 0 rgb(196 181 253 / 0.7);
                    }
                    50% { 
                        transform: scale(1.8); 
                        opacity: 1;
                        box-shadow: 0 0 0 8px rgb(196 181 253 / 0);
                    }
                }
                
                @keyframes pulse-node-3 {
                    0%, 100% { 
                        transform: scale(1); 
                        opacity: 0.6;
                        box-shadow: 0 0 0 0 rgb(34 211 238 / 0.6);
                    }
                    50% { 
                        transform: scale(2); 
                        opacity: 1;
                        box-shadow: 0 0 0 12px rgb(34 211 238 / 0);
                    }
                }
                
                @keyframes pulse-node-4 {
                    0%, 100% { 
                        transform: scale(1); 
                        opacity: 0.9;
                        box-shadow: 0 0 0 0 rgb(244 114 182 / 0.9);
                    }
                    50% { 
                        transform: scale(1.3); 
                        opacity: 1;
                        box-shadow: 0 0 0 6px rgb(244 114 182 / 0);
                    }
                }
                
                @keyframes pulse-node-5 {
                    0%, 100% { 
                        transform: scale(1); 
                        opacity: 0.75;
                        box-shadow: 0 0 0 0 rgb(129 140 248 / 0.75);
                    }
                    50% { 
                        transform: scale(1.6); 
                        opacity: 1;
                        box-shadow: 0 0 0 9px rgb(129 140 248 / 0);
                    }
                }
                
                @keyframes pulse-node-6 {
                    0%, 100% { 
                        transform: scale(1); 
                        opacity: 0.65;
                        box-shadow: 0 0 0 0 rgb(74 222 128 / 0.65);
                    }
                    50% { 
                        transform: scale(1.7); 
                        opacity: 1;
                        box-shadow: 0 0 0 11px rgb(74 222 128 / 0);
                    }
                }
                
                @keyframes pulse-node-7 {
                    0%, 100% { 
                        transform: scale(1); 
                        opacity: 0.85;
                        box-shadow: 0 0 0 0 rgb(250 204 21 / 0.85);
                    }
                    50% { 
                        transform: scale(1.4); 
                        opacity: 1;
                        box-shadow: 0 0 0 7px rgb(250 204 21 / 0);
                    }
                }
                
                @keyframes pulse-circuit-1 {
                    0%, 100% { opacity: 0; transform: scaleX(0); }
                    50% { opacity: 0.4; transform: scaleX(1); }
                }
                
                @keyframes pulse-circuit-2 {
                    0%, 100% { opacity: 0; transform: scaleX(0); }
                    50% { opacity: 0.35; transform: scaleX(1); }
                }
                
                @keyframes pulse-circuit-3 {
                    0%, 100% { opacity: 0; transform: scaleX(0); }
                    50% { opacity: 0.5; transform: scaleX(1); }
                }
                
                .animate-pulse-horizontal-1 {
                    animation: pulse-horizontal-1 3s infinite;
                    animation-delay: 0s;
                }
                
                .animate-pulse-horizontal-2 {
                    animation: pulse-horizontal-2 4s infinite;
                    animation-delay: 1s;
                }
                
                .animate-pulse-horizontal-3 {
                    animation: pulse-horizontal-3 3.5s infinite;
                    animation-delay: 2s;
                }
                
                .animate-pulse-horizontal-4 {
                    animation: pulse-horizontal-4 4.5s infinite;
                    animation-delay: 2.8s;
                }
                
                .animate-pulse-vertical-1 {
                    animation: pulse-vertical-1 5s infinite;
                    animation-delay: 0.5s;
                }
                
                .animate-pulse-vertical-2 {
                    animation: pulse-vertical-2 4.5s infinite;
                    animation-delay: 2.5s;
                }
                
                .animate-pulse-vertical-3 {
                    animation: pulse-vertical-3 5.5s infinite;
                    animation-delay: 1.2s;
                }
                
                .animate-pulse-vertical-4 {
                    animation: pulse-vertical-4 4.2s infinite;
                    animation-delay: 3.1s;
                }
                
                .animate-pulse-diagonal-1 {
                    animation: pulse-diagonal-1 6s infinite;
                    animation-delay: 1.5s;
                }
                
                .animate-pulse-diagonal-2 {
                    animation: pulse-diagonal-2 5.5s infinite;
                    animation-delay: 3s;
                }
                
                .animate-pulse-diagonal-3 {
                    animation: pulse-diagonal-3 6.5s infinite;
                    animation-delay: 0.8s;
                }
                
                .animate-pulse-diagonal-4 {
                    animation: pulse-diagonal-4 5.8s infinite;
                    animation-delay: 2.2s;
                }
                
                .animate-pulse-node-1 {
                    animation: pulse-node-1 2s infinite;
                    animation-delay: 0s;
                }
                
                .animate-pulse-node-2 {
                    animation: pulse-node-2 2.5s infinite;
                    animation-delay: 0.7s;
                }
                
                .animate-pulse-node-3 {
                    animation: pulse-node-3 3s infinite;
                    animation-delay: 1.2s;
                }
                
                .animate-pulse-node-4 {
                    animation: pulse-node-4 1.8s infinite;
                    animation-delay: 0.3s;
                }
                
                .animate-pulse-node-5 {
                    animation: pulse-node-5 2.3s infinite;
                    animation-delay: 1.5s;
                }
                
                .animate-pulse-node-6 {
                    animation: pulse-node-6 2.7s infinite;
                    animation-delay: 0.9s;
                }
                
                .animate-pulse-node-7 {
                    animation: pulse-node-7 2.1s infinite;
                    animation-delay: 1.8s;
                }
                
                .animate-pulse-circuit-1 {
                    animation: pulse-circuit-1 4s infinite;
                    animation-delay: 1s;
                }
                
                .animate-pulse-circuit-2 {
                    animation: pulse-circuit-2 3.5s infinite;
                    animation-delay: 2.3s;
                }
                
                .animate-pulse-circuit-3 {
                    animation: pulse-circuit-3 4.2s infinite;
                    animation-delay: 0.6s;
                }
            `}</style>
        </main>
    );
};

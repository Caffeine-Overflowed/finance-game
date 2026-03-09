import { FC, useState } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { HeadAndSupportNotCentered } from "@/features/mainpage/ui/HeadAndSupportNotCentered";
import { useCreateGameMutation } from "@/shared/api";
import { Button } from "@/shared/components/base/buttons/button";
import { Input } from "@/shared/components/base/input/input";
import { lobbyUrlBuilder } from "@/shared/utils/lobbyUrlBuilder";

interface Props {
    router: AppRouterInstance;
}

export const Footer: FC<Props> = ({ router }) => {
    const [organizerName, setOrganizerName] = useState("");

    const [createGame] = useCreateGameMutation();
    const handleGetStarted = async () => {
        const resp = await createGame({ variables: { data: { leaderName: organizerName } } });

        if (!resp.data) return;
        const code = resp.data?.createGame.code;

        router.push(lobbyUrlBuilder({ code, relative: true }));
    };

    return (
        <footer className="flex w-full flex-col items-center gap-20 self-stretch pb-12 md:px-28">
            <div className="flex flex-col items-start gap-8 self-stretch py-10 md:max-w-md md:px-8">
                <div className={"flex flex-col"}>
                    <HeadAndSupportNotCentered
                        heading={"Create game"}
                        supportingText={"Set up a new game session and invite your friends or students to join"}
                    />

                    {/* Game Features */}
                    <div className="flex flex-col gap-4 self-stretch">
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 text-orange-500">🚀</div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">Quick start</span>
                                <span className="text-sm text-gray-600">launch a game in seconds</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 text-yellow-500">🙌</div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">No registration required</span>
                                <span className="text-sm text-gray-600">jump in without signing up</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 text-gray-500">🎮</div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">Native financial literacy learning</span>
                                <span className="text-sm text-gray-600">through gameplay</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Form Section */}
                <div className="flex flex-col items-start gap-3 self-stretch">
                    <label className="text-sm font-medium text-gray-700">Organizer name</label>

                    <Input
                        id="startGame"
                        placeholder="Enter your name"
                        onChange={(value) => setOrganizerName(value)}
                        className="flex flex-col items-start self-stretch"
                    />

                    <Button
                        onClick={handleGetStarted}
                        color="primary"
                        className="flex items-center justify-center gap-2 self-stretch px-4.5 py-3"
                        disabled={!organizerName.trim()}
                    >
                        Get started
                    </Button>

                    <p className="self-stretch text-center text-xs text-gray-500">You'll get a game code or link to share with friends or students</p>
                </div>
            </div>
        </footer>
    );
};

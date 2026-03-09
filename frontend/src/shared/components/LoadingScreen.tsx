import { FC } from "react";
import { WaveDots } from "@/shared/ui/WaveDots";

interface Props {
    type: "wait_for_others" | "loading" | "game_starting" | "generating" | "loading_results";
}

export const LoadingScreen: FC<Props> = ({ type }) => {
    return (
        <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-primary px-4">
            <div className="flex max-w-md flex-col items-center gap-6 text-center">
                <WaveDots />
                {type === "wait_for_others" && (
                    <h1 className="text-xl leading-tight font-semibold text-bg-brand-solid md:text-2xl">Waiting for other players to answer their questions</h1>
                )}
                {type === "game_starting" && <h1 className="text-xl leading-tight font-semibold text-bg-brand-solid md:text-2xl">Game is starting</h1>}
                {type === "loading_results" && <h1 className="text-xl leading-tight font-semibold text-bg-brand-solid md:text-2xl">Loading results</h1>}
                {type === "loading" && (
                    <h1 className="text-xl leading-tight font-semibold text-bg-brand-solid md:text-2xl">
                        Waiting for other players to answer their questions. Or generating next question
                    </h1>
                )}
            </div>
        </div>
    );
};

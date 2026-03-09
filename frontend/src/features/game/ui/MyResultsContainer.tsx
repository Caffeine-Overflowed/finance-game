import { FC } from "react";
import { AdditionalResultList } from "@/features/game/ui/AdditionalResultList";
import { GameResultQuery } from "@/shared/api";

interface Props {
    data: GameResultQuery;
}

export const MyResultsContainer: FC<Props> = ({ data }) => {
    if (!data?.gameResult) return null;

    const selfResult = data.gameResult.find((result) => result.participant.self);
    return (
        <div className="flex flex-col">
            <h1 className="py-4 text-2xl font-bold text-primary">My results</h1>

            <AdditionalResultList score={selfResult?.score || 0} ageGroups={selfResult?.additionalResults || []} />
        </div>
    );
};

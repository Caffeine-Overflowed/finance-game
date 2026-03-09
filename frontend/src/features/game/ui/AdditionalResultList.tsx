import { FC } from "react";
import { AgeGroupCard } from "@/features/game/ui/AgeGroupCard";
import { SuccessThermometer } from "@/features/game/ui/SuccessThermometer";
import { AdditionalResultItemType } from "@/shared/api";

interface Props {
    ageGroups: AdditionalResultItemType[];
    score: number;
}

export const AdditionalResultList: FC<Props> = ({ ageGroups, score }) => {
    return (
        <div className="flex flex-col gap-4">
            {ageGroups.map((ageGroup) => (
                <AgeGroupCard key={ageGroup.id} ageGroup={ageGroup} />
            ))}
            <SuccessThermometer score={score} />
        </div>
    );
};

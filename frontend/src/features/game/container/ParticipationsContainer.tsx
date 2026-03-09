import React, { FC } from "react";
import { AvatarWithName } from "@/features/game/ui/AvatarWithName";
import { useGameStore } from "@/shared/store/game-store";
import { mod5 } from "@/shared/utils/mod5";

export const ParticipationsContainer: FC = () => {
    const participations = useGameStore((s) => s.participations);

    return (
        <div className="flex flex-row gap-4">
            {participations?.map((participant) => {
                return (
                    <div key={participant.id} className="flex flex-row">
                        <AvatarWithName nickname={participant.name} avatar_id={mod5(participant.id) + 1} />
                    </div>
                );
            })}
        </div>
    );
};

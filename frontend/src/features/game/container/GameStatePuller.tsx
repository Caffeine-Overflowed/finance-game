import { FC, useEffect } from "react";
import { useGameStateQuery } from "@/shared/api";
import { useGameStore } from "@/shared/store/game-store";

interface Props {
    active?: boolean
}

export const GameStatePuller: FC<Props> = ({active = true}) => {
    const { state, setState } = useGameStore();
    if (!state) return;

    const { data } = useGameStateQuery({
        variables: { gameId: state.id },
        pollInterval: 500,
        skip: !active
    });

    useEffect(() => {
        if (data?.gameState) {
            console.log(data)
            setState(data.gameState);
        }
    }, [data]);

    return null;
};

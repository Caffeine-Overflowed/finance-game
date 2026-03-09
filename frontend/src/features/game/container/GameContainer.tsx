"use client";

import { FC, useEffect } from "react";
import { GameFinal } from "@/features/game/container/GameFinal";
import { GameStatePuller } from "@/features/game/container/GameStatePuller";
import { IntermediateResultsContainer } from "@/features/game/container/IntermediateResultsContainer";
import { JoinedWaitingContainer } from "@/features/game/container/JoinedWaitingContainer";
import { JoiningContainer } from "@/features/game/container/JoiningContainer";
import { LeaderLobbyContainer } from "@/features/game/container/LeaderLobbyContainer";
import { QuestionFormContainer } from "@/features/game/container/QuestionFormContainer";
import { GameStatusEnum, TurnStatusEnum, useGameParticipantsQuery, useGameStateByCodeQuery } from "@/shared/api";
import { LoadingScreen } from "@/shared/components/LoadingScreen";
import { useGameStore } from "@/shared/store/game-store";

interface Props {
    code: string;
}

export const GameContainer: FC<Props> = ({ code }) => {
    const { setParticipations, setState, state, participations } = useGameStore();

    const { data: codeData } = useGameStateByCodeQuery({
        variables: { code },
        skip: !!state?.id,
    });

    const skipParticipants = !state?.id || state.status !== GameStatusEnum.InLobby;

    const { data: participationsData } = useGameParticipantsQuery({
        variables: state?.id ? { gameId: state.id } : ({} as any),
        skip: skipParticipants,
        pollInterval: 500,
    });

    useEffect(() => {
        if (!!state?.id) return;

        const game = codeData?.gameStateByCode;
        if (!game) return;
        setState(game);
    }, [codeData, setState]);

    useEffect(() => {
        const list = participationsData?.gameParticipants;
        if (!list) return;
        setParticipations(list);
    }, [participationsData, setParticipations]);

    // Если стейт ещё не загружен — показываем лоадер
    if (!state) {
        return <LoadingScreen type="loading" />;
    }

    const hasJoined = participations?.some((e) => e.self) ?? false;

    // Сначала убеждаемся, что turns есть, и только потом вычисляем производные

    const currentStep = state.turns?.find((e) => e.index === state.currentTurnIndex);

    const allConfirmed = state.turns?.every((e) => e.status === TurnStatusEnum.Confirmed);

    // Лобби
    if (state.status === GameStatusEnum.InLobby) {
        if (state.isLeader) return <LeaderLobbyContainer />;
        if (!hasJoined) return <JoiningContainer />;
        return <JoinedWaitingContainer />;
    }

    if (!state.turns || state.turns.length === 0) {
        return (
            <>
                <GameStatePuller />
                <LoadingScreen type="game_starting" />
            </>
        );
    }

    // Ходы ещё не подтверждены всеми
    if (!allConfirmed) {
        if (currentStep?.status === TurnStatusEnum.Generating) {
            if (currentStep.index === 1) {
                return (
                    <>
                        <GameStatePuller />
                        <LoadingScreen type="game_starting" />
                    </>
                );
            }
            return (
                <>
                    <GameStatePuller />
                    <LoadingScreen type="loading" />
                </>
            );
        }

        if (currentStep?.status === TurnStatusEnum.Answered) {
            if (currentStep.hasConfirmed) {
                return (
                    <>
                        <GameStatePuller />
                        <LoadingScreen type="wait_for_others" />
                    </>
                );
            }
            return (
                <>
                    <GameStatePuller />
                    <IntermediateResultsContainer />
                </>
            );
        }

        if (currentStep?.status === TurnStatusEnum.WaitingForAnswers) {
            return (
                <>
                    <GameStatePuller />
                    <QuestionFormContainer />
                </>
            );
        }
    }

    // Генерация итогов
    if (state.status === GameStatusEnum.GeneratingResults) {
        return (
            <>
                <GameStatePuller />
                <LoadingScreen type="loading_results" />
            </>
        );
    }

    return <GameFinal />;
};

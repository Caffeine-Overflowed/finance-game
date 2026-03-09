"use client";

import { FC } from "react";
import { Check, Copy01 } from "@untitledui/icons";
import { GameLobbyForm } from "@/features/game/container/GameLobbyForm";
import { GameStatusEnum, useStartGameMutation } from "@/shared/api";
import { Button } from "@/shared/components/base/buttons/button";
import { InputBase } from "@/shared/components/base/input/input";
import { InputGroup } from "@/shared/components/base/input/input-group";
import { Label } from "@/shared/components/base/input/label";
import { useClipboard } from "@/shared/hooks/use-clipboard";
import { useGameStore } from "@/shared/store/game-store";
import { lobbyUrlBuilder } from "@/shared/utils/lobbyUrlBuilder";

export const LeaderLobbyContainer: FC = () => {
    const state = useGameStore((s) => s.state)!;
    const setState = useGameStore((s) => s.setState)!;

    const [startGame] = useStartGameMutation();

    const { copy, copied } = useClipboard();
    const { copy: copyCode } = useClipboard();

    const url = lobbyUrlBuilder({
        code: state.code,
        relative: false,
    });

    const onSubmit = async () => {
        await startGame({ variables: { gameId: state.id } });

        setState({ ...state, status: GameStatusEnum.InProgress });
    };

    return (
        <GameLobbyForm title={"Waiting for players"}>
            <InputGroup
                label="Send the participants the game link"
                trailingAddon={
                    <Button color="secondary" iconLeading={copied ? Check : Copy01} onClick={() => copy(url)}>
                        Copy
                    </Button>
                }
                isReadOnly
            >
                <InputBase value={url} tooltip={"Game link"} />
            </InputGroup>
            <div className="flex w-full items-center gap-2">
                <div className="flex-grow border border-gray-200"></div>
                <span className="font-medium text-gray-500">OR</span>
                <div className="flex-grow border border-gray-200"></div>
            </div>

            <div className={"flex w-full flex-col gap-1.5"}>
                <Label htmlFor="code" className="text-secondary">
                    Code
                </Label>
                <Button color={"secondary"} size={"xl"} className={"h-14 text-xl"} onClick={() => copyCode(state.code)}>
                    {state.code}
                </Button>
            </div>

            <Button color={"primary"} size={"xl"} className={"mt-4 h-12"} onClick={onSubmit}>
                Start the game
            </Button>
        </GameLobbyForm>
    );
};

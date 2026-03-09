import { FC, useState } from "react";
import { GameLobbyForm } from "@/features/game/container/GameLobbyForm";
import { GameParticipantsDocument, useJoinGameMutation } from "@/shared/api";
import { Button } from "@/shared/components/base/buttons/button";
import { Input } from "@/shared/components/base/input/input";
import { useGameStore } from "@/shared/store/game-store";
import { customToast } from "@/shared/utils/customToast";

export const JoiningContainer: FC = () => {
    const state = useGameStore((s) => s.state)!;

    const [joinGame] = useJoinGameMutation();
    const [name, setName] = useState<string>("");

    const onSubmit = async () => {
        await joinGame({
            variables: {
                data: { gameId: state.id, participationName: name },
            },
        });

        customToast("You joined the lobby");
    };

    return (
        <GameLobbyForm title={"Enter your name to started game"} className={"gap-8"} onSubmit={onSubmit}>
            <Input value={name} onChange={setName} placeholder={"Type your name"}/>
            <Button type={"submit"} size={"xl"}>
                Join the game
            </Button>
        </GameLobbyForm>
    );
};

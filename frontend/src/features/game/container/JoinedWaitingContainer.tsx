import { GameLobbyForm } from "@/features/game/container/GameLobbyForm";
import { GameStatePuller } from "@/features/game/container/GameStatePuller";

export const JoinedWaitingContainer = () => (
    <>
        <GameStatePuller/>
        <GameLobbyForm title={"Waiting for other players"} />
    </>
);

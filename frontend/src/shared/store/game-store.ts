import { create } from "zustand/index";
import { GameParticipantFragment, GameStateFragment } from "@/shared/api";

export interface GameStoreState {
    state: GameStateFragment | null;
    participations: GameParticipantFragment[] | null;
    setState: (state: GameStateFragment | null) => void;
    setParticipations: (participations: GameParticipantFragment[] | null) => void;
}

export const useGameStore = create<GameStoreState>()((set) => ({
    state: null,
    participations: null,

    setState: (state: GameStateFragment | null) => {
        console.log("setting state", state);
        set({ state });
    },
    setParticipations: (participations: GameParticipantFragment[] | null) => {
        set({ participations });
    },
}));

import { FC } from "react";
import { PlayerInfo } from "@/features/game/container/GameFinal";
import { Avatar } from "@/shared/components/base/avatar/avatar";
import { mod5 } from "@/shared/utils/mod5";

interface Props {
    player: PlayerInfo;
    position: number;
}

export const PodiumCard: FC<Props> = ({ player, position }) => {
    const getPositionColor = () => {
        switch (position) {
            case 1:
                return "bg-purple-500";
            case 2:
                return "bg-purple-400";
            case 3:
                return "bg-purple-300";
            default:
                return "bg-gray-300";
        }
    };

    const getCardHeight = () => {
        switch (position) {
            case 1:
                return "h-32";
            case 2:
                return "h-24";
            case 3:
                return "h-20";
            default:
                return "h-16";
        }
    };

    return (
        <div className="relative flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-2">
                <Avatar size="lg" src={`/avatar-${mod5(player.id) + 1}.png`} alt={player.name} />
                <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">{player.name}</div>
                </div>
            </div>
            <div className={`${getPositionColor()} ${getCardHeight()} flex w-20 items-center justify-center rounded-t-lg`}>
                <span className="text-2xl font-bold text-white">{position}</span>
            </div>
        </div>
    );
};

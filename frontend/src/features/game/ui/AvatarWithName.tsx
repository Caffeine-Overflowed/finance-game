import { FC } from "react";
import { LoadingScreen } from "@/shared/components/LoadingScreen";
import { Avatar } from "@/shared/components/base/avatar/avatar";

interface Props {
    nickname?: string;
    avatar_id?: number;
    rotation?: number;
}

export const AvatarWithName: FC<Props> = ({ nickname, avatar_id, rotation }) => {
    // Ограничиваем rotation
    const clampedRotation = Math.max(-20, Math.min(20, rotation ?? 0));

    return (
        <div className="inline-flex flex-col items-center justify-center gap-2.5" style={{ transform: `rotate(${clampedRotation}deg)` }}>
            <Avatar size="xl" alt="Olivia Rhye" src={`/avatar-${avatar_id ?? 0}.png`} className="h-20 w-20" />
            {nickname ? <p className="self-center font-sans text-base leading-6 font-normal text-primary">{nickname}</p> : <LoadingScreen type={"loading"} />}
        </div>
    );
};

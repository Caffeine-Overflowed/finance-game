import { FC, FormEvent, ReactNode } from "react";
import { ParticipationsContainer } from "@/features/game/container/ParticipationsContainer";
import { GameTitle } from "@/features/game/ui/GameTitle";
import { cx } from "@/shared/utils/cx";

interface Props {
    children?: ReactNode;
    title: string;
    className?: string;
    onSubmit?: () => void;
}

export const GameLobbyForm: FC<Props> = ({ children, title, className = "", onSubmit }) => {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit?.();
    };
    return (
        <form className={"flex h-full w-full flex-col items-center justify-center gap-8"} onSubmit={handleSubmit}>
            <ParticipationsContainer />
            <GameTitle text={title} />
            {children && <div className={cx("flex max-w-[540px] flex-col gap-4", className)}>{children}</div>}
        </form>
    );
};

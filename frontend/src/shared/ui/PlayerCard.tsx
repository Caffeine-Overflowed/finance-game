import { FC } from "react";
import { Avatar } from "@/shared/components/base/avatar/avatar";
import { cx } from "@/shared/utils/cx";

export type PlayerCardProps = {
    title: string;
    description?: string;
    avatarID?: number;
    className?: string;
};

export const PlayerCard: FC<PlayerCardProps> = ({ title, description, avatarID, className }) => {
    return (
        <div className={cx("flex w-full items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm", className)}>
            <div className="flex-shrink-0">
                <Avatar size="sm" alt={title} src={`/Avatar${avatarID}.png`} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col items-start justify-start gap-1">
                <h3 className="w-full truncate text-sm leading-5 font-semibold text-primary">{title}</h3>
                {description && <p className="line-clamp-2 text-xs leading-4 text-secondary">{description}</p>}
            </div>
        </div>
    );
};

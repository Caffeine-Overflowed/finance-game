import { JSX } from "react";
import { Avatar } from "@/shared/components/base/avatar/avatar";
import { FeaturedIcon } from "@/shared/ui/FeaturedIcon";
import { WarningIcon } from "@/shared/ui/WarningIcon";

export type ToastProps = {
    id: string | number;
    title: string;
    description?: string;
    type?: "info" | "info2" | "error" | "warning";
    avatarID?: "0" | "1" | "2" | "3" | "4" | "5" | "6";
};

export function CustomToast(props: ToastProps) {
    const { title, description, type = "info", avatarID } = props;

    const iconMap: Record<NonNullable<ToastProps["type"]>, JSX.Element> = {
        info: <FeaturedIcon className="h-10 w-10 text-gray-700" />,
        info2: <FeaturedIcon className="h-10 w-10 text-brand-600" />,
        error: <FeaturedIcon className="h-10 w-10 text-red-500" />,
        warning: <WarningIcon className="h-10 w-10 text-yellow-500" />,
    };

    return (
        <div className="flex w-[400px] items-start gap-4 rounded-xl border border-gray-300 bg-primary p-4 shadow-sm">
            <div className="flex-shrink-0">{avatarID ? <Avatar size="md" alt="aaaa" src={`/avatar-${avatarID}.png`} /> : iconMap[type]}</div>
            <div className="flex flex-1 flex-col items-start justify-center gap-1">
                <h2 className="self-stretch text-base leading-6 font-semibold text-primary">{title}</h2>
                {!!description && <h2 className="self-stretch text-base leading-6 text-primary">{description}</h2>}
            </div>
        </div>
    );
}

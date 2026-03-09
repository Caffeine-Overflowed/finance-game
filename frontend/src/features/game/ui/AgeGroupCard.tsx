import { FC } from "react";
import { AdditionalResultItemType } from "@/shared/api";

interface Props {
    ageGroup: AdditionalResultItemType;
    isActive?: boolean;
    onActionClick?: (actionId: string) => void;
}

export const AgeGroupCard: FC<Props> = ({ ageGroup, isActive = false }) => {
    const { title, description } = ageGroup;

    return (
        <div
            className={`flex flex-col gap-4 rounded-lg border p-3.5 transition-all duration-200 ${
                isActive ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"
            } `}
        >
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-primary">{title}</h3>

                <p className="text-base leading-relaxed text-gray-600">{description}</p>
            </div>
        </div>
    );
};

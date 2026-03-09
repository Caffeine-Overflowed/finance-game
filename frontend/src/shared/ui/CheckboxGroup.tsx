import {FC} from "react";
import {Checkbox} from "@/shared/components/base/checkbox/checkbox";
import {cx} from "@/shared/utils/cx";

interface Option {
    id: number
    label: string;
    description?: string;
}

interface Props {
    options: Option[];
    selectedId: number | null;
    setSelectedId: (id: number) => void;
    disabled?: boolean;
    className?: string;
    checkboxClassName?: string;
}

export const CheckboxGroup: FC<Props> = ({
                                             options,
                                             selectedId,
                                             setSelectedId,
                                             disabled = false,
                                             className,
                                             checkboxClassName,
                                         }) => {
    return (
        <div
            className={cx(
                "flex flex-col gap-3 w-full max-w-2xl mx-auto px-4",
                className
            )}
        >
            {options.map((option) => {
                const isActive = selectedId === option.id;
                return (
                    <Checkbox
                        key={option.id}
                        label={option.label}

                        size="md"
                        isSelected={isActive}
                        onChange={() => setSelectedId(option.id)}
                        isDisabled={disabled}
                        className={cx(
                            "flex w-full p-4 items-start rounded-xl border transition-colors duration-200 ",
                            isActive && !disabled
                                ? "border-2 border-brand-700 bg-brand-50"
                                : "border-gray-200 hover:border-brand-400",
                            disabled && "bg-bg-disabled_subtle cursor-not-allowed opacity-60",
                            checkboxClassName
                        )}
                    />
                );
            })}
        </div>
    );
};

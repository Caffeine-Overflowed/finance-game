import { FC } from "react";
import { Badge } from "@/shared/components/base/badges/badges";
import { badgeTypes } from "@/shared/components/base/badges/badge-types";

interface Props {
  badgeLabel?: string;
  labelText?: string;
  text: string;
  picturePath: string;
}

export const CardWithPicture: FC<Props> = ({ badgeLabel, labelText, text, picturePath }) => {
  return (
    <div className="flex flex-col items-center gap-2 p-7 rounded-[20px]">
      <div className="flex flex-col items-center gap-5">
        <img
          src={picturePath}
          alt={labelText || "Card image"}
          className="rounded-[20px] w-64 h-40 object-cover flex-shrink-0"
        />
        <div className="flex items-center gap-2.5 self-stretch">
          <h2 className="text-base font-semibold text-primary">{labelText}</h2>
          {badgeLabel && (
            <Badge type="color" color="brand" size="md">
              {badgeLabel}
            </Badge>
          )}
        </div>
      </div>

      <p className="text-xs text-primary">{text}</p>
    </div>
  );
};

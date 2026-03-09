import { FC } from "react";

interface Props {
    text: string;
}

export const GameTitle: FC<Props> = ({ text }) => (
    <span className="text-5xl leading-[60px] font-semibold text-gray-900 text-center">{text}</span>
);

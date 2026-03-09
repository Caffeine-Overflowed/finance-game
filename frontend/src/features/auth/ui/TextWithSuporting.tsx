import { FC } from "react";


interface Props{
    mainText: string
    suportingText?: string
}

export const TextWithSuporting: FC<Props> = ({mainText, suportingText}) => {

    return <div className="flex flex-col gap-[12px] items-start self-stretch">
            <h1 className="self-stretch text-primary text-2xl md:text-4xl font-semibold ">
                {mainText}
            </h1>
        {suportingText && <h2 className="self-stretch text-primary font-sans text-base font-normal leading-6">
            {suportingText}
        </h2>
        }

    </div>
}
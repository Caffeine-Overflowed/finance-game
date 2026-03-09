import {FC} from "react";


interface Props{
    stepString?: string,
    heading: string,
    supportingText?: string
}

export const HeadAndSupportNotCentered: FC<Props> = ({stepString, heading, supportingText}) => {
    return <section className="flex flex-col w-2/3 gap-2">
        <div className="flex flex-col items-start gap-3 self-stretch">
            <p className="text-bg-brand-solid  self-stretch">{stepString}</p>
            <h1 className="self-stretch  text-primary text-2xl md:text-4xl font-semibold ">
                {heading}
            </h1>
        </div>

        {supportingText && <h2 className=" text-primary font-sans text-base font-normal leading-6">
            {supportingText}
        </h2>}
    </section>
}

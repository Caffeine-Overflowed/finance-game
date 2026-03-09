import {FC} from "react";


interface Props{
    stepString: string,
    heading: string,
    supportingText?: string
}

export const HeadingAndSupportingText: FC<Props> = ({stepString, heading, supportingText}) => {
    return <section className="flex flex-col justify-center items-center gap-5">
        <div className="flex flex-col items-start gap-3">
            <p className="text-bg-brand-solid text-center">{stepString}</p>
            <h1 className="text-center text-primary text-5xl/18 max-md:px-10 text-4xl font-semibold ">
                {heading}
            </h1>
        </div>

        {supportingText && <h2 className="text-center text-primary font-sans text-3xl/12 max-md:px-28 md:text-base font-normal">
            {supportingText}
        </h2>}
    </section>
}

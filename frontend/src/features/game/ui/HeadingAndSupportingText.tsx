import { FC } from "react";

interface Props {
    stepString: string;
    heading: string;
    supportingText?: string;
}

export const HeadingAndSupportingText: FC<Props> = ({ stepString, heading, supportingText }) => {
    return (
        <section className="flex w-2/3 flex-col items-center justify-center gap-5">
            <div className="flex flex-col items-start gap-3 self-stretch">
                <p className="self-stretch text-center text-bg-brand-solid">{stepString}</p>
                <h1 className="self-stretch text-center text-2xl font-semibold text-primary md:text-4xl">{heading}</h1>
            </div>

            {supportingText && <h2 className="text-center font-sans text-base leading-6 font-normal text-primary">{supportingText}</h2>}
        </section>
    );
};

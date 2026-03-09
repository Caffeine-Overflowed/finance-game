import {FC, ReactNode} from "react";

interface Props{
    text: string
}

export const Alert: FC<Props> = ({text}) => {
    return <div className="flex absolute inset-0 z-10 justify-center items-center mx-auto">
        <div className="flex items-start bg-brand-50 border-2 p-6 gap-4 rounded-xl border-brand-300">
            <h1 className="self-stretch text-md font-semibold text-brand-600 ">
                {text}
            </h1>
        </div>

    </div>
}
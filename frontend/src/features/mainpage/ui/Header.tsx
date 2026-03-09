import {FC} from "react";
import {HeadingAndSupportingText} from "@/shared/components/HeadingAndSupportingText";
import {Button} from "@/shared/components/base/buttons/button";


export const Header: FC = () => {
    const handleCreateClick = () => {
        const el = document.getElementById("startGame");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return <header className="flex flex-col items-center md:px-8 pt-24 gap-8 self-stretch">
        <div className="flex flex-col items-center md:px-8 gap-8 flex-1">
            {/* text container */}
            <div className="flex flex-col items-center gap-12 self-stretch">
                <HeadingAndSupportingText stepString={""}
                                          heading={"Every Decision Shapes Your Life"}
                                          supportingText={"A life-simulation game where every choice you make impacts your future. Learn financial literacy through play"}
                />
                <Button onClick={handleCreateClick} color="primary" className="flex content-center md:h-10 h-20 text-2xl md:text-xl md:rounded-xl w-60 rounded-2xl">
                    Create game
                </Button>
            </div>


            {/* image container */}
            <div className="flex flex-col justify-center items-center w-full md:px-8 gap-8">
                <div className="flex justify-center items-center max-w-[900px] w-full">
                    <img
                        src="/screenshot1.png"
                        alt="Game screenshot"
                        className="w-full h-auto rounded-lg shadow-lg object-cover"
                    />
                </div>
            </div>

        </div>
    </header>

}

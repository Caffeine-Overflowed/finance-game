import { FC, useState } from "react";
import { HeadingAndSupportingText } from "@/features/game/ui/HeadingAndSupportingText";
import { useConfirmTurnMutation, useGameTurnChoicesQuery } from "@/shared/api";
import { LoadingScreen } from "@/shared/components/LoadingScreen";
import { Badge } from "@/shared/components/base/badges/badges";
import { Button } from "@/shared/components/base/buttons/button";
import { useGameStore } from "@/shared/store/game-store";
import { PlayerCard } from "@/shared/ui/PlayerCard";
import { mod5 } from "@/shared/utils/mod5";

export const IntermediateResultsContainer: FC = () => {
    const state = useGameStore((s) => s.state)!;
    const [confirmed, setConfirmed] = useState(false);

    const { data } = useGameTurnChoicesQuery({
        variables: { gameId: state.id },
        fetchPolicy: "network-only",
    });
    const [confirmTurn] = useConfirmTurnMutation();

    const chosenChoices = data?.gameTurnChoices;
    if (!chosenChoices) return;

    const handleNext = async () => {
        setConfirmed(true);
        await confirmTurn({
            variables: {
                gameId: state.id,
            },
            fetchPolicy: "no-cache",
        });
    };

    const selfChoice = chosenChoices.find((e) => e.self)!;
    const otherChoices = chosenChoices.filter((e) => !e.self);

    if (confirmed) {
        return <LoadingScreen type={"wait_for_others"} />;
    }

    return (
        <main className="flex h-full flex-col items-center gap-6 px-4 py-6 sm:px-8 sm:py-8 md:gap-8 md:px-16 md:py-12">
            <HeadingAndSupportingText stepString="Intermediate" heading="Results" />

            <section className="flex min-h-0 w-full max-w-6xl flex-col gap-8 sm:grid sm:grid-cols-2 sm:gap-20">
                <article className="flex min-h-0 flex-col gap-6 md:gap-6">
                    <header className="flex flex-col gap-4">
                        <h2 className="text-base font-medium text-primary md:text-lg">Your choice</h2>

                        <div className="flex flex-col gap-3">
                            <h1 className="text-xl leading-tight font-semibold text-primary sm:text-2xl md:text-3xl">{selfChoice.titleForEveryone}</h1>

                            <div className="flex flex-wrap items-center gap-2">
                                {selfChoice.resultTags.map((e) => (
                                    <Badge type="color" color="brand" size="lg" key={e}>
                                        {e}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </header>

                    <p className="text-sm leading-relaxed text-primary sm:text-base">{selfChoice.result}</p>

                    <Button onClick={handleNext} color="primary" size="md" className="mt-2 w-full sm:w-auto sm:min-w-60">
                        Next
                    </Button>
                </article>

                <aside className="order-1 flex min-h-0 flex-col gap-4 md:gap-4">
                    <h2 className="text-base font-medium text-primary md:text-lg">Choices of other players</h2>

                    <div className="flex max-h-80 flex-col gap-2 overflow-y-auto md:gap-3 lg:max-h-none">
                        {otherChoices.map((e) => (
                            <PlayerCard
                                key={e.participation.id}
                                title={e.participation.name}
                                description={e.titleForEveryone}
                                avatarID={mod5(e.participation.id) + 1}
                            />
                        ))}
                    </div>
                </aside>
            </section>
        </main>
    );
};

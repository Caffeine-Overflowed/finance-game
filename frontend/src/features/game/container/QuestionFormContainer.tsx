import { FC, useEffect, useMemo, useState } from "react";
import { HeadingAndSupportingText } from "@/features/game/ui/HeadingAndSupportingText";
import { LoadingScreen } from "@/shared/components/LoadingScreen";
import { useChooseOptionMutation, useCurrentGameQuestionsQuery } from "@/shared/api";
import { Button } from "@/shared/components/base/buttons/button";
import { useGameStore } from "@/shared/store/game-store";
import { CheckboxGroup } from "@/shared/ui/CheckboxGroup";

export const QuestionFormContainer: FC = () => {
    const gameState = useGameStore((s) => s.state);

    const [answered, setAnswered] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Хук ВСЕГДА вызывается; загрузку контролируем через skip
    const { data, loading } = useCurrentGameQuestionsQuery({
        variables: { gameId: gameState?.id ?? 0 },
        fetchPolicy: "network-only",
        skip: !gameState?.id,
    });

    const [chooseOption] = useChooseOptionMutation();

    // Мемо, чтобы не держать ссылку на массив в зависимостях эффектов
    const question = useMemo(
        () => data?.currentGameQuestions?.[0] ?? null,
        [data]
    );

    // Синхронизация локального answered с бекендом
    useEffect(() => {
        if (question?.answered) {
            setAnswered(true);
        } else {
            setAnswered(false);
        }
    }, [question?.answered]);

    const handleClick = async () => {
        if (selectedId === null) return;
        setAnswered(true);
        try {
            await chooseOption({ variables: { choiceId: selectedId } });
        } catch {
            // откат состояния при ошибке
            setAnswered(false);
        }
    };

    // Единообразные возвраты без изменения порядка хуков
    if (!gameState?.id) return null;
    if (loading) return null;
    if (!question) return null;

    return (
        <div className="flex h-full flex-col items-center gap-8 self-stretch px-3 py-12">
            {answered && <LoadingScreen type={"wait_for_others"}/>}

            <HeadingAndSupportingText
                stepString="Question"
                heading={question.title}
                supportingText="Choose the option you like best"
            />

            <CheckboxGroup
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                disabled={question.answered || answered}
                options={question.choices.map((c) => ({
                    id: c.id,
                    label: c.title,
                    description: c.description,
                }))}
            />

            <Button
                onClick={handleClick}
                isDisabled={selectedId === null || answered}
                color="primary"
                size="md"
                className="flex w-1/3"
            >
                Answer
            </Button>
        </div>
    );
};

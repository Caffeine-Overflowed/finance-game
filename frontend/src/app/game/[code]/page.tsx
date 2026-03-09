import { GameContainer } from "@/features/game/container/GameContainer";

interface Props {
    params: Promise<{ code: string }>;
}

export default async function GamePage({ params }: Props) {
    const { code } = await params;

    return <GameContainer code={code} />;
}

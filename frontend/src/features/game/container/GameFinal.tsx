import { useEffect, useRef, useState } from "react";
import type { SortDescriptor } from "react-aria-components";
import { FinalTable } from "@/features/game/ui/FinalTable";
import { MyResultsContainer } from "@/features/game/ui/MyResultsContainer";
import { PodiumCard } from "@/features/game/ui/PodiumCard";
import { useGameResultQuery } from "@/shared/api";
import { LoadingScreen } from "@/shared/components/LoadingScreen";
import { useGameStore } from "@/shared/store/game-store";

export type PlayerInfo = {
    id: number;
    name: string;
    score: number;
};

// Confetti particle class
class ConfettiParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    gravity: number;
    color: string;
    size: number;
    rotation: number;
    rotationSpeed: number;
    life: number;
    maxLife: number;
    shape: "circle" | "square" | "triangle";

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 15;
        this.vy = (Math.random() - 0.5) * 15 - 5;
        this.gravity = 0.3;
        this.color = this.getRandomColor();
        this.size = Math.random() * 8 + 4;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.life = 0;
        this.maxLife = Math.random() * 100 + 100;
        this.shape = this.getRandomShape();
    }

    getRandomColor(): string {
        const colors = [
            "#FF6B6B",
            "#4ECDC4",
            "#45B7D1",
            "#96CEB4",
            "#FFEAA7",
            "#DDA0DD",
            "#98D8C8",
            "#F7DC6F",
            "#BB8FCE",
            "#85C1E9",
            "#F8C471",
            "#82E0AA",
            "#F1948A",
            "#85C1E9",
            "#FFD93D",
            "#6BCF7F",
            "#4D96FF",
            "#FF9FF3",
            "#54A0FF",
            "#5F27CD",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getRandomShape(): "circle" | "square" | "triangle" {
        const shapes: ("circle" | "square" | "triangle")[] = ["circle", "square", "triangle"];
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    update(): void {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.999;
        this.rotation += this.rotationSpeed;
        this.life++;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const alpha = Math.max(0, 1 - this.life / this.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;

        switch (this.shape) {
            case "circle":
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case "square":
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                break;
            case "triangle":
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2);
                ctx.lineTo(-this.size / 2, this.size / 2);
                ctx.lineTo(this.size / 2, this.size / 2);
                ctx.closePath();
                ctx.fill();
                break;
        }
        ctx.restore();
    }

    isDead(): boolean {
        return this.life >= this.maxLife || this.y > window.innerHeight + 50;
    }
}

// Confetti system hook
const useConfetti = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const particlesRef = useRef<ConfettiParticle[]>([]);

    const createBurst = (x: number, y: number, count: number = 50) => {
        for (let i = 0; i < count; i++) {
            particlesRef.current.push(new ConfettiParticle(x, y));
        }
    };

    const animate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particlesRef.current = particlesRef.current.filter((particle) => {
            particle.update();
            particle.draw(ctx);
            return !particle.isDead();
        });

        // Continue animation if particles exist
        if (particlesRef.current.length > 0) {
            animationRef.current = requestAnimationFrame(animate);
        }
    };

    const startConfetti = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Resize canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Create multiple bursts
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 3;

        // Central massive burst
        createBurst(centerX, centerY, 100);

        // Side bursts
        createBurst(centerX - 250, centerY + 50, 50);
        createBurst(centerX + 250, centerY + 50, 50);

        // Top corners
        createBurst(150, 150, 40);
        createBurst(window.innerWidth - 150, 150, 40);

        // Bottom corners for extra celebration
        createBurst(200, window.innerHeight - 100, 35);
        createBurst(window.innerWidth - 200, window.innerHeight - 100, 35);

        // Start animation
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        animate();
    };

    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return { canvasRef, startConfetti };
};

export const GameFinal = () => {
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "points",
        direction: "descending",
    });

    const { canvasRef, startConfetti } = useConfetti();

    const { state } = useGameStore();
    if (!state) return null;

    const { data, loading } = useGameResultQuery({ variables: { gameId: state.id } });

    useEffect(() => {
        if (data?.gameResult) {
            // Trigger confetti when results are loaded with a slight delay for dramatic effect
            const timer = setTimeout(() => {
                startConfetti();
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [data, startConfetti]);

    if (loading) return <LoadingScreen type={"loading"} />;
    if (!data?.gameResult) return null;

    const participants = data.gameResult.map(
        (result) =>
            ({
                id: result.participant.id,
                name: result.participant.name,
                score: result.score,
            }) as PlayerInfo,
    );

    // Get top 3 for podium
    const topThree = participants.slice(0, 3);
    const podiumOrder = topThree.length >= 3 ? [topThree[1], topThree[0], topThree[2]] : topThree;

    return (
        <>
            {/* Confetti Canvas */}
            <canvas ref={canvasRef} className="pointer-events-none fixed top-0 left-0 z-50" style={{ width: "100vw", height: "100vh" }} />

            <div className="relative flex min-h-screen flex-col items-center px-4 py-8">
                <div className="mb-8 flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-primary">Final Results</h1>

                    {/* Celebration Button */}
                    <button
                        onClick={startConfetti}
                        className="transform rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-110 hover:from-yellow-500 hover:to-orange-600 hover:shadow-xl active:scale-95"
                        title="Celebrate with confetti!"
                    >
                        🎉
                    </button>
                </div>

                <div className="max-sm:pl-4 flex w-full max-w-4xl flex-col md:flex-row gap-12 max-md:items-center">
                    <div className="flex flex-col sm:w-10/12">
                        {/* Header */}

                        {/* Podium Section */}
                        <div
                            className="flex items-end  justify-center gap-8 rounded-t-lg border-t-[1px] border-r-[1px] border-l-[1px] border-gray-200 pt-6"
                            style={{
                                backgroundImage: 'url("/winners-background.svg")',
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            {podiumOrder.map((player) => {
                                const actualPosition = participants.findIndex((p) => p.id === player.id) + 1;
                                return <PodiumCard key={player.id} player={player} position={actualPosition} />;
                            })}
                        </div>

                        {/* Results Table */}
                        <div className="overflow-hidden rounded-b-lg border border-gray-200 shadow-sm">
                            <FinalTable sortedPlayers={participants} sortDescriptor={sortDescriptor} setSortDescriptor={setSortDescriptor} />
                        </div>
                    </div>

                    <MyResultsContainer data={data} />
                </div>
            </div>
        </>
    );
};

"use client";

import { AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/game/gameStore";
import { SplashScreen } from "@/components/game/SplashScreen";
import { IntroScreen } from "@/components/game/IntroScreen";
import { HistoryScreen } from "@/components/game/HistoryScreen";
import { GameScreen } from "@/components/game/GameScreen";
import { EndingScreen } from "@/components/game/EndingScreen";

export default function Home() {
  const phase = useGameStore((s) => s.phase);

  return (
    <main className="min-h-[100dvh] flex flex-col">
      <AnimatePresence mode="wait">
        {phase === "splash" && <SplashScreen key="splash" />}
        {phase === "intro" && <IntroScreen key="intro" />}
        {phase === "history" && <HistoryScreen key="history" />}
        {phase === "game" && <GameScreen key="game" />}
        {phase === "ending" && <EndingScreen key="ending" />}
      </AnimatePresence>
    </main>
  );
}

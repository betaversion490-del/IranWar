"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useGameStore } from "@/lib/game/gameStore";

// ============================================================
// WAR MODE OVERLAY (red vignette when escalation > 70)
// ============================================================
export function WarModeOverlay() {
  const warEscalation = useGameStore((s) => s.warEscalation);

  if (warEscalation < 70) return null;

  return (
    <>
      <div className="war-mode-overlay" />
      <div className="war-mode-vignette" />
    </>
  );
}

// ============================================================
// SCREEN SHAKE (on big events - card impact, nuclear, etc.)
// ============================================================
export function ScreenShake({ trigger }: { trigger: number }) {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;
    setShake(true);
    const t = setTimeout(() => setShake(false), 500);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!shake) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9997 }}
      animate={{
        x: [0, -3, 3, -2, 2, 0],
        y: [0, -2, 2, -3, 3, 0],
      }}
      transition={{ duration: 0.5 }}
    />
  );
}

// ============================================================
// PARTICLE BURST (when arena unit impacts)
// ============================================================
export function ParticleBurst({ x, y, color, count = 8 }: { x: number; y: number; color: string; count?: number }) {
  const particles = Array.from({ length: count }).map((_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const distance = 30 + Math.random() * 20;
    return {
      id: i,
      px: Math.cos(angle) * distance,
      py: Math.sin(angle) * distance,
      delay: Math.random() * 0.1,
    };
  });

  return (
    <div className="absolute pointer-events-none" style={{ left: `${x}%`, top: `${y}%`, zIndex: 25 }}>
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            background: color,
            boxShadow: `0 0 6px ${color}`,
            ['--px' as any]: `${p.px}px`,
            ['--py' as any]: `${p.py}px`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// ACHIEVEMENT SYSTEM
// ============================================================
export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
};

const achievementDefinitions: Achievement[] = [
  { id: "first_card", title: "اولین حرکت", description: "اولین کارت ایران را بازی کردی", icon: "🎮", color: "#22c55e" },
  { id: "first_combo", title: "استراتژیست", description: "اولین کمبو را فعال کردی", icon: "⚡", color: "#fbbf24" },
  { id: "nuclear_breakout", title: "بازدارندگی هسته‌ای", description: "به بمب اتم دست یافتی", icon: "☢️", color: "#dc2626" },
  { id: "axis_full", title: "محور مقاومت", description: "تمام کارت‌های محور مقاومت را بازی کردی", icon: "🛡️", color: "#10b981" },
  { id: "diplomat", title: "دیپلمات برتر", description: "بدون جنگ به صلح رسیدی", icon: "🕊️", color: "#06b6d4" },
  { id: "cyber_master", title: "امپراتور سایبر", description: "۳ حمله سایبری موفق", icon: "💻", color: "#a855f7" },
  { id: "war_survivor", title: "ناجی", description: "از جنگ همه‌جانبه جان به در بردی", icon: "🏆", color: "#f59e0b" },
  { id: "victory", title: "پیروزی استراتژیک", description: "بازی را با موفقیت به پایان بردی", icon: "👑", color: "#fbbf24" },
];

export function AchievementSystem() {
  const moveLog = useGameStore((s) => s.moveLog);
  const playedIranCardIds = useGameStore((s) => s.playedIranCardIds);
  const earlyEndingTriggered = useGameStore((s) => s.earlyEndingTriggered);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const prevLogLength = useRef(0);

  useEffect(() => {
    const newAchievements: Achievement[] = [];

    // First card
    if (moveLog.length === 1 && !unlockedAchievements.has("first_card")) {
      newAchievements.push(achievementDefinitions[0]);
    }

    // First combo
    if (moveLog.length > prevLogLength.current) {
      const lastMove = moveLog[moveLog.length - 1];
      if (lastMove?.combos && lastMove.combos.length > 0 && !unlockedAchievements.has("first_combo")) {
        newAchievements.push(achievementDefinitions[1]);
      }
    }

    // Nuclear breakout
    if (playedIranCardIds.includes("iran_nuclear_breakout") && !unlockedAchievements.has("nuclear_breakout")) {
      newAchievements.push(achievementDefinitions[2]);
    }

    // Axis full
    const axisCards = ["iran_houthi", "iran_hezbollah_full", "iran_iraq_militias", "iran_hamas"];
    const axisPlayed = axisCards.filter(id => playedIranCardIds.includes(id));
    if (axisPlayed.length >= 3 && !unlockedAchievements.has("axis_full")) {
      newAchievements.push(achievementDefinitions[3]);
    }

    // Cyber master - 3 cyber attacks
    const cyberCount = playedIranCardIds.filter(id => id === "iran_cyber").length;
    if (cyberCount >= 3 && !unlockedAchievements.has("cyber_master")) {
      newAchievements.push(achievementDefinitions[5]);
    }

    // Early ending triggered
    if (earlyEndingTriggered && !unlockedAchievements.has("war_survivor")) {
      newAchievements.push(achievementDefinitions[6]);
    }

    prevLogLength.current = moveLog.length;

    if (newAchievements.length > 0) {
      const newSet = new Set(unlockedAchievements);
      newAchievements.forEach(a => newSet.add(a.id));
      setUnlockedAchievements(newSet);
      // Show first achievement
      setCurrentAchievement(newAchievements[0]);
      const t = setTimeout(() => setCurrentAchievement(null), 5000);
      return () => clearTimeout(t);
    }
  }, [moveLog, playedIranCardIds, earlyEndingTriggered]);

  return (
    <AnimatePresence>
      {currentAchievement && (
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 200, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed top-1/4 right-4 z-[100] pointer-events-none"
        >
          <div
            className="px-4 py-3 rounded-xl glass-strong flex items-center gap-3 min-w-[200px]"
            style={{
              border: `2px solid ${currentAchievement.color}`,
              boxShadow: `0 0 20px ${currentAchievement.color}80`,
            }}
          >
            <div className="text-3xl">{currentAchievement.icon}</div>
            <div>
              <div className="text-[8px] font-bold text-amber-300 uppercase tracking-wide">🏆 دستاورد جدید</div>
              <div className="text-sm font-bold" style={{ color: currentAchievement.color }}>{currentAchievement.title}</div>
              <div className="text-[9px] text-muted-foreground">{currentAchievement.description}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// COMBO FLASH OVERLAY (full screen flash when combo activates)
// ============================================================
export function ComboFlashOverlay({ comboName, trigger }: { comboName: string | null; trigger: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger === 0 || !comboName) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(t);
  }, [trigger, comboName]);

  if (!show || !comboName) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 1.5 }}
        className="fixed inset-0 pointer-events-none z-[99]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(251,191,36,0.4) 0%, transparent 60%)",
        }}
      />
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.2, 1, 1, 0.8, 0], opacity: [0, 1, 1, 1, 1, 0] }}
        transition={{ duration: 1.5 }}
        className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[100]"
      >
        <div
          className="px-8 py-4 rounded-2xl text-center"
          style={{
            background: "linear-gradient(135deg, rgba(251,191,36,0.9), rgba(217,119,6,0.9))",
            border: "3px solid #fbbf24",
            boxShadow: "0 0 60px rgba(251,191,36,0.8)",
          }}
        >
          <div className="text-[10px] text-amber-950 font-bold">⚡ کمبو فعال شد ⚡</div>
          <div className="text-2xl font-black text-amber-950">{comboName}</div>
        </div>
      </motion.div>
    </>
  );
}

// ============================================================
// CARD PLAY GLOW RING (when Iran plays a card)
// ============================================================
export function CardPlayGlow({ trigger }: { trigger: number }) {
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;
    setGlow(true);
    const t = setTimeout(() => setGlow(false), 800);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!glow) return null;

  return (
    <motion.div
      initial={{ opacity: 0.8, scale: 0 }}
      animate={{ opacity: 0, scale: 3 }}
      transition={{ duration: 0.8 }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[60]"
      style={{
        width: 100,
        height: 100,
        borderRadius: "50%",
        border: "4px solid #22c55e",
        boxShadow: "0 0 30px #22c55e",
      }}
    />
  );
}

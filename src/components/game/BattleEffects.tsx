"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// ============================================================
// PHASE 3.4: BATTLE EFFECTS OVERLAY
// Shows visual effects (missile trails, explosions, cyber rain)
// when arena units hit each other or reach the end
// ============================================================
export type BattleEffect = {
  id: string;
  type: "missile" | "explosion" | "cyber" | "diplomatic" | "nuclear" | "impact";
  startX?: number; // 0-100 percent
  startY?: number;
  endX?: number;
  endY?: number;
  color?: string;
  icon?: string;
  duration?: number;
};

export function BattleEffectsLayer({ effects }: { effects: BattleEffect[] }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 30 }}>
      <AnimatePresence>
        {effects.map(eff => (
          <BattleEffectItem key={eff.id} effect={eff} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function BattleEffectItem({ effect }: { effect: BattleEffect }) {
  if (effect.type === "missile") {
    return (
      <motion.div
        initial={{ left: `${effect.startX ?? 50}%`, top: `${effect.startY ?? 50}%`, opacity: 1, scale: 1 }}
        animate={{
          left: [`${effect.startX ?? 50}%`, `${effect.endX ?? 50}%`],
          top: [`${effect.startY ?? 50}%`, `${effect.endY ?? 50}%`],
          opacity: [1, 1, 0.8],
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: effect.duration ?? 1.2, ease: "easeIn" }}
        className="absolute text-xl"
        style={{ filter: "drop-shadow(0 0 6px #fbbf24)" }}
      >
        🚀
      </motion.div>
    );
  }

  if (effect.type === "explosion") {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 2, 3], opacity: [1, 0.6, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: effect.duration ?? 0.8 }}
        className="absolute text-4xl"
        style={{
          left: `${effect.endX ?? 50}%`,
          top: `${effect.endY ?? 50}%`,
          transform: "translate(-50%, -50%)",
          filter: "drop-shadow(0 0 10px #dc2626)",
        }}
      >
        💥
      </motion.div>
    );
  }

  if (effect.type === "cyber") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: effect.duration ?? 2 }}
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(16,185,129,0.15) 50%, transparent 100%)",
        }}
      >
        <div className="absolute inset-0 font-mono text-[8px] text-emerald-400 leading-tight overflow-hidden p-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap opacity-60">
              {Array.from({ length: 40 }).map((__, j) => (Math.random() > 0.5 ? "1" : "0")).join("")}
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (effect.type === "nuclear") {
    return (
      <>
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 4, 8], opacity: [1, 0.8, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute rounded-full"
          style={{
            left: `${effect.endX ?? 50}%`,
            top: `${effect.endY ?? 50}%`,
            transform: "translate(-50%, -50%)",
            width: 100, height: 100,
            background: "radial-gradient(circle, rgba(251,191,36,0.9) 0%, rgba(220,38,38,0.6) 30%, rgba(124,58,237,0.3) 60%, transparent 80%)",
            boxShadow: "0 0 60px rgba(220,38,38,0.8)",
          }}
        />
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute inset-0 bg-amber-300/40"
        />
      </>
    );
  }

  if (effect.type === "diplomatic") {
    return (
      <motion.div
        initial={{ scale: 0, y: 0, opacity: 0 }}
        animate={{ scale: 1, y: -30, opacity: 1 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 2 }}
        className="absolute text-3xl"
        style={{
          left: `${effect.endX ?? 50}%`,
          top: `${effect.endY ?? 50}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        🕊️
      </motion.div>
    );
  }

  // Default impact
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 2, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute text-2xl"
      style={{
        left: `${effect.endX ?? 50}%`,
        top: `${effect.endY ?? 50}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {effect.icon || "💥"}
    </motion.div>
  );
}

// ============================================================
// PHASE 3.3: NEWS TICKER - حذف شد (اخبار فرضی حذف شدند)
// ============================================================

// ============================================================
// PHASE 3.2: WORLD MAP HOTSPOTS (compact)
// ============================================================
export function WorldHotspots() {
  const hotspots = [
    { x: 55, y: 45, label: "نطنز", intensity: 0.8 },
    { x: 50, y: 50, label: "هرمز", intensity: 1 },
    { x: 45, y: 35, label: "غزه", intensity: 0.9 },
    { x: 48, y: 30, label: "لبنان", intensity: 0.7 },
    { x: 42, y: 55, label: "یمن", intensity: 0.85 },
    { x: 40, y: 40, label: "عراق", intensity: 0.6 },
    { x: 35, y: 50, label: "سوریه", intensity: 0.5 },
  ];

  return (
    <div className="relative h-full w-full">
      {/* Map background - simplified Middle East */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-30">
        {/* Iran */}
        <path d="M 50 30 L 65 25 L 70 40 L 65 55 L 55 60 L 50 50 Z" fill="#22c55e" opacity="0.2" />
        {/* Israel */}
        <ellipse cx="45" cy="40" rx="2" ry="3" fill="#fbbf24" opacity="0.4" />
        {/* Saudi */}
        <path d="M 38 50 L 50 50 L 50 65 L 40 65 Z" fill="#f59e0b" opacity="0.2" />
        {/* Iraq */}
        <ellipse cx="40" cy="40" rx="5" ry="4" fill="#3b82f6" opacity="0.2" />
      </svg>

      {/* Hotspots */}
      {hotspots.map((h, i) => (
        <div key={i} className="absolute" style={{ left: `${h.x}%`, top: `${h.y}%`, transform: "translate(-50%, -50%)" }}>
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.3, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            className="w-3 h-3 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(220,38,38,${h.intensity}) 0%, transparent 70%)`,
              boxShadow: `0 0 8px rgba(220,38,38,${h.intensity})`,
            }}
          />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[6px] text-rose-300 whitespace-nowrap">
            {h.label}
          </div>
        </div>
      ))}
    </div>
  );
}

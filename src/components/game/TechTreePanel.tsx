"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { iranCards, categoryInfo, rarityInfo, actorInfo } from "@/lib/game/cardsData";
import { getCardCost, getCardEnrichment, arePrereqsMet, comboDefinitions } from "@/lib/game/cardEnrichments";
import { getPrepTime } from "@/lib/game/cardsData";
import { useGameStore } from "@/lib/game/gameStore";

type TechNode = {
  cardId: string;
  level: number;       // depth in tree (0=root)
  branch: string;      // branch name
  children?: string[];
};

// Define tech tree structure
const techTree: TechNode[] = [
  // === NUCLEAR BRANCH ===
  { cardId: "iran_npt_withdraw", level: 0, branch: "nuclear", children: ["iran_nuclear_breakout"] },
  { cardId: "iran_nuclear_breakout", level: 1, branch: "nuclear", children: ["iran_icbm", "iran_nk_nuclear_deal"] },
  { cardId: "iran_icbm", level: 2, branch: "nuclear" },
  { cardId: "iran_nk_nuclear_deal", level: 2, branch: "nuclear" },

  // === MILITARY BRANCH ===
  { cardId: "iran_missile_strike", level: 0, branch: "military", children: ["iran_strike_us_bases"] },
  { cardId: "iran_drone_swarm", level: 0, branch: "military", children: ["iran_ground_invasion"] },
  { cardId: "iran_strike_us_bases", level: 1, branch: "military" },
  { cardId: "iran_ground_invasion", level: 1, branch: "military" },

  // === PROXY BRANCH ===
  { cardId: "iran_houthi", level: 0, branch: "proxy", children: ["iran_bab_el_mandeb"] },
  { cardId: "iran_iraq_militias", level: 0, branch: "proxy" },
  { cardId: "iran_hamas", level: 0, branch: "proxy" },
  { cardId: "iran_hezbollah_full", level: 0, branch: "proxy" },
  { cardId: "iran_bab_el_mandeb", level: 1, branch: "proxy" },

  // === ASYMMETRIC BRANCH ===
  { cardId: "iran_cyber", level: 0, branch: "asymmetric", children: ["iran_hormuz"] },
  { cardId: "iran_hormuz", level: 1, branch: "asymmetric", children: ["iran_oil_weapon"] },
  { cardId: "iran_oil_weapon", level: 2, branch: "asymmetric" },

  // === DIPLOMATIC BRANCH ===
  { cardId: "iran_diplomacy", level: 0, branch: "diplomatic", children: ["iran_saudi_normalize"] },
  { cardId: "iran_saudi_normalize", level: 1, branch: "diplomatic" },

  // === ALLIANCE BRANCH ===
  { cardId: "iran_russia_alliance", level: 0, branch: "alliance", children: ["iran_china_deal"] },
  { cardId: "iran_china_deal", level: 1, branch: "alliance" },

  // === DOMESTIC BRANCH ===
  { cardId: "iran_patience", level: 0, branch: "domestic", children: ["iran_mobilization"] },
  { cardId: "iran_mobilization", level: 1, branch: "domestic" },
];

const branchColors: Record<string, string> = {
  nuclear: "#dc2626",
  military: "#3b82f6",
  proxy: "#10b981",
  asymmetric: "#f59e0b",
  diplomatic: "#06b6d4",
  alliance: "#a855f7",
  domestic: "#ec4899",
};

const branchLabels: Record<string, string> = {
  nuclear: "هسته‌ای ☢️",
  military: "نظامی ⚔️",
  proxy: "نیابتی 🛡️",
  asymmetric: "نامتقارن 🌊",
  diplomatic: "دیپلماتیک 🕊️",
  alliance: "ائتلاف 🤝",
  domestic: "داخلی 👥",
};

export function TechTreePanel({ onClose }: { onClose: () => void }) {
  const playedIranCardIds = useGameStore((s) => s.playedIranCardIds);
  const selectCard = useGameStore((s) => s.selectCard);

  // Group by branch
  const branches = Array.from(new Set(techTree.map(n => n.branch)));
  const [activeBranch, setActiveBranch] = useState<string>(branches[0]);

  const branchNodes = techTree.filter(n => n.branch === activeBranch);
  const maxLevel = Math.max(...branchNodes.map(n => n.level));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-2xl p-3 max-w-2xl w-full max-h-[85dvh] overflow-y-auto"
        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">🌳 درخت تکنولوژی</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg">✕</button>
        </div>

        {/* Branch tabs */}
        <div className="flex gap-1 mb-3 overflow-x-auto pb-1 no-scrollbar">
          {branches.map(b => (
            <button
              key={b}
              onClick={() => setActiveBranch(b)}
              className={`text-[9px] px-2 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${activeBranch === b ? "text-white" : "text-muted-foreground"}`}
              style={{
                background: activeBranch === b ? branchColors[b] + "30" : "rgba(255,255,255,0.04)",
                border: `1px solid ${activeBranch === b ? branchColors[b] : "transparent"}`,
              }}
            >
              {branchLabels[b]}
            </button>
          ))}
        </div>

        {/* Tree visualization */}
        <div className="space-y-3" style={{ direction: "ltr" }}>
          {Array.from({ length: maxLevel + 1 }).map((_, level) => {
            const nodes = branchNodes.filter(n => n.level === level);
            if (nodes.length === 0) return null;
            return (
              <div key={level} className="flex items-center justify-center gap-3">
                {/* Level label */}
                <div className="text-[8px] text-muted-foreground rotate-180" style={{ writingMode: "vertical-rl" }}>
                  سطح {level}
                </div>
                {/* Connector line from previous level */}
                {level > 0 && (
                  <div className="absolute left-1/2 -translate-x-1/2 -mt-3 w-px h-3 bg-white/20" />
                )}
                {/* Nodes */}
                <div className="flex gap-2 flex-wrap justify-center">
                  {nodes.map(node => {
                    const card = iranCards.find(c => c.id === node.cardId);
                    if (!card) return null;
                    const enr = getCardEnrichment(node.cardId);
                    const isUnlocked = playedIranCardIds.includes(node.cardId);
                    const prereqMet = arePrereqsMet(node.cardId, playedIranCardIds);
                    const state = isUnlocked ? "unlocked" : prereqMet ? "available" : "locked";
                    const cost = getCardCost(node.cardId);
                    const prepTime = getPrepTime(node.cardId);

                    return (
                      <motion.button
                        key={node.cardId}
                        onClick={() => { selectCard(node.cardId); onClose(); }}
                        whileHover={state !== "locked" ? { scale: 1.05 } : {}}
                        className={`tech-node ${state} relative rounded-lg p-2 flex flex-col items-center`}
                        style={{
                          width: 80,
                          background: actorInfo[card.actor].gradient,
                          border: `2px solid ${rarityInfo[card.rarity].color}`,
                          opacity: state === "locked" ? 0.5 : 1,
                        }}
                      >
                        {/* State indicator */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px]"
                          style={{
                            background: state === "unlocked" ? "#22c55e" : state === "available" ? "#fbbf24" : "#64748b",
                          }}>
                          {state === "unlocked" ? "✓" : state === "available" ? "!" : "🔒"}
                        </div>

                        <div className="text-2xl">{card.icon}</div>
                        <div className="text-[8px] font-bold text-center mt-0.5 leading-tight">{card.name}</div>
                        <div className="text-[6px] text-muted-foreground mt-0.5">{card.nameEn}</div>
                        <div className="flex gap-0.5 mt-1">
                          <span className="text-[6px] px-1 rounded bg-fuchsia-500/30 text-fuchsia-200">💎{cost}</span>
                          {prepTime > 0 && <span className="text-[6px] px-1 rounded bg-amber-500/30 text-amber-200">⏱{prepTime}</span>}
                        </div>
                        {enr?.comboTags && enr.comboTags.length > 0 && (
                          <div className="text-[6px] text-fuchsia-300 mt-0.5">⚡{enr.comboTags.length}</div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex gap-3 text-[8px] text-muted-foreground justify-center">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> بازی شده</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> آماده</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-500"></span> قفل</span>
        </div>

        {/* Combo info */}
        <div className="mt-3 p-2 rounded-lg bg-fuchsia-950/30 border border-fuchsia-500/30">
          <div className="text-[9px] font-bold text-fuchsia-300 mb-1">⚡ کمبوهای ممکن</div>
          <div className="space-y-0.5">
            {comboDefinitions.map(c => {
              const matchingPlayed = playedIranCardIds.filter(id => {
                const enr = getCardEnrichment(id);
                return enr?.comboTags?.some(t => c.requiredTags.includes(t));
              });
              return (
                <div key={c.type} className="text-[8px] flex justify-between items-center p-1 rounded bg-fuchsia-500/10">
                  <div>
                    <span className="text-fuchsia-300 font-bold">{c.name}</span>
                    <span className="text-muted-foreground"> - {c.description}</span>
                  </div>
                  <span className={`font-bold ${matchingPlayed.length >= 2 ? "text-emerald-400" : "text-muted-foreground"}`}>
                    {matchingPlayed.length}/2
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

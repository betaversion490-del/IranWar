"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/game/gameStore";
import { iranCards, categoryInfo, rarityInfo, actorInfo, type GameCard } from "@/lib/game/cardsData";
import { FlippableCard } from "./FlippableCard";
import { RelevantHistoryPanel } from "./RelevantHistoryPanel";
import { useState } from "react";

function StatBar({
  label,
  value,
  color,
  icon,
  change,
}: {
  label: string;
  value: number;
  color: string;
  icon: string;
  change?: number;
}) {
  return (
    <div className="space-y-0.5 relative">
      <div className="flex items-center justify-between text-[10px]">
        <span className="flex items-center gap-1 text-muted-foreground">
          <span>{icon}</span>
          <span>{label}</span>
        </span>
        <div className="flex items-center gap-1">
          {change !== undefined && change !== 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-[9px] font-bold font-num px-1 rounded ${
                change > 0
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-rose-500/20 text-rose-300"
              }`}
            >
              {change > 0 ? "+" : ""}{change}
            </motion.span>
          )}
          <span className="font-bold font-num text-xs" style={{ color }}>
            {value}
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function EnemyResponseCard({ card }: { card: GameCard }) {
  const cat = categoryInfo[card.category];
  const rar = rarityInfo[card.rarity];
  const actor = actorInfo[card.actor];

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="rounded-xl p-2.5 sm:p-3 relative overflow-hidden"
      style={{ background: actor.gradient, border: `1px solid ${actor.color}80` }}
    >
      <div className="flex items-start gap-2">
        <div className="text-xl sm:text-2xl shrink-0">{card.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1 flex-wrap">
            <span
              className="text-[8px] sm:text-[9px] px-1 py-0.5 rounded font-bold"
              style={{ backgroundColor: actor.color + "30", color: actor.color }}
            >
              {card.actorLabel}
            </span>
            <span
              className="text-[8px] sm:text-[9px] px-1 py-0.5 rounded font-bold"
              style={{ backgroundColor: cat.color + "30", color: cat.color }}
            >
              {cat.icon}
            </span>
            <span
              className="text-[8px] sm:text-[9px] px-1 py-0.5 rounded font-bold"
              style={{ backgroundColor: rar.color + "30", color: rar.color }}
            >
              {rar.label}
            </span>
          </div>
          <h4 className="font-bold text-xs sm:text-sm leading-tight mb-1">{card.name}</h4>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground/80 leading-relaxed line-clamp-2">
            {card.description}
          </p>
        </div>
      </div>

      {/* Effects */}
      <div className="mt-2 pt-2 border-t border-border/20 flex flex-wrap gap-0.5">
        {Object.entries(card.effects).slice(0, 4).map(([key, val]) => {
          const numVal = typeof val === "number" ? val : 0;
          const isMult = numVal > 0 && numVal < 2 && !Number.isInteger(numVal);
          const display = isMult ? `×${numVal.toFixed(2)}` : `${numVal > 0 ? "+" : ""}${numVal}`;
          return (
            <span
              key={key}
              className={`text-[8px] sm:text-[9px] px-1 py-0.5 rounded font-num ${
                numVal > 0 ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
              }`}
            >
              {display}
            </span>
          );
        })}
      </div>

      {/* Used context */}
      {card.usedContext && (
        <div className="mt-1.5 text-[8px] sm:text-[9px] text-amber-300/80">
          📚 {card.usedContext}
        </div>
      )}
    </motion.div>
  );
}

export function GameScreen() {
  const store = useGameStore();
  const {
    turn,
    maxTurns,
    nuclearProgress,
    regionalInfluence,
    economicStability,
    domesticSupport,
    militaryCapability,
    deterrence,
    warEscalation,
    flippedCardId,
    playedIranCard,
    enemyResponses,
    isResolving,
    moveLog,
    nextTurn,
    earlyEndingTriggered,
    lastStatChanges,
  } = store;

  const flippedCard = flippedCardId ? iranCards.find((c) => c.id === flippedCardId) : null;
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredIranCards = activeFilter === "all"
    ? iranCards
    : iranCards.filter((c) => c.category === activeFilter);

  const categories = [
    { id: "all", label: "همه" },
    { id: "nuclear", label: "☢️" },
    { id: "military", label: "⚔️" },
    { id: "proxy", label: "🛡️" },
    { id: "diplomatic", label: "🕊️" },
    { id: "asymmetric", label: "🌊" },
    { id: "extreme", label: "💀" },
    { id: "alliance", label: "🤝" },
    { id: "cyber", label: "💻" },
    { id: "domestic", label: "👥" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[100dvh] flex flex-col"
    >
      {/* Top status bar */}
      <div className="glass-strong border-b border-border/50 p-2.5 sm:p-3 sticky top-0 z-30 safe-top">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <button
              onClick={() => store.setPhase("splash")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ← خروج
            </button>
            <div className="text-center">
              <div className="text-[10px] text-muted-foreground">نوبت</div>
              <div className="font-bold font-num text-sm">
                {turn} / {maxTurns}
              </div>
            </div>
            <button
              onClick={() => store.setPhase("history")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              📚
            </button>
          </div>

          <div className="h-1 bg-muted/40 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-l from-primary to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${(turn / maxTurns) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 p-2 sm:p-3 md:p-4 max-w-7xl mx-auto w-full">
        {/* Iran Stats Dashboard */}
        <div className="glass rounded-xl p-2.5 sm:p-3 mb-3 sm:mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold text-emerald-400">🇮🇷 شاخص‌های ایران</div>
            <div className="text-[10px] text-muted-foreground">۶ شاخص حیاتی</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 sm:gap-x-4 gap-y-1.5">
            <StatBar label="هسته‌ای" value={nuclearProgress} color="oklch(0.6 0.25 25)" icon="☢️" change={lastStatChanges?.nuclearProgress} />
            <StatBar label="بازدارندگی" value={deterrence} color="oklch(0.65 0.15 165)" icon="🛡️" change={lastStatChanges?.deterrence} />
            <StatBar label="نظامی" value={militaryCapability} color="oklch(0.6 0.18 250)" icon="⚔️" change={lastStatChanges?.militaryCapability} />
            <StatBar label="اقتصاد" value={economicStability} color="oklch(0.7 0.18 70)" icon="💰" change={lastStatChanges?.economicStability} />
            <StatBar label="حمایت داخلی" value={domesticSupport} color="oklch(0.65 0.16 165)" icon="👥" change={lastStatChanges?.domesticSupport} />
            <StatBar label="نفوذ منطقه‌ای" value={regionalInfluence} color="oklch(0.6 0.2 305)" icon="🌐" change={lastStatChanges?.regionalInfluence} />
          </div>

          {/* War Escalation Meter */}
          <div className="mt-2 pt-2 border-t border-border/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-rose-400">🔥 تشدید جنگ</span>
              <span
                className={`text-xs font-bold font-num ${
                  warEscalation > 70 ? "text-rose-400 pulse-danger" : warEscalation > 40 ? "text-amber-400" : "text-emerald-400"
                }`}
              >
                {warEscalation > 70 ? "بحرانی" : warEscalation > 40 ? "متوسط" : "کنترل‌شده"} - {warEscalation}
              </span>
            </div>
            <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, oklch(0.65 0.18 165), oklch(0.7 0.18 85), oklch(0.65 0.18 35), oklch(0.62 0.24 25))`,
                  backgroundSize: "200% 100%",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${warEscalation}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        </div>

        {/* Resolving area - shows played cards */}
        <AnimatePresence>
          {isResolving && (playedIranCard || enemyResponses.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-strong rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4 border-primary/30"
            >
              <div className="text-center text-xs text-muted-foreground mb-3">نتیجه نوبت {turn}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {playedIranCard && (
                  <div>
                    <div className="text-xs text-center text-emerald-400 mb-1.5 font-bold">🇮🇷 حرکت ایران</div>
                    <EnemyResponseCard card={playedIranCard} />
                  </div>
                )}
                {enemyResponses.map((card, idx) => (
                  <div key={idx}>
                    <div className="text-xs text-center mb-1.5 font-bold" style={{ color: actorInfo[card.actor].color }}>
                      {card.actorLabel}
                    </div>
                    <EnemyResponseCard card={card} />
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center">
                {earlyEndingTriggered ? (
                  <div className="space-y-2">
                    <div className="text-xs text-rose-400 font-bold animate-pulse">
                      ⚠️ شرایط بحرانی ایجاد شد - بازی به پایان می‌رسد
                    </div>
                    <button
                      onClick={() => nextTurn()}
                      className="px-6 sm:px-8 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm sm:text-base hover:scale-105 active:scale-95 transition-all shadow-lg shadow-rose-600/30"
                    >
                      🏁 مشاهده پایان
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => nextTurn()}
                    className="px-6 sm:px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm sm:text-base hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/30"
                  >
                    {turn >= maxTurns ? "🏁 نتیجه نهایی" : "← ادامه نوبت بعد"}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards section */}
        {!isResolving && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-sm sm:text-base md:text-lg font-bold">🎭 کارت‌های ایران</h3>
              <span className="text-xs text-muted-foreground">{iranCards.length} کارت</span>
            </div>

            {/* Category filter - scrollable horizontally on mobile */}
            <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 -mx-2 px-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                    activeFilter === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "glass text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label={cat.id === "all" ? "همه" : cat.id}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Cards grid + side panel */}
            <div className="grid lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Cards */}
              <div className="lg:col-span-3">
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 overflow-y-auto p-1"
                  style={{ maxHeight: "60vh", WebkitOverflowScrolling: "touch" }}
                >
                  {filteredIranCards.map((card) => (
                    <FlippableCard key={card.id} card={card} />
                  ))}
                </div>
              </div>

              {/* Side panel - below cards on mobile, beside on desktop */}
              <div className="lg:col-span-1 mt-3 lg:mt-0">
                <RelevantHistoryPanel card={flippedCard || playedIranCard} />
                {!flippedCard && !playedIranCard && (
                  <div className="glass rounded-2xl p-3 sm:p-4">
                    <div className="text-xs font-bold text-muted-foreground mb-2">💡 راهنما</div>
                    <ul className="text-[10px] sm:text-[11px] text-muted-foreground/80 space-y-1.5 leading-relaxed">
                      <li>• روی کارت ضربه بزنید تا ورق بخورد</li>
                      <li>• 📚 = قبلاً در تاریخ استفاده شده</li>
                      <li>• 💀 = کارت افراطی</li>
                      <li>• ۲-۳ کارت پاسخ از دشمنان می‌آید</li>
                      <li>• دشمنان: آمریکا، اسرائیل، عرب، ناتو</li>
                      <li>• متحدان: کره شمالی، روسیه، چین</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Move Log */}
        {moveLog.length > 0 && (
          <div className="mt-4 sm:mt-6 glass rounded-xl p-3 sm:p-4">
            <h3 className="text-sm font-bold mb-2">📜 گزارش نوبت‌های گذشته</h3>
            <div className="max-h-32 sm:max-h-40 overflow-y-auto space-y-2">
              {[...moveLog].reverse().map((move, idx) => (
                <div key={idx} className="text-xs border-r-2 border-primary/40 pr-2 py-1">
                  <div className="text-muted-foreground mb-0.5">نوبت {move.turn}</div>
                  <div className="text-foreground leading-relaxed">{move.summary}</div>
                  <div className="text-muted-foreground/70 mt-0.5 text-[10px]">{move.effectsSummary}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

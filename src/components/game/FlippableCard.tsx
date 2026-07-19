"use client";

import { motion } from "framer-motion";
import { categoryInfo, rarityInfo, actorInfo, type GameCard } from "@/lib/game/cardsData";
import { useGameStore } from "@/lib/game/gameStore";

export function FlippableCard({
  card,
  isPlayed = false,
  size = "normal",
}: {
  card: GameCard;
  isPlayed?: boolean;
  size?: "normal" | "small" | "large";
}) {
  const flippedCardId = useGameStore((s) => s.flippedCardId);
  const flipCard = useGameStore((s) => s.flipCard);
  const playCard = useGameStore((s) => s.playCard);
  const isResolving = useGameStore((s) => s.isResolving);
  const playedIranCardIds = useGameStore((s) => s.playedIranCardIds);

  const cat = categoryInfo[card.category];
  const rar = rarityInfo[card.rarity];
  const actor = actorInfo[card.actor];
  const isFlipped = flippedCardId === card.id;
  const isPlayedThisGame = playedIranCardIds.includes(card.id);
  const alreadyUsedInHistory = card.used;

  const sizeClasses = {
    small: "w-32 h-44",
    normal: "w-full h-64 sm:h-72",
    large: "w-56 h-80 sm:w-64 sm:h-96",
  };

  return (
    <div
      className={`relative ${sizeClasses[size]}`}
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
      >
        {/* FRONT */}
        <div
          className={`absolute inset-0 rounded-2xl p-3 flex flex-col items-center text-center ${
            isPlayedThisGame ? "opacity-60" : ""
          } ${isFlipped ? "pointer-events-none" : ""}`}
          style={{
            background: actor.gradient,
            border: `1px solid ${actor.color}80`,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Top badges */}
          <div className="absolute top-1.5 right-1.5 left-1.5 flex items-start justify-between pointer-events-none">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: rar.color + "30", color: rar.color }}>
              {rar.label}
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: cat.color + "30", color: cat.color }}>
              {cat.icon} {cat.label}
            </span>
          </div>

          {/* Used marker */}
          {(alreadyUsedInHistory || isPlayedThisGame) && (
            <div className="absolute top-7 left-1.5 pointer-events-none">
              <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-amber-500/20 text-amber-300">
                {isPlayedThisGame ? "✓ استفاده شد" : "📚 قبلاً استفاده"}
              </span>
            </div>
          )}

          {/* Icon */}
          <div className="text-4xl md:text-5xl mt-8 mb-1 pointer-events-none">{card.icon}</div>

          {/* Name */}
          <h4 className="font-bold text-sm md:text-base leading-tight mb-1 pointer-events-none">{card.name}</h4>
          <div className="text-[9px] text-muted-foreground/70 mb-2 pointer-events-none">{card.nameEn}</div>

          {/* Description */}
          <p className="text-[10px] md:text-xs text-muted-foreground/80 leading-relaxed line-clamp-3 flex-1 pointer-events-none">
            {card.description}
          </p>

          {/* Bottom: Effects preview */}
          <div className="mt-2 pt-2 border-t border-border/20 flex flex-wrap justify-center gap-1 pointer-events-none">
            {Object.entries(card.effects).slice(0, 3).map(([key, val]) => {
              const numVal = typeof val === "number" ? val : 0;
              const isMult = numVal > 0 && numVal < 2 && !Number.isInteger(numVal);
              const display = isMult ? `×${numVal.toFixed(2)}` : `${numVal > 0 ? "+" : ""}${numVal}`;
              return (
                <span
                  key={key}
                  className={`text-[8px] md:text-[9px] px-1 py-0.5 rounded font-num ${
                    numVal > 0 ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
                  }`}
                >
                  {display}
                </span>
              );
            })}
          </div>

          {/* Flip button - covers the whole front, only when no card is flipped (or this one is) */}
          {!isPlayed && !isResolving && !isFlipped && !flippedCardId && (
            <button
              onClick={() => flipCard(card.id)}
              className="absolute inset-0 w-full h-full cursor-pointer"
              aria-label={`ورق زدن کارت ${card.name}`}
              style={{ background: "transparent", border: "none" }}
            />
          )}

          {/* Hint */}
          {!isPlayed && !isResolving && !isFlipped && !flippedCardId && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground/50 pointer-events-none">
              برای جزئیات ضربه بزنید
            </div>
          )}
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-2xl p-3 flex flex-col text-right glass-strong"
          style={{
            border: `1px solid ${actor.color}80`,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/30">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-lg shrink-0">{card.icon}</span>
              <h4 className="font-bold text-xs md:text-sm leading-tight truncate">{card.name}</h4>
            </div>
            <button
              onClick={() => flipCard(null)}
              className="text-muted-foreground hover:text-foreground text-xs shrink-0 p-1 -m-1"
              aria-label="بستن"
            >
              ✕
            </button>
          </div>

          {/* Actor label */}
          <div className="mb-2">
            <span className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ backgroundColor: actor.color + "30", color: actor.color }}>
              {card.actorLabel}
            </span>
          </div>

          {/* Long description */}
          <p className="text-[10px] md:text-xs text-muted-foreground/90 leading-relaxed mb-2 flex-1 overflow-y-auto">
            {card.longDescription}
          </p>

          {/* Used context */}
          {card.usedContext && (
            <div className="mb-2 p-1.5 rounded bg-amber-500/10 border border-amber-500/20">
              <div className="text-[9px] text-amber-300 font-bold mb-0.5">📚 سابقه استفاده:</div>
              <div className="text-[9px] text-amber-200/80 leading-relaxed">{card.usedContext}</div>
            </div>
          )}

          {/* Effects */}
          <div className="mb-2">
            <div className="text-[9px] text-muted-foreground mb-1">اثرات:</div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(card.effects).map(([key, val]) => {
                const numVal = typeof val === "number" ? val : 0;
                const isMult = numVal > 0 && numVal < 2 && !Number.isInteger(numVal);
                const display = isMult ? `×${numVal.toFixed(2)}` : `${numVal > 0 ? "+" : ""}${numVal}`;
                return (
                  <span
                    key={key}
                    className={`text-[9px] px-1 py-0.5 rounded font-num ${
                      numVal > 0 ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
                    }`}
                  >
                    {key.replace(/([A-Z])/g, " $1").trim()}: {display}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Play button */}
          {!isPlayed && !isResolving && card.actor === "iran" && (
            <button
              onClick={() => playCard(card.id)}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-bold text-xs hover:bg-primary/90 active:scale-95 transition-all relative z-10"
            >
              ▶ بازی کردن این کارت
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

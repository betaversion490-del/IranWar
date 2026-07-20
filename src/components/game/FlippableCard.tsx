"use client";

import { motion } from "framer-motion";
import { categoryInfo, rarityInfo, actorInfo, type GameCard } from "@/lib/game/cardsData";
import { useGameStore } from "@/lib/game/gameStore";

export function FlippableCard({
  card,
  isPlayed = false,
}: {
  card: GameCard;
  isPlayed?: boolean;
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

  return (
    <div
      className="relative w-full"
      style={{
        paddingTop: "140%", // aspect ratio 5/7 = 140%
        perspective: "1200px",
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          pointerEvents: "none",
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
      >
        {/* FRONT */}
        <div
          className={`absolute inset-0 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center no-select ${
            isPlayedThisGame ? "opacity-60" : ""
          }`}
          style={{
            background: actor.gradient,
            border: `1px solid ${actor.color}80`,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            visibility: isFlipped ? "hidden" : "visible",
            pointerEvents: isFlipped ? "none" : "auto",
            zIndex: isFlipped ? 1 : 10,
          }}
        >
          {/* Top badges */}
          <div className="absolute top-1.5 right-1.5 left-1.5 flex items-start justify-between pointer-events-none">
            <span
              className="text-[8px] sm:text-[9px] font-bold px-1 py-0.5 rounded"
              style={{ backgroundColor: rar.color + "30", color: rar.color }}
            >
              {rar.label}
            </span>
            <span
              className="text-[8px] sm:text-[9px] font-bold px-1 py-0.5 rounded"
              style={{ backgroundColor: cat.color + "30", color: cat.color }}
            >
              {cat.icon} {cat.label}
            </span>
          </div>

          {/* Used marker */}
          {(alreadyUsedInHistory || isPlayedThisGame) && (
            <div className="absolute top-6 left-1.5 pointer-events-none">
              <span className="text-[7px] sm:text-[8px] font-bold px-1 py-0.5 rounded bg-amber-500/20 text-amber-300">
                {isPlayedThisGame ? "✓ استفاده" : "📚 قبلاً"}
              </span>
            </div>
          )}

          {/* Icon */}
          <div className="text-3xl sm:text-4xl md:text-5xl mt-7 mb-1 pointer-events-none">
            {card.icon}
          </div>

          {/* Name */}
          <h4 className="font-bold text-xs sm:text-sm md:text-base leading-tight mb-0.5 pointer-events-none px-1">
            {card.name}
          </h4>
          <div className="text-[8px] sm:text-[9px] text-muted-foreground/70 mb-1.5 pointer-events-none">
            {card.nameEn}
          </div>

          {/* Description */}
          <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground/80 leading-relaxed line-clamp-3 flex-1 pointer-events-none px-0.5">
            {card.description}
          </p>

          {/* Bottom: Effects preview */}
          <div className="mt-1.5 pt-1.5 border-t border-border/20 flex flex-wrap justify-center gap-0.5 pointer-events-none">
            {Object.entries(card.effects).slice(0, 3).map(([key, val]) => {
              const numVal = typeof val === "number" ? val : 0;
              const isMult = numVal > 0 && numVal < 2 && !Number.isInteger(numVal);
              const display = isMult
                ? `×${numVal.toFixed(2)}`
                : `${numVal > 0 ? "+" : ""}${numVal}`;
              return (
                <span
                  key={key}
                  className={`text-[9px] sm:text-[9px] md:text-[10px] px-1 py-0.5 rounded font-num ${
                    numVal > 0
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-rose-500/15 text-rose-300"
                  }`}
                >
                  {display}
                </span>
              );
            })}
          </div>

          {/* Flip button - only when no card is flipped */}
          {!isPlayed && !isResolving && !isFlipped && !flippedCardId && (
            <button
              onClick={() => flipCard(card.id)}
              className="absolute inset-0 w-full h-full cursor-pointer"
              aria-label={`ورق زدن کارت ${card.name}`}
              style={{ background: "transparent", border: "none" }}
            />
          )}
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col text-right glass-strong no-select overflow-hidden"
          style={{
            border: `1px solid ${actor.color}80`,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            visibility: isFlipped ? "visible" : "hidden",
            pointerEvents: "none",
          }}
        >
          {/* Header - fixed top */}
          <div
            className="flex items-center justify-between p-2 sm:p-2.5 pb-1.5 border-b border-border/30 shrink-0"
            style={{ pointerEvents: "auto" }}
          >
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <span className="text-base sm:text-lg shrink-0">{card.icon}</span>
              <h4 className="font-bold text-[11px] sm:text-xs md:text-sm leading-tight truncate">
                {card.name}
              </h4>
            </div>
            <button
              onClick={() => flipCard(null)}
              className="text-muted-foreground hover:text-foreground text-xs shrink-0 p-1"
              aria-label="بستن"
            >
              ✕
            </button>
          </div>

          {/* Content - scrollable middle */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-2.5">
            {/* Actor label */}
            <div className="mb-1.5">
              <span
                className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold"
                style={{ backgroundColor: actor.color + "30", color: actor.color }}
              >
                {card.actorLabel}
              </span>
            </div>

            {/* Long description */}
            <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground/90 leading-relaxed mb-2">
              {card.longDescription}
            </p>

            {/* Used context */}
            {card.usedContext && (
              <div className="mb-1.5 p-1.5 rounded bg-amber-500/10 border border-amber-500/20">
                <div className="text-[8px] sm:text-[9px] text-amber-300 font-bold mb-0.5">
                  📚 سابقه استفاده:
                </div>
                <div className="text-[8px] sm:text-[9px] text-amber-200/80 leading-relaxed">
                  {card.usedContext}
                </div>
              </div>
            )}

            {/* Effects */}
            <div className="mb-2">
              <div className="text-[8px] sm:text-[9px] text-muted-foreground mb-1">اثرات:</div>
              <div className="flex flex-wrap gap-0.5">
                {Object.entries(card.effects).map(([key, val]) => {
                  const numVal = typeof val === "number" ? val : 0;
                  const isMult = numVal > 0 && numVal < 2 && !Number.isInteger(numVal);
                  const display = isMult
                    ? `×${numVal.toFixed(2)}`
                    : `${numVal > 0 ? "+" : ""}${numVal}`;
                  return (
                    <span
                      key={key}
                      className={`text-[8px] sm:text-[9px] px-1 py-0.5 rounded font-num ${
                        numVal > 0
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-rose-500/15 text-rose-300"
                      }`}
                    >
                      {key.replace(/([A-Z])/g, " $1").trim()}: {display}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Play button - fixed bottom */}
          {!isPlayed && !isResolving && card.actor === "iran" && (
            <div className="p-2 sm:p-2.5 pt-1.5 border-t border-border/30 shrink-0" style={{ pointerEvents: "auto" }}>
              <button
                onClick={() => playCard(card.id)}
                className="w-full py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-lg font-bold text-[11px] sm:text-xs hover:bg-primary/90 active:scale-95 transition-all"
              >
                ▶ بازی کردن این کارت
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

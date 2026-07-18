"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/game/gameStore";
import { categoryInfo, rarityInfo, type GameCard } from "@/lib/game/cardsData";

function StatBar({
  label,
  value,
  color,
  icon,
  inverse = false,
}: {
  label: string;
  value: number;
  color: string;
  icon: string;
  inverse?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-muted-foreground">
          <span>{icon}</span>
          <span>{label}</span>
        </span>
        <span className="font-bold font-num" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function CardDisplay({
  card,
  side,
  showEffects = false,
}: {
  card: GameCard;
  side: "iran" | "us" | "israel";
  showEffects?: boolean;
}) {
  const cat = categoryInfo[card.category];
  const rar = rarityInfo[card.rarity];

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
      className={`rounded-2xl p-4 ${
        side === "iran" ? "card-iran" : side === "us" ? "card-us" : "card-israel"
      } relative overflow-hidden`}
    >
      <div className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: rar.color + "30", color: rar.color }}>
        {rar.label}
      </div>
      <div className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: cat.color + "30", color: cat.color }}>
        {cat.icon} {cat.label}
      </div>

      <div className="text-4xl md:text-5xl text-center mt-4 mb-2">{card.icon}</div>
      <h4 className="font-bold text-center text-base md:text-lg mb-1">{card.name}</h4>
      <div className="text-[10px] text-center text-muted-foreground/70 mb-2">{card.nameEn}</div>

      <p className="text-xs text-center text-muted-foreground leading-relaxed">
        {card.description}
      </p>

      {showEffects && (
        <div className="mt-3 pt-3 border-t border-border/30">
          <div className="text-[10px] text-muted-foreground mb-1.5 text-center">اثرات کلیدی:</div>
          <div className="flex flex-wrap justify-center gap-1">
            {Object.entries(card.effects).slice(0, 4).map(([key, val]) => {
              const numVal = typeof val === "number" ? val : 0;
              const isMult = numVal > 0 && numVal < 2 && !Number.isInteger(numVal);
              const display = isMult ? `×${numVal.toFixed(2)}` : `${numVal > 0 ? "+" : ""}${numVal}`;
              const isPositive = numVal > 0;
              return (
                <span
                  key={key}
                  className={`text-[10px] px-1.5 py-0.5 rounded font-num ${
                    isPositive ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
                  }`}
                >
                  {key.replace(/([A-Z])/g, " $1").trim()}: {display}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function PlayerCard({ card, onPlay, disabled }: { card: GameCard; onPlay: () => void; disabled: boolean }) {
  const cat = categoryInfo[card.category];
  const rar = rarityInfo[card.rarity];

  return (
    <motion.button
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={!disabled ? { scale: 1.05, y: -8 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={onPlay}
      disabled={disabled}
      className={`card-iran rounded-2xl p-3 text-right relative overflow-hidden transition-all ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <div className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: rar.color + "30", color: rar.color }}>
        {rar.label}
      </div>
      <div className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: cat.color + "30", color: cat.color }}>
        {cat.icon} {cat.label}
      </div>

      <div className="text-3xl md:text-4xl text-center mt-3 mb-1">{card.icon}</div>
      <h4 className="font-bold text-center text-sm md:text-base mb-0.5 leading-tight">{card.name}</h4>
      <p className="text-[10px] md:text-xs text-center text-muted-foreground/80 leading-relaxed line-clamp-2">
        {card.description}
      </p>

      {/* Mini effects preview */}
      <div className="mt-2 pt-2 border-t border-border/20 flex flex-wrap justify-center gap-1">
        {Object.entries(card.effects).slice(0, 3).map(([key, val]) => {
          const numVal = typeof val === "number" ? val : 0;
          const isMult = numVal > 0 && numVal < 2 && !Number.isInteger(numVal);
          const display = isMult ? `×${numVal.toFixed(2)}` : `${numVal > 0 ? "+" : ""}${numVal}`;
          return (
            <span
              key={key}
              className={`text-[9px] md:text-[10px] px-1 py-0.5 rounded font-num ${
                numVal > 0 ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
              }`}
            >
              {display}
            </span>
          );
        })}
      </div>
    </motion.button>
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
    usPressure,
    israelThreat,
    warEscalation,
    iranHand,
    playedIranCard,
    playedUsCard,
    playedIsraelCard,
    isResolving,
    moveLog,
    playCard,
    nextTurn,
  } = store;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[100dvh] flex flex-col"
    >
      {/* Top status bar */}
      <div className="glass-strong border-b border-border/50 p-3 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => store.setPhase("splash")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ← خروج
            </button>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">نوبت</div>
              <div className="font-bold font-num">
                {turn} / {maxTurns}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">شبیه‌سازی فعال</div>
          </div>

          {/* Progress bar */}
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

      <div className="flex-1 p-3 md:p-4 max-w-7xl mx-auto w-full">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {/* Iran Stats */}
          <div className="glass rounded-xl p-3 md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-emerald-400">🇮🇷 شاخص‌های ایران</div>
              <div className="text-[10px] text-muted-foreground">وضعیت کشور</div>
            </div>
            <div className="space-y-1.5">
              <StatBar label="پیشرفت هسته‌ای" value={nuclearProgress} color="oklch(0.6 0.25 25)" icon="☢️" />
              <StatBar label="بازدارندگی" value={deterrence} color="oklch(0.65 0.15 165)" icon="🛡️" />
              <StatBar label="توان نظامی" value={militaryCapability} color="oklch(0.6 0.18 250)" icon="⚔️" />
              <StatBar label="ثبات اقتصادی" value={economicStability} color="oklch(0.7 0.18 70)" icon="💰" />
              <StatBar label="حمایت داخلی" value={domesticSupport} color="oklch(0.65 0.16 165)" icon="👥" />
              <StatBar label="نفوذ منطقه‌ای" value={regionalInfluence} color="oklch(0.6 0.2 305)" icon="🌐" />
            </div>
          </div>

          {/* Enemy Stats */}
          <div className="glass rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-blue-400">🇺🇸 فشار آمریکا</div>
              <div className="text-[10px] text-muted-foreground">US Pressure</div>
            </div>
            <div className="h-24 md:h-32 flex items-end justify-center">
              <motion.div
                className="w-full bg-gradient-to-t from-blue-600/80 to-blue-400/60 rounded-t-lg relative"
                initial={{ height: 0 }}
                animate={{ height: `${usPressure}%` }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xl font-bold font-num text-blue-300">
                  {usPressure}
                </div>
              </motion.div>
            </div>
          </div>

          <div className="glass rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-amber-400">🇮🇱 تهدید اسرائیل</div>
              <div className="text-[10px] text-muted-foreground">Israel Threat</div>
            </div>
            <div className="h-24 md:h-32 flex items-end justify-center">
              <motion.div
                className="w-full bg-gradient-to-t from-amber-600/80 to-amber-400/60 rounded-t-lg relative"
                initial={{ height: 0 }}
                animate={{ height: `${israelThreat}%` }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xl font-bold font-num text-amber-300">
                  {israelThreat}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* War Escalation Meter */}
        <div className="glass rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-rose-400">🔥 سطح تشدید جنگ</span>
            <span
              className={`text-sm font-bold font-num ${
                warEscalation > 70 ? "text-rose-400 pulse-danger" : warEscalation > 40 ? "text-amber-400" : "text-emerald-400"
              }`}
            >
              {warEscalation > 70 ? "بحرانی" : warEscalation > 40 ? "متوسط" : "کنترل‌شده"} - {warEscalation}
            </span>
          </div>
          <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
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

        {/* Resolving area - shows played cards */}
        <AnimatePresence>
          {isResolving && (playedIranCard || playedUsCard || playedIsraelCard) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-strong rounded-2xl p-4 mb-4 border-primary/30"
            >
              <div className="text-center text-xs text-muted-foreground mb-3">نتیجه نوبت {turn}</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {playedIranCard && (
                  <div>
                    <div className="text-xs text-center text-emerald-400 mb-1.5 font-bold">🇮🇷 حرکت ایران</div>
                    <CardDisplay card={playedIranCard} side="iran" showEffects />
                  </div>
                )}
                {playedUsCard && (
                  <div>
                    <div className="text-xs text-center text-blue-400 mb-1.5 font-bold">🇺🇸 پاسخ آمریکا</div>
                    <CardDisplay card={playedUsCard} side="us" showEffects />
                  </div>
                )}
                {playedIsraelCard && (
                  <div>
                    <div className="text-xs text-center text-amber-400 mb-1.5 font-bold">🇮🇱 پاسخ اسرائیل</div>
                    <CardDisplay card={playedIsraelCard} side="israel" showEffects />
                  </div>
                )}
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => nextTurn()}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/30"
                >
                  {turn >= maxTurns ? "🏁 مشاهده نتیجه نهایی" : "← ادامه نوبت بعد"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Iran's Hand */}
        {!isResolving && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base md:text-lg font-bold">🎭 دست ایران - کارت‌های استراتژیک</h3>
              <span className="text-xs text-muted-foreground">یک کارت را انتخاب کنید</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {iranHand.map((card) => (
                <PlayerCard
                  key={card.id}
                  card={card}
                  onPlay={() => playCard(card.id)}
                  disabled={isResolving}
                />
              ))}
              {iranHand.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  دست خالی است. شاید نوبت بعدی کارت‌های جدید دریافت کنید.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Move Log */}
        {moveLog.length > 0 && (
          <div className="mt-6 glass rounded-xl p-4">
            <h3 className="text-sm font-bold mb-2">📜 گزارش نوبت‌های گذشته</h3>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {[...moveLog].reverse().map((move, idx) => (
                <div key={idx} className="text-xs border-r-2 border-primary/40 pr-2 py-1">
                  <div className="text-muted-foreground mb-0.5">نوبت {move.turn}</div>
                  <div className="text-foreground">{move.summary}</div>
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

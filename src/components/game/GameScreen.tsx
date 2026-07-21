"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useGameStore } from "@/lib/game/gameStore";
import {
  iranCards, usCards, israelCards, arabCards, natoCards, nkRussiaChinaCards,
  getPrepTime, historyCards, infraCards,
  categoryInfo, rarityInfo, actorInfo,
  type GameCard,
} from "@/lib/game/cardsData";

// === CLASH ROYALE STYLE CARD ===
function GameCardItem({
  card, onClick, prepRemaining, disabled, small, faceDown,
}: {
  card: GameCard;
  onClick?: () => void;
  prepRemaining?: number;
  disabled?: boolean;
  small?: boolean;
  faceDown?: boolean;
}) {
  const cat = categoryInfo[card.category];
  const rar = rarityInfo[card.rarity];
  const actor = actorInfo[card.actor];
  const prepTime = getPrepTime(card.id);
  const isPreparing = prepRemaining !== undefined && prepRemaining > 0;

  if (faceDown) {
    return (
      <div
        className="relative rounded-lg flex items-center justify-center shrink-0"
        style={{
          width: small ? 50 : 64,
          height: small ? 70 : 88,
          background: "linear-gradient(135deg, #1e293b, #0f172a)",
          border: "2px solid #334155",
        }}
      >
        <span className="text-xl opacity-40">❓</span>
      </div>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.08, y: -4 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      disabled={disabled}
      className="relative rounded-lg shrink-0 overflow-hidden"
      style={{
        width: small ? 52 : 64,
        height: small ? 72 : 88,
        background: actor.gradient,
        border: `2px solid ${isPreparing ? '#fbbf24' : rar.color + '80'}`,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {/* Rarity top bar */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: rar.color }} />

      {/* Icon */}
      <div className="flex items-center justify-center pt-2" style={{ fontSize: small ? 18 : 22 }}>
        {card.icon}
      </div>

      {/* Title */}
      <div className="text-center px-0.5 mt-0.5 font-bold leading-tight" style={{ fontSize: small ? 6 : 7 }}>
        {card.name}
      </div>

      {/* Prep time indicator */}
      {prepTime > 0 && !isPreparing && !small && (
        <div className="absolute bottom-0.5 right-0.5 bg-black/60 rounded px-1 text-[6px] font-bold text-amber-300">
          ⏱{prepTime}s
        </div>
      )}

      {/* Preparing countdown */}
      {isPreparing && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
          <div className="text-[6px] text-amber-300 font-bold">آماده‌سازی</div>
          <div className="text-base font-black text-amber-300">{prepRemaining}</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500/30">
            <div
              className="h-full bg-amber-400 transition-all"
              style={{ width: `${((prepTime - prepRemaining) / prepTime) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Used marker */}
      {card.used && !isPreparing && (
        <div className="absolute top-1 left-0.5 text-[6px] bg-amber-500/30 text-amber-300 px-0.5 rounded">📚</div>
      )}
    </motion.button>
  );
}

// === STAT BAR (compact) ===
function StatPill({ label, value, color, change }: { label: string; value: number; color: string; change?: number }) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <div className="relative w-8 h-8 rounded-full flex items-center justify-center" style={{ border: `2px solid ${color}` }}>
        <span className="text-[9px] font-black font-num" style={{ color }}>{value}</span>
        {change !== undefined && change !== 0 && (
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-2 text-[7px] font-bold"
            style={{ color: change > 0 ? '#22c55e' : '#ef4444' }}
          >
            {change > 0 ? '+' : ''}{change}
          </motion.span>
        )}
      </div>
      <span className="text-[7px] text-muted-foreground hidden sm:block">{label}</span>
    </div>
  );
}

// === CARD DETAIL MODAL ===
function CardDetailModal({ card, onClose }: { card: GameCard | null; onClose: () => void }) {
  if (!card) return null;
  const cat = categoryInfo[card.category];
  const rar = rarityInfo[card.rarity];
  const actor = actorInfo[card.actor];
  const prepTime = getPrepTime(card.id);
  const relatedHistory = historyCards.filter(h => card.relatedHistoryEra === h.id || h.id.startsWith("h"));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-2xl p-4 max-w-md w-full max-h-[80dvh] overflow-y-auto"
        style={{ border: `2px solid ${actor.color}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{card.icon}</span>
            <div>
              <h3 className="font-bold text-base">{card.name}</h3>
              <div className="text-[10px] text-muted-foreground">{card.nameEn}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg p-1">✕</button>
        </div>

        {/* Badges */}
        <div className="flex gap-1 flex-wrap mb-3">
          <span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{ backgroundColor: actor.color + '20', color: actor.color }}>{card.actorLabel}</span>
          <span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{ backgroundColor: cat.color + '20', color: cat.color }}>{cat.icon} {cat.label}</span>
          <span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{ backgroundColor: rar.color + '20', color: rar.color }}>{rar.label}</span>
          {prepTime > 0 && (
            <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300">⏱ {prepTime} ثانیه آماده‌سازی</span>
          )}
          {prepTime === 0 && (
            <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300">⚡ فوری</span>
          )}
        </div>

        {/* Description */}
        <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">{card.longDescription}</p>

        {/* Used context */}
        {card.usedContext && (
          <div className="mb-3 p-2 rounded bg-amber-500/10 border border-amber-500/20">
            <div className="text-[9px] text-amber-300 font-bold mb-0.5">📚 سابقه استفاده:</div>
            <div className="text-[9px] text-amber-200/80">{card.usedContext}</div>
          </div>
        )}

        {/* Effects */}
        <div className="mb-3">
          <div className="text-[9px] text-muted-foreground mb-1">اثرات:</div>
          <div className="flex flex-wrap gap-1">
            {Object.entries(card.effects).map(([key, val]) => {
              const numVal = typeof val === 'number' ? val : 0;
              const isMult = numVal > 0 && numVal < 2 && !Number.isInteger(numVal);
              const display = isMult ? `×${numVal.toFixed(2)}` : `${numVal > 0 ? '+' : ''}${numVal}`;
              return (
                <span key={key} className={`text-[8px] px-1.5 py-0.5 rounded font-num ${numVal > 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}: {display}
                </span>
              );
            })}
          </div>
        </div>

        {/* Related history */}
        {relatedHistory.length > 0 && (
          <div className="mb-3">
            <div className="text-[9px] text-muted-foreground mb-1">📜 رویدادهای مرتبط:</div>
            <div className="space-y-1">
              {relatedHistory.slice(0, 3).map((h, i) => (
                <div key={i} className="flex items-center gap-1 text-[8px] bg-white/5 rounded px-1.5 py-1">
                  <span>{h.icon}</span>
                  <span className="text-info font-bold">{h.date}</span>
                  <span>{h.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Play button */}
        {card.actor === "iran" && (
          <button
            onClick={() => {
              if (prepTime === 0) {
                useGameStore.getState().playCard(card.id);
              } else {
                useGameStore.getState().startPreparation(card.id);
              }
              onClose();
            }}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-xs hover:scale-[1.02] active:scale-95 transition-all"
          >
            {prepTime === 0 ? '▶ بازی کردن' : `⏱ شروع آماده‌سازی (${prepTime}s)`}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

// === ALL CARDS VIEW ===
function AllCardsView({ side, onClose }: { side: "iran" | "enemy"; onClose: () => void }) {
  const cards = side === "iran" ? iranCards : [...usCards, ...israelCards, ...arabCards, ...natoCards];
  const selectCard = useGameStore((s) => s.selectCard);
  const selectedCardId = useGameStore((s) => s.selectedCardId);
  const selectedCard = selectedCardId ? [...iranCards, ...usCards, ...israelCards, ...arabCards, ...natoCards, ...nkRussiaChinaCards].find(c => c.id === selectedCardId) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black/90 flex flex-col"
    >
      <div className="flex items-center justify-between p-3 glass-strong border-b">
        <h3 className="font-bold text-sm">{side === "iran" ? "🇮🇷 همه کارت‌های ایران" : "🌍 همه کارت‌های دشمن"}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {cards.map((card) => (
            <div key={card.id} className="flex flex-col items-center gap-1">
              <GameCardItem card={card} onClick={() => selectCard(card.id)} />
              <span className="text-[7px] text-muted-foreground text-center leading-tight">{card.name}</span>
            </div>
          ))}
        </div>
      </div>
      <CardDetailModal card={selectedCard} onClose={() => selectCard(null)} />
    </motion.div>
  );
}

// === MAIN GAME SCREEN ===
export function GameScreen() {
  const store = useGameStore();
  const {
    turn, maxTurns,
    nuclearProgress, regionalInfluence, economicStability,
    domesticSupport, militaryCapability, deterrence, warEscalation,
    preparingCards, playedIranCard, enemyResponses, isResolving,
    moveLog, nextTurn, earlyEndingTriggered, lastStatChanges,
    selectedCardId, showAllCards,
  } = store;

  const [showInfra, setShowInfra] = useState(false);

  // Tick preparation timer every second
  useEffect(() => {
    if (Object.keys(preparingCards).length === 0) return;
    const interval = setInterval(() => {
      store.tickPreparation();
    }, 1000);
    return () => clearInterval(interval);
  }, [preparingCards, store]);

  // All enemy cards for display
  const allEnemyCards = [...usCards.slice(0, 6), ...israelCards.slice(0, 6)];

  // Available Iran cards (not yet played this game)
  const availableIranCards = iranCards.filter(c => !store.playedIranCardIds.includes(c.id));

  // Selected card for detail
  const selectedCard = selectedCardId
    ? [...iranCards, ...usCards, ...israelCards, ...arabCards, ...natoCards, ...nkRussiaChinaCards].find(c => c.id === selectedCardId)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[100dvh] flex flex-col overflow-hidden"
    >
      {/* === TOP BAR (stats + turn) === */}
      <div className="glass-strong border-b border-border/50 px-2 py-1.5 shrink-0">
        <div className="flex items-center justify-between gap-1">
          <button onClick={() => store.setPhase("splash")} className="text-[10px] text-muted-foreground hover:text-foreground">←</button>

          {/* Stats - compact pills */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <StatPill label="هسته‌ای" value={nuclearProgress} color="oklch(0.6 0.25 25)" change={lastStatChanges?.nuclearProgress} />
            <StatPill label="بازدارندگی" value={deterrence} color="oklch(0.65 0.15 165)" change={lastStatChanges?.deterrence} />
            <StatPill label="نظامی" value={militaryCapability} color="oklch(0.6 0.18 250)" change={lastStatChanges?.militaryCapability} />
            <StatPill label="اقتصاد" value={economicStability} color="oklch(0.7 0.18 70)" change={lastStatChanges?.economicStability} />
            <StatPill label="نفوذ" value={regionalInfluence} color="oklch(0.6 0.2 305)" change={lastStatChanges?.regionalInfluence} />
          </div>

          <div className="text-center shrink-0">
            <div className="text-[9px] text-muted-foreground">نوبت</div>
            <div className="font-bold font-num text-xs">{turn}/{maxTurns}</div>
          </div>
        </div>

        {/* War escalation bar */}
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[8px] text-rose-400 shrink-0">🔥</span>
          <div className="h-1 flex-1 bg-muted/40 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #16a34a, #d97706, #dc2626)' }}
              animate={{ width: `${warEscalation}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-[8px] font-bold font-num shrink-0" style={{ color: warEscalation > 70 ? '#dc2626' : warEscalation > 40 ? '#d97706' : '#16a34a' }}>{warEscalation}</span>
        </div>
      </div>

      {/* === ENEMY AREA (top, view only) === */}
      <div className="shrink-0 py-1.5 px-2" style={{ height: '100px' }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-bold text-blue-400">🇺🇸🇮🇱 کارت‌های دشمن</span>
          <button onClick={() => store.setShowAllCards("enemy")} className="text-[8px] text-muted-foreground hover:text-foreground">همه ←</button>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {allEnemyCards.map((card, i) => (
            <GameCardItem key={card.id} card={card} small faceDown={i > 5} />
          ))}
        </div>
      </div>

      {/* === TIMELINE (center, horizontal scroll) === */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="shrink-0 py-1 px-2">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-amber-400 shrink-0">📜 تایم‌لاین</span>
            <div className="flex-1 flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {/* History cards (past) */}
              {historyCards.slice().reverse().map((h, i) => (
                <div key={h.id} className="shrink-0 flex flex-col items-center" style={{ opacity: 1 - i * 0.05 }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${h.result === 'yes' ? '#16a34a' : h.result === 'no' ? '#dc2626' : '#d97706'}40` }}>
                    {h.icon}
                  </div>
                  <span className="text-[6px] text-muted-foreground mt-0.5 text-center leading-none whitespace-nowrap">{h.date}</span>
                </div>
              ))}
              {/* Played cards this game */}
              {moveLog.map((m, i) => (
                <div key={`p${i}`} className="shrink-0 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: actorInfo[m.iranCard.actor].gradient, border: `1px solid ${actorInfo[m.iranCard.actor].color}` }}>
                    {m.iranCard.icon}
                  </div>
                  <span className="text-[6px] text-emerald-400 mt-0.5">نوبت {m.turn}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === RESOLVING AREA (center) === */}
        <AnimatePresence>
          {isResolving && (playedIranCard || enemyResponses.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col items-center justify-center px-2 min-h-0"
            >
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {playedIranCard && (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[8px] text-emerald-400 font-bold">🇮🇷 ایران</span>
                    <GameCardItem card={playedIranCard} disabled />
                  </div>
                )}
                {enemyResponses.map((card, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <span className="text-[8px] font-bold" style={{ color: actorInfo[card.actor].color }}>{card.actorLabel}</span>
                    <GameCardItem card={card} disabled small />
                  </div>
                ))}
              </div>

              {earlyEndingTriggered ? (
                <div className="mt-3 text-center">
                  <div className="text-[10px] text-rose-400 font-bold animate-pulse mb-2">⚠️ شرایط بحرانی!</div>
                  <button onClick={() => nextTurn()} className="px-6 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-xs hover:scale-105 active:scale-95 transition-all">🏁 مشاهده پایان</button>
                </div>
              ) : (
                <button onClick={() => nextTurn()} className="mt-3 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-xs hover:scale-105 active:scale-95 transition-all">
                  {turn >= maxTurns ? "🏁 نتیجه نهایی" : "← ادامه"}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* === IRAN CARDS AREA (bottom) === */}
        {!isResolving && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col min-h-0">
            <div className="shrink-0 py-1 px-2 flex items-center justify-between">
              <span className="text-[9px] font-bold text-emerald-400">🇮🇷 کارت‌های ایران</span>
              <div className="flex gap-1">
                <button onClick={() => setShowInfra(!showInfra)} className="text-[8px] px-2 py-0.5 glass rounded font-bold hover:text-foreground">🏗 زیرساخت</button>
                <button onClick={() => store.setShowAllCards("iran")} className="text-[8px] px-2 py-0.5 glass rounded font-bold hover:text-foreground">همه ←</button>
              </div>
            </div>

            {/* Cards row */}
            <div className="flex-1 px-2 pb-2 min-h-0 overflow-hidden">
              {!showInfra ? (
                <div className="flex gap-1.5 justify-center items-center h-full flex-wrap overflow-y-auto" style={{ maxHeight: '100%' }}>
                  {availableIranCards.slice(0, 10).map((card) => (
                    <GameCardItem
                      key={card.id}
                      card={card}
                      prepRemaining={preparingCards[card.id]}
                      onClick={() => {
                        const prepTime = getPrepTime(card.id);
                        if (prepTime === 0) {
                          store.playCard(card.id);
                        } else if (preparingCards[card.id] === undefined) {
                          store.startPreparation(card.id);
                        }
                      }}
                      disabled={isResolving || (preparingCards[card.id] !== undefined && preparingCards[card.id] > 0)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex gap-1.5 justify-center items-center h-full flex-wrap overflow-y-auto" style={{ maxHeight: '100%' }}>
                  {infraCards.filter(c => c.isIranTarget).map((infra) => (
                    <button
                      key={infra.id}
                      onClick={() => {
                        // Play infrastructure card as instant
                        const fakeCard: GameCard = {
                          id: infra.id,
                          name: infra.name,
                          nameEn: infra.id,
                          category: "asymmetric",
                          actor: "iran",
                          actorLabel: "🇮🇷 ایران",
                          description: infra.description,
                          longDescription: `${infra.description} - ${infra.impact}`,
                          effects: { deterrence: 8, warEscalation: 1.1 },
                          icon: infra.icon,
                          rarity: "epic",
                          used: false,
                        };
                        store.playCard(fakeCard.id);
                      }}
                      disabled={isResolving}
                      className="relative rounded-lg shrink-0 overflow-hidden p-1.5 flex flex-col items-center justify-center"
                      style={{
                        width: 60, height: 76,
                        background: 'linear-gradient(135deg, oklch(0.22 0.08 35 / 0.9), oklch(0.18 0.05 35 / 0.95))',
                        border: '2px solid oklch(0.55 0.18 35 / 0.5)',
                        opacity: isResolving ? 0.5 : 1,
                      }}
                    >
                      <div className="text-xl">{infra.icon}</div>
                      <div className="text-[6px] font-bold text-center leading-tight mt-0.5">{infra.name}</div>
                      <div className="text-[5px] text-amber-300/80 text-center">{infra.target}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* === MODALS === */}
      <CardDetailModal card={selectedCard} onClose={() => store.selectCard(null)} />
      <AnimatePresence>
        {showAllCards && <AllCardsView side={showAllCards} onClose={() => store.setShowAllCards(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}

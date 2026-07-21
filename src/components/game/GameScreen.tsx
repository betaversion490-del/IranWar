"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useGameStore } from "@/lib/game/gameStore";
import {
  iranCards, usCards, israelCards, arabCards, natoCards, nkRussiaChinaCards,
  getPrepTime, historyCards, activeCards, infraCards,
  categoryInfo, rarityInfo, actorInfo,
  type GameCard,
} from "@/lib/game/cardsData";

// === COMPACT CARD ===
function MiniCard({
  card, onClick, prepRemaining, disabled, faceDown, size = 60,
}: {
  card: GameCard;
  onClick?: () => void;
  prepRemaining?: number;
  disabled?: boolean;
  faceDown?: boolean;
  size?: number;
}) {
  const cat = categoryInfo[card.category];
  const rar = rarityInfo[card.rarity];
  const actor = actorInfo[card.actor];
  const prepTime = getPrepTime(card.id);
  const isPreparing = prepRemaining !== undefined && prepRemaining > 0;

  if (faceDown) {
    return (
      <div
        className="rounded-lg flex items-center justify-center shrink-0"
        style={{ width: size, height: size * 1.35, background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '2px solid #334155' }}
      >
        <span className="text-lg opacity-40">❓</span>
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
        width: size, height: size * 1.35,
        background: actor.gradient,
        border: `2px solid ${isPreparing ? '#fbbf24' : rar.color + '80'}`,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: rar.color }} />
      <div className="flex items-center justify-center pt-1.5" style={{ fontSize: size * 0.32 }}>{card.icon}</div>
      <div className="text-center px-0.5 mt-0.5 font-bold leading-tight" style={{ fontSize: size * 0.1 }}>{card.name}</div>

      {prepTime > 0 && !isPreparing && (
        <div className="absolute bottom-0.5 right-0.5 bg-black/60 rounded px-0.5 text-[6px] font-bold text-amber-300">⏱{prepTime}</div>
      )}
      {isPreparing && (
        <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center rounded-lg">
          <div className="text-[6px] text-amber-300 font-bold">آماده‌سازی</div>
          <div className="text-sm font-black text-amber-300">{prepRemaining}</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500/30">
            <div className="h-full bg-amber-400 transition-all" style={{ width: `${((prepTime - prepRemaining) / prepTime) * 100}%` }} />
          </div>
        </div>
      )}
      {card.used && !isPreparing && (
        <div className="absolute top-0.5 left-0.5 text-[6px] bg-amber-500/30 text-amber-300 px-0.5 rounded">📚</div>
      )}
    </motion.button>
  );
}

// === ACTIVE CARD (currently happening) ===
function ActiveCardItem({ card }: { card: typeof activeCards[0] }) {
  const statusColor = card.status === 'active' ? '#dc2626' : card.status === 'preparing' ? '#fbbf24' : '#0ea5e9';
  return (
    <div
      className="rounded-lg shrink-0 p-1.5 flex flex-col items-center justify-center relative"
      style={{
        width: 56, height: 72,
        background: 'rgba(255,255,255,0.03)',
        border: `1.5px solid ${statusColor}60`,
      }}
    >
      {card.status === 'active' && (
        <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      )}
      <div className="text-lg">{card.icon}</div>
      <div className="text-[6px] font-bold text-center leading-tight mt-0.5" style={{ color: statusColor }}>{card.name}</div>
      <div className="text-[5px] text-muted-foreground">{card.actor}</div>
    </div>
  );
}

// === STAT PILL ===
function StatPill({ label, value, color, change }: { label: string; value: number; color: string; change?: number }) {
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      <div className="relative w-7 h-7 rounded-full flex items-center justify-center" style={{ border: `2px solid ${color}` }}>
        <span className="text-[9px] font-black font-num" style={{ color }}>{value}</span>
        {change !== undefined && change !== 0 && (
          <motion.span initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="absolute -top-2 text-[7px] font-bold" style={{ color: change > 0 ? '#22c55e' : '#ef4444' }}>
            {change > 0 ? '+' : ''}{change}
          </motion.span>
        )}
      </div>
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 30 }} onClick={(e) => e.stopPropagation()} className="glass-strong rounded-2xl p-4 max-w-md w-full max-h-[80dvh] overflow-y-auto" style={{ border: `2px solid ${actor.color}` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2"><span className="text-3xl">{card.icon}</span><div><h3 className="font-bold text-base">{card.name}</h3><div className="text-[10px] text-muted-foreground">{card.nameEn}</div></div></div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg p-1">✕</button>
        </div>
        <div className="flex gap-1 flex-wrap mb-3">
          <span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{ backgroundColor: actor.color + '20', color: actor.color }}>{card.actorLabel}</span>
          <span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{ backgroundColor: cat.color + '20', color: cat.color }}>{cat.icon} {cat.label}</span>
          <span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{ backgroundColor: rar.color + '20', color: rar.color }}>{rar.label}</span>
          {prepTime > 0 ? <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300">⏱ {prepTime}s آماده‌سازی</span> : <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300">⚡ فوری</span>}
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">{card.longDescription}</p>
        {card.usedContext && (<div className="mb-3 p-2 rounded bg-amber-500/10 border border-amber-500/20"><div className="text-[9px] text-amber-300 font-bold mb-0.5">📚 سابقه استفاده:</div><div className="text-[9px] text-amber-200/80">{card.usedContext}</div></div>)}
        <div className="mb-3"><div className="text-[9px] text-muted-foreground mb-1">اثرات:</div><div className="flex flex-wrap gap-1">{Object.entries(card.effects).map(([key, val]) => { const numVal = typeof val === 'number' ? val : 0; const isMult = numVal > 0 && numVal < 2 && !Number.isInteger(numVal); const display = isMult ? `×${numVal.toFixed(2)}` : `${numVal > 0 ? '+' : ''}${numVal}`; return <span key={key} className={`text-[8px] px-1.5 py-0.5 rounded font-num ${numVal > 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>{key.replace(/([A-Z])/g, ' $1').trim()}: {display}</span> })}</div></div>
        {card.actor === 'iran' && (<button onClick={() => { if (prepTime === 0) useGameStore.getState().playCard(card.id); else useGameStore.getState().startPreparation(card.id); onClose(); }} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-xs hover:scale-[1.02] active:scale-95 transition-all">{prepTime === 0 ? '▶ بازی کردن' : `⏱ شروع آماده‌سازی (${prepTime}s)`}</button>)}
      </motion.div>
    </motion.div>
  );
}

// === ALL CARDS VIEW ===
function AllCardsView({ side, onClose }: { side: 'iran' | 'enemy'; onClose: () => void }) {
  const cards = side === 'iran' ? iranCards : [...usCards, ...israelCards, ...arabCards, ...natoCards];
  const selectCard = useGameStore((s) => s.selectCard);
  const selectedCardId = useGameStore((s) => s.selectedCardId);
  const selectedCard = selectedCardId ? [...iranCards, ...usCards, ...israelCards, ...arabCards, ...natoCards, ...nkRussiaChinaCards].find(c => c.id === selectedCardId) : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/95 flex flex-col">
      <div className="flex items-center justify-between p-3 glass-strong border-b">
        <h3 className="font-bold text-sm">{side === 'iran' ? '🇮🇷 همه کارت‌های ایران' : '🌍 همه کارت‌های دشمن'}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {cards.map((card) => (<div key={card.id} className="flex flex-col items-center gap-1"><MiniCard card={card} onClick={() => selectCard(card.id)} size={64} /><span className="text-[7px] text-muted-foreground text-center leading-tight">{card.name}</span></div>))}
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

  useEffect(() => {
    if (Object.keys(preparingCards).length === 0) return;
    const interval = setInterval(() => { store.tickPreparation(); }, 1000);
    return () => clearInterval(interval);
  }, [preparingCards, store]);

  const allEnemyCards = [...usCards.slice(0, 6), ...israelCards.slice(0, 6)];
  const availableIranCards = iranCards.filter(c => !store.playedIranCardIds.includes(c.id));
  const selectedCard = selectedCardId ? [...iranCards, ...usCards, ...israelCards, ...arabCards, ...natoCards, ...nkRussiaChinaCards].find(c => c.id === selectedCardId) : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[100dvh] flex flex-col overflow-hidden">
      {/* === TOP BAR === */}
      <div className="glass-strong border-b border-border/50 px-2 py-1.5 shrink-0">
        <div className="flex items-center justify-between gap-1">
          <button onClick={() => store.setPhase('splash')} className="text-[10px] text-muted-foreground hover:text-foreground">←</button>
          <div className="flex items-center gap-0.5 overflow-x-auto">
            <StatPill label="هسته‌ای" value={nuclearProgress} color="oklch(0.6 0.25 25)" change={lastStatChanges?.nuclearProgress} />
            <StatPill label="بازدارندگی" value={deterrence} color="oklch(0.65 0.15 165)" change={lastStatChanges?.deterrence} />
            <StatPill label="نظامی" value={militaryCapability} color="oklch(0.6 0.18 250)" change={lastStatChanges?.militaryCapability} />
            <StatPill label="اقتصاد" value={economicStability} color="oklch(0.7 0.18 70)" change={lastStatChanges?.economicStability} />
            <StatPill label="نفوذ" value={regionalInfluence} color="oklch(0.6 0.2 305)" change={lastStatChanges?.regionalInfluence} />
          </div>
          <div className="text-center shrink-0"><div className="text-[9px] text-muted-foreground">نوبت</div><div className="font-bold font-num text-xs">{turn}/{maxTurns}</div></div>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[8px] text-rose-400 shrink-0">🔥</span>
          <div className="h-1 flex-1 bg-muted/40 rounded-full overflow-hidden"><motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #16a34a, #d97706, #dc2626)' }} animate={{ width: `${warEscalation}%` }} transition={{ duration: 0.5 }} /></div>
          <span className="text-[8px] font-bold font-num shrink-0" style={{ color: warEscalation > 70 ? '#dc2626' : warEscalation > 40 ? '#d97706' : '#16a34a' }}>{warEscalation}</span>
        </div>
      </div>

      {/* === ENEMY CARDS (top, view only) === */}
      <div className="shrink-0 py-1 px-2" style={{ height: '88px' }}>
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[8px] font-bold text-blue-400">🇺🇸🇮🇱 دشمن</span>
          <button onClick={() => store.setShowAllCards('enemy')} className="text-[7px] text-muted-foreground hover:text-foreground">همه ←</button>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {allEnemyCards.map((card, i) => (<MiniCard key={card.id} card={card} small faceDown={i > 5} size={48} />))}
        </div>
      </div>

      {/* === CENTER: TIMELINE + ACTIVE + RESOLVE === */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Timeline (horizontal, scroll left for past) */}
        <div className="shrink-0 py-1 px-2">
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-bold text-amber-400 shrink-0">📜</span>
            <div className="flex-1 flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', direction: 'ltr' }}>
              {/* Left = past (oldest first, scroll left to see more past) */}
              {historyCards.map((h, i) => (
                <div key={h.id} className="shrink-0 flex flex-col items-center" style={{ opacity: Math.max(0.3, 1 - i * 0.04) }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${h.result === 'yes' ? '#16a34a' : h.result === 'no' ? '#dc2626' : '#d97706'}40` }}>{h.icon}</div>
                  <span className="text-[5px] text-muted-foreground mt-0.5 text-center leading-none whitespace-nowrap">{h.date}</span>
                </div>
              ))}
              {/* Played cards this game */}
              {moveLog.map((m, i) => (
                <div key={`p${i}`} className="shrink-0 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs" style={{ background: actorInfo[m.iranCard.actor].gradient, border: `1px solid ${actorInfo[m.iranCard.actor].color}` }}>{m.iranCard.icon}</div>
                  <span className="text-[5px] text-emerald-400 mt-0.5">نوبت{m.turn}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active cards (currently happening - news) */}
        <div className="shrink-0 py-1 px-2">
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-bold text-rose-400 shrink-0 animate-pulse">🔴 زنده</span>
            <div className="flex-1 flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {activeCards.map((ac) => (<ActiveCardItem key={ac.id} card={ac} />))}
            </div>
          </div>
        </div>

        {/* Resolve area */}
        <AnimatePresence>
          {isResolving && (playedIranCard || enemyResponses.length > 0) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col items-center justify-center px-2 min-h-0">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {playedIranCard && (<div className="flex flex-col items-center gap-1"><span className="text-[8px] text-emerald-400 font-bold">🇮🇷 ایران</span><MiniCard card={playedIranCard} disabled size={64} /></div>)}
                {enemyResponses.map((card, idx) => (<div key={idx} className="flex flex-col items-center gap-1"><span className="text-[8px] font-bold" style={{ color: actorInfo[card.actor].color }}>{card.actorLabel}</span><MiniCard card={card} disabled size={52} /></div>))}
              </div>
              {earlyEndingTriggered ? (
                <div className="mt-3 text-center"><div className="text-[10px] text-rose-400 font-bold animate-pulse mb-2">⚠️ شرایط بحرانی!</div><button onClick={() => nextTurn()} className="px-6 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-xs hover:scale-105 active:scale-95 transition-all">🏁 مشاهده پایان</button></div>
              ) : (<button onClick={() => nextTurn()} className="mt-3 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-xs hover:scale-105 active:scale-95 transition-all">{turn >= maxTurns ? '🏁 نتیجه نهایی' : '← ادامه'}</button>)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* === IRAN CARDS (bottom, center) === */}
        {!isResolving && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col min-h-0 justify-end pb-2">
            <div className="shrink-0 py-1 px-2 flex items-center justify-between">
              <span className="text-[8px] font-bold text-emerald-400">🇮🇷 ایران</span>
              <div className="flex gap-1">
                <button onClick={() => setShowInfra(!showInfra)} className={`text-[7px] px-1.5 py-0.5 rounded font-bold ${showInfra ? 'bg-primary text-primary-foreground' : 'glass'}`}>🏗 زیرساخت</button>
                <button onClick={() => store.setShowAllCards('iran')} className="text-[7px] px-1.5 py-0.5 glass rounded font-bold hover:text-foreground">همه ←</button>
              </div>
            </div>
            <div className="px-2 pb-1">
              {!showInfra ? (
                <div className="flex gap-1 justify-center items-center flex-wrap overflow-y-auto" style={{ maxHeight: '110px' }}>
                  {availableIranCards.slice(0, 10).map((card) => (
                    <MiniCard key={card.id} card={card} prepRemaining={preparingCards[card.id]} size={56}
                      onClick={() => { const pt = getPrepTime(card.id); if (pt === 0) store.playCard(card.id); else if (preparingCards[card.id] === undefined) store.startPreparation(card.id); }}
                      disabled={isResolving || (preparingCards[card.id] !== undefined && preparingCards[card.id] > 0)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex gap-1 justify-center items-center flex-wrap overflow-y-auto" style={{ maxHeight: '110px' }}>
                  {infraCards.filter(c => c.isIranTarget).map((infra) => (
                    <button key={infra.id} disabled={isResolving} onClick={() => store.playCard(infra.id)} className="relative rounded-lg shrink-0 p-1 flex flex-col items-center justify-center" style={{ width: 56, height: 72, background: 'linear-gradient(135deg, oklch(0.22 0.08 35 / 0.9), oklch(0.18 0.05 35 / 0.95))', border: '2px solid oklch(0.55 0.18 35 / 0.5)', opacity: isResolving ? 0.5 : 1 }}>
                      <div className="text-lg">{infra.icon}</div>
                      <div className="text-[6px] font-bold text-center leading-tight mt-0.5">{infra.name}</div>
                      <div className="text-[5px] text-amber-300/80">{infra.target}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <CardDetailModal card={selectedCard} onClose={() => store.selectCard(null)} />
      <AnimatePresence>{showAllCards && <AllCardsView side={showAllCards} onClose={() => store.setShowAllCards(null)} />}</AnimatePresence>
    </motion.div>
  );
}

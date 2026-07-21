"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useGameStore } from "@/lib/game/gameStore";
import {
  iranCards, usCards, israelCards, arabCards, natoCards, nkRussiaChinaCards,
  getPrepTime, historyCards, infraCards,
  categoryInfo, rarityInfo, actorInfo,
  type GameCard,
} from "@/lib/game/cardsData";
import {
  getCardCost, getCardEnrichment, arePrereqsMet, detectActiveCombos,
  comboDefinitions, type CardEnrichment,
} from "@/lib/game/cardEnrichments";
import { TechTreePanel } from "./TechTreePanel";
import { WarModeOverlay, AchievementSystem, ComboFlashOverlay, CardPlayGlow, ParticleBurst } from "./GameEffects";

// ============================================================
// ELIXIR BAR (Phase 1.1)
// ============================================================
function ElixirBar({ value, side, color }: { value: number; side: "iran" | "enemy"; color: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[8px] font-bold" style={{ color }}>{side === "iran" ? "🇮🇷" : "🇺🇸🇮🇱"}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-3 rounded-sm transition-all"
            style={{
              background: i < value ? color : "rgba(255,255,255,0.08)",
              boxShadow: i < value ? `0 0 4px ${color}` : "none",
            }}
          />
        ))}
      </div>
      <span className="text-[9px] font-bold font-num" style={{ color }}>{value}</span>
    </div>
  );
}

// ============================================================
// MINI CARD
// ============================================================
function MiniCard({
  card, onClick, prepRemaining, disabled, faceDown, size = 60, showCost = false, canAfford = true,
}: {
  card: GameCard;
  onClick?: () => void;
  prepRemaining?: number;
  disabled?: boolean;
  faceDown?: boolean;
  size?: number;
  showCost?: boolean;
  canAfford?: boolean;
}) {
  const cat = categoryInfo[card.category];
  const rar = rarityInfo[card.rarity];
  const actor = actorInfo[card.actor];
  const prepTime = getPrepTime(card.id);
  const cost = getCardCost(card.id);
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
      whileHover={!disabled ? { scale: 1.08, y: -4, rotateZ: -1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      disabled={disabled}
      className={`relative rounded-lg shrink-0 overflow-hidden card-3d-tilt rarity-${card.rarity}`}
      style={{
        width: size, height: size * 1.35,
        background: actor.gradient,
        border: `2px solid ${isPreparing ? '#fbbf24' : rar.color + '80'}`,
        opacity: disabled || !canAfford ? 0.5 : 1,
        cursor: disabled || !canAfford ? 'not-allowed' : 'pointer',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: rar.color }} />
      {/* Rarity glow border */}
      {(card.rarity === 'legendary' || card.rarity === 'apocalyptic') && (
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${rar.color}30 0%, transparent 30%, transparent 70%, ${rar.color}30 100%)`,
          }}
        />
      )}
      <div className="flex items-center justify-center pt-1.5" style={{ fontSize: size * 0.32 }}>{card.icon}</div>
      <div className="text-center px-0.5 mt-0.5 font-bold leading-tight" style={{ fontSize: size * 0.1 }}>{card.name}</div>

      {showCost && (
        <div className="absolute bottom-0.5 left-0.5 bg-fuchsia-600 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[7px] font-bold border border-fuchsia-300">
          {cost}
        </div>
      )}
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

// ============================================================
// PHASE 1.3: BATTLE ARENA
// ============================================================
function BattleArena() {
  const arenaUnits = useGameStore((s) => s.arenaUnits);

  return (
    <div className="relative flex-1 mx-1 my-0.5 rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(15,23,42,0.6) 0%, rgba(30,41,59,0.4) 50%, rgba(15,23,42,0.6) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        minHeight: "110px",
      }}
    >
      {/* Arena ground line */}
      <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Iran side label */}
      <div className="absolute bottom-0.5 right-1 text-[7px] font-bold text-emerald-400">🇮🇷 ایران</div>
      <div className="absolute bottom-0.5 left-1 text-[7px] font-bold text-rose-400">🇺🇸🇮🇱 دشمن</div>

      {/* Iran spawn zone */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-emerald-500/10 to-transparent" />
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-rose-500/10 to-transparent" />

      {/* Units */}
      <AnimatePresence>
        {arenaUnits.map((unit) => {
          const actor = actorInfo[unit.card.actor];
          const isIran = unit.side === "iran";
          return (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1, scale: 1,
                right: isIran ? `${100 - unit.position}%` : undefined,
                left: !isIran ? `${unit.position}%` : undefined,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ zIndex: 10 }}
            >
              <div className="relative flex flex-col items-center">
                <motion.div
                  animate={unit.state === "fighting" ? { x: [0, -2, 2, 0] } : {}}
                  transition={{ duration: 0.2, repeat: 2 }}
                  className="rounded-md flex items-center justify-center"
                  style={{
                    width: 30, height: 30,
                    background: actor.gradient,
                    border: `2px solid ${unit.state === "fighting" ? "#fbbf24" : actor.color}`,
                    boxShadow: unit.state === "impact" ? "0 0 20px #dc2626" : `0 0 8px ${actor.color}80`,
                  }}
                >
                  <span className="text-sm">{unit.card.icon}</span>
                </motion.div>
                {/* HP bar */}
                <div className="w-7 h-0.5 bg-black/50 rounded-full mt-0.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.max(0, unit.hp)}%`,
                      background: unit.hp > 50 ? "#22c55e" : unit.hp > 25 ? "#fbbf24" : "#ef4444",
                    }}
                  />
                </div>
                {/* Impact effect */}
                {unit.state === "impact" && (
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl pointer-events-none"
                  >
                    💥
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Empty state */}
      {arenaUnits.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[9px] text-muted-foreground/40 text-center">
            <div className="text-lg mb-1">⚔️</div>
            <div>حلقه نبرد</div>
            <div className="text-[7px] mt-0.5">کارت‌ها اینجا رودررو می‌شوند</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// COMBO ALERT (Phase 1.4)
// ============================================================
function ComboAlert() {
  const moveLog = useGameStore((s) => s.moveLog);
  const [showCombo, setShowCombo] = useState<typeof comboDefinitions[0] | null>(null);

  useEffect(() => {
    const last = moveLog[moveLog.length - 1];
    if (last?.combos && last.combos.length > 0) {
      // Show most recently triggered combo
      setShowCombo(last.combos[last.combos.length - 1]);
      const t = setTimeout(() => setShowCombo(null), 4000);
      return () => clearTimeout(t);
    }
  }, [moveLog]);

  if (!showCombo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.8 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
      >
        <div className="px-4 py-2 rounded-xl text-center"
          style={{
            background: "linear-gradient(135deg, rgba(251,191,36,0.9), rgba(217,119,6,0.9))",
            border: "2px solid #fbbf24",
            boxShadow: "0 0 30px rgba(251,191,36,0.6)",
          }}
        >
          <div className="text-[10px] text-amber-950 font-bold">⚡ کمبو فعال شد!</div>
          <div className="text-base font-black text-amber-950">{showCombo.name}</div>
          <div className="text-[8px] text-amber-900 mt-0.5">×{showCombo.multiplier} ضریب</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================
// STAT PILL
// ============================================================
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

// ============================================================
// PHASE 4: RESOURCE BAR (manageable resources)
// ============================================================
function ResourceBar() {
  const oilRevenue = useGameStore((s) => s.oilRevenue);
  const missileStockpile = useGameStore((s) => s.missileStockpile);
  const enrichmentLevel = useGameStore((s) => s.enrichmentLevel);
  const forexReserves = useGameStore((s) => s.forexReserves);
  const hezbollahStrength = useGameStore((s) => s.hezbollahStrength);

  return (
    <div className="flex items-center gap-2 text-[7px] text-muted-foreground overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
      <span className="shrink-0">🛢 ${oilRevenue.toFixed(1)}B/ماه</span>
      <span className="shrink-0">🚀 {missileStockpile} موشک</span>
      <span className="shrink-0">☢️ {enrichmentLevel}% غنی‌سازی</span>
      <span className="shrink-0">💰 ${forexReserves}B</span>
      <span className="shrink-0">🇱🇧 {hezbollahStrength}%</span>
    </div>
  );
}

// ============================================================
// PHASE 4: HIDDEN METRICS BAR
// ============================================================
function HiddenMetricsBar() {
  const israelStrikeReadiness = useGameStore((s) => s.israelStrikeReadiness);
  const diplomaticPressure = useGameStore((s) => s.diplomaticPressure);
  const domesticTolerance = useGameStore((s) => s.domesticTolerance);
  const iranDetectionLevel = useGameStore((s) => s.iranDetectionLevel);

  return (
    <div className="flex items-center gap-1.5 text-[7px] overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
      <MetricItem label="آمادگی حمله اسرائیل" value={israelStrikeReadiness} color="#dc2626" icon="⚠️" />
      <MetricItem label="فشار دیپلماتیک" value={diplomaticPressure} color="#0ea5e9" icon="🌍" />
      <MetricItem label="تحمل داخلی" value={domesticTolerance} color="#22c55e" icon="👥" invert />
      <MetricItem label="شناسایی دشمن" value={iranDetectionLevel} color="#a855f7" icon="👁️" />
    </div>
  );
}

function MetricItem({ label, value, color, icon, invert }: { label: string; value: number; color: string; icon: string; invert?: boolean }) {
  const displayColor = invert ? (value < 30 ? '#dc2626' : '#22c55e') : (value > 70 ? '#dc2626' : value > 40 ? '#fbbf24' : '#22c55e');
  return (
    <div className="shrink-0 flex items-center gap-0.5">
      <span>{icon}</span>
      <div className="w-8 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: displayColor }} />
      </div>
      <span className="font-num" style={{ color: displayColor }}>{value}</span>
    </div>
  );
}

// ============================================================
// CARD DETAIL MODAL — with sources & realData (Phase 2)
// ============================================================
function CardDetailModal({ card, onClose }: { card: GameCard | null; onClose: () => void }) {
  if (!card) return null;
  const cat = categoryInfo[card.category];
  const rar = rarityInfo[card.rarity];
  const actor = actorInfo[card.actor];
  const prepTime = getPrepTime(card.id);
  const cost = getCardCost(card.id);
  const enr = getCardEnrichment(card.id);
  const [activeTab, setActiveTab] = useState<"detail" | "sources" | "realdata">("detail");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 30 }} onClick={(e) => e.stopPropagation()} className="glass-strong rounded-2xl p-4 max-w-md w-full max-h-[85dvh] overflow-y-auto" style={{ border: `2px solid ${actor.color}` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2"><span className="text-3xl">{card.icon}</span><div><h3 className="font-bold text-base">{card.name}</h3><div className="text-[10px] text-muted-foreground">{card.nameEn}</div></div></div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg p-1">✕</button>
        </div>
        <div className="flex gap-1 flex-wrap mb-3">
          <span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{ backgroundColor: actor.color + '20', color: actor.color }}>{card.actorLabel}</span>
          <span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{ backgroundColor: cat.color + '20', color: cat.color }}>{cat.icon} {cat.label}</span>
          <span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{ backgroundColor: rar.color + '20', color: rar.color }}>{rar.label}</span>
          <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-fuchsia-500/20 text-fuchsia-300">💎 {cost} انرژی</span>
          {prepTime > 0 ? <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300">⏱ {prepTime}s آماده‌سازی</span> : <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300">⚡ فوری</span>}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-3 border-b border-border/40">
          {(["detail", "realdata", "sources"] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`text-[10px] px-2 py-1 font-bold transition-colors ${activeTab === t ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
              {t === "detail" ? "📋 جزئیات" : t === "realdata" ? "📊 داده واقعی" : "📚 منابع"}
            </button>
          ))}
        </div>

        {activeTab === "detail" && (
          <>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">{card.longDescription}</p>
            {card.usedContext && (<div className="mb-3 p-2 rounded bg-amber-500/10 border border-amber-500/20"><div className="text-[9px] text-amber-300 font-bold mb-0.5">📚 سابقه استفاده:</div><div className="text-[9px] text-amber-200/80">{card.usedContext}</div></div>)}
            <div className="mb-3"><div className="text-[9px] text-muted-foreground mb-1">اثرات:</div><div className="flex flex-wrap gap-1">{Object.entries(card.effects).map(([key, val]) => { const numVal = typeof val === 'number' ? val : 0; const isMult = numVal > 0 && numVal < 2 && !Number.isInteger(numVal); const display = isMult ? `×${numVal.toFixed(2)}` : `${numVal > 0 ? '+' : ''}${numVal}`; return <span key={key} className={`text-[8px] px-1.5 py-0.5 rounded font-num ${numVal > 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>{key.replace(/([A-Z])/g, ' $1').trim()}: {display}</span> })}</div></div>
            {enr?.prerequisites && enr.prerequisites.length > 0 && (
              <div className="mb-3 p-2 rounded bg-blue-500/10 border border-blue-500/20">
                <div className="text-[9px] text-blue-300 font-bold mb-0.5">🔧 پیش‌نیاز:</div>
                <div className="text-[9px] text-blue-200/80">
                  {enr.prerequisites.map(p => iranCards.find(c => c.id === p)?.name || p).join("، ")}
                </div>
              </div>
            )}
            {enr?.counteredBy && enr.counteredBy.length > 0 && (
              <div className="mb-3 p-2 rounded bg-rose-500/10 border border-rose-500/20">
                <div className="text-[9px] text-rose-300 font-bold mb-0.5">⚠️ پادکارت‌ها:</div>
                <div className="text-[9px] text-rose-200/80">
                  {enr.counteredBy.map(c => {
                    const all = [...usCards, ...israelCards, ...arabCards, ...natoCards, ...iranCards];
                    return all.find(x => x.id === c)?.name || c;
                  }).join("، ")}
                </div>
              </div>
            )}
            {enr?.comboTags && enr.comboTags.length > 0 && (
              <div className="mb-3 p-2 rounded bg-fuchsia-500/10 border border-fuchsia-500/20">
                <div className="text-[9px] text-fuchsia-300 font-bold mb-0.5">⚡ تگ کمبو:</div>
                <div className="text-[9px] text-fuchsia-200/80">
                  {enr.comboTags.map(t => comboDefinitions.find(c => c.requiredTags.includes(t))?.name || t).join("، ")}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "realdata" && (
          <div className="space-y-2">
            {enr?.realData ? (
              <>
                {enr.realData.currentEnrichment && <RealDataItem label="غنی‌سازی فعلی" value={enr.realData.currentEnrichment} />}
                {enr.realData.breakoutTime && <RealDataItem label="زمان ساخت بمب" value={enr.realData.breakoutTime} />}
                {enr.realData.centrifugesActive && <RealDataItem label="سانتریفیوژ فعال" value={enr.realData.centrifugesActive} />}
                {enr.realData.stockpile && <RealDataItem label="ذخیره اورانیوم" value={enr.realData.stockpile} />}
                {enr.realData.missileInventory && <RealDataItem label="موجودی موشک" value={enr.realData.missileInventory} />}
                {enr.realData.missileRange && <RealDataItem label="برد موشک" value={enr.realData.missileRange} />}
                {enr.realData.droneInventory && <RealDataItem label="پهپاد" value={enr.realData.droneInventory} />}
                {enr.realData.oilExports && <RealDataItem label="صادرات نفت" value={enr.realData.oilExports} />}
                {enr.realData.forexReserves && <RealDataItem label="ذخایر ارزی" value={enr.realData.forexReserves} />}
                {enr.realData.realProbability && <RealDataItem label="احتمال وقوع واقعی" value={enr.realData.realProbability} highlight />}
                {enr.realData.historicalParallel && <RealDataItem label="الگوی تاریخی" value={enr.realData.historicalParallel} />}
                {enr.realData.lastUpdate && <div className="text-[8px] text-muted-foreground text-center pt-1">آخرین بروزرسانی: {enr.realData.lastUpdate}</div>}
              </>
            ) : (
              <div className="text-[10px] text-muted-foreground text-center py-4">داده واقعی برای این کارت ثبت نشده</div>
            )}
          </div>
        )}

        {activeTab === "sources" && (
          <div className="space-y-2">
            {enr?.sources ? (
              <>
                {enr.sources.iranian && enr.sources.iranian.length > 0 && (
                  <SourceGroup title="🇮🇷 منابع رسمی ایرانی" items={enr.sources.iranian} color="#22c55e" />
                )}
                {enr.sources.international && enr.sources.international.length > 0 && (
                  <SourceGroup title="🌐 منابع بین‌المللی (تأییدی)" items={enr.sources.international} color="#a855f7" />
                )}
                {enr.sources.academic && enr.sources.academic.length > 0 && (
                  <SourceGroup title="🎓 منابع آکادمیک" items={enr.sources.academic} color="#f59e0b" />
                )}
              </>
            ) : (
              <div className="text-[10px] text-muted-foreground text-center py-4">منابع برای این کارت ثبت نشده</div>
            )}
          </div>
        )}

        {card.actor === "iran" && activeTab === "detail" && (
          <button
            onClick={() => {
              const store = useGameStore.getState();
              if (prepTime === 0) store.playCard(card.id);
              else store.startPreparation(card.id);
              onClose();
            }}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-xs hover:scale-[1.02] active:scale-95 transition-all mt-2"
          >
            {prepTime === 0 ? '▶ بازی کردن' : `⏱ شروع آماده‌سازی (${prepTime}s)`}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

function RealDataItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center p-1.5 rounded ${highlight ? "bg-amber-500/10 border border-amber-500/30" : "bg-white/5"}`}>
      <span className="text-[9px] text-muted-foreground">{label}</span>
      <span className={`text-[9px] font-bold ${highlight ? "text-amber-300" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

function SourceGroup({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div>
      <div className="text-[9px] font-bold mb-1" style={{ color }}>{title}</div>
      <div className="space-y-0.5">
        {items.map((src, i) => (
          <div key={i} className="text-[9px] text-muted-foreground p-1 rounded bg-white/5 border-r-2" style={{ borderColor: color }}>
            {src}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// ALL CARDS VIEW
// ============================================================
function AllCardsView({ side, onClose }: { side: 'iran' | 'enemy'; onClose: () => void }) {
  const cards = side === 'iran' ? iranCards : [...usCards, ...israelCards, ...arabCards, ...natoCards];
  const selectCard = useGameStore((s) => s.selectCard);
  const selectedCardId = useGameStore((s) => s.selectedCardId);
  const iranElixir = useGameStore((s) => s.iranElixir);
  const playedIranCardIds = useGameStore((s) => s.playedIranCardIds);
  const selectedCard = selectedCardId ? [...iranCards, ...usCards, ...israelCards, ...arabCards, ...natoCards, ...nkRussiaChinaCards].find(c => c.id === selectedCardId) : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/95 flex flex-col">
      <div className="flex items-center justify-between p-3 glass-strong border-b">
        <h3 className="font-bold text-sm">{side === 'iran' ? '🇮🇷 همه کارت‌های ایران' : '🌍 همه کارت‌های دشمن'}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {cards.map((card) => {
            const cost = getCardCost(card.id);
            const canAfford = side !== 'iran' || iranElixir >= cost;
            const prereqMet = side !== 'iran' || arePrereqsMet(card.id, playedIranCardIds);
            return (
              <div key={card.id} className="flex flex-col items-center gap-1">
                <MiniCard card={card} onClick={() => selectCard(card.id)} size={64} showCost canAfford={canAfford} />
                <span className="text-[7px] text-muted-foreground text-center leading-tight">{card.name}</span>
                {!prereqMet && <span className="text-[6px] text-rose-400">🔒 پیش‌نیاز</span>}
              </div>
            );
          })}
        </div>
      </div>
      <CardDetailModal card={selectedCard ?? null} onClose={() => selectCard(null)} />
    </motion.div>
  );
}

// ============================================================
// MAIN GAME SCREEN
// ============================================================
export function GameScreen() {
  const store = useGameStore();
  const {
    turn, maxTurns,
    nuclearProgress, regionalInfluence, economicStability,
    domesticSupport, militaryCapability, deterrence, warEscalation,
    preparingCards, playedIranCard, enemyResponses, isResolving,
    moveLog, nextTurn, earlyEndingTriggered, lastStatChanges,
    selectedCardId, showAllCards,
    iranElixir, enemyElixir, enemyPlays, arenaUnits,
    activeCombos,
  } = store;

  const [showInfra, setShowInfra] = useState(false);
  const [showComboList, setShowComboList] = useState(false);
  const [showTechTree, setShowTechTree] = useState(false);
  const [comboFlashTrigger, setComboFlashTrigger] = useState(0);
  const [comboFlashName, setComboFlashName] = useState<string | null>(null);
  const [cardPlayTrigger, setCardPlayTrigger] = useState(0);
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const prevMoveLogLength = useRef(0);

  // Detect new combo activations for flash effect
  useEffect(() => {
    if (moveLog.length > prevMoveLogLength.current) {
      const lastMove = moveLog[moveLog.length - 1];
      if (lastMove?.combos && lastMove.combos.length > 0) {
        const newest = lastMove.combos[lastMove.combos.length - 1];
        setComboFlashName(newest.name);
        setComboFlashTrigger(t => t + 1);
      }
      if (lastMove?.iranCard) {
        setCardPlayTrigger(t => t + 1);
        // Shake on heavy cards
        if (lastMove.iranCard.rarity === 'apocalyptic' || lastMove.iranCard.rarity === 'legendary') {
          setShakeTrigger(t => t + 1);
        }
      }
    }
    prevMoveLogLength.current = moveLog.length;
  }, [moveLog]);

  // === Phase 1.1: Elixir tick ===
  useEffect(() => {
    const interval = setInterval(() => {
      store.tickElixir();
      store.tickEnemyAI();
    }, 800);
    return () => clearInterval(interval);
  }, [store]);

  // === Phase 1.3: Arena tick ===
  useEffect(() => {
    if (arenaUnits.length === 0) return;
    const interval = setInterval(() => {
      store.tickArena();
    }, 400);
    return () => clearInterval(interval);
  }, [arenaUnits.length, store]);

  // === Preparation tick ===
  useEffect(() => {
    if (Object.keys(preparingCards).length === 0) return;
    const interval = setInterval(() => { store.tickPreparation(); }, 1000);
    return () => clearInterval(interval);
  }, [preparingCards, store]);

  const allEnemyCards = [...usCards.slice(0, 6), ...israelCards.slice(0, 6)];
  const availableIranCards = iranCards.filter(c => !store.playedIranCardIds.includes(c.id));
  const selectedCard = selectedCardId ? [...iranCards, ...usCards, ...israelCards, ...arabCards, ...natoCards, ...nkRussiaChinaCards].find(c => c.id === selectedCardId) : null;

  // Active enemy plays (last 4)
  const recentEnemyPlays = enemyPlays.slice(-4);

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
        {/* Phase 4.2: Resources */}
        <ResourceBar />
      </div>

      {/* === ENEMY ELIXIR BAR (Phase 1.2) === */}
      <div className="shrink-0 px-2 py-1 flex items-center justify-between bg-rose-950/20 border-b border-rose-500/20">
        <ElixirBar value={enemyElixir} side="enemy" color="#dc2626" />
        <div className="flex gap-1 items-center">
          <span className="text-[7px] text-rose-400 shrink-0">حملات فعال:</span>
          <div className="flex gap-0.5">
            {recentEnemyPlays.length > 0 ? recentEnemyPlays.map((p, i) => (
              <motion.div key={`${p.card.id}-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="w-6 h-6 rounded flex items-center justify-center text-xs"
                style={{ background: actorInfo[p.card.actor].gradient, border: `1px solid ${actorInfo[p.card.actor].color}` }}>
                {p.card.icon}
              </motion.div>
            )) : <span className="text-[7px] text-muted-foreground">...</span>}
          </div>
        </div>
      </div>

      {/* === ENEMY CARDS (top, view only) === */}
      <div className="shrink-0 py-1 px-2" style={{ height: '72px' }}>
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[8px] font-bold text-blue-400">🇺🇸🇮🇱 کارت‌های دشمن</span>
          <button onClick={() => store.setShowAllCards('enemy')} className="text-[7px] text-muted-foreground hover:text-foreground">همه ←</button>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {allEnemyCards.map((card, i) => (<MiniCard key={card.id} card={card} faceDown={i > 5} size={42} />))}
        </div>
      </div>

      {/* === BATTLE ARENA (Phase 1.3) === */}
      <BattleArena />

      {/* === TIMELINE === */}
      <div className="shrink-0 px-2 py-1 space-y-1">
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-bold text-amber-400 shrink-0">📜</span>
          <div className="flex-1 flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', direction: 'ltr' }}>
            {historyCards.map((h, i) => (
              <div key={h.id} className="shrink-0 flex flex-col items-center" style={{ opacity: Math.max(0.3, 1 - i * 0.04) }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px]" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${h.result === 'yes' ? '#16a34a' : h.result === 'no' ? '#dc2626' : '#d97706'}40` }}>{h.icon}</div>
                <span className="text-[5px] text-muted-foreground mt-0.5 text-center leading-none whitespace-nowrap">{h.date}</span>
              </div>
            ))}
            {moveLog.map((m, i) => (
              <div key={`p${i}`} className="shrink-0 flex flex-col items-center">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px]" style={{ background: actorInfo[m.iranCard.actor].gradient, border: `1px solid ${actorInfo[m.iranCard.actor].color}` }}>{m.iranCard.icon}</div>
                <span className="text-[5px] text-emerald-400 mt-0.5">نوبت{m.turn}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === RESOLVE AREA (when isResolving) === */}
      <AnimatePresence>
        {isResolving && (playedIranCard || enemyResponses.length > 0) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="shrink-0 px-2 py-2">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {playedIranCard && (<div className="flex flex-col items-center gap-1"><span className="text-[8px] text-emerald-400 font-bold">🇮🇷 ایران</span><MiniCard card={playedIranCard} disabled size={56} showCost /></div>)}
              {enemyResponses.map((card, idx) => (<div key={idx} className="flex flex-col items-center gap-1"><span className="text-[8px] font-bold" style={{ color: actorInfo[card.actor].color }}>{card.actorLabel}</span><MiniCard card={card} disabled size={48} /></div>))}
            </div>
            {earlyEndingTriggered ? (
              <div className="mt-2 text-center"><div className="text-[10px] text-rose-400 font-bold animate-pulse mb-2">⚠️ شرایط بحرانی!</div><button onClick={() => nextTurn()} className="px-6 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-xs hover:scale-105 active:scale-95 transition-all">🏁 مشاهده پایان</button></div>
            ) : (<button onClick={() => nextTurn()} className="mt-2 w-full py-2 bg-primary text-primary-foreground rounded-xl font-bold text-xs hover:scale-[1.02] active:scale-95 transition-all">{turn >= maxTurns ? '🏁 نتیجه نهایی' : '← ادامه'}</button>)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* === IRAN CARDS (bottom) === */}
      {!isResolving && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="shrink-0 pb-1">
          {/* Iran elixir bar */}
          <div className="px-2 py-0.5 flex items-center justify-between bg-emerald-950/20 border-t border-emerald-500/20">
            <ElixirBar value={iranElixir} side="iran" color="#10b981" />
            <div className="flex gap-1 items-center">
              {activeCombos.length > 0 && (
                <button onClick={() => setShowComboList(!showComboList)} className="text-[7px] px-1.5 py-0.5 rounded font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40">
                  ⚡ {activeCombos.length} کمبو
                </button>
              )}
              <button onClick={() => setShowInfra(!showInfra)} className={`text-[7px] px-1.5 py-0.5 rounded font-bold ${showInfra ? 'bg-primary text-primary-foreground' : 'glass'}`}>🏗 زیرساخت</button>
              <button onClick={() => setShowTechTree(true)} className="text-[7px] px-1.5 py-0.5 glass rounded font-bold hover:text-foreground">🌳 درخت</button>
              <button onClick={() => store.setShowAllCards('iran')} className="text-[7px] px-1.5 py-0.5 glass rounded font-bold hover:text-foreground">همه ←</button>
            </div>
          </div>

          {/* Active combos display */}
          {showComboList && activeCombos.length > 0 && (
            <div className="px-2 py-1 bg-fuchsia-950/30 border-b border-fuchsia-500/20">
              {activeCombos.map((combo, i) => (
                <div key={i} className="text-[8px] flex justify-between p-1 rounded bg-fuchsia-500/10 mb-0.5">
                  <span className="text-fuchsia-300 font-bold">⚡ {combo.name}</span>
                  <span className="text-fuchsia-400">×{combo.multiplier}</span>
                </div>
              ))}
            </div>
          )}

          <div className="px-2 pt-1">
            {!showInfra ? (
              <div className="flex gap-1 justify-center items-center flex-wrap overflow-y-auto" style={{ maxHeight: '100px' }}>
                {availableIranCards.slice(0, 10).map((card) => {
                  const cost = getCardCost(card.id);
                  const canAfford = iranElixir >= cost;
                  const prereqMet = arePrereqsMet(card.id, store.playedIranCardIds);
                  return (
                    <MiniCard
                      key={card.id}
                      card={card}
                      prepRemaining={preparingCards[card.id]}
                      size={52}
                      showCost
                      canAfford={canAfford && prereqMet}
                      onClick={() => {
                        if (!canAfford || !prereqMet) return;
                        store.selectCard(card.id);
                      }}
                      disabled={isResolving || (preparingCards[card.id] !== undefined && preparingCards[card.id] > 0)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex gap-1 justify-center items-center flex-wrap overflow-y-auto" style={{ maxHeight: '100px' }}>
                {infraCards.filter(c => c.isIranTarget).map((infra) => (
                  <button key={infra.id} disabled={isResolving} onClick={() => store.playCard(infra.id)} className="relative rounded-lg shrink-0 p-1 flex flex-col items-center justify-center" style={{ width: 52, height: 68, background: 'linear-gradient(135deg, oklch(0.22 0.08 35 / 0.9), oklch(0.18 0.05 35 / 0.95))', border: '2px solid oklch(0.55 0.18 35 / 0.5)', opacity: isResolving ? 0.5 : 1 }}>
                    <div className="text-base">{infra.icon}</div>
                    <div className="text-[6px] font-bold text-center leading-tight mt-0.5">{infra.name}</div>
                    <div className="text-[5px] text-amber-300/80">{infra.target}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* === Phase 4.4: Hidden metrics (bottom) === */}
      <div className="shrink-0 px-2 py-0.5 glass-strong border-t border-border/50">
        <HiddenMetricsBar />
      </div>

      {/* === Visual Effects === */}
      <WarModeOverlay />
      <ComboAlert />
      <ComboFlashOverlay comboName={comboFlashName} trigger={comboFlashTrigger} />
      <CardPlayGlow trigger={cardPlayTrigger} />
      <AchievementSystem />

      {/* Modals */}
      <CardDetailModal card={selectedCard ?? null} onClose={() => store.selectCard(null)} />
      <AnimatePresence>{showAllCards && <AllCardsView side={showAllCards} onClose={() => store.setShowAllCards(null)} />}</AnimatePresence>
      <AnimatePresence>{showTechTree && <TechTreePanel onClose={() => setShowTechTree(false)} />}</AnimatePresence>
    </motion.div>
  );
}

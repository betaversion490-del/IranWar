"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useGameStore } from "@/lib/game/gameStore";
import { endings, type Ending } from "@/lib/game/endingsData";

// ============================================================
// گالری پایان‌ها - نمایش تمام پایان‌های ممکن با راه برد
// ============================================================

type WinPath = {
  endingId: string;
  title: string;
  difficulty: "آسان" | "متوسط" | "سخت" | "بسیار سخت";
  strategy: string;
  cardSequence: string[];
  cardNames: string[];
  keyCondition: string;
  turn: string;
};

const WIN_PATHS: WinPath[] = [
  {
    endingId: "iran_nuclear_deterrence",
    title: "مسیر بمب اتم",
    difficulty: "سخت",
    strategy: "خروج از NPT → افزایش غنی‌سازی → ساخت بمب. مسیر خطرناک اما قطعی. نیاز به صبر و کنترل جنگ در نوبت‌های اول.",
    cardSequence: ["iran_npt_withdraw", "iran_patience", "iran_china_deal", "iran_npt_withdraw", "iran_patience", "iran_russia_alliance", "iran_nuclear_breakout"],
    cardNames: ["خروج NPT", "صبر استراتژیک", "تعامل با چین", "خروج NPT", "صبر", "ائتلاف روسیه", "ساخت بمب"],
    keyCondition: "غنی‌سازی ≥ ۷۵٪ + کارت بمب",
    turn: "نوبت ۷",
  },
  {
    endingId: "comprehensive_peace",
    title: "مسیر صلح جامع",
    difficulty: "متوسط",
    strategy: "دیپلماسی مداوم + صبر استراتژیک. باید جنگ را پایین نگه دارید. سریع‌ترین مسیر برد (نوبت ۳).",
    cardSequence: ["iran_diplomacy", "iran_patience", "iran_diplomacy"],
    cardNames: ["دیپلماسی", "صبر استراتژیک", "دیپلماسی"],
    keyCondition: "ضریب مذاکره ≥ ۲.۵ + جنگ < ۳۵",
    turn: "نوبت ۳",
  },
  {
    endingId: "us_withdrawal_ambition",
    title: "مسیر خروج آمریکا",
    difficulty: "متوسط",
    strategy: "ائتلاف با روسیه و چین + فعال‌سازی محور مقاومت + کنترل جنگ. باید بازدارندگی و نفوذ منطقه‌ای را همزمان بالا ببرید.",
    cardSequence: ["iran_russia_alliance", "iran_china_deal", "iran_hezbollah_full", "iran_patience"],
    cardNames: ["ائتلاف روسیه", "تعامل با چین", "حزب‌الله", "صبر"],
    keyCondition: "بازدارندگی ≥ ۷۰ + نفوذ ≥ ۶۵ + جنگ < ۶۵",
    turn: "نوبت ۴",
  },
  {
    endingId: "israel_strategic_weakening",
    title: "مسیر انزوای اسرائیل",
    difficulty: "سخت",
    strategy: "فعال‌سازی کامل محور مقاومت (حزب‌الله + حوثی + حشد) + حمله موشکی. باید نفوذ منطقه‌ای را به ۸۰+ برسانید بدون اینکه جنگ از کنترل خارج شود.",
    cardSequence: ["iran_hezbollah_full", "iran_houthi", "iran_iraq_militias", "iran_missile_strike", "iran_patience"],
    cardNames: ["حزب‌الله", "حوثی‌ها", "حشد عراق", "حمله موشکی", "صبر"],
    keyCondition: "نفوذ ≥ ۸۰ + انزوای اسرائیل ≥ ۱.۷ + جنگ < ۸۵",
    turn: "نوبت ۵",
  },
];

const LOSE_PATHS: WinPath[] = [
  {
    endingId: "iran_strategic_defeat",
    title: "شکست استراتژیک (تهاجم بی‌رویه)",
    difficulty: "بسیار سخت",
    strategy: "اگر فقط کارت‌های تهاجمی بازی کنید بدون فکر، جنگ از کنترل خارج می‌شود و حمایت داخلی فرو می‌پاشد.",
    cardSequence: ["iran_hezbollah_full", "iran_hormuz", "iran_missile_strike", "iran_houthi", "iran_missile_strike", "iran_hormuz", "iran_hezbollah_full", "iran_houthi"],
    cardNames: ["حزب‌الله", "هرمز", "موشک", "حوثی", "موشک", "هرمز", "حزب‌الله", "حوثی"],
    keyCondition: "نظامی ≤ ۲۵ + جنگ ≥ ۸۰ (یا اقتصاد ≤ ۲۰ + حمایت ≤ ۲۵)",
    turn: "نوبت ۶",
  },
  {
    endingId: "regime_change_from_within",
    title: "تغییر رژیم (فروپاشی اقتصادی)",
    difficulty: "بسیار سخت",
    strategy: "بستن هرمز + سلاح نفت = نابودی اقتصاد. وقتی اقتصاد زیر ۲۰ بیفتد، مردم ناراضی می‌شوند و حمایت داخلی سقوط می‌کند.",
    cardSequence: ["iran_hormuz", "iran_oil_weapon", "iran_hormuz", "iran_oil_weapon"],
    cardNames: ["هرمز", "سلاح نفت", "هرمز", "سلاح نفت"],
    keyCondition: "اقتصاد ≤ ۲۰ + حمایت داخلی ≤ ۲۵",
    turn: "نوبت ۴",
  },
];

const ALL_ENDINGS = [...WIN_PATHS, ...LOSE_PATHS];

export function EndingsGallery({ onClose }: { onClose: () => void }) {
  const [selectedEnding, setSelectedEnding] = useState<WinPath | null>(null);
  const selectCard = useGameStore((s) => s.selectCard);

  const endingMap: Record<string, Ending> = {};
  for (const e of endings) endingMap[e.id] = e;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 glass-strong border-b shrink-0">
        <h2 className="font-bold text-base sm:text-lg">🏁 گالری پایان‌ها — راهنمای برد</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg p-1">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {/* تب توضیح */}
        <div className="glass rounded-2xl p-4 mb-4">
          <h3 className="font-bold text-sm mb-2 text-primary">📖 چطور برنده شویم؟</h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed mb-2">
            این بازی ۱۰ پایان مختلف دارد. ۴ پایان «برد» و ۶ پایان «باخت/وضع موجود». هر پایان نیاز به استراتژی خاص دارد.
            در ادامه، ۴ مسیر برد و ۲ مسیر باخت رایج را با جزئیات کامل می‌بینید.
          </p>
          <div className="text-[10px] text-amber-300 bg-amber-500/10 rounded-lg p-2 mt-2">
            💡 <strong>نکته کلیدی:</strong> هیچ کارتی مطلقاً خوب یا بد نیست. نتیجه به ترکیب کارت‌ها و پاسخ دشمن بستگی دارد.
          </div>
        </div>

        {/* مسیرهای برد */}
        <div className="mb-4">
          <h3 className="font-bold text-sm mb-2 text-emerald-400 flex items-center gap-2">
            <span>🥇</span> مسیرهای برد (۴ مسیر)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {WIN_PATHS.map((path, i) => (
              <EndingCard
                key={path.endingId}
                path={path}
                ending={endingMap[path.endingId]}
                index={i + 1}
                isWin={true}
                onClick={() => setSelectedEnding(path)}
              />
            ))}
          </div>
        </div>

        {/* مسیرهای باخت */}
        <div className="mb-4">
          <h3 className="font-bold text-sm mb-2 text-rose-400 flex items-center gap-2">
            <span>💀</span> مسیرهای باخت (هشدار — این‌ها را انجام ندهید!)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {LOSE_PATHS.map((path, i) => (
              <EndingCard
                key={path.endingId}
                path={path}
                ending={endingMap[path.endingId]}
                index={i + 1}
                isWin={false}
                onClick={() => setSelectedEnding(path)}
              />
            ))}
          </div>
        </div>

        {/* سایر پایان‌ها */}
        <div className="mb-4">
          <h3 className="font-bold text-sm mb-2 text-amber-400 flex items-center gap-2">
            <span>🌫️</span> سایر پایان‌ها (بدون مسیر مشخص)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {endings
              .filter(e => !ALL_ENDINGS.find(p => p.endingId === e.id))
              .map(ending => (
                <div key={ending.id} className="glass rounded-xl p-3 border border-border/40">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">{ending.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-xs" style={{ color: ending.color }}>{ending.name}</div>
                      <div className="text-[9px] text-muted-foreground mt-1">{ending.description}</div>
                      <div className="text-[8px] text-amber-300 mt-1">احتمال واقعی: {ending.realProbability}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Modal جزئیات مسیر */}
      <AnimatePresence>
        {selectedEnding && (
          <PathDetailModal path={selectedEnding} ending={endingMap[selectedEnding.endingId]} onClose={() => setSelectedEnding(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EndingCard({ path, ending, index, isWin, onClick }: {
  path: WinPath;
  ending?: Ending;
  index: number;
  isWin: boolean;
  onClick: () => void;
}) {
  if (!ending) return null;

  const difficultyColor = {
    "آسان": "#22c55e",
    "متوسط": "#fbbf24",
    "سخت": "#f97316",
    "بسیار سخت": "#dc2626",
  }[path.difficulty];

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass rounded-xl p-3 text-right transition-all hover:bg-white/5"
      style={{ border: `1px solid ${ending.color}40` }}
    >
      <div className="flex items-start gap-2 mb-2">
        <span className="text-3xl">{ending.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-bold text-muted-foreground">#{index}</span>
            <div className="font-bold text-xs" style={{ color: ending.color }}>{ending.name}</div>
          </div>
          <div className="text-[9px] text-muted-foreground mt-0.5">{path.title}</div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
        <span
          className="text-[8px] px-1.5 py-0.5 rounded font-bold"
          style={{ background: difficultyColor + "20", color: difficultyColor }}
        >
          {path.difficulty}
        </span>
        <span className="text-[8px] px-1.5 py-0.5 rounded font-bold bg-blue-500/20 text-blue-300">
          {path.turn}
        </span>
        <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${isWin ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
          {isWin ? " برد" : "باخت"}
        </span>
      </div>

      <div className="text-[9px] text-muted-foreground leading-relaxed line-clamp-2">
        {path.strategy}
      </div>

      <div className="text-[8px] text-fuchsia-300 mt-1.5">
        🎴 {path.cardNames.length} کارت
      </div>
    </motion.button>
  );
}

function PathDetailModal({ path, ending, onClose }: { path: WinPath; ending?: Ending; onClose: () => void }) {
  if (!ending) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-3"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-2xl p-4 max-w-md w-full max-h-[85dvh] overflow-y-auto"
        style={{ border: `2px solid ${ending.color}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-4xl">{ending.icon}</span>
            <div>
              <h3 className="font-bold text-base" style={{ color: ending.color }}>{ending.name}</h3>
              <div className="text-[10px] text-muted-foreground">{path.title}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg">✕</button>
        </div>

        {/* Tags */}
        <div className="flex gap-1 flex-wrap mb-3">
          <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-muted/40">{path.difficulty}</span>
          <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-blue-500/20 text-blue-300">⏱ {path.turn}</span>
          <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300">
            📊 احتمال واقعی: {ending.realProbability}
          </span>
        </div>

        {/* Strategy */}
        <div className="mb-3">
          <div className="text-[10px] font-bold text-primary mb-1">📋 استراتژی</div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">{path.strategy}</p>
        </div>

        {/* Key condition */}
        <div className="mb-3 p-2 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/30">
          <div className="text-[9px] font-bold text-fuchsia-300 mb-0.5">🎯 شرط کلیدی</div>
          <div className="text-[10px] text-fuchsia-200">{path.keyCondition}</div>
        </div>

        {/* Card sequence */}
        <div className="mb-3">
          <div className="text-[10px] font-bold text-primary mb-1">🎴 دنباله کارت‌ها</div>
          <div className="flex flex-wrap gap-1">
            {path.cardNames.map((name, i) => (
              <div key={i} className="flex items-center gap-0.5">
                <div className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[9px] text-emerald-300">
                  {i + 1}. {name}
                </div>
                {i < path.cardNames.length - 1 && <span className="text-[8px] text-muted-foreground">→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Ending description */}
        <div className="mb-3">
          <div className="text-[10px] font-bold text-primary mb-1">📝 توضیح پایان</div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">{ending.longDescription}</p>
        </div>

        {/* Outcome */}
        <div className="space-y-1.5 mb-3">
          <div className="text-[10px] font-bold text-primary">🏆 پیامد</div>
          <div className="p-2 rounded bg-white/5">
            <div className="text-[8px] text-muted-foreground">اثر منطقه‌ای</div>
            <div className="text-[9px]">{ending.outcome.regionalImpact}</div>
          </div>
          <div className="p-2 rounded bg-white/5">
            <div className="text-[8px] text-muted-foreground">اثر جهانی</div>
            <div className="text-[9px]">{ending.outcome.globalImpact}</div>
          </div>
          <div className="p-2 rounded bg-white/5">
            <div className="text-[8px] text-muted-foreground">تلفات</div>
            <div className="text-[9px]">{ending.outcome.casualties}</div>
          </div>
        </div>

        {/* Historical basis */}
        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="text-[9px] font-bold text-amber-300 mb-0.5">📚 مبنای تاریخی</div>
          <div className="text-[9px] text-amber-200/80">{ending.historicalBasis}</div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full mt-3 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-xs hover:scale-[1.02] active:scale-95 transition-all"
        >
          بستن
        </button>
      </motion.div>
    </motion.div>
  );
}

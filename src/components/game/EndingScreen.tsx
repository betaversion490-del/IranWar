"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useGameStore } from "@/lib/game/gameStore";
import { calculateEndingsProbability } from "@/lib/game/endingsData";

export function EndingScreen() {
  const store = useGameStore();
  const { ending, endingProbability, allProbabilities, resetGame, setPhase } = store;
  const [showAll, setShowAll] = useState(false);

  if (!ending) return null;

  const resultColor =
    ending.outcome.iranResult === "victory"
      ? "oklch(0.65 0.18 165)"
      : ending.outcome.iranResult === "defeat" || ending.outcome.iranResult === "destruction"
      ? "oklch(0.62 0.24 25)"
      : ending.outcome.iranResult === "compromise"
      ? "oklch(0.7 0.18 85)"
      : "oklch(0.6 0.15 250)";

  const resultLabel: Record<string, string> = {
    victory: "پیروزی استراتژیک",
    defeat: "شکست استراتژیک",
    compromise: "مذاکره و سازش",
    survival: "بقا و ادامه",
    destruction: "تخریب همه‌جانبه",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[100dvh] flex flex-col"
    >
      <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        {/* Hero ending card */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 150 }}
          className="glass-strong rounded-3xl p-6 md:p-10 mb-6 relative overflow-hidden"
          style={{ borderTopColor: ending.color, borderTopWidth: "6px" }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${ending.color}, transparent 70%)`,
            }}
          />

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="text-7xl md:text-9xl mb-4"
            >
              {ending.icon}
            </motion.div>

            <div className="text-xs font-bold mb-2 px-3 py-1 rounded-full inline-block" style={{ backgroundColor: ending.color + "30", color: ending.color }}>
              پایان محتمل - {ending.category === "war" ? "جنگ" : ending.category === "nuclear" ? "هسته‌ای" : ending.category === "peace" ? "صلح" : ending.category === "regime_change" ? "تغییر رژیم" : "وضع موجود"}
            </div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-5xl font-black mb-2"
              style={{ color: ending.color }}
            >
              {ending.name}
            </motion.h1>
            <p className="text-sm text-muted-foreground mb-4">{ending.nameEn}</p>

            <div className="inline-block px-4 py-2 rounded-xl glass mb-6">
              <div className="text-xs text-muted-foreground">احتمال وقوع</div>
              <div className="text-3xl font-black font-num" style={{ color: ending.color }}>
                {(endingProbability * 100).toFixed(1)}%
              </div>
            </div>

            <div
              className="inline-block px-4 py-2 rounded-xl mx-2"
              style={{ backgroundColor: resultColor + "30", color: resultColor }}
            >
              <div className="text-xs">نتیجه برای ایران</div>
              <div className="text-lg font-bold">{resultLabel[ending.outcome.iranResult]}</div>
            </div>
          </div>
        </motion.div>

        {/* Detailed description */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-5 mb-4"
        >
          <h3 className="font-bold text-lg mb-3">📖 سناریو</h3>
          <p className="text-sm text-foreground leading-relaxed">{ending.longDescription}</p>
        </motion.div>

        {/* Outcome details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-2 gap-4 mb-4"
        >
          <div className="glass rounded-2xl p-4">
            <h4 className="font-bold text-sm mb-2 text-amber-400">🌍 تأثیر منطقه‌ای</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{ending.outcome.regionalImpact}</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <h4 className="font-bold text-sm mb-2 text-blue-400">🌐 تأثیر جهانی</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{ending.outcome.globalImpact}</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <h4 className="font-bold text-sm mb-2 text-rose-400">💀 تلفات</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{ending.outcome.casualties}</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <h4 className="font-bold text-sm mb-2 text-emerald-400">⏱️ بازه زمانی</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{ending.outcome.timeline}</p>
          </div>
        </motion.div>

        {/* All endings probability */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-2xl p-5 mb-6"
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-between text-right"
          >
            <h3 className="font-bold text-base">📊 احتمال همه پایان‌های محتمل</h3>
            <span className="text-xs text-muted-foreground">{showAll ? "▲ بستن" : "▼ نمایش"}</span>
          </button>

          <AnimatePresence>
            {showAll && allProbabilities && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4 space-y-2"
              >
                {[...allProbabilities]
                  .sort((a, b) => b.probability - a.probability)
                  .map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2">
                          <span>{item.ending.icon}</span>
                          <span className="font-medium">{item.ending.name}</span>
                        </span>
                        <span className="font-bold font-num" style={{ color: item.ending.color }}>
                          {(item.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.ending.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.probability * 100}%` }}
                          transition={{ delay: idx * 0.05, duration: 0.5 }}
                        />
                      </div>
                    </div>
                  ))}
                <div className="text-[10px] text-muted-foreground/60 mt-3 leading-relaxed">
                  * این احتمالات بر اساس تصمیمات شما در طول {store.maxTurns} نوبت و وضعیت نهایی شش شاخص کلیدی ایران
                  و دو شاخص دشمنان محاسبه شده‌اند.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Final stats summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="glass rounded-2xl p-5 mb-6"
        >
          <h3 className="font-bold text-base mb-3">📈 وضعیت نهایی ایران</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "پیشرفت هسته‌ای", val: store.nuclearProgress, color: "oklch(0.6 0.25 25)" },
              { label: "بازدارندگی", val: store.deterrence, color: "oklch(0.65 0.15 165)" },
              { label: "اقتصاد", val: store.economicStability, color: "oklch(0.7 0.18 70)" },
              { label: "حمایت داخلی", val: store.domesticSupport, color: "oklch(0.65 0.16 165)" },
              { label: "توان نظامی", val: store.militaryCapability, color: "oklch(0.6 0.18 250)" },
              { label: "نفوذ منطقه‌ای", val: store.regionalInfluence, color: "oklch(0.6 0.2 305)" },
              { label: "فشار آمریکا", val: store.usPressure, color: "oklch(0.6 0.15 250)" },
              { label: "تهدید اسرائیل", val: store.israelThreat, color: "oklch(0.7 0.18 70)" },
            ].map((s, i) => (
              <div key={i} className="glass rounded-lg p-2 text-center">
                <div className="text-[10px] text-muted-foreground mb-1">{s.label}</div>
                <div className="text-xl font-bold font-num" style={{ color: s.color }}>
                  {s.val}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <button
            onClick={() => resetGame()}
            className="flex-1 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/30"
          >
            🔄 بازی دوباره
          </button>
          <button
            onClick={() => setPhase("history")}
            className="flex-1 px-6 py-4 glass rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all"
          >
            📜 مرور تاریخچه
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

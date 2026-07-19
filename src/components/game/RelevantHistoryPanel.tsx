"use client";

import { motion, AnimatePresence } from "framer-motion";
import { historyEras } from "@/lib/game/historyData";
import type { GameCard } from "@/lib/game/cardsData";

export function RelevantHistoryPanel({ card }: { card: GameCard | null }) {
  if (!card || !card.relatedHistoryEra) return null;

  const era = historyEras.find((e) => e.id === card.relatedHistoryEra);
  if (!era) return null;

  // Pick most relevant events (top 2 by severity)
  const relevantEvents = [...era.events]
    .sort((a, b) => {
      const sev = { critical: 4, high: 3, medium: 2, low: 1 };
      return sev[b.severity] - sev[a.severity];
    })
    .slice(0, 2);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={card.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="glass rounded-2xl p-4 border-r-4"
        style={{ borderRightColor: era.color }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold" style={{ color: era.color }}>
            📚 گذشته مرتبط با این کارت
          </div>
          <div className="text-[10px] text-muted-foreground">{era.period}</div>
        </div>

        <h3 className="font-bold text-sm mb-2">{era.title}</h3>

        <div className="space-y-2">
          {relevantEvents.map((event, idx) => (
            <div key={idx} className="text-xs">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-base">{event.icon}</span>
                <span className="font-bold" style={{ color: era.color }}>
                  {event.shamsiYear}
                </span>
                {event.shamsiDate && (
                  <span className="text-[10px] text-muted-foreground">{event.shamsiDate}</span>
                )}
              </div>
              <div className="font-medium mb-0.5">{event.title}</div>
              <p className="text-[10px] text-muted-foreground/80 leading-relaxed line-clamp-2">
                {event.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-2 pt-2 border-t border-border/20 text-[10px] text-muted-foreground/70 leading-relaxed">
          قبل از تصمیم‌گیری، این رویدادها را در نظر بگیرید. آیا استفاده از این کارت، تکرار اشتباهات گذشته است یا مسیر جدیدی می‌سازد؟
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

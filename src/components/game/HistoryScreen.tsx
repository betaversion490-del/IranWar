"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useGameStore } from "@/lib/game/gameStore";
import { historyEras, type HistoryEra } from "@/lib/game/historyData";

const severityColor: Record<string, string> = {
  low: "oklch(0.65 0.15 165)",
  medium: "oklch(0.7 0.18 85)",
  high: "oklch(0.65 0.18 35)",
  critical: "oklch(0.62 0.24 25)",
};

const severityLabel: Record<string, string> = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
  critical: "بحرانی",
};

export function HistoryScreen() {
  const setPhase = useGameStore((s) => s.setPhase);
  const startGame = useGameStore((s) => s.startGame);
  const [selectedEra, setSelectedEra] = useState<HistoryEra | null>(historyEras[0]);
  const [selectedEventIdx, setSelectedEventIdx] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[100dvh] flex flex-col"
    >
      {/* Header */}
      <div className="sticky top-0 z-20 glass-strong border-b border-border/50 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setPhase("splash")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            → بازگشت
          </button>
          <h1 className="text-lg md:text-2xl font-bold text-center flex-1">
            📜 تاریخچه مناسبات ایران، آمریکا و اسرائیل
          </h1>
          <button
            onClick={() => startGame()}
            className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold hover:scale-105 transition"
          >
            شروع بازی ←
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {/* Era timeline */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex md:grid md:grid-cols-8 gap-2 min-w-[800px] md:min-w-0">
            {historyEras.map((era, idx) => (
              <button
                key={era.id}
                onClick={() => {
                  setSelectedEra(era);
                  setSelectedEventIdx(null);
                }}
                className={`relative flex-shrink-0 md:flex-shrink p-3 rounded-xl text-right transition-all border ${
                  selectedEra?.id === era.id
                    ? "glass-strong scale-[1.02]"
                    : "glass opacity-70 hover:opacity-100"
                }`}
                style={{
                  borderColor: selectedEra?.id === era.id ? era.color : "transparent",
                }}
              >
                <div className="text-xs font-bold mb-1" style={{ color: era.color }}>
                  {era.period}
                </div>
                <div className="text-xs leading-tight text-foreground font-medium">
                  {era.title}
                </div>
                {idx < historyEras.length - 1 && (
                  <div
                    className="absolute -left-1 top-1/2 -translate-y-1/2 hidden md:block"
                    style={{ color: era.color }}
                  >
                    ←
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedEra && (
            <motion.div
              key={selectedEra.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-3 gap-4"
            >
              {/* Era overview */}
              <div className="lg:col-span-1">
                <div
                  className="glass-strong rounded-2xl p-5 h-full"
                  style={{ borderTopColor: selectedEra.color, borderTopWidth: "4px" }}
                >
                  <div className="text-xs mb-2 font-bold" style={{ color: selectedEra.color }}>
                    {selectedEra.period}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black mb-4">
                    {selectedEra.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {selectedEra.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{selectedEra.events.length} رویداد کلیدی</span>
                  </div>
                </div>
              </div>

              {/* Events list */}
              <div className="lg:col-span-2 space-y-3">
                {selectedEra.events.map((event, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedEventIdx(selectedEventIdx === idx ? null : idx)}
                    className={`w-full text-right glass rounded-xl p-4 hover:scale-[1.01] transition-all border ${
                      selectedEventIdx === idx ? "border-primary/50" : "border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl shrink-0">{event.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: selectedEra.color, color: "white" }}>
                            {event.shamsiYear}
                          </span>
                          {event.shamsiDate && (
                            <span className="text-xs text-muted-foreground">{event.shamsiDate}</span>
                          )}
                          <span
                            className="text-xs px-2 py-0.5 rounded font-bold"
                            style={{
                              backgroundColor: severityColor[event.severity] + "30",
                              color: severityColor[event.severity],
                            }}
                          >
                            شدت: {severityLabel[event.severity]}
                          </span>
                        </div>
                        <h3 className="font-bold text-base md:text-lg mb-1">{event.title}</h3>

                        <AnimatePresence>
                          {selectedEventIdx === idx && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                                {event.description}
                              </p>
                              <div className="flex items-center gap-3 mt-3 text-xs">
                                <span className="text-muted-foreground">طرف‌های درگیر:</span>
                                {event.parties.map((p) => (
                                  <span
                                    key={p}
                                    className="px-2 py-0.5 rounded font-bold"
                                    style={{
                                      backgroundColor:
                                        p === "iran"
                                          ? "oklch(0.62 0.18 165 / 0.2)"
                                          : p === "us"
                                          ? "oklch(0.6 0.15 250 / 0.2)"
                                          : "oklch(0.7 0.18 70 / 0.2)",
                                      color:
                                        p === "iran"
                                          ? "oklch(0.7 0.18 165)"
                                          : p === "us"
                                          ? "oklch(0.7 0.18 250)"
                                          : "oklch(0.78 0.18 70)",
                                    }}
                                  >
                                    {p === "iran" ? "🇮🇷 ایران" : p === "us" ? "🇺🇸 آمریکا" : "🇮🇱 اسرائیل"}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {selectedEventIdx !== idx && (
                          <p className="text-xs text-muted-foreground/70 line-clamp-1 mt-1">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 glass-strong border-t border-border/50 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground hidden sm:block">
            برای جزئیات هر رویداد، روی آن ضربه بزنید
          </div>
          <button
            onClick={() => startGame()}
            className="ml-auto px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/30"
          >
            شروع شبیه‌سازی ←
          </button>
        </div>
      </div>
    </motion.div>
  );
}

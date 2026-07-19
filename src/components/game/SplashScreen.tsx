"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/lib/game/gameStore";

// Pre-generated stable particle positions (avoid hydration mismatch with Math.random)
const PARTICLES = [
  { x: 100, y: 200, duration: 5, delay: 0.5 },
  { x: 250, y: 400, duration: 6, delay: 1.2 },
  { x: 400, y: 150, duration: 4.5, delay: 0.8 },
  { x: 550, y: 350, duration: 7, delay: 2.0 },
  { x: 700, y: 250, duration: 5.5, delay: 0.3 },
  { x: 850, y: 450, duration: 6.5, delay: 1.5 },
  { x: 1000, y: 200, duration: 5, delay: 2.3 },
  { x: 1150, y: 350, duration: 7.5, delay: 0.7 },
  { x: 150, y: 550, duration: 6, delay: 1.8 },
  { x: 300, y: 700, duration: 5.5, delay: 0.4 },
  { x: 450, y: 600, duration: 4.8, delay: 2.5 },
  { x: 600, y: 750, duration: 6.2, delay: 1.1 },
  { x: 750, y: 550, duration: 5.8, delay: 0.9 },
  { x: 900, y: 650, duration: 7.2, delay: 1.7 },
  { x: 1050, y: 700, duration: 5.3, delay: 2.2 },
  { x: 200, y: 300, duration: 6.8, delay: 0.6 },
  { x: 500, y: 250, duration: 5.6, delay: 1.9 },
  { x: 800, y: 300, duration: 7.1, delay: 0.2 },
  { x: 350, y: 500, duration: 5.9, delay: 1.4 },
  { x: 650, y: 500, duration: 6.3, delay: 2.1 },
];

export function SplashScreen() {
  const setPhase = useGameStore((s) => s.setPhase);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[100dvh] flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Animated background map */}
      <div className="absolute inset-0 map-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/40"
          style={{ left: p.x, top: p.y }}
          initial={{ opacity: 0 }}
          animate={{ y: -100, opacity: [0, 1, 0] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}

      <div className="relative z-10 text-center max-w-3xl">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6 inline-block"
        >
          <div className="text-6xl md:text-8xl mb-4">🌍</div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl md:text-7xl font-black mb-3 bg-gradient-to-l from-primary via-emerald-300 to-amber-400 bg-clip-text text-transparent glow-text"
        >
          بازی بزرگ خاورمیانه
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-2xl text-muted-foreground mb-2 font-medium"
        >
          ایران در برابر آمریکا و اسرائیل
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm md:text-base text-muted-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          یک شبیه‌سازی استراتژیک تعاملی بر اساس تاریخچه کامل مناسبات و درگیری‌های
          سه کشور از کودتای ۲۸ مرداد ۱۳۳۲ تا بحران ۲۰۲۵. شما در جایگاه تصمیم‌گیرندگان
          ایران قرار می‌گیرید و آینده منطقه را با انتخاب کارت‌های استراتژیک می‌سازید.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            onClick={() => setPhase("intro")}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/30"
          >
            شروع بازی
          </button>
          <button
            onClick={() => setPhase("history")}
            className="px-8 py-4 glass rounded-xl font-bold text-lg hover:scale-105 active:scale-95 transition-all"
          >
            مرور تاریخچه (۱۳۳۲-۱۴۰۴)
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 grid grid-cols-3 gap-3 max-w-2xl mx-auto"
        >
          {[
            { label: "۷۰+ سال", value: "تاریخچه مناسبات" },
            { label: "۴۰+ کارت", value: "استراتژیک" },
            { label: "۸ پایان", value: "محتمل آینده" },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-lg p-3 text-center">
              <div className="text-xl md:text-2xl font-bold text-primary">{stat.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.value}</div>
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 text-xs text-muted-foreground/50 max-w-xl mx-auto leading-relaxed"
        >
          ⚠️ این بازی بر اساس وقایع مستند تاریخی ساخته شده اما سناریوهای آینده تحلیلی-احتمالی هستند
          و منعکس‌کننده موقعیت رسمی هیچ‌یک از طرف‌ها نیست. هدف، درک بهتر پیچیدگی‌های ژئوپلیتیک منطقه است.
        </motion.p>
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/lib/game/gameStore";

export function IntroScreen() {
  const setPhase = useGameStore((s) => s.setPhase);
  const startGame = useGameStore((s) => s.startGame);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[100dvh] flex flex-col p-4 md:p-8 max-w-5xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6 mt-2">
        <button
          onClick={() => setPhase("splash")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          → بازگشت
        </button>
        <div className="text-xs text-muted-foreground">راهنمای بازی</div>
      </div>

      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl md:text-5xl font-black mb-4 text-center"
      >
        چگونه بازی کنیم؟
      </motion.h1>

      <div className="space-y-5 flex-1">
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0">🎭</div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-primary">شما نقش ایران را بازی می‌کنید</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                در هر نوبت، یک کارت از دست ۵ کارتی ایران انتخاب می‌کنید. هر کارت نشان‌دهنده یک
                تصمیم استراتژیک واقعی است که در اختیار تصمیم‌گیرندگان تهران قرار دارد: از غنی‌سازی
                هسته‌ای تا بستن تنگه هرمز، از فعال‌سازی حزب‌الله تا دیپلماسی.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0">🤖</div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-blue-400">دشمنان توسط هوش مصنوعی بازی می‌کنند</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                پس از هر حرکت شما، آمریکا و اسرائیل با هوش مصنوعی مبتنی بر وزن‌دهی احتمالی پاسخ می‌دهند.
                الگوریتم AI بر اساس موقعیت فعلی و کارت شما، محتمل‌ترین پاسخ را انتخاب می‌کند. مثلاً
                اگر غنی‌سازی را بالا ببرید، احتمال حمله نظامی آمریکا و اسرائیل به تأسیسات هسته‌ای افزایش می‌یابد.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0">📊</div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-amber-400">۶ شاخص حیاتی را دنبال کنید</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                پیشرفت هسته‌ای، بازدارندگی، ثبات اقتصادی، حمایت داخلی، توان نظامی، نفوذ منطقه‌ای.
                در طرف مقابل، فشار آمریکا و تهدید اسرائیل را زیر نظر داشته باشید. هر کارت روی
                چند شاخص اثر می‌گذارد و ترکیب کارت‌ها مسیر نهایی را تعیین می‌کند.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0">🏁</div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-rose-400">۸ پایان محتمل</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                بعد از ۸ نوبت، با توجه به وضعیت نهایی شاخص‌ها، بازی به یکی از ۸ پایان می‌رسد:
                از «بمب اتم در دستان ایران» تا «جنگ تمام‌عیار منطقه‌ای»، از «توافق تاریخی» تا
                «تغییر رژیم». هر پایان با درصد احتمال و تحلیل کامل نمایش داده می‌شود.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-strong rounded-2xl p-5 border-primary/30"
        >
          <h3 className="font-bold text-lg mb-3 text-center">نکته کلیدی</h3>
          <p className="text-sm text-center text-muted-foreground leading-relaxed">
            هیچ کارتی «به‌طور مطلق» خوب یا بد نیست. همان کارت «غنی‌سازی تا ۹۰٪» می‌تواند به
            بمب اتم ختم شود یا به حمله پیش‌دگیرانه اسرائیل. نتیجه به ترکیب کارت‌ها و
            پاسخ دشمن بستگی دارد. استراتژی، هنر انتخاب در زمان مناسب است.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-3 mt-6 mb-4"
      >
        <button
          onClick={() => setPhase("history")}
          className="flex-1 px-6 py-4 glass rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all"
        >
          📜 مرور تاریخچه قبل از شروع
        </button>
        <button
          onClick={() => startGame()}
          className="flex-1 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/30"
        >
          ⚔️ شروع شبیه‌سازی
        </button>
      </motion.div>
    </motion.div>
  );
}

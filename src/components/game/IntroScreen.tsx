"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useGameStore } from "@/lib/game/gameStore";

type TutorialStep = "intro" | "role" | "stats" | "elixir" | "cards" | "combos" | "ending" | "ready";

const STEPS: TutorialStep[] = ["intro", "role", "stats", "elixir", "cards", "combos", "ending", "ready"];

export function IntroScreen() {
  const setPhase = useGameStore((s) => s.setPhase);
  const startGame = useGameStore((s) => s.startGame);
  const [step, setStep] = useState<TutorialStep>("intro");

  const currentIndex = STEPS.indexOf(step);
  const goNext = () => {
    const next = STEPS[currentIndex + 1];
    if (next) setStep(next);
  };
  const goPrev = () => {
    const prev = STEPS[currentIndex - 1];
    if (prev) setStep(prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[100dvh] flex flex-col p-3 sm:p-4 md:p-8 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-4 mt-2">
        <button
          onClick={() => setPhase("splash")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          → بازگشت
        </button>
        <div className="text-xs text-muted-foreground">
          راهنمای بازی • مرحله {currentIndex + 1} از {STEPS.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted/40 rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${((currentIndex + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === "intro" && (
          <StepWrapper key="intro">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 text-center"
            >
              شبیه‌سازی استراتژیک
              <br />
              <span className="text-primary">ایران - آمریکا - اسرائیل</span>
            </motion.h1>
            <div className="glass-strong rounded-2xl p-4 sm:p-6 mb-4">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-center">
                این یک بازی استراتژیک بر اساس رویدادهای تاریخی واقعی است. شما نقش ایران را
                بازی می‌کنید و باید در ۸ نوبت، تصمیمات استراتژیک بگیرید که آینده منطقه را
                شکل می‌دهد. هر تصمیم شما می‌تواند به صلح، جنگ، بمب اتم، یا تغییر رژیم ختم شود.
              </p>
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <p className="text-[11px] text-amber-300 leading-relaxed">
                  ⚠️ <strong>توجه:</strong> تمام داده‌های این بازی بر اساس منابع رسمی ایرانی
                  (برای کارت‌های ایران) و منابع بین‌المللی معتبر (برای کارت‌های دشمن) تنظیم شده است.
                  هیچ داده فرضی وجود ندارد.
                </p>
              </div>
            </div>
          </StepWrapper>
        )}

        {step === "role" && (
          <StepWrapper key="role">
            <SectionHeader icon="🎭" title="شما نقش ایران را بازی می‌کنید" color="text-primary" />
            <div className="glass rounded-2xl p-4 sm:p-5 mb-3">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">
                در هر نوبت، یک کارت از دست کارت‌های ایران انتخاب می‌کنید. هر کارت نشان‌دهنده یک
                تصمیم استراتژیک واقعی است: از غنی‌سازی هسته‌ای تا بستن تنگه هرمز، از فعال‌سازی
                حزب‌الله تا دیپلماسی.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <MiniExample icon="☢️" title="غنی‌سازی ۹۰٪" desc="ساخت بمب اتم" />
                <MiniExample icon="🚀" title="حمله موشکی" desc="ضربه به اسرائیل" />
                <MiniExample icon="⚓" title="بستن هرمز" desc="قطع صادرات نفت" />
                <MiniExample icon="🕊️" title="دیپلماسی" desc="مذاکره با غرب" />
              </div>
            </div>
            <div className="glass rounded-2xl p-4 sm:p-5">
              <h4 className="font-bold text-sm mb-2 text-blue-400">🤖 دشمنان توسط هوش مصنوعی بازی می‌کنند</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                پس از هر حرکت شما، آمریکا و اسرائیل با AI پاسخ می‌دهند. الگوریتم بر اساس موقعیت
                فعلی، محتمل‌ترین پاسخ را انتخاب می‌کند. مثلاً اگر غنی‌سازی را بالا ببرید، احتمال
                حمله پیش‌دگیرانه اسرائیل افزایش می‌یابد.
              </p>
            </div>
          </StepWrapper>
        )}

        {step === "stats" && (
          <StepWrapper key="stats">
            <SectionHeader icon="📊" title="۶ شاخص حیاتی را دنبال کنید" color="text-amber-400" />
            <div className="glass rounded-2xl p-4 sm:p-5 mb-3">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">
                هر کارت روی این ۶ شاخص اثر می‌گذارد. ترکیب آن‌ها مسیر نهایی بازی را تعیین می‌کند:
              </p>
              <div className="space-y-2">
                <StatRow icon="☢️" name="پیشرفت هسته‌ای" desc="درصد غنی‌سازی و نزدیکی به بمب" good="بالا برای بمب، بد برای صلح" color="text-orange-400" />
                <StatRow icon="🛡️" name="بازدارندگی" desc="ترس دشمن از حمله به ایران" good="بالا خوب است" color="text-emerald-400" />
                <StatRow icon="⚔️" name="توان نظامی" desc="قدرت سپاه، ارتش، موشک‌ها" good="بالا خوب است" color="text-blue-400" />
                <StatRow icon="💰" name="ثبات اقتصادی" desc="وضعیت اقتصاد و تحریم‌ها" good="بالا خوب است" color="text-yellow-400" />
                <StatRow icon="👥" name="حمایت داخلی" desc="پشتیبانی مردم از نظام" good="بالا خوب است" color="text-pink-400" />
                <StatRow icon="🌍" name="نفوذ منطقه‌ای" desc="قدرت محور مقاومت" good="بالا خوب است" color="text-purple-400" />
              </div>
            </div>
            <div className="glass rounded-2xl p-4 sm:p-5">
              <h4 className="font-bold text-sm mb-2 text-rose-400">🔥 نوار جنگ‌افزایی</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                نوار رنگی در بالای صفحه شدت درگیری را نشان می‌دهد:
                <span className="text-green-400 font-bold"> سبز</span> (آرامش) →
                <span className="text-orange-400 font-bold"> نارنجی</span> (تنش) →
                <span className="text-red-400 font-bold"> قرمز</span> (جنگ).
                اگر به ۸۵+ برسد، احتمال شکست استراتژیک ایران زیاد می‌شود.
              </p>
            </div>
          </StepWrapper>
        )}

        {step === "elixir" && (
          <StepWrapper key="elixir">
            <SectionHeader icon="💎" title="سیستم انرژی (Elixir)" color="text-fuchsia-400" />
            <div className="glass rounded-2xl p-4 sm:p-5 mb-3">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">
                شبیه Clash Royale: شما و دشمن هر کدام یک نوار انرژی دارید که به‌طور خودکار
                پر می‌شود (هر ۲.۴ ثانیه +۱، حداکثر ۱۰).
              </p>
              <div className="flex items-center justify-center gap-2 my-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: i < 7 ? 1 : 0.3, scale: i < 7 ? 1 : 0.8 }}
                      transition={{ delay: i * 0.05 }}
                      className="w-3 h-6 rounded-sm bg-fuchsia-500"
                      style={{ boxShadow: i < 7 ? "0 0 6px #d946ef" : "none" }}
                    />
                  ))}
                </div>
                <span className="text-2xl font-black text-fuchsia-400">۷</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                هر کارت هزینه انرژی دارد (۲ تا ۹). کارت‌های سبک ارزان اما کم‌اثر، کارت‌های
                سنگین گران اما تحول‌ساز. باید صبر کنید تا انرژی کافی جمع شود.
              </p>
            </div>
            <div className="glass rounded-2xl p-4 sm:p-5">
              <h4 className="font-bold text-sm mb-2 text-amber-400">⏱ زمان آماده‌سازی (Prep Time)</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                برخی کارت‌ها نیاز به آماده‌سازی دارند (۳ تا ۶۰ ثانیه). این زمان واقعی است:
                مثلاً ساخت بمب اتم ۴۰ ثانیه (معادل ۳-۶ ماه در دنیای واقعی)، حمله موشکی ۰ ثانیه
                (فوری). در حین آماده‌سازی، دشمن ممکن است حمله کند!
              </p>
            </div>
          </StepWrapper>
        )}

        {step === "cards" && (
          <StepWrapper key="cards">
            <SectionHeader icon="🌳" title="درخت فناوری و پیش‌نیازها" color="text-emerald-400" />
            <div className="glass rounded-2xl p-4 sm:p-5 mb-3">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">
                همه کارت‌ها از ابتدا قابل بازی نیستند. کارت‌های سنگین نیاز به پیش‌نیاز دارند:
              </p>
              <div className="bg-black/40 rounded-xl p-3 font-mono text-[11px] text-muted-foreground mb-3" style={{ direction: "ltr" }}>
                <div>📜 خروج از NPT → ☢️ ساخت بمب اتم → 🚀 ICBM</div>
                <div>👥 بسیج → ⚔️ حمله زمینی</div>
                <div>💻 سایبر → ⚓ بستن هرمز → 🛢 سلاح نفت</div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                با کلیک روی دکمه <span className="text-emerald-400 font-bold">🌳 درخت</span> در پایین صفحه،
                می‌توانید کل درخت فناوری را ببینید و بدانید کدام کارت‌ها قفل هستند.
              </p>
            </div>
            <div className="glass rounded-2xl p-4 sm:p-5">
              <h4 className="font-bold text-sm mb-2 text-rose-400">⚠️ پادکارت‌ها (Counters)</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                هر کارت ایران، می‌تواند توسط کارت دشمن «خنثی» شود. مثلاً اگر شما «بستن هرمز»
                را بازی کنید، دشمن احتمالاً «عملیات هرمز» را بازی می‌کند تا آن را خنثی کند.
                در مودال جزئیات هر کارت، می‌توانید پادکارت‌ها را ببینید.
              </p>
            </div>
          </StepWrapper>
        )}

        {step === "combos" && (
          <StepWrapper key="combos">
            <SectionHeader icon="⚡" title="کمبوهای استراتژیک" color="text-fuchsia-400" />
            <div className="glass rounded-2xl p-4 sm:p-5 mb-3">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">
                اگر چند کارت مرتبط را پشت سر هم بازی کنید، کمبو فعال می‌شود و اثر شما چند برابر می‌شود:
              </p>
              <div className="space-y-2">
                <ComboRow icon="🛡️" name="محور مقاومت" mult="×۱.۵" desc="حزب‌الله + حوثی + حشد الشعبی" color="border-emerald-500/50 bg-emerald-500/10" />
                <ComboRow icon="☢️" name="بازدارندگی هسته‌ای" mult="×۱.۸" desc="خروج NPT + ساخت بمب" color="border-rose-500/50 bg-rose-500/10" />
                <ComboRow icon="🌊" name="غیرمتقارن کامل" mult="×۲.۰" desc="سایبر + حوثی + زیرساخت" color="border-amber-500/50 bg-amber-500/10" />
                <ComboRow icon="🤝" name="محور شرق" mult="×۱.۴" desc="روسیه + چین + کره شمالی" color="border-blue-500/50 bg-blue-500/10" />
              </div>
            </div>
            <div className="glass rounded-2xl p-4 sm:p-5">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                وقتی کمبو فعال می‌شود، فلش طلایی روی صفحه ظاهر می‌شود و اثر کارت‌ها با ضریب
                نشان داده شده ضرب می‌شود. استراتژی واقعی در ساختن کمبو است!
              </p>
            </div>
          </StepWrapper>
        )}

        {step === "ending" && (
          <StepWrapper key="ending">
            <SectionHeader icon="🏁" title="۱۰ پایان محتمل" color="text-rose-400" />
            <div className="glass rounded-2xl p-4 sm:p-5 mb-3">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">
                بعد از ۸ نوبت (یا زودتر در شرایط بحرانی)، بازی به یکی از ۱۰ پایان می‌رسد.
                هر پایان با درصد احتمال و تحلیل کامل نمایش داده می‌شود:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <EndingBadge icon="🌫️" name="جنگ سایه‌ای" prob="۴۰-۵۰٪" color="text-slate-400" />
                <EndingBadge icon="☢️" name="بازدارندگی هسته‌ای" prob="۲۰-۲۵٪" color="text-orange-400" />
                <EndingBadge icon="🕊️" name="صلح جامع" prob="۱۰-۱۵٪" color="text-emerald-400" />
                <EndingBadge icon="💀" name="شکست استراتژیک" prob="۱۰-۱۵٪" color="text-rose-400" />
                <EndingBadge icon="🚪" name="خروج آمریکا" prob="۸-۱۲٪" color="text-blue-400" />
                <EndingBadge icon="📉" name="انزوای اسرائیل" prob="۵-۱۰٪" color="text-purple-400" />
                <EndingBadge icon="💥" name="جنگ هسته‌ای" prob="۳-۵٪" color="text-red-500" />
                <EndingBadge icon="🔄" name="تغییر رژیم" prob="۳-۵٪" color="text-pink-400" />
              </div>
            </div>
            <div className="glass rounded-2xl p-4 sm:p-5">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                نکته کلیدی: هیچ کارتی «به‌طور مطلق» خوب یا بد نیست. همان کارت «غنی‌سازی ۹۰٪»
                می‌تواند به بمب اتم ختم شود یا به حمله پیش‌دگیرانه اسرائیل. نتیجه به ترکیب
                کارت‌ها و پاسخ دشمن بستگی دارد.
              </p>
            </div>
          </StepWrapper>
        )}

        {step === "ready" && (
          <StepWrapper key="ready">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center mb-6"
            >
              <div className="text-6xl mb-4">⚔️</div>
              <h2 className="text-2xl sm:text-3xl font-black mb-2">آماده شروع؟</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                حالا می‌دانید چطور بازی کنید. در طول بازی، می‌توانید با کلیک روی دکمه «؟»
                راهنما را دوباره ببینید.
              </p>
            </motion.div>
            <div className="glass-strong rounded-2xl p-4 sm:p-5 border-primary/30 mb-4">
              <h4 className="font-bold text-base mb-3 text-center">خلاصه استراتژی</h4>
              <div className="space-y-2 text-[11px] sm:text-xs text-muted-foreground">
                <div className="flex gap-2"><span>✅</span><span>برای صلح: کارت‌های دیپلماتیک + پایین نگه‌داشتن جنگ</span></div>
                <div className="flex gap-2"><span>✅</span><span>برای بمب: خروج NPT → ساخت بمب (با کمبو ×۱.۸)</span></div>
                <div className="flex gap-2"><span>✅</span><span>برای پیروزی نیابتی: فعال‌سازی محور مقاومت (کمبو ×۱.۵)</span></div>
                <div className="flex gap-2"><span>⚠️</span><span>مراقب جنگ‌افزایی بالای ۸۵ باشید - شکست استراتژیک!</span></div>
                <div className="flex gap-2"><span>⚠️</span><span>اگر اقتصاد زیر ۲۰ بیفتد، تغییر رژیم محتمل است</span></div>
              </div>
            </div>
          </StepWrapper>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex gap-2 sm:gap-3 mt-auto mb-4">
        {step !== "intro" && (
          <button
            onClick={goPrev}
            className="px-4 sm:px-6 py-3 sm:py-4 glass rounded-xl font-bold text-sm sm:text-base hover:scale-[1.02] active:scale-95 transition-all"
          >
            → قبلی
          </button>
        )}
        {step !== "ready" ? (
          <button
            onClick={goNext}
            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm sm:text-base hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/30"
          >
            بعدی ←
          </button>
        ) : (
          <>
            <button
              onClick={() => setPhase("history")}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 glass rounded-xl font-bold text-sm sm:text-base hover:scale-[1.02] active:scale-95 transition-all"
            >
              📜 مرور تاریخچه
            </button>
            <button
              onClick={() => startGame()}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm sm:text-base md:text-lg hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/30"
            >
              ⚔️ شروع شبیه‌سازی
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================
// Helper components
// ============================================================
function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="flex-1"
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ icon, title, color }: { icon: string; title: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-3xl sm:text-4xl">{icon}</span>
      <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${color}`}>{title}</h2>
    </div>
  );
}

function MiniExample({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="glass rounded-lg p-2 flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <div>
        <div className="text-[10px] font-bold">{title}</div>
        <div className="text-[8px] text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}

function StatRow({ icon, name, desc, good, color }: { icon: string; name: string; desc: string; good: string; color: string }) {
  return (
    <div className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
      <span className="text-base shrink-0">{icon}</span>
      <div className="flex-1">
        <div className={`text-[11px] font-bold ${color}`}>{name}</div>
        <div className="text-[9px] text-muted-foreground">{desc}</div>
        <div className="text-[8px] text-muted-foreground/70 mt-0.5">{good}</div>
      </div>
    </div>
  );
}

function ComboRow({ icon, name, mult, desc, color }: { icon: string; name: string; mult: string; desc: string; color: string }) {
  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg border ${color}`}>
      <span className="text-lg">{icon}</span>
      <div className="flex-1">
        <div className="text-[11px] font-bold">{name}</div>
        <div className="text-[9px] text-muted-foreground">{desc}</div>
      </div>
      <span className="text-[12px] font-black text-fuchsia-400">{mult}</span>
    </div>
  );
}

function EndingBadge({ icon, name, prob, color }: { icon: string; name: string; prob: string; color: string }) {
  return (
    <div className="glass rounded-lg p-2 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className={`text-[10px] font-bold ${color}`}>{name}</div>
      <div className="text-[8px] text-muted-foreground">{prob}</div>
    </div>
  );
}

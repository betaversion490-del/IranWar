// Endings data v2.0 - 7 final future scenarios based on research
// All probabilities are based on geopolitical analysis.

export type Ending = {
  id: string;
  name: string;
  nameEn: string;
  category: "nuclear" | "war" | "peace" | "regime_change" | "power_shift";
  timeframe: string;
  description: string;
  longDescription: string;
  conditions: {
    baseProbability: number;
    triggers?: Partial<{
      nuclearProgress: number;
      deterrence: number;
      domesticSupport: number;
      economicStability: number;
      regionalInfluence: number;
      militaryCapability: number;
      warEscalation: number;
      negotiationChance: number;
      regimeChange: number;
      usWithdrawal: number;
      israelIsolation: number;
    }>;
  };
  outcome: {
    iranResult: "victory" | "defeat" | "compromise" | "destruction";
    regionalImpact: string;
    globalImpact: string;
    casualties: string;
    timeline: string;
  };
  icon: string;
  color: string;
};

export const endings: Ending[] = [
  // 1. JANG-E FARSAYESHI TULANI (40-50% - most likely)
  {
    id: "decade_war",
    name: "جنگ فرسایشی طولانی",
    nameEn: "Decade-Long War of Attrition",
    category: "war",
    timeframe: "۱۰ تا ۲۰ سال آینده",
    description:
      "محتمل‌ترین سناریو: نه جنگ تمام‌عیار، نه صلح. درگیری سایبری، نیابتی، اقتصادی، موشکی متناوب.",
    longDescription:
      "تحقیقات نشان می‌دهد این محتمل‌ترین سناریو است (۴۰-۵۰٪). «gray zone warfare» - جنگ سایه‌ای که دهه‌ها ادامه می‌یابد. هر چند ماه یک حمله محدود مستقیم. اقتصاد ایران در تورم مزمن، اما سیستم پایدار است. اسرائیل در آمادگی دائمی پدافندی. شبیه جنگ کره (۱۹۵۳-تاکنون) یا کشمیر (۱۹۴۷-تاکنون). برنده روشن ندارد. فرسایش تدریجی هر دو طرف.",
    conditions: {
      baseProbability: 0.22,
      triggers: {
        warEscalation: 50,
        nuclearProgress: 50,
        deterrence: 50,
        negotiationChance: 30,
      },
    },
    outcome: {
      iranResult: "compromise",
      regionalImpact:
        "ادامه بی‌ثباتی مزمن. فرسایش تدریجی هر دو طرف. خروج تدریجی سرمایه و مغزها از منطقه.",
      globalImpact:
        "قیمت نفت ۱۰۰-۱۲۰ دلار. عدم قطعیت دائمی در بازارها. کندی رشد اقتصادی جهانی.",
      casualties: "ده‌ها هزار کشته در طول دهه‌ها.",
      timeline: "۱۰ تا ۲۰ سال یا بیشتر.",
    },
    icon: "🌫️",
    color: "oklch(0.55 0.1 260)",
  },
  // 2. BOM ATOM IRAN (20-25%)
  {
    id: "iran_nuclear_power",
    name: "ظهور بمب اتم ایران و بازدارندگی متقابل",
    nameEn: "Iranian Nuclear Deterrence",
    category: "nuclear",
    timeframe: "۳ تا ۱۰ سال آینده",
    description:
      "ایران به بمب اتم می‌رسد، پنجره بحرانی ۱۸-۳۶ ماه را طی می‌کند و وارد دوران بازدارندگی متقابل می‌شود.",
    longDescription:
      "تحقیقات: احتمال ۲۰-۲۵٪. مسیر: ایران غنی‌سازی ۹۰٪ → breakout → تست → اعلام. سپس ۲-۵ سال برای بازدارندگی مؤثر. پنجره بحرانی ۱۸-۳۶ ماه اول خطرناک (احتمال حمله پیش‌دگیرانه اسرائیل ۵۰-۶۵٪). پس از عبور، آمریکا به مدل «containment» روی می‌آورد - مثل کره شمالی. احتمال موفقیت نهایی ۶۰-۷۰٪. اسرائیل به سیاست ابهام هسته‌ای بازمی‌گردد. سعودی‌ها کلاهک از پاکستان. وضعیت «MAD منطقه‌ای» (تخریب متقابل تضمین‌شده).",
    conditions: {
      baseProbability: 0.18,
      triggers: {
        nuclearProgress: 85,
        deterrence: 70,
      },
    },
    outcome: {
      iranResult: "victory",
      regionalImpact:
        "آغاز مسابقه تسلیحاتی هسته‌ای در خاورمیانه. سعودی‌ها کلاهک از پاکستان می‌گیرند. ترکیه ممکن است به دنبال بمب برود. محور مقاومت قدرتمندتر می‌شود. اسرائیل مجبور به بازنگری استراتژی.",
      globalImpact:
        "فروپاشی رژیم NPT. ضربه سهمگین به نظام غیرپراکنش. سازمان ملل در بحران. روسیه و چین به‌طور پنهانی از ایران حمایت می‌کنند.",
      casualties: "بدون تلفات مستقیم، اما شروع دوران خطرناک‌تر.",
      timeline: "۳ تا ۱۰ سال برای تثبیت.",
    },
    icon: "☢️",
    color: "oklch(0.6 0.25 25)",
  },
  // 3. US WITHDRAWAL (20-25%)
  {
    id: "us_withdrawal",
    name: "خروج تدریجی آمریکا از خاورمیانه",
    nameEn: "Gradual US Withdrawal",
    category: "power_shift",
    timeframe: "۵ تا ۱۵ سال آینده",
    description:
      "آمریکا پس از دهه‌ها جنگ پرهزینه، تصمیم می‌گیرد از خاورمیانه خارج شود و تمرکز بر چین کند.",
    longDescription:
      "تحقیقات: احتمال ۲۰-۲۵٪ برای «کاهش جاه‌طلبی»، اما خروج کامل <۵٪. مسیر: «Pivot to Asia» ادامه می‌یابد. کاهش نیرو. سپردن منطقه به اسرائیل و عربستان. موانع: نفت، امنیت اسرائیل، پایگاه‌ها، میراث. تسریع‌کننده: جنگ‌های فرسایشی، خستگی داخلی آمریکا. در صورت وقوع، ایران به هژمون قطعی خاورمیانه تبدیل می‌شود.",
    conditions: {
      baseProbability: 0.15,
      triggers: {
        deterrence: 75,
        regionalInfluence: 80,
        usWithdrawal: 1.5,
      },
    },
    outcome: {
      iranResult: "victory",
      regionalImpact:
        "ایران به قدرت هژمون خاورمیانه تبدیل می‌شود. گسترش محور مقاومت به کل منطقه. عربستان، امارات مجبور به سازگاری. اسرائیل در انزوای استراتژیک.",
      globalImpact:
        "انتقال قطب قدرت جهانی. چین و روسیه از خلأ آمریکا بهره می‌برند. اقتصاد جهانی به چندقطبی تبدیل می‌شود.",
      casualties: "تلفات محدود به درگیری‌های نیابتی باقیمانده.",
      timeline: "۵ تا ۱۵ سال برای تکمیل.",
    },
    icon: "🚪",
    color: "oklch(0.6 0.18 165)",
  },
  // 4. PEACE DEAL (15-20%)
  {
    id: "historic_peace",
    name: "توافق جامع و صلح پایدار",
    nameEn: "Comprehensive Peace Agreement",
    category: "peace",
    timeframe: "۲ تا ۵ سال آینده",
    description:
      "توافق «More for More»: رفع کامل تحریم‌ها در برابر محدودیت‌های واقعی هسته‌ای، موشکی و نیابتی.",
    longDescription:
      "تحقیقات: احتمال ۱۵-۲۰٪. مدل «More for More»: رفع کامل تحریم‌ها در برابر توقف غنی‌سازی، محدودیت موشک، عدم فعال‌سازی نیابتی‌ها. ضمانت اجرایی متقابل. موانع: عدم اعتماد متقابل (خروج ترامپ از JCPOA)، اختلاف داخلی هر دو طرف، مخالفت اسرائیل و سعودی. پنجره فرصت: پس از تحول سیاسی در یکی از طرفین. در وضعیت فعلی (نتانیاهو + رهبری ایران) بعید است.",
    conditions: {
      baseProbability: 0.13,
      triggers: {
        negotiationChance: 80,
        nuclearProgress: 40,
        warEscalation: 40,
      },
    },
    outcome: {
      iranResult: "compromise",
      regionalImpact:
        "کاهش تنش در خاورمیانه. احیای روابط دیپلماتیک محدود. بهبود وضع اقتصادی ایران. کاهش شدت درگیری‌های نیابتی.",
      globalImpact:
        "کاهش قیمت نفت، بهبود اقتصاد جهانی. تقویت دیپلماسی چندجانبه. الگویی برای حل بحران‌های دیگر.",
      casualties: "تلفات پیش از توافق محدود می‌ماند.",
      timeline: "۲ تا ۵ سال مذاکره، دهه‌ها برای اعتمادسازی.",
    },
    icon: "🕊️",
    color: "oklch(0.65 0.18 165)",
  },
  // 5. REGIME CHANGE (10-15%)
  {
    id: "regime_change_iran",
    name: "تغییر رژیم در ایران",
    nameEn: "Regime Change in Iran",
    category: "regime_change",
    timeframe: "۲ تا ۵ سال آینده",
    description:
      "فشار حداکثری غرب، ناآرامی‌های داخلی و اختلاف در طبقه حاکمه به فروپاشی رژیم می‌رسد.",
    longDescription:
      "تحقیقات: احتمال ۱۰-۱۵٪ برای تغییر رژیم از بیرون. ساختار حاکمیتی ایران مقاومت بالایی نشان داده. مسیرهای ممکن: ۱) فشار اقتصادی شدید → نارضایتی → ناآرامی (مدل ونزوئلا، تا الان ناموفق). ۲) حمله نظامی → فروپاشی (مدل عراق ۲۰۰۳ - ولی ایران بسیج و ساختار انقلابی قوی‌تر). ۳) مرگ رهبر → شکاف جانشینی → اصلاحات از درون (مدل گورباچف). مسیر سوم محتمل‌تر است.",
    conditions: {
      baseProbability: 0.08,
      triggers: {
        regimeChange: 85,
        economicStability: 15,
        domesticSupport: 20,
      },
    },
    outcome: {
      iranResult: "defeat",
      regionalImpact:
        "فروپاشی محور مقاومت. حزب‌الله، حوثی‌ها و شبه‌نظامیان عراقی بدون پشتوانه ایران ضعیف می‌شوند. اسرائیل به قدرت بلامنازع منطقه تبدیل می‌شود.",
      globalImpact:
        "افزایش تولید نفت ایران پس از ثبات. کاهش قیمت نفت. تقویت موقت موقعیت آمریکا. اما رادیکالیسم ضدآمریکایی در میان ایرانیان به‌شدت افزایش می‌یابد.",
      casualties: "هزاران تا ده‌ها هزار کشته در درگیری‌های داخلی.",
      timeline: "۱ تا ۳ سال گذار، دهه‌ها برای ثبات واقعی.",
    },
    icon: "🔄",
    color: "oklch(0.6 0.2 305)",
  },
  // 6. NUCLEAR WAR (5-8%)
  {
    id: "regional_nuclear_war",
    name: "جنگ هسته‌ای منطقه‌ای",
    nameEn: "Regional Nuclear War",
    category: "war",
    timeframe: "۶ ماه تا ۲ سال آینده",
    description:
      "تبادل ضربات هسته‌ای بین ایران و اسرائیل. فاجعه بزرگ.",
    longDescription:
      "تحقیقات: احتمال ۵-۸٪. مسیر: بحران → اشتباه محاسباتی → تبادل هسته‌ای محدود. در اوج بحران، یکی از طرفین - احتمالاً اسرائیل با ترس از بمب قریب‌الوقوع ایران - حمله پیش‌دگیرانه هسته‌ای می‌کند. ایران در پاسخ، بمب‌های خود (یا کلاهک‌های کثیف) را به تل‌آویو، حیفا و دیمونا شلیک می‌کند. تبادل ضربات هسته‌ای، دو کشور را ویران می‌کند. ابر قارچ هسته‌ای، خاورمیانه را زیر سایه می‌برد. ریزگرد رادیواکتیو، میلیون‌ها نفر را در معرض سرطان قرار می‌دهد. قیمت نفت جهانی به ۵۰۰ دلار می‌رسد. رکود بزرگ جهانی. منطقه شکننده‌تر از جنگ سرد است - فاصله‌ها کوتاه، زمان واکنش کم (۳-۵ دقیقه)، بدبینی بالا.",
    conditions: {
      baseProbability: 0.05,
      triggers: {
        warEscalation: 95,
        nuclearProgress: 80,
      },
    },
    outcome: {
      iranResult: "destruction",
      regionalImpact:
        "تهران، اصفهان، شیراز و تل‌آویو، حیفا و اورشلیم با بمب هسته‌ای هدف قرار می‌گیرند. ده‌ها میلیون کشته فوری. میلیون‌ها دیگر در سال‌های بعد به‌دلیل ریزگرد رادیواکتیو می‌میرند.",
      globalImpact:
        "زمستان هسته‌ای کوچک: کاهش دمای جهانی به مدت چند سال. رکود بزرگ اقتصادی. بحران پناهجویان بی‌سابقه. نظام بین‌الملل در شوک.",
      casualties: "۵ تا ۲۰ میلیون کشته مستقیم، ده‌ها میلیون غیرمستقیم.",
      timeline: "چند روز برای تبادل ضربات، دهه‌ها برای بازیابی.",
    },
    icon: "💀",
    color: "oklch(0.4 0.28 25)",
  },
  // 7. ISRAEL COLLAPSE (3-5%)
  {
    id: "israel_collapse",
    name: "تضعیف استراتژیک اسرائیل",
    nameEn: "Israel Strategic Weakening",
    category: "power_shift",
    timeframe: "۱۰ تا ۳۰ سال آینده",
    description:
      "فشار مستمر ایران، فروپاشی دموگرافیک و مهاجرت گسترده یهودیان، پایان پروژه صهیونیسم.",
    longDescription:
      "تحقیقات: احتمال ۳-۵٪ برای «فروپاشی»، اما «تضعیف استراتژیک» ۲۰-۲۵٪ محتمل‌تر است. عوامل: ۱) جنگ چندجبهه‌ای طولانی → فرسایش اقتصادی و دموگرافیک. ۲) خروج سرمایه و مغزها (۲ میلیون در یک دهه). ۳) فشار بین‌المللی پس از فجایع. موانع قوی: چتر هسته‌ای، پشتیبانی آمریکا، ارتش پیشرفته، انسجام اجتماعی. ارزیابی: «فروپاشی» بعید، اما «تضعیف استراتژیک» (کاهش توان بازدارندگی، خروج جمعیتی، انزوای بین‌المللی) ممکن است.",
    conditions: {
      baseProbability: 0.05,
      triggers: {
        regionalInfluence: 90,
        deterrence: 80,
        israelIsolation: 1.8,
      },
    },
    outcome: {
      iranResult: "victory",
      regionalImpact:
        "تغییر بنیادی معادلات خاورمیانه. تأسیس دولت فلسطینی. بازگشت پناهجویان. ایران به رهبر بلامنازع منطقه تبدیل می‌شود.",
      globalImpact:
        "بازترتیب کامل اتحادهای جهانی. ضربه سنگین به لابی‌های صهیونیستی در غرب. تغییر در سیاست خارجی آمریکا.",
      casualties: "صدها هزار کشته در طول دهه‌ها درگیری.",
      timeline: "۱۰ تا ۳۰ سال فرسایش تدریجی.",
    },
    icon: "🌅",
    color: "oklch(0.7 0.22 35)",
  },
  // 8. STRATEGIC DEFEAT (10-15%)
  {
    id: "iran_strategic_defeat",
    name: "شکست استراتژیک ایران",
    nameEn: "Iran's Strategic Defeat",
    category: "war",
    timeframe: "۱ تا ۳ سال آینده",
    description:
      "حمله نظامی هماهنگ آمریکا-اسرائیل برنامه هسته‌ای، توان موشکی و محور مقاومت را نابود می‌کند.",
    longDescription:
      "تحقیقات: احتمال ۱۰-۱۵٪. عملیات هماهنگ با ۵۰۰ جنگنده و ۱۰۰۰ موشک کروز، تمام تأسیسات هسته‌ای، سایت‌های موشکی، فرودگاه‌های نظامی و مراکز فرماندهی سپاه را نابود می‌کند. ایران تلاش می‌کند پاسخ دهد اما پدافند هوایی، موشک‌های بالستیک و شبکه فرماندهی خود را از دست داده. حزب‌الله در لبنان به‌شدت ضربه می‌خورد. حوثی‌ها متوقف می‌شوند. محور مقاومت فروپاشید. ایران در ضعیف‌ترین وضعیت خود از زمان جنگ ایران و عراق قرار می‌گیرد. اما حتی در این حالت، جمهوری اسلامی سرنگون نمی‌شود - تنها ضعیف می‌شود. نسل جدیدی از کینه و تمایل به انتقام شکل می‌گیرد.",
    conditions: {
      baseProbability: 0.09,
      triggers: {
        warEscalation: 95,
        militaryCapability: 20,
      },
    },
    outcome: {
      iranResult: "defeat",
      regionalImpact:
        "فروپاشی محور مقاومت. خروج نیروهای ایرانی از سوریه، عراق، لبنان. حزب‌الله خلع سلاح. حوثی‌ها متوقف. اسرائیل به قدرت بلامنازع تبدیل می‌شود.",
      globalImpact:
        "کاهش موقت قیمت نفت. تقویت موقت موقعیت آمریکا و اسرائیل. اما رادیکالیسم ضدآمریکایی در ایران به‌شدت افزایش می‌یابد. احتمال انتقام آینده.",
      casualties: "هزاران کشته نظامی، صدها غیرنظامی.",
      timeline: "۳ تا ۶ ماه عملیات فعال، دهه‌ها برای بازیابی.",
    },
    icon: "🏳️",
    color: "oklch(0.55 0.15 260)",
  },
];

export type GameState = {
  nuclearProgress: number;
  regionalInfluence: number;
  economicStability: number;
  domesticSupport: number;
  militaryCapability: number;
  deterrence: number;
  warEscalation: number;
  nuclearBreakoutMult: number;
  regimeChangeMult: number;
  negotiationChanceMult: number;
  usWithdrawalMult: number;
  israelIsolationMult: number;
  turn: number;
  maxTurns: number;
};

export function calculateEndingsProbability(state: GameState): Array<{ ending: Ending; probability: number }> {
  const results = endings.map((ending) => {
    let probability = ending.conditions.baseProbability;
    const triggers = ending.conditions.triggers || {};
    let multiplier = 1.0;

    const triggerEntries = Object.entries(triggers) as Array<[keyof typeof triggers, number]>;
    if (triggerEntries.length > 0) {
      let triggerScore = 0;
      let count = 0;
      for (const [key, value] of triggerEntries) {
        // Special handling for multipliers (usWithdrawal, israelIsolation)
        if (key === "usWithdrawal" || key === "israelIsolation") {
          const multValue = state[key as "usWithdrawalMult" | "israelIsolationMult"] ?? 1.0;
          const triggerMult = value;
          const closeness = Math.min(1, Math.max(0, multValue / Math.max(1, triggerMult)));
          triggerScore += closeness;
        } else {
          const stateValue = state[key as keyof GameState] ?? 0;
          const closeness = Math.min(1, Math.max(0, stateValue / Math.max(1, value)));
          triggerScore += closeness;
        }
        count++;
      }
      const avgCloseness = count > 0 ? triggerScore / count : 0;
      multiplier = 0.4 + avgCloseness * 2.1;
    }

    if (ending.category === "war") {
      multiplier *= 1 + (state.warEscalation - 40) / 100;
    }
    if (ending.category === "nuclear") {
      multiplier *= 1 + (state.nuclearProgress - 50) / 80;
      multiplier *= state.nuclearBreakoutMult;
    }
    if (ending.category === "peace") {
      multiplier *= state.negotiationChanceMult;
      multiplier *= 1 - (state.warEscalation - 30) / 150;
    }
    if (ending.category === "regime_change") {
      multiplier *= state.regimeChangeMult;
      multiplier *= 1 + (60 - state.economicStability) / 80;
    }
    if (ending.category === "power_shift") {
      multiplier *= 1 + (state.regionalInfluence - 50) / 100;
      multiplier *= 1 + (state.deterrence - 50) / 100;
      // usWithdrawal ending gets boost from usWithdrawalMult
      if (ending.id === "us_withdrawal") {
        multiplier *= state.usWithdrawalMult;
      }
      if (ending.id === "israel_collapse") {
        multiplier *= state.israelIsolationMult;
      }
    }

    probability *= multiplier;
    return {
      ending,
      probability: Math.max(0, Math.min(0.95, probability)),
    };
  });

  const total = results.reduce((sum, r) => sum + r.probability, 0);
  if (total > 0) {
    return results.map((r) => ({ ...r, probability: r.probability / total }));
  }
  return results;
}

export function determineEnding(state: GameState): { ending: Ending; probability: number; allProbabilities: Array<{ ending: Ending; probability: number }> } {
  const all = calculateEndingsProbability(state);
  const sorted = [...all].sort((a, b) => b.probability - a.probability);
  return {
    ending: sorted[0].ending,
    probability: sorted[0].probability,
    allProbabilities: sorted,
  };
}

// Endings data: multiple scenarios with probability calculations

export type Ending = {
  id: string;
  name: string;
  nameEn: string;
  category: "war" | "nuclear" | "peace" | "status_quo" | "regime_change";
  description: string;
  longDescription: string;
  conditions: {
    // Base probability (0-1) - will be modified by game state
    baseProbability: number;
    // State conditions for likelihood multiplier (0-100)
    triggers?: Partial<{
      nuclearProgress: number;
      usPressure: number;
      israelThreat: number;
      deterrence: number;
      domesticSupport: number;
      economicStability: number;
      regionalInfluence: number;
      militaryCapability: number;
      warEscalation: number; // Accumulated escalation
      negotiationChance: number;
      regimeChange: number;
    }>;
  };
  // Probability at given state - returns 0-1
  outcome: {
    iranResult: "victory" | "defeat" | "compromise" | "survival" | "destruction";
    regionalImpact: string;
    globalImpact: string;
    casualties: string;
    timeline: string;
  };
  icon: string;
  color: string;
};

export const endings: Ending[] = [
  {
    id: "nuclear_breakout",
    name: "بمب اتم در دستان ایران",
    nameEn: "Iranian Nuclear Breakout",
    category: "nuclear",
    description:
      "ایران به آستانه تسلیحاتی می‌رسد و اولین آزمایش هسته‌ای را انجام می‌دهد. ورود به باشگاه هسته‌ای.",
    longDescription:
      "بعد از سال‌ها تلاش، ایران اولین آزمایش هسته‌ای خود را در کویر مرکزی انجام می‌دهد. زمین لرزه مصنوعی ۴.۸ ریشتری ثبت می‌شود. آژانس بین‌المللی انرژی اتمی تأیید می‌کند. ایران رسماً به هشتمین کشور دارای سلاح هسته‌ای تبدیل می‌شود. منطقه وارد دوران بازدارندگی متقابل هسته‌ای می‌شود.",
    conditions: {
      baseProbability: 0.08,
      triggers: {
        nuclearProgress: 85,
        warEscalation: 30,
      },
    },
    outcome: {
      iranResult: "victory",
      regionalImpact:
        "آغاز مسابقه تسلیحاتی هسته‌ای در خاورمیانه. عربستان، ترکیه و مصر اعلام می‌کنند به دنبال برنامه هسته‌ای هستند.",
      globalImpact:
        "فروپاشی رژیم NPT. ضربه سهمگین به نظام غیرپراکنش. سازمان ملل در بحران.",
      casualties: "بدون تلفات مستقیم اما شروع دوران خطرناک‌تر.",
      timeline: "۳ تا ۱۲ ماه برای اولین آزمایش.",
    },
    icon: "☢️",
    color: "oklch(0.6 0.25 25)",
  },
  {
    id: "full_war",
    name: "جنگ تمام‌عیار منطقه‌ای",
    nameEn: "Full Regional War",
    category: "war",
    description:
      "جنگ گسترده ایران، آمریکا، اسرائیل و متحدان. بمباران شهری، حمله موشکی متقابل و درگیری نیروی دریایی.",
    longDescription:
      "۳ ماه پس از تشدید تنش، جنگ گسترده آغاز می‌شود. صدها موشک بالستیک روزانه به تل‌آویو و حیفا شلیک می‌شود. اسرائیل با ۲۰۰ جنگنده به تهران، اصفهان و شیراز حمله می‌کند. ناو آمریکایی در خلیج فارس غرق می‌شود. حزب‌الله لبنان و حوثی‌ها فعال می‌شوند. قیمه جهانی نفت به ۲۵۰ دلار می‌رسد. تلفات غیرنظامی به صدها هزار می‌رسد.",
    conditions: {
      baseProbability: 0.06,
      triggers: {
        warEscalation: 80,
        israelThreat: 75,
        usPressure: 75,
      },
    },
    outcome: {
      iranResult: "destruction",
      regionalImpact:
        "تخریب گسترده زیرساخت‌های ایران، لبنان، اسرائیل و عراق. بحران پناهجویان بزرگ.",
      globalImpact:
        "بازارهای جهانی فروپاشی. رکود بزرگ جهانی. بحران انرژی و غذای جهانی.",
      casualties: "۵۰۰ هزار تا ۲ میلیون کشته و زخمی در منطقه.",
      timeline: "۶ تا ۲۴ ماه جنگ فعال.",
    },
    icon: "💥",
    color: "oklch(0.6 0.28 25)",
  },
  {
    id: "negotiated_settlement",
    name: "توافق تاریخی جدید",
    nameEn: "New Historic Agreement",
    category: "peace",
    description:
      "بعد از بحران، توافق جامع هسته‌ای و منطقه‌ای امضا می‌شود. برجام ۲.",
    longDescription:
      "تحت فشار جامعه جهانی و پس از چندین روز جنگ محدود، طرفین به توافق می‌رسند. توافق «برجام پلاس»: محدودیت‌های سخت‌گیرانه هسته‌ای، نظارت بازرسی‌های پیشرفته، رفع تحریم‌ها، تأمین مالی پروژه‌های زیرساختی ایران، توافق عدم حمله متقابل. ثبات نسبی بازمی‌گردد اما بی‌اعتمادی عمیق باقی می‌ماند.",
    conditions: {
      baseProbability: 0.12,
      triggers: {
        negotiationChance: 75,
        nuclearProgress: 30,
        warEscalation: 25,
      },
    },
    outcome: {
      iranResult: "compromise",
      regionalImpact:
        "کاهش تنش در خاورمیانه. احیای روابط دیپلماتیک محدود. بهبود وضع اقتصادی ایران.",
      globalImpact:
        "کاهش قیمت نفت، بهبود اقتصاد جهانی. تقویت دیپلماسی چندجانبه.",
      casualties: "تلفات پیش از توافق محدود می‌ماند.",
      timeline: "۶ تا ۱۸ ماه مذاکره.",
    },
    icon: "🕊️",
    color: "oklch(0.65 0.18 165)",
  },
  {
    id: "status_quo",
    name: "جنگ سایه ادامه دارد",
    nameEn: "Shadow War Continues",
    category: "status_quo",
    description:
      "وضعیت موجود: درگیری زیر آستانه جنگ آشکار، حملات سایبری، ترور، خرابکاری.",
    longDescription:
      "هیچ طرف آماده خطر جنگ گسترده یا امتیاز دیپلماتیک نیست. وضعیت فعلی ادامه می‌یابد: حملات سایبری متقابل، ترورهای هدفمند، خرابکاری در تأسیسات، درگیری‌های نیابتی در لبنان، سوریه، یمن و عراق. هر چند ماه، یک حمله محدود مستقیم. اقتصاد ایران در تورم مزمن، اما سیستم پایدار است.",
    conditions: {
      baseProbability: 0.25,
      triggers: {
        warEscalation: 40,
        nuclearProgress: 50,
        negotiationChance: 30,
      },
    },
    outcome: {
      iranResult: "survival",
      regionalImpact:
        "ادامه بی‌ثباتی مزمن. چندین دهه جنگ سایه. تضعیف تدریجی محور مقاومت.",
      globalImpact:
        "قیمت نفت ۸۰-۱۰۰ دلار. عدم قطعیت دائمی در بازارها.",
      casualties: "صدها کشته در سال، عمدتاً نظامی و اطلاعاتی.",
      timeline: "ادامه نامحدود تا تغییر اساسی شرایط.",
    },
    icon: "🌫️",
    color: "oklch(0.6 0.1 260)",
  },
  {
    id: "regime_change",
    name: "تغییر رژیم در ایران",
    nameEn: "Regime Change in Iran",
    category: "regime_change",
    description:
      "فشار حداکثری غرب به فروپاشی اقتصادی و ناآرامی‌های داخلی منجر می‌شود.",
    longDescription:
      "تحریم‌های بی‌سابقه، تورم ۱۰۰ درصدی، بیکاری گسترده، نارضایتی عمیق و اختلاف در طبقه حاکمه، به اعتراضات سراسری و در نهایت تغییر رژیم ختم می‌شود. یک دولت انتقالی شکل می‌گیرد. روابط با غرب عادی می‌شود اما کشور وارد دوره بی‌ثباتی طولانی می‌شود. مخالفان درون و بیرون کشور بر سر قدرت می‌جنگند.",
    conditions: {
      baseProbability: 0.08,
      triggers: {
        regimeChange: 80,
        economicStability: 15,
        domesticSupport: 20,
        usPressure: 70,
      },
    },
    outcome: {
      iranResult: "defeat",
      regionalImpact:
        "تغییر معادلات منطقه. تضعیف حزب‌الله، حوثی‌ها و شبه‌نظامیان عراقی.",
      globalImpact:
        "افزایش تولید نفت ایران پس از ثبات. کاهش قیمت نفت.",
      casualties: "صدها تا هزاران کشته در درگیری‌های داخلی.",
      timeline: "۱ تا ۳ سال گذار.",
    },
    icon: "🔄",
    color: "oklch(0.6 0.2 305)",
  },
  {
    id: "limited_strikes",
    name: "حمله‌های محدود متقابل",
    nameEn: "Limited Strikes Exchange",
    category: "war",
    description:
      "چندین حمله محدود هوایی و موشکی بدون تبدیل شدن به جنگ تمام‌عیار.",
    longDescription:
      "هر چند ماه، یک حمله محدود رد و بدل می‌شود: اسرائیل یک سایت نظامی را بمباران می‌کند، ایران ۵۰ موشک به اسرائیل شلیک می‌کند. آمریکا در دفاع هوایی اسرائیل مشارکت می‌کند. طرفین به‌طور ضمنی «قواعد درگیری» را رعایت می‌کنند: شهرهای بزرگ هدف قرار نمی‌گیرند، تأسیسات هسته‌ای در حمله‌های معمول نیستند. این چرخه سال‌ها ادامه می‌یابد.",
    conditions: {
      baseProbability: 0.22,
      triggers: {
        warEscalation: 55,
        israelThreat: 60,
        nuclearProgress: 60,
      },
    },
    outcome: {
      iranResult: "survival",
      regionalImpact:
        "تخریب تدریجی زیرساخت‌ها. سرمایه‌فراری. فرار مغزها.",
      globalImpact:
        "قیمت نفت ۱۰۰-۱۲۰ دلار. عدم قطعیت در سرمایه‌گذاری منطقه.",
      casualties: "هزاران کشته در طول چند سال.",
      timeline: "چندین سال.",
    },
    icon: "⚡",
    color: "oklch(0.65 0.18 85)",
  },
  {
    id: "cold_war_stability",
    name: "جنگ سرد پایدار",
    nameEn: "Stable Cold War",
    category: "status_quo",
    description:
      "ایران به آستانه نزدیک بمب می‌رسد اما آن را نمی‌سازد. بازدارندگی متعادل شکل می‌گیرد.",
    longDescription:
      "ایران به آستانه تسلیحاتی (breakout capability) می‌رسد اما تصمیم می‌گیرد بمب نسازد. اسرائیل از حمله پیش‌دگیرانه صرف نظر می‌کند چون هزینه آن بیش از فایده است. یک تعادل بازدارندگی شبیه کره شمالی-آمریکا شکل می‌گیرد. هر دو طرف در حال آماده‌سازی هستند اما جنگی در کار نیست. تشنج مزمن اما قابل کنترل.",
    conditions: {
      baseProbability: 0.15,
      triggers: {
        nuclearProgress: 70,
        deterrence: 60,
        warEscalation: 30,
      },
    },
    outcome: {
      iranResult: "survival",
      regionalImpact:
        "تثبیت موقعیت منطقه‌ای ایران. ادامه رقابت با اسرائیل اما بدون جنگ.",
      globalImpact:
        "تنش‌های متناوب، تحریم‌های ادامه‌دار، اما بدون جنگ بزرگ.",
      casualties: "تلفات محدود به درگیری‌های نیابتی.",
      timeline: "یک دهه یا بیشتر.",
    },
    icon: "🧊",
    color: "oklch(0.6 0.15 250)",
  },
  {
    id: "strategic_defeat",
    name: "شکست استراتژیک ایران",
    nameEn: "Iran's Strategic Defeat",
    category: "war",
    description:
      "حمله نظامی هماهنگ آمریکا-اسرائیل برنامه هسته‌ای و توان موشکی را نابود می‌کند.",
    longDescription:
      "عملیات هماهنگ آمریکا-اسرائیل با ۳۰۰ جنگنده و ۵۰۰ موشک کروز، تمام تأسیسات هسته‌ای، سایت‌های موشکی، فرودگاه‌های نظامی و مراکز فرماندهی سپاه را نابود می‌کند. ایران تلاش می‌کند پاسخ دهد اما پدافند هوایی خود را از دست داده. حزب‌الله در لبنان به‌شدت ضربه می‌خورد. حوثی‌ها متوقف می‌شوند. ایران در ضعیف‌ترین وضعیت خود از زمان جنگ ایران و عراق قرار می‌گیرد.",
    conditions: {
      baseProbability: 0.05,
      triggers: {
        warEscalation: 90,
        israelThreat: 85,
        usPressure: 85,
        militaryCapability: 25,
      },
    },
    outcome: {
      iranResult: "defeat",
      regionalImpact:
        "فروپاشی محور مقاومت. خروج نیروهای ایرانی از سوریه، عراق، لبنان.",
      globalImpact:
        "کاهش موقت قیمت نفت. تقویت موقت موقعیت آمریکا و اسرائیل.",
      casualties: "هزاران کشته نظامی، صدها غیرنظامی.",
      timeline: "۳ تا ۶ ماه عملیات فعال.",
    },
    icon: "🏳️",
    color: "oklch(0.55 0.15 260)",
  },
];

export type GameState = {
  // Iran stats (0-100)
  nuclearProgress: number;
  regionalInfluence: number;
  economicStability: number;
  domesticSupport: number;
  militaryCapability: number;
  deterrence: number;
  // Enemy stats (0-100)
  usPressure: number;
  israelThreat: number;
  // Probability multipliers (accumulated)
  warEscalation: number; // 0-100 normalized
  nuclearBreakoutMult: number;
  regimeChangeMult: number;
  negotiationChanceMult: number;
  // Game progress
  turn: number;
  maxTurns: number;
};

// Calculate probability for each ending given a game state
export function calculateEndingsProbability(state: GameState): Array<{ ending: Ending; probability: number }> {
  const results = endings.map((ending) => {
    let probability = ending.conditions.baseProbability;

    const triggers = ending.conditions.triggers || {};
    let multiplier = 1.0;

    // Each trigger contributes a multiplier based on closeness
    const triggerEntries = Object.entries(triggers) as Array<[keyof typeof triggers, number]>;
    if (triggerEntries.length > 0) {
      let triggerScore = 0;
      for (const [key, value] of triggerEntries) {
        const stateValue = state[key] ?? 0;
        // If state matches or exceeds trigger, full boost. Closer = partial boost.
        const closeness = Math.min(1, Math.max(0, stateValue / Math.max(1, value)));
        triggerScore += closeness;
      }
      // Average closeness scales 0.5x to 2.5x
      const avgCloseness = triggerScore / triggerEntries.length;
      multiplier = 0.4 + avgCloseness * 2.1;
    }

    // Apply special modifiers based on category
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

    probability *= multiplier;

    return {
      ending,
      probability: Math.max(0, Math.min(0.95, probability)),
    };
  });

  // Normalize so all probabilities sum to 1.0
  const total = results.reduce((sum, r) => sum + r.probability, 0);
  if (total > 0) {
    return results.map((r) => ({ ...r, probability: r.probability / total }));
  }
  return results;
}

// Determine the dominant ending at end of game
export function determineEnding(state: GameState): { ending: Ending; probability: number; allProbabilities: Array<{ ending: Ending; probability: number }> } {
  const all = calculateEndingsProbability(state);
  const sorted = [...all].sort((a, b) => b.probability - a.probability);
  return {
    ending: sorted[0].ending,
    probability: sorted[0].probability,
    allProbabilities: sorted,
  };
}

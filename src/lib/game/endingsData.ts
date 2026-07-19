// Endings data: 6 FINAL future-looking scenarios
// All endings look years/decades ahead - no "current state" endings.

export type Ending = {
  id: string;
  name: string;
  nameEn: string;
  category: "nuclear" | "war" | "peace" | "regime_change" | "power_shift";
  timeframe: string; // when this ending materializes
  description: string;
  longDescription: string;
  conditions: {
    baseProbability: number;
    triggers?: Partial<{
      nuclearProgress: number;
      usPressure: number;
      israelThreat: number;
      deterrence: number;
      domesticSupport: number;
      economicStability: number;
      regionalInfluence: number;
      militaryCapability: number;
      warEscalation: number;
      negotiationChance: number;
      regimeChange: number;
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
  {
    id: "iran_nuclear_power",
    name: "ظهور بمب اتم ایران",
    nameEn: "Iranian Nuclear Power Emerges",
    category: "nuclear",
    timeframe: "۳ تا ۱۰ سال آینده",
    description:
      "ایران پس از خروج از NPT، اولین آزمایش هسته‌ای را انجام می‌دهد و به هشتمین قدرت هسته‌ای جهان تبدیل می‌شود. بازدارندگی دائمی برقرار می‌شود.",
    longDescription:
      "ایران پس از چندین سال تلاش مخفی، اولین آزمایش هسته‌ای خود را در کویر مرکزی انجام می‌دهد. زمین‌لرزه مصنوعی ۴.۸ ریشتری ثبت می‌شود و آژانس بین‌المللی انرژی اتمی تأیید می‌کند. ایران رسماً به هشتمین کشور دارای سلاح هسته‌ای تبدیل می‌شود (پس از آمریکا، روسیه، چین، فرانسه، بریتانیا، هند، پاکستان). منطقه وارد دوران بازدارندگی متقابل هسته‌ای می‌شود - شبیه هند-پاکستان در دهه ۹۰. حمله نظامی آمریکا یا اسرائیل به ایران، پس از این نقطه، عملاً غیرممکن می‌شود. اسرائیل دیگر انحصار هسته‌ای منطقه را ندارد.",
    conditions: {
      baseProbability: 0.18,
      triggers: {
        nuclearProgress: 80,
        deterrence: 60,
      },
    },
    outcome: {
      iranResult: "victory",
      regionalImpact:
        "آغاز مسابقه تسلیحاتی هسته‌ای در خاورمیانه. عربستان، ترکیه و مصر اعلام می‌کنند به دنبال برنامه هسته‌ای هستند. محور مقاومت قدرتمندتر می‌شود. اسرائیل مجبور به بازنگری استراتژی می‌شود.",
      globalImpact:
        "فروپاشی رژیم NPT. ضربه سهمگین به نظام غیرپراکنش. سازمان ملل در بحران. روسیه و چین به‌طور پنهانی از ایران حمایت می‌کنند تا对美国 weakening.",
      casualties: "بدون تلفات مستقیم اما شروع دوران خطرناک‌تر.",
      timeline: "۳ تا ۱۰ سال برای اولین آزمایش، دهه‌ها برای تثبیت.",
    },
    icon: "☢️",
    color: "oklch(0.6 0.25 25)",
  },
  {
    id: "regional_nuclear_war",
    name: "جنگ هسته‌ای منطقه‌ای",
    nameEn: "Regional Nuclear War",
    category: "war",
    timeframe: "۶ ماه تا ۲ سال آینده",
    description:
      "تبادل ضربات هسته‌ای بین ایران و اسرائیل. قربانی میلیون‌ها غیرنظامی و پیامدهای جهانی.",
    longDescription:
      "در اوج بحران، یکی از طرفین - احتمالاً اسرائیل با ترس از بمب قریب‌الوقوع ایران - حمله پیش‌دگیرانه هسته‌ای به تأسیسات هسته‌ای ایران انجام می‌دهد. ایران در پاسخ، بمب‌های خود (یا کلاهک‌های کثیف) را به تل‌آویو، حیفا و دیمونا شلیک می‌کند. تبادل ضربات هسته‌ای، دو کشور را ویران می‌کند. ابر قارچ هسته‌ای، خاورمیانه را زیر سایه می‌برد. ریزگرد رادیواکتیو، میلیون‌ها نفر را در معرض سرطان قرار می‌دهد. قیمت نفت جهانی به ۵۰۰ دلار می‌رسد. رکود بزرگ جهانی آغاز می‌شود. این، یکی از تاریک‌ترین سناریوهای قرن ۲۱ است.",
    conditions: {
      baseProbability: 0.07,
      triggers: {
        warEscalation: 90,
        nuclearProgress: 75,
        israelThreat: 85,
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
  {
    id: "regime_change_iran",
    name: "تغییر رژیم در ایران",
    nameEn: "Regime Change in Iran",
    category: "regime_change",
    timeframe: "۲ تا ۵ سال آینده",
    description:
      "فشار حداکثری غرب، ناآرامی‌های داخلی و اختلاف در طبقه حاکمه به فروپاشی رژیم می‌رسد.",
    longDescription:
      "تحریم‌های بی‌سابقه، تورم ۱۰۰ درصدی، بیکاری گسترده، نارضایتی عمیق پس از جنگ و اختلاف در طبقه حاکمه، به اعتراضات سراسری و در نهایت تغییر رژیم ختم می‌شود. یک دولت انتقالی شکل می‌گیرد که به غرب امتیازات بزرگ می‌دهد: توقف برنامه موشکی، پایان محور مقاومت، توقف غنی‌سازی. روابط با غرب عادی می‌شود اما کشور وارد دوره بی‌ثباتی طولانی می‌شود. مخالفان درون و بیرون کشور بر سر قدرت می‌جنگند. ایران ضعیف‌ترین وضعیت خود از صد سال پیش را تجربه می‌کند.",
    conditions: {
      baseProbability: 0.12,
      triggers: {
        regimeChange: 85,
        economicStability: 15,
        domesticSupport: 20,
        usPressure: 75,
      },
    },
    outcome: {
      iranResult: "defeat",
      regionalImpact:
        "فروپاشی محور مقاومت. حزب‌الله، حوثی‌ها و شبه‌نظامیان عراقی بدون پشتوانه ایران ضعیف می‌شوند. اسرائیل به قدرت بلامنازع منطقه تبدیل می‌شود. عربستان موقعیت خود را تقویت می‌کند.",
      globalImpact:
        "افزایش تولید نفت ایران پس از ثبات. کاهش قیمت نفت. تقویت موقت موقعیت آمریکا در خاورمیانه. اما رادیکالیسم ضدآمریکایی در میان ایرانیان به‌شدت افزایش می‌یابد.",
      casualties: "هزاران تا ده‌ها هزار کشته در درگیری‌های داخلی.",
      timeline: "۱ تا ۳ سال گذار، دهه‌ها برای ثبات واقعی.",
    },
    icon: "🔄",
    color: "oklch(0.6 0.2 305)",
  },
  {
    id: "us_withdrawal",
    name: "خروج آمریکا از خاورمیانه",
    nameEn: "US Withdrawal from Middle East",
    category: "power_shift",
    timeframe: "۵ تا ۱۵ سال آینده",
    description:
      "آمریکا پس از دهه‌ها جنگ پرهزینه، تصمیم می‌گیرد از خاورمیانه خارج شود و ایران به قدرت هژمون منطقه تبدیل می‌شود.",
    longDescription:
      "آمریکا، پس از جنگ‌های پرهزینه افغانستان، عراق و درگیری‌های مستقیم با ایران، نهایتاً تصمیم استراتژیک می‌گیرد از خاورمیانه خارج شود. تعطیلی پایگاه‌ها در عراق، سوریه، قطر، امارات و بحرین. کاهش وابستگی به نفت خلیج فارس (با انقلاب شیل). تمرکز بر مهار چین در شرق آسیا. ایران، با خلأ قدرت ایجاد شده، به هژمون قطعی خاورمیانه تبدیل می‌شود. محور مقاومت گسترش می‌یابد. اسرائیل مجبور می‌شود به یک توافق تاریخی با ایران برسد - زیرا دیگر نمی‌تواند به حمایت نظامی آمریکا تکیه کند.",
    conditions: {
      baseProbability: 0.15,
      triggers: {
        deterrence: 70,
        regionalInfluence: 75,
        warEscalation: 30,
      },
    },
    outcome: {
      iranResult: "victory",
      regionalImpact:
        "ایران به قدرت هژمون خاورمیانه تبدیل می‌شود. گسترش محور مقاومت به کل منطقه. عربستان، امارات و دیگر کشورها مجبور به سازگاری می‌شوند. اسرائیل در انزوای استراتژیک.",
      globalImpact:
        "انتقال قطب قدرت جهانی. چین و روسیه از خلأ آمریکا بهره می‌برند. اقتصاد جهانی به چندقطبی تبدیل می‌شود. کاهش وابستگی به دلار.",
      casualties: "تلفات محدود به درگیری‌های نیابتی باقیمانده.",
      timeline: "۵ تا ۱۵ سال برای تکمیل خروج.",
    },
    icon: "🚪",
    color: "oklch(0.6 0.18 165)",
  },
  {
    id: "historic_peace",
    name: "توافق تاریخی و صلح پایدار",
    nameEn: "Historic Peace Agreement",
    category: "peace",
    timeframe: "۲ تا ۵ سال آینده",
    description:
      "بعد از بحران، توافق جامع با تضمین واقعی رفع تحریم‌ها و احراز بازدارندگی متقابل برقرار می‌شود.",
    longDescription:
      "تحت فشار شدید جامعه جهانی و پس از چندین جنگ محدود، طرفین به توافق می‌رسند. این بار برخلاف برجام، تضمین‌های واقعی وجود دارد: تصویب در کنگره آمریکا با ضمانت اجرایی، آزادسازی واقعی سیستم بانکی، پایان تحریم‌های ثانویه، توافق عدم حمله متقابل با نظارت بین‌المللی. ایران محدودیت‌های داوطلبانه در برنامه هسته‌ای می‌پذیرد اما غنی‌سازی را حفظ می‌کند. توافق امنیتی با اسرائیل از طریق میانجی روسیه و چین. ثبات نسبی بازمی‌گردد اما بی‌اعتمادی عمیق باقی می‌ماند. اقتصاد ایران احیا می‌شود.",
    conditions: {
      baseProbability: 0.18,
      triggers: {
        negotiationChance: 75,
        nuclearProgress: 50,
        warEscalation: 40,
      },
    },
    outcome: {
      iranResult: "compromise",
      regionalImpact:
        "کاهش تنش در خاورمیانه. احیای روابط دیپلماتیک محدود. بهبود وضع اقتصادی ایران. کاهش شدت درگیری‌های نیابتی. اما اسرائیل همچنان نگران است.",
      globalImpact:
        "کاهش قیمت نفت، بهبود اقتصاد جهانی. تقویت دیپلماسی چندجانبه. احیای نقش سازمان ملل. الگویی برای حل بحران‌های دیگر.",
      casualties: "تلفات پیش از توافق محدود می‌ماند.",
      timeline: "۲ تا ۵ سال مذاکره، دهه‌ها برای اعتمادسازی.",
    },
    icon: "🕊️",
    color: "oklch(0.65 0.18 165)",
  },
  {
    id: "iran_strategic_defeat",
    name: "شکست استراتژیک ایران",
    nameEn: "Iran's Strategic Defeat",
    category: "war",
    timeframe: "۱ تا ۳ سال آینده",
    description:
      "حمله نظامی هماهنگ آمریکا-اسرائیل برنامه هسته‌ای، توان موشکی و محور مقاومت را نابود می‌کند.",
    longDescription:
      "عملیات هماهنگ آمریکا-اسرائیل با ۵۰۰ جنگنده و ۱۰۰۰ موشک کروز، تمام تأسیسات هسته‌ای، سایت‌های موشکی، فرودگاه‌های نظامی و مراکز فرماندهی سپاه را نابود می‌کند. حمله ویژه به فرماندهان ارشد. ایران تلاش می‌کند پاسخ دهد اما پدافند هوایی، موشک‌های بالستیک و شبکه فرماندهی خود را از دست داده. حزب‌الله در لبنان به‌شدت ضربه می‌خورد. حوثی‌ها متوقف می‌شوند. محور مقاومت فروپاشید. ایران در ضعیف‌ترین وضعیت خود از زمان جنگ ایران و عراق قرار می‌گیرد. اما حتی در این حالت، جمهوری اسلامی سرنگون نمی‌شود - تنها ضعیف می‌شود. نسل جدیدی از کینه و تمایل به انتقام شکل می‌گیرد.",
    conditions: {
      baseProbability: 0.10,
      triggers: {
        warEscalation: 95,
        israelThreat: 90,
        usPressure: 90,
        militaryCapability: 25,
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
  {
    id: "israel_collapse",
    name: "فروپاشی اسرائیل",
    nameEn: "Israel's Collapse",
    category: "power_shift",
    timeframe: "۱۰ تا ۳۰ سال آینده",
    description:
      "فشار مستمر ایران، فروپاشی دموگرافیک و مهاجرت گسترده یهودیان، پایان پروژه صهیونیسم را رقم می‌زند.",
    longDescription:
      "طی دهه‌ها فشار مستمر نظامی، اقتصادی و روانی از سوی ایران و محور مقاومت، اسرائیل به‌تدریج فروپاشید. مهاجرت گسترده یهودیان به آمریکا و اروپا (تخمین ۲ میلیون نفر در یک دهه). ناکارآمدی پدافند در برابر موشک‌های مستمر. فرسایش اقتصاد. اختلافات داخلی شدید. در نهایت، یک دولت واحد دموکراتیک در کل فلسطین تاریخی شکل می‌گیرد (یا دو دولت با مرزهای ۱۹۶۷ با حق بازگشت پناهجویان). این، پیروزی نهایی محور مقاومت است - اگرچه دهه‌ها طول می‌کشد.",
    conditions: {
      baseProbability: 0.08,
      triggers: {
        regionalInfluence: 90,
        deterrence: 80,
        israelThreat: 30,
        warEscalation: 50,
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
  {
    id: "decade_war",
    name: "جنگ فرسایشی ده‌ساله",
    nameEn: "Decade-Long War of Attrition",
    category: "war",
    timeframe: "۱۰ تا ۲۰ سال آینده",
    description:
      "هیچ طرف پیروز نمی‌شود. جنگ سایه‌ای و حمله‌های محدود چند دهه ادامه می‌یابد و هر دو طرف را فرسایش می‌دهد.",
    longDescription:
      "هیچ طرف آماده خطر جنگ گسترده یا امتیاز دیپلماتیک نیست. وضعیت جنگ سایه‌ای ادامه می‌یابد: حملات سایبری متقابل، ترورهای هدفمند، خرابکاری، درگیری‌های نیابتی. هر چند ماه، یک حمله محدود مستقیم. اقتصاد ایران در تورم مزمن، اما سیستم پایدار است. اسرائیل در آمادگی دائمی پدافندی، با مهاجرت تدریجی جمعیت. هر دو طرف خسته می‌شوند اما هیچ‌کس تسلیم نمی‌شود. این حالت، شبیه جنگ کره (۱۹۵۳-تاکنون) یا کشمیر (۱۹۴۷-تاکنون) می‌شود - یک جنگ پایان‌نیافته که دهه‌ها ادامه می‌یابد و نسل‌ها را فرسایش می‌دهد.",
    conditions: {
      baseProbability: 0.12,
      triggers: {
        warEscalation: 60,
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
];

export type GameState = {
  nuclearProgress: number;
  regionalInfluence: number;
  economicStability: number;
  domesticSupport: number;
  militaryCapability: number;
  deterrence: number;
  usPressure: number;
  israelThreat: number;
  warEscalation: number;
  nuclearBreakoutMult: number;
  regimeChangeMult: number;
  negotiationChanceMult: number;
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
      for (const [key, value] of triggerEntries) {
        const stateValue = state[key] ?? 0;
        const closeness = Math.min(1, Math.max(0, stateValue / Math.max(1, value)));
        triggerScore += closeness;
      }
      const avgCloseness = triggerScore / triggerEntries.length;
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

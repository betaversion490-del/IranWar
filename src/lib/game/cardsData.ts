// Game cards data v2.0 - Comprehensive set
// Based on extensive research of real-world scenarios, deterrence theory,
// and documented response patterns from US/Israel/NATO/Arab states.

export type CardCategory =
  | "nuclear"
  | "military"
  | "proxy"
  | "diplomatic"
  | "economic"
  | "cyber"
  | "intelligence"
  | "domestic"
  | "asymmetric"
  | "extreme"
  | "alliance"; // ائتلاف با قدرت‌های دیگر

export type CardActor = "iran" | "us" | "israel" | "arab" | "nato" | "nk" | "russia" | "china";

export type CardEffects = {
  nuclearProgress?: number;
  regionalInfluence?: number;
  economicStability?: number;
  domesticSupport?: number;
  militaryCapability?: number;
  deterrence?: number;
  // Researched scenario multipliers
  warEscalation?: number;
  nuclearBreakout?: number;
  regimeChange?: number;
  negotiationChance?: number;
  usWithdrawal?: number; // شانس خروج آمریکا از خاورمیانه
  israelIsolation?: number; // شانس انزوای اسرائیل
};

export type CardSources = {
  iranian?: string[];   // منابع رسمی ایرانی
  western?: string[];   // منابع غربی (CSIS, RAND, ISIS, CFR...)
  international?: string[]; // IAEA, UN, IMF, SIPRI...
  academic?: string[];  // مقالات آکادمیک
};

export type RealData = {
  // Nuclear
  currentEnrichment?: string;       // درصد غنی‌سازی فعلی
  breakoutTime?: string;            // زمان لازم برای ساخت بمب
  centrifugesActive?: string;       // تعداد سانتریفیوژ فعال
  stockpile?: string;               // ذخیره اورانیوم
  // Military
  missileInventory?: string;        // موجودی موشک
  missileRange?: string;            // برد موشک
  droneInventory?: string;          // پهپاد
  troopsActive?: string;            // نیروی فعال
  // Economic
  oilExports?: string;              // صادرات نفت (bpd)
  forexReserves?: string;           // ذخایر ارزی
  gdp?: string;
  sanctions?: string;               // تعداد/نوع تحریم‌ها
  // Diplomatic
  alliesStrength?: string;          // قدرت متحدان
  proxyNetwork?: string;            // شبکه نیابتی
  // Other
  realProbability?: string;         // احتمال وقوع در دنیای واقعی
  historicalParallel?: string;      // الگوی تاریخی مشابه
  lastUpdate?: string;              // آخرین بروزرسانی داده
};

export type GameCard = {
  id: string;
  name: string;
  nameEn: string;
  category: CardCategory;
  actor: CardActor;
  actorLabel: string;
  description: string;
  longDescription: string;
  effects: CardEffects;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "apocalyptic";
  used: boolean;
  usedContext?: string;
  aiWeight?: number;
  counters?: string[];              // IDs of cards this one counters
  counteredBy?: string[];           // IDs of cards that counter this one
  requiresHighWarEscalation?: boolean;
  requiresNuclearProgress?: number;
  relatedHistoryEra?: string;
  // Preparation time in seconds (real-time). 0 = instant
  prepTime?: number;
  // Historical reference for card detail
  historicalRef?: string;
  // Related past cards (IDs from history)
  relatedPastCards?: string[];
  // === NEW Phase 1.1: Elixir cost ===
  cost?: number;                    // 2 (light) | 4 (medium) | 6 (heavy) | 8 (super-heavy)
  // === NEW Phase 1.4: Combo tags ===
  comboTags?: string[];             // "axis_of_resistance" | "nuclear_deterrence" | "asymmetric_full" | ...
  // === NEW Phase 2.1: Real sources ===
  sources?: CardSources;
  // === NEW Phase 2.2: Real data ===
  realData?: RealData;
  // === NEW Phase 4.1: Tech tree prerequisites ===
  prerequisites?: string[];         // Card IDs that must be played first
  // === NEW Phase 4.3: Hidden mechanics ===
  detectionRisk?: number;           // 0-100 chance of being detected by enemy before activation
  // Image URL for visual (Phase 3)
  imageRef?: string;                // emoji-based or asset path
};

// ============================================================
// IRAN CARDS - 20 cards (player)
// ============================================================
export const iranCards: GameCard[] = [
  // === Nuclear ===
  {
    id: "iran_nuclear_breakout",
    name: "ساخت بمب اتم",
    nameEn: "Build Nuclear Bomb",
    category: "nuclear",
    actor: "iran",
    actorLabel: "🇮🇷 ایران",
    description: "خروج از NPT، غنی‌سازی ۹۰٪، ساخت و آزمایش اولین بمب اتم ایران.",
    longDescription:
      "تصمیم نهایی: خروج از پیمان منع گسترش سلاح‌های هسته‌ای (NPT)، غنی‌سازی اورانیوم به ۹۰٪، ساخت و آزمایش بمب اتم. تحقیقات نشان می‌دهد: اگر ایران این مرحله را با موفقیت طی کند، بازدارندگی ایجاد می‌کند (مثل کره شمالی). اما پنجره بحرانی ۱۸-۳۶ ماه اول خطرناک است - احتمال حمله پیش‌دگیرانه اسرائیل ۵۰-۶۵٪. پس از عبور از این پنجره، آمریکا به مدل «containment» (پذیرش) روی می‌آورد. تحلیلگران: احتمال موفقیت ۶۰-۷۰٪.",
    effects: {
      nuclearProgress: 35,
      deterrence: 30,
      economicStability: -25,
      domesticSupport: 15,
      warEscalation: 1.5,
      nuclearBreakout: 1.8,
      negotiationChance: 0.6,
    },
    icon: "☢️",
    rarity: "apocalyptic",
    used: false,
    relatedHistoryEra: "axis",
  },
  {
    id: "iran_npt_withdraw",
    name: "خروج کامل از NPT",
    nameEn: "Full NPT Withdrawal",
    category: "nuclear",
    actor: "iran",
    actorLabel: "🇮🇷 ایران",
    description: "خروج رسمی از پیمان منع گسترش سلاح‌های هسته‌ای.",
    longDescription:
      "اقدام نمادین و حقوقی بحرانی: خروج از NPT. این اقدام اعلام غیررسمی ورود به باشگاه هسته‌ای است. کره شمالی (۲۰۰۳) و اسرائیل تنها کشورهای خارج از این پیمان هستند. پاسخ آمریکا و اسرائیل احتمالاً تشدید تحریم‌ها و افزایش آماده‌سازی حمله پیش‌دگیرانه است.",
    effects: {
      nuclearProgress: 15,
      deterrence: 10,
      economicStability: -10,
      domesticSupport: 12,
      warEscalation: 1.25,
      nuclearBreakout: 1.3,
      negotiationChance: 0.7,
    },
    icon: "📜",
    rarity: "epic",
    used: false,
    relatedHistoryEra: "axis",
  },
  {
    id: "iran_nk_nuclear_deal",
    name: "دریافت کلاهک از کره شمالی",
    nameEn: "North Korean Warhead Deal",
    category: "alliance",
    actor: "iran",
    actorLabel: "🇮🇷 ایران + 🇰🇵 کره شمالی",
    description: "دریافت کلاهک هسته‌ای آماده یا طراحی فنی از کره شمالی.",
    longDescription:
      "توافق مخفی با کره شمالی برای دریافت کلاهک هسته‌ای آماده یا طراحی فنی (blueprint). تحقیقات نشان می‌دهد: احتمال انتقال کلاهک کامل ۵-۱۰٪، اما انتقال طراحی فنی ۲۰-۳۰٪. آمریکا بلافاصله از ماهواره‌ها متوجه می‌شود. پاسخ: تحریم‌های بی‌سابقه علیه هر دو کشور، احتمال توقیف کشتی‌ها، خطر حمله پیش‌دگیرانه افزایش می‌یابد. با این حال، اگر موفق شود، زمان رسیدن به بمب از سال‌ها به ماه‌ها کاهش می‌یابد.",
    effects: {
      nuclearProgress: 25,
      deterrence: 18,
      economicStability: -18,
      domesticSupport: 8,
      warEscalation: 1.4,
      nuclearBreakout: 1.5,
      negotiationChance: 0.5,
    },
    icon: "🤝",
    rarity: "apocalyptic",
    used: false,
    relatedHistoryEra: "axis",
  },
  // === Military ===
  {
    id: "iran_missile_strike",
    name: "حمله موشکی به اسرائیل",
    nameEn: "Ballistic Missile Strike",
    category: "military",
    actor: "iran",
    actorLabel: "🇮🇷 ایران",
    description: "شلیک صدها موشک بالستیک به تل‌آویو و سایت‌های نظامی.",
    longDescription:
      "شلیک ۳۰۰+ موشک بالستیک از جمله هایپرسونیک فتاح-۱ به سمت اسرائیل. این کارت سه بار در وعده صادق ۱ (۱۴۰۳)، وعده صادق ۲ (۱۴۰۳) و حمله بزرگ اسفند ۱۴۰۳ استفاده شد. پاسخ قطعی: پشتیبانی پدافندی آمریکا/بریتانیا/فرانسه (۹۰-۹۵٪)، حمله متقابل اسرائیل به سایت‌های شلیک (۸۵-۹۰٪)، هدف‌گیری فرماندهان سپاه (۷۰-۷۵٪).",
    effects: {
      deterrence: 18,
      militaryCapability: -8,
      domesticSupport: 15,
      economicStability: -6,
      warEscalation: 1.3,
      negotiationChance: 0.85,
    },
    icon: "🚀",
    rarity: "epic",
    used: true,
    usedContext: "۳ بار: وعده صادق ۱ و ۲ و حمله اسفند ۱۴۰۳",
    relatedHistoryEra: "direct_war",
  },
  {
    id: "iran_ground_invasion",
    name: "حمله زمینی به اسرائیل",
    nameEn: "Ground Invasion of Israel",
    category: "extreme",
    actor: "iran",
    actorLabel: "🇮🇷 ایران",
    description: "اعزام سپاه و بسیج برای حمله زمینی از لبنان و سوریه.",
    longDescription:
      "اعزام ده‌ها هزار نیروی سپاه و بسیج به لبنان و سوریه برای حمله زمینی به اسرائیل. این کارت هرگز استفاده نشده. نیازمند هماهنگی کامل محور مقاومت و پشتیبانی لجستیکی روسیه. در صورت استفاده، پاسخ اسرائیل احتمالاً شامل حمله هسته‌ای تاکتیکی خواهد بود. خطر فروپاشی کامل ارتش ایران.",
    effects: {
      militaryCapability: -30,
      deterrence: 12,
      domesticSupport: 25,
      economicStability: -18,
      warEscalation: 1.6,
      negotiationChance: 0.4,
    },
    icon: "⚔️",
    rarity: "apocalyptic",
    used: false,
    relatedHistoryEra: "direct_war",
  },
  {
    id: "iran_icbm",
    name: "ساخت موشک قاره‌پیما",
    nameEn: "ICBM Development",
    category: "extreme",
    actor: "iran",
    actorLabel: "🇮🇷 ایران",
    description: "ساخت موشک قاره‌پیما (برد ۱۰۰۰۰+ کیلومتر) برای تهدید خاک آمریکا.",
    longDescription:
      "ایران در حال توسعه موشک قاره‌پیما است. این کارت، تهدید مستقیم خاک اصلی آمریکا را شبیه‌سازی می‌کند. کره شمالی ۱۱ سال طول کشید تا به این مرحله برسد. در صورت موفقیت، بازدارندگی جهانی ایجاد می‌کند (نه فقط منطقه‌ای). اما در طول مسیر، خطر حمله پیش‌دگیرانه بسیار بالاست.",
    effects: {
      deterrence: 30,
      militaryCapability: -10,
      domesticSupport: 20,
      economicStability: -20,
      warEscalation: 1.5,
      negotiationChance: 0.5,
      usWithdrawal: 1.2,
    },
    icon: "🌍",
    rarity: "apocalyptic",
    used: false,
    relatedHistoryEra: "direct_war",
  },
  {
    id: "iran_strike_us_bases",
    name: "حمله به پایگاه‌های آمریکا",
    nameEn: "Strike US Bases",
    category: "military",
    actor: "iran",
    actorLabel: "🇮🇷 ایران",
    description: "حمله موشکی به پایگاه‌های آمریکا در قطر، بحرین، امارات.",
    longDescription:
      "حمله موشک بالستیک به پایگاه‌های آمریکایی در منطقه: العیید (قطر)، ناو پنجم (بحرین)، الظفرہ (امارات). پاسخ قطعی آمریکا (۸۰-۹۰٪): حمله مستقیم به سایت‌های شلیک در ایران. اعزام ناو هواپیمابر (۹۰٪). هدف‌گیری مستقیم فرماندهان سپاه (۶۰-۷۰٪). این کارت در حمله به عین‌الاسد (۱۳۹۸) استفاده شد.",
    effects: {
      deterrence: 15,
      militaryCapability: -8,
      domesticSupport: 20,
      economicStability: -12,
      warEscalation: 1.35,
      negotiationChance: 0.7,
    },
    icon: "🎯",
    rarity: "legendary",
    used: true,
    usedContext: "حمله به عین‌الاسد ۱۳۹۸",
    relatedHistoryEra: "soleimani",
  },
  // === Proxy ===
  {
    id: "iran_hezbollah_full",
    name: "فعال‌سازی کامل حزب‌الله",
    nameEn: "Full Hezbollah Activation",
    category: "proxy",
    actor: "iran",
    actorLabel: "🇮🇷 ایران",
    description: "شلیک روزانه هزاران موشک از لبنان به کل اسرائیل.",
    longDescription:
      "دستور به حزب‌الله لبنان برای باز کردن کامل جبهه شمالی. ۱۵۰ هزار موشک کاتیوشا، فجر، فاتح و برکان. پاسخ قطعی: جنگ تمام‌عیار اسرائیل با حزب‌الله در لبنان (۸۰-۸۵٪)، ترور رهبران حزب‌الله (۸۰-۸۵٪)، لجستیک تسلیحاتی فوری آمریکا به اسرائیل (۸۵-۹۰٪).",
    effects: {
      regionalInfluence: 14,
      militaryCapability: 8,
      deterrence: 12,
      economicStability: -5,
      warEscalation: 1.2,
      negotiationChance: 0.9,
    },
    icon: "🇱🇧",
    rarity: "epic",
    used: false,
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "iran_houthi",
    name: "فعال‌سازی حوثی‌ها",
    nameEn: "Houthi Activation",
    category: "proxy",
    actor: "iran",
    actorLabel: "🇮🇷 ایران",
    description: "حمله حوثی‌ها به کشتیرانی دریای سرخ و باب‌المندب.",
    longDescription:
      "دستور به حوثی‌های یمن برای تشدید حملات به کشتی‌های مرتبط با اسرائیل و غرب. پاسخ قطعی: عملیات Prosperity Guardian آمریکا (۸۰-۸۵٪)، حمله هوایی به سایت‌های حوثی (۷۰-۷۵٪)، فشار بر عمان برای میانجی‌گری (۶۰-۷۰٪).",
    effects: {
      regionalInfluence: 8,
      deterrence: 6,
      militaryCapability: 3,
      economicStability: -2,
      warEscalation: 1.08,
      negotiationChance: 1.0,
    },
    icon: "🚢",
    rarity: "rare",
    used: true,
    usedContext: "از ۱۴۰۲ به‌طور مداوم، اوج در اسفند ۱۴۰۳",
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "iran_iraq_militias",
    name: "فعال‌سازی شبه‌نظامیان عراق",
    nameEn: "Iraqi Militias Activation",
    category: "proxy",
    actor: "iran",
    actorLabel: "🇮🇷 ایران",
    description: "حمله شبه‌نظامیان عراقی به پایگاه‌های آمریکا در عراق و سوریه.",
    longDescription:
      "دستور به کتائب‌الله، حشد الشعبی و другие گروه‌های عراقی برای حمله به پایگاه‌های آمریکایی. پاسخ آمریکا: حمله به سایت‌های شبه‌نظامیان در عراق (۶۰-۷۰٪)، فشار بر بغداد (۴۰-۵۰٪)، هدف‌گیری مستقیم فرماندهان سپاه در عراق (۴۰-۵۰٪).",
    effects: {
      regionalInfluence: 6,
      deterrence: 5,
      militaryCapability: 2,
      economicStability: -3,
      warEscalation: 1.1,
      negotiationChance: 0.95,
    },
    icon: "🇮🇶",
    rarity: "rare",
    used: false,
    relatedHistoryEra: "soleimani",
  },
  {
    id: "iran_hamas",
    name: "فعال‌سازی حماس و جهاد",
    nameEn: "Hamas & PIJ Activation",
    category: "proxy",
    actor: "iran",
    actorLabel: "🇮🇷 ایران",
    description: "حمایت کامل از حماس و جهاد اسلامی برای جنگ چندجبهه‌ای.",
    longDescription:
      "حمایت مالی، تسلیحاتی و اطلاعاتی کامل از حماس و جهاد اسلامی. پاسخ: عملیات نظامی گسترده اسرائیل در غزه/کرانه باختری (۸۰-۸۵٪)، فشار بر قطر برای قطع حمایت مالی (۵۰-۶۰٪)، هدف‌گیری رهبری حماس در خارج (۷۰-۸۰٪).",
    effects: {
      regionalInfluence: 10,
      deterrence: 5,
      militaryCapability: 2,
      economicStability: -5,
      warEscalation: 1.12,
      negotiationChance: 0.92,
      israelIsolation: 1.1,
    },
    icon: "🇵🇸",
    rarity: "rare",
    used: false,
    relatedHistoryEra: "soleimani",
  },
  // === Asymmetric ===
  {
    id: "iran_hormuz",
    name: "بستن تنگه هرمز",
    nameEn: "Strait of Hormuz Blockade",
    category: "asymmetric",
    actor: "iran",
    actorLabel: "🇮🇷 ایران",
    description: "بستن شریان نفت جهان، افزایش قیمت نفت به ۲۵۰ دلار.",
    longDescription:
      "استقرار موشک‌های ساحلی، قایق‌های سواری و مین دریایی برای بستن تنگه هرمز. ۲۰٪ نفت جهان از این مسیر عبور می‌کند. پاسخ قطعی آمریکا (۸۵-۹۰٪): عملیات آزادسازی هرمز با ائتلاف بین‌المللی (سابقه: Operation Earnest Will ۱۹۸۷). حمله به موشک‌های ساحلی ایران (۷۰-۷۵٪). مسدودسازی بنادر ایران (۵۰-۶۰٪). ایران می‌تواند ۲-۴ هفته اختلال ایجاد کند، ولی ماندگار نیست.",
    effects: {
      economicStability: -15,
      deterrence: 18,
      regionalInfluence: 14,
      militaryCapability: -8,
      warEscalation: 1.25,
      negotiationChance: 1.05,
    },
    icon: "⚓",
    rarity: "legendary",
    used: true,
    usedContext: "در جنگ اسفند ۱۴۰۳ استفاده شد",
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "iran_bab_el_mandeb",
    name: "بستن تنگه باب‌المندب",
    nameEn: "Bab-el-Mandeb Blockade",
    category: "asymmetric",
    actor: "iran",
    actorLabel: "🇮🇷 ایران",
    description: "بستن شریان تجاری دریای سرخ با همکاری حوثی‌ها.",
    longDescription:
      "حوثی‌ها با حمایت کامل ایران، تنگه باب‌المندب را می‌بندند. ۱۲٪ تجارت جهانی از این مسیر عبور می‌کند. این کارت تاکنون به‌طور کامل استفاده نشده. پاسخ: عملیات Prosperity Guardian (۸۰-۸۵٪)، حمله هوایی به سایت‌های حوثی (۷۰-۷۵٪).",
    effects: {
      economicStability: -8,
      deterrence: 15,
      regionalInfluence: 12,
      militaryCapability: -2,
      warEscalation: 1.18,
      negotiationChance: 1.05,
    },
    icon: "🚢",
    rarity: "legendary",
    used: false,
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "iran_drone_swarm",
    name: "حمله پهپادی انبوه",
    nameEn: "Drone Swarm Attack",
    category: "asymmetric",
    actor: "iran",
    actorLabel: "🇮🇷 ایران",
    description: "شلیک صدها پهپاد انتحاری شاهد به اهداف استراتژیک.",
    longDescription:
      "استفاده از پهپادهای شاهد-۱۳۶ و آرش به صورت انبوه. این کارت در وعده صادق ۱، ۲ و جنگ اسفند ۱۴۰۳ استفاده شد (۳۰۰ پهپاد در اسفند).",
    effects: {
      militaryCapability: 6,
      deterrence: 8,
      economicStability: 2,
      warEscalation: 1.05,
      negotiationChance: 1.0,
    },
    icon: "🛩️",
    rarity: "rare",
    used: true,
    usedContext: "وعده صادق ۱، ۲ و جنگ اسفند ۱۴۰۳",
    relatedHistoryEra: "direct_war",
  },
  // === Cyber ===
  {
    id: "iran_cyber",
    name: "حمله سایبری به زیرساخت‌ها",
    nameEn: "Cyberattack on Infrastructure",
    category: "cyber",
    actor: "iran",
    actorLabel: "🇮🇷 ایران",
    description: "حمله به بانک‌ها، شبکه‌های برق و آب آمریکا و اسرائیل.",
    longDescription:
      "حمله سایبری گسترده به زیرساخت‌های حیاتی دشمن. پاسخ قطعی (۷۵-۸۰٪): حمله سایبری متقابل به زیرساخت ایران (سابقه: Stuxnet ۲۰۱۰، حمله به بنادر ۲۰۲۰). تحریم هدفمند هکرهای سپاه (۷۰-۸۰٪). احتمال کمتر: حمله فیزیکی به مراکز سایبری (۲۰-۳۰٪).",
    effects: {
      deterrence: 8,
      militaryCapability: 4,
      economicStability: 3,
      warEscalation: 1.04,
      negotiationChance: 0.98,
    },
    icon: "💻",
    rarity: "rare",
    used: false,
    relatedHistoryEra: "shadow",
  },
  // === Diplomatic ===
  {
    id: "iran_diplomacy",
    name: "دیپلماسی فعال",
    nameEn: "Active Diplomacy",
    category: "diplomatic",
    actor: "iran",
    actorLabel: "🇮🇷 ایران",
    description: "مذاکره با چین، روسیه و اروپا برای کاهش فشار.",
    longDescription:
      "فعال‌سازی کانال‌های دیپلماتیک. این کارت چندین بار استفاده شد (خاتمی، روحانی، برجام). تحقیقات: آمریکا در ۸۰-۹۰٪ موارد تحریم‌ها را در عین گفت‌وگو حفظ می‌کند. مدل «فریب استراتژیک». اکنون اعتماد به غرب در پایین‌ترین حد خود است.",
    effects: {
      nuclearProgress: -8,
      economicStability: 12,
      domesticSupport: 6,
      deterrence: -5,
      warEscalation: 0.82,
      negotiationChance: 1.4,
      regimeChange: 0.9,
    },
    icon: "🕊️",
    rarity: "rare",
    used: true,
    usedContext: "خاتمی، روحانی، برجام - همیشه با فریب آمریکا",
    relatedHistoryEra: "jcpoa",
  },
  {
    id: "iran_russia_alliance",
    name: "اتحاد کامل با روسیه",
    nameEn: "Full Russia Alliance",
    category: "alliance",
    actor: "iran",
    actorLabel: "🇮🇷 ایران + 🇷🇺 روسیه",
    description: "امضای پیمان نظامی دفاع مشترک با روسیه.",
    longDescription:
      "ارتقای روابط با روسیه به اتحاد رسمی نظامی. پیمان دفاع مشترک: حمله به یکی = حمله به هر دو. تحقیقات: روسیه حاضر نیست برای ایران بجنگد (احتمال ورود مستقیم <۱۰٪)، اما در اوکراین درگیر است. با این حال، لجستیک، اطلاعاتی و وتو در شورای امنیت را تضمین می‌کند.",
    effects: {
      deterrence: 25,
      regionalInfluence: 15,
      militaryCapability: 12,
      economicStability: 5,
      warEscalation: 0.85,
      negotiationChance: 1.2,
      usWithdrawal: 1.15,
    },
    icon: "🤝",
    rarity: "legendary",
    used: false,
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "iran_china_deal",
    name: "گسترش پکت ۲۵ ساله با چین",
    nameEn: "Expand China 25-Year Deal",
    category: "alliance",
    actor: "iran",
    actorLabel: "🇮🇷 ایران + 🇨🇳 چین",
    description: "گسترش همکاری اقتصادی-نظامی با چین، خرید نفت با یوان.",
    longDescription:
      "ارتقای پکت ۲۵ ساله (۱۴۰۰) به همکاری کامل نظامی-اقتصادی. چین ۵۰٪ نفت خاورمیانه وارد می‌کند. تحقیقات: چین حاضر نیست برای ایران بجنگد (<۵٪)، اما پوشش دیپلماتیک (وتو) و بانکداری جایگزین (CIPS) را فراهم می‌کند. تحریم ثانویه علیه شرکت‌های چینی (۶۰-۷۰٪).",
    effects: {
      economicStability: 15,
      deterrence: 12,
      regionalInfluence: 10,
      militaryCapability: 5,
      warEscalation: 0.88,
      negotiationChance: 1.15,
      usWithdrawal: 1.1,
    },
    icon: "🐉",
    rarity: "legendary",
    used: false,
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "iran_saudi_normalize",
    name: "عادی‌سازی با عربستان",
    nameEn: "Normalize with Saudi Arabia",
    category: "diplomatic",
    actor: "iran",
    actorLabel: "🇮🇷 ایران + 🇸🇦 عربستان",
    description: "تعمیق توافق پکن (۱۴۰۱) و عادی‌سازی کامل با عربستان.",
    longDescription:
      "تعمیق توافق پکن (۱۴۰۱) و گسترش آن به همکاری نظامی-امنیتی. تحقیقات: عربستان به دنبال حفظ ظاهر اسلامی است و نمی‌تواند علناً با اسرائیل بجنگد، اما هماهنگی پنهان با ایران باعث کاهش فشار چندجبهه‌ای می‌شود. این کارت، انزوای اسرائیل در منطقه را افزایش می‌دهد.",
    effects: {
      regionalInfluence: 18,
      deterrence: 10,
      economicStability: 8,
      warEscalation: 0.8,
      negotiationChance: 1.3,
      israelIsolation: 1.4,
      usWithdrawal: 1.1,
    },
    icon: "🤝",
    rarity: "epic",
    used: false,
    relatedHistoryEra: "soleimani",
  },
  // === Domestic ===
  {
    id: "iran_mobilization",
    name: "مردم‌سازی و بسیج",
    nameEn: "Mass Mobilization",
    category: "domestic",
    actor: "iran",
    actorLabel: "🇮🇷 ایران",
    description: "بسیج میلیون‌ها داوطلب برای دفاع از کشور.",
    longDescription:
      "اعلام بسیج عمومی. فراخوان بسیج، تشکیل لشکرهای مردمی. این کارت در جنگ اسفند ۱۴۰۳ استفاده شد و اراده ملی را تقویت کرد.",
    effects: {
      domesticSupport: 25,
      militaryCapability: 12,
      deterrence: 8,
      economicStability: -10,
      warEscalation: 1.05,
      regimeChange: 0.85,
    },
    icon: "👥",
    rarity: "common",
    used: true,
    usedContext: "جنگ اسفند ۱۴۰۳",
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "iran_patience",
    name: "صبر استراتژیک",
    nameEn: "Strategic Patience",
    category: "diplomatic",
    actor: "iran",
    actorLabel: "🇮🇷 ایران",
    description: "خویشتن‌داری، انتظار برای تغییر شرایط.",
    longDescription:
      "تاکتیک سنتی ایران: صبر، تحمل فشار، امید به تغییر در آمریکا. هزینه: تضعیف تدریجی اقتصاد. مزیت: جلوگیری از جنگ گسترده. تحقیقات: این استراتژی ۴۰-۵۰٪ احتمال دارد به جنگ فرسایشی طولانی منجر شود.",
    effects: {
      nuclearProgress: 4,
      economicStability: -6,
      domesticSupport: -8,
      deterrence: -3,
      warEscalation: 0.8,
      negotiationChance: 1.15,
      regimeChange: 1.1,
    },
    icon: "⏳",
    rarity: "common",
    used: true,
    usedContext: "پس از جنگ ۱۲ روزه و در دوره‌های مختلف",
    relatedHistoryEra: "jcpoa",
  },
];

// ============================================================
// US RESPONSE CARDS - 15 cards
// ============================================================
export const usCards: GameCard[] = [
  {
    id: "us_sanctions_max",
    name: "تحریم‌های حداکثری",
    nameEn: "Maximum Sanctions",
    category: "economic",
    actor: "us",
    actorLabel: "🇺🇸 آمریکا",
    description: "تحریم تمامی صادرات نفت ایران و قطع سیستم بانکی.",
    longDescription:
      "اعمال «حالت حداکثری فشار» ترامپ-گونه. از ۱۳۹۷ به‌طور مداوم استفاده شده. اقتصاد ایران به تورم ۶۰٪ و کاهش ارزش ریال به نصف رسید. تحریم‌ها در عمل هرگز رفع نشدند.",
    effects: {
      economicStability: -20,
      domesticSupport: -10,
      nuclearProgress: -3,
      warEscalation: 1.08,
      negotiationChance: 0.95,
      regimeChange: 1.15,
    },
    icon: "💸",
    rarity: "rare",
    used: true,
    usedContext: "از ۱۳۹۷ به‌طور مداوم",
    aiWeight: 18,
    counters: ["iran_nuclear_breakout", "iran_hormuz", "iran_nk_nuclear_deal"],
    relatedHistoryEra: "jcpoa",
  },
  {
    id: "us_strike_nukes",
    name: "حمله نظامی به هسته‌ای",
    nameEn: "Military Strike on Nukes",
    category: "military",
    actor: "us",
    actorLabel: "🇺🇸 آمریکا",
    description: "بمباران تأسیسات هسته‌ای با بمب‌های MOP.",
    longDescription:
      "حمله B-2 با بمب‌های GBU-57 (MOP) به فردو، نطنز و اسپاد. این کارت در جنگ ۱۲ روزه و جنگ اسفند ۱۴۰۳ استفاده شد. تحقیقات: حتی با MOP تخریب کامل فردو (۹۰ متر زیر زمین) تضمینی نیست.",
    effects: {
      nuclearProgress: -30,
      militaryCapability: -15,
      domesticSupport: 18,
      deterrence: -8,
      warEscalation: 1.5,
      negotiationChance: 0.7,
    },
    icon: "✈️",
    rarity: "legendary",
    used: true,
    usedContext: "جنگ ۱۲ روزه و اسفند ۱۴۰۳",
    aiWeight: 8,
    counters: ["iran_nuclear_breakout", "iran_npt_withdraw"],
    requiresNuclearProgress: 70,
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "us_carrier_group",
    name: "اعزام ناو هواپیمابر",
    nameEn: "Carrier Strike Group",
    category: "military",
    actor: "us",
    actorLabel: "🇺🇸 آمریکا",
    description: "اعزام دو ناو هواپیمابر به خلیج فارس.",
    longDescription:
      "اعزام گروه ناو هواپیمابر به خلیج فارس. ۱۲۰ هواپیما، ۹۰ هلیکوپتر، ۸۰۰۰ سرباز. بارها استفاده شده (۱۳۹۸، ۱۴۰۳، ۱۴۰۴). پاسخ قطعی به تشدید تنش.",
    effects: {
      militaryCapability: -8,
      deterrence: -5,
      warEscalation: 1.12,
      negotiationChance: 0.95,
    },
    icon: "🛳️",
    rarity: "epic",
    used: true,
    usedContext: "بارها: ۱۳۹۸، ۱۴۰۳، ۱۴۰۴",
    aiWeight: 14,
    relatedHistoryEra: "soleimani",
  },
  {
    id: "us_negotiation_deception",
    name: "پیشنهاد مذاکره (فریب)",
    nameEn: "Negotiation Offer (Deception)",
    category: "diplomatic",
    actor: "us",
    actorLabel: "🇺🇸 آمریکا",
    description: "پیشنهاد مذاکره بدون پیش‌شرط - در حقیقت فریب استراتژیک.",
    longDescription:
      "بایدن-گونه: پیشنهاد مذاکره مستقیم. تحقیقات: آمریکا در ۸۰-۹۰٪ موارد تحریم‌ها را در عین گفت‌وگو حفظ می‌کند. هدف: توقف برنامه هسته‌ای بدون عوض کردن چیزی. تجربه برجام نشان داد این فریب است.",
    effects: {
      economicStability: 10,
      nuclearProgress: -6,
      warEscalation: 0.8,
      negotiationChance: 1.5,
      regimeChange: 0.95,
    },
    icon: "🤝",
    rarity: "rare",
    used: true,
    usedContext: "۱۳۹۹-۱۴۰۱ - فریب بود",
    aiWeight: 10,
    counters: ["iran_diplomacy", "iran_patience"],
    relatedHistoryEra: "jcpoa",
  },
  {
    id: "us_cyber_offensive",
    name: "حمله سایبری گسترده",
    nameEn: "Major Cyber Offensive",
    category: "cyber",
    actor: "us",
    actorLabel: "🇺🇸 آمریکا",
    description: "حمله NSA به زیرساخت‌های نظامی و غیرنظامی ایران.",
    longDescription:
      "حمله سایبری NSA و سایبرکام به شبکه‌های فرماندهی سپاه، سامانه‌های پدافندی، شبکه‌های ارتباطی. سابقه: استاکس‌نت (۱۳۸۹)، حمله به بنادر ۱۳۹۹. قابل انکار، کم‌هزینه.",
    effects: {
      militaryCapability: -10,
      nuclearProgress: -4,
      deterrence: -5,
      warEscalation: 1.04,
    },
    icon: "👾",
    rarity: "rare",
    used: true,
    usedContext: "از ۱۳۸۹ (استاکس‌نت) مکرر",
    aiWeight: 12,
    counters: ["iran_cyber"],
    relatedHistoryEra: "axis",
  },
  {
    id: "us_aid_israel",
    name: "حمایت همه‌جانبه از اسرائیل",
    nameEn: "Full Israel Support",
    category: "diplomatic",
    actor: "us",
    actorLabel: "🇺🇸 آمریکا",
    description: "ارسال پاتریوت، تاد، THAAD و مهمات اضطراری به اسرائیل.",
    longDescription:
      "اعزام سیستم‌های پاتریوت، تاد، THAAD، مهمات هوشمند، سوخت نظامی. حمایت دیپلماتیک در سازمان ملل. در جنگ ۱۲ روزه و جنگ اسفند ۱۴۰۳ استفاده شد.",
    effects: {
      militaryCapability: -6,
      warEscalation: 1.08,
      negotiationChance: 0.92,
    },
    icon: "🇺🇸",
    rarity: "epic",
    used: true,
    usedContext: "جنگ ۱۲ روزه و اسفند ۱۴۰۳",
    aiWeight: 16,
    counters: ["iran_missile_strike", "iran_hezbollah_full"],
    relatedHistoryEra: "direct_war",
  },
  {
    id: "us_intel_opposition",
    name: "اطلاعات به مخالفان",
    nameEn: "Intel to Opposition",
    category: "intelligence",
    actor: "us",
    actorLabel: "🇺🇸 آمریکا",
    description: "کمک اطلاعاتی و مالی به گروه‌های مخالف داخلی.",
    longDescription:
      "حمایت از شبکه‌های مخالف، پخش رادیویی و ماهواره‌ای (صدای آمریکا، RFE/RL)، کمک به سازمان‌های حقوق بشری. هدف: تغییر رژیم نرم. از دهه‌ها پیش به‌طور مداوم استفاده شده.",
    effects: {
      domesticSupport: -15,
      economicStability: -5,
      deterrence: -4,
      regimeChange: 1.4,
      warEscalation: 1.02,
    },
    icon: "🕵️",
    rarity: "rare",
    used: true,
    usedContext: "از دهه‌ها پیش مداوم",
    aiWeight: 10,
    relatedHistoryEra: "revolution",
  },
  {
    id: "us_hormuz_operation",
    name: "عملیات آزادسازی هرمز",
    nameEn: "Hormuz Liberation Operation",
    category: "military",
    actor: "us",
    actorLabel: "🇺🇸 آمریکا + ائتلاف",
    description: "عملیات نظامی برای باز کردن تنگه هرمز.",
    longDescription:
      "عملیات با مین‌روب‌ها، ناوشکن، جنگنده. سابقه: Operation Earnest Will ۱۳۶۶-۱۳۶۷. تحقیقات: این کارت قطعی‌ترین کارت آمریکاست (۸۵-۹۰٪). حمله به موشک‌های ساحلی ایران (۷۰-۷۵٪). مسدودسازی بنادر ایران (۵۰-۶۰٪).",
    effects: {
      militaryCapability: -18,
      deterrence: -12,
      economicStability: -10,
      domesticSupport: 15,
      warEscalation: 1.35,
      negotiationChance: 0.85,
    },
    icon: "⚓",
    rarity: "legendary",
    used: false,
    aiWeight: 20,
    counters: ["iran_hormuz"],
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "us_strike_iraq_militias",
    name: "حمله به شبه‌نظامیان عراق",
    nameEn: "Strike Iraqi Militias",
    category: "military",
    actor: "us",
    actorLabel: "🇺🇸 آمریکا",
    description: "حمله هوایی به سایت‌های شبه‌نظامیان عراقی.",
    longDescription:
      "حمله هوایی به سایت‌های کتائب‌الله و دیگر گروه‌های عراقی. سابقه: حمله به کتائب‌الله ۱۳۹۸. فشار بر بغداد برای خلع سلاح (۴۰-۵۰٪).",
    effects: {
      militaryCapability: -6,
      regionalInfluence: -8,
      deterrence: -3,
      warEscalation: 1.1,
      negotiationChance: 0.95,
    },
    icon: "🪖",
    rarity: "rare",
    used: true,
    usedContext: "حمله به کتائب‌الله ۱۳۹۸",
    aiWeight: 14,
    counters: ["iran_iraq_militias"],
    relatedHistoryEra: "soleimani",
  },
  {
    id: "us_ground_invasion",
    name: "حمله زمینی به ایران",
    nameEn: "Ground Invasion of Iran",
    category: "extreme",
    actor: "us",
    actorLabel: "🇺🇸 آمریکا",
    description: "اعزام ۵۰۰ هزار سرباز برای حمله زمینی به ایران.",
    longDescription:
      "حمله زمینی همه‌جانبه به ایران از خاک عراق، افغانستان و خلیج فارس. این کارت هرگز استفاده نشده - حتی در اوج تنش. تحقیقات: آمریکا می‌داند جنگ زمینی در ایران بزرگ‌تر از ویتنام خواهد بود. بسیار بعید.",
    effects: {
      militaryCapability: -40,
      deterrence: -20,
      domesticSupport: 30,
      economicStability: -25,
      warEscalation: 1.8,
      negotiationChance: 0.3,
      regimeChange: 1.8,
    },
    icon: "🪖",
    rarity: "apocalyptic",
    used: false,
    aiWeight: 3,
    requiresHighWarEscalation: true,
    relatedHistoryEra: "soleimani",
  },
  {
    id: "us_nuclear_strike",
    name: "حمله هسته‌ای به ایران",
    nameEn: "Nuclear Strike on Iran",
    category: "extreme",
    actor: "us",
    actorLabel: "🇺🇸 آمریکا",
    description: "استفاده از سلاح هسته‌ای علیه تأسیسات زیرزمینی ایران.",
    longDescription:
      "استفاده از بمب هسته‌ای B61 برای نابودی تأسیسات فردو و سایت‌های زیرزمینی. تحقیقات: این کارت هرگز استفاده نشده و بسیار بعید است (<۵٪). حمله به قدرت هسته‌ای یا آستانه‌ای، خطر تبادل هسته‌ای دارد.",
    effects: {
      militaryCapability: -50,
      deterrence: -30,
      domesticSupport: -20,
      economicStability: -40,
      warEscalation: 2.5,
      negotiationChance: 0.1,
      regimeChange: 2.0,
    },
    icon: "💀",
    rarity: "apocalyptic",
    used: false,
    aiWeight: 1,
    requiresHighWarEscalation: true,
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "us_withdraw_me",
    name: "خروج استراتژیک از خاورمیانه",
    nameEn: "Strategic Withdrawal from ME",
    category: "diplomatic",
    actor: "us",
    actorLabel: "🇺🇸 آمریکا",
    description: "خروج کامل نیروها از خاورمیانه و تمرکز بر چین.",
    longDescription:
      "تصمیم استراتژیک آمریکا برای خروج از خاورمیانه، تعطیلی پایگاه‌ها، تمرکز بر مهار چین. تحقیقات: احتمال خروج کامل <۵٪، اما «کاهش جاه‌طلبی» ۲۰-۲۵٪. در صورت استفاده، ایران به هژمون منطقه تبدیل می‌شود.",
    effects: {
      regionalInfluence: 25,
      deterrence: 20,
      warEscalation: 0.6,
      negotiationChance: 1.8,
      usWithdrawal: 2.0,
      israelIsolation: 1.5,
    },
    icon: "🚪",
    rarity: "legendary",
    used: false,
    aiWeight: 4,
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "us_nuclear_umbrella",
    name: "چتر هسته‌ای برای عربستان",
    nameEn: "Nuclear Umbrella for Saudis",
    category: "diplomatic",
    actor: "us",
    actorLabel: "🇺🇸 آمریکا + 🇸🇦 عربستان",
    description: "اعلام رسمی چتر هسته‌ای آمریکا برای عربستان و امارات.",
    longDescription:
      "تحقیقات: محتمل‌ترین پاسخ آمریکا بمب اتم ایران (۶۰٪). اعلام رسمی، استقرار بمب‌های B61، تمرینات مشترک. تشکیل ائتلاف ضدایرانی.",
    effects: {
      regionalInfluence: -12,
      deterrence: -8,
      warEscalation: 1.04,
      negotiationChance: 0.95,
    },
    icon: "☂️",
    rarity: "epic",
    used: false,
    aiWeight: 12,
    counters: ["iran_nuclear_breakout", "iran_npt_withdraw"],
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "us_target_irgc",
    name: "هدف‌گیری فرماندهان سپاه",
    nameEn: "Target IRGC Commanders",
    category: "intelligence",
    actor: "us",
    actorLabel: "🇺🇸 آمریکا",
    description: "ترور فرماندهان ارشد سپاه با پهپاد.",
    longDescription:
      "ترور فرماندهان نیروی قدس و سپاه. سابقه: سلیمانی (۱۳۹۸). ادامه الگو. ضربه به بازدارندگی و فرماندهی.",
    effects: {
      militaryCapability: -8,
      deterrence: -8,
      domesticSupport: 10,
      warEscalation: 1.15,
      negotiationChance: 0.9,
    },
    icon: "🎯",
    rarity: "epic",
    used: true,
    usedContext: "سلیمانی ۱۳۹۸",
    aiWeight: 10,
    relatedHistoryEra: "soleimani",
  },
  {
    id: "us_oil_blockade",
    name: "مسدودسازی بنادر ایران",
    nameEn: "Blockade Iranian Ports",
    category: "economic",
    actor: "us",
    actorLabel: "🇺🇸 آمریکا",
    description: "مسدودسازی بنادر بندرعباس، خارک، بوشهر.",
    longDescription:
      "اعمال blockade زیر حقوق بین‌الملل. متقابل با بستن هرمز. تحقیقات: ۵۰-۶۰٪ احتمال در پاسخ به بستن هرمز. آسیب شدید به اقتصاد ایران.",
    effects: {
      economicStability: -25,
      militaryCapability: -5,
      deterrence: -5,
      warEscalation: 1.2,
      negotiationChance: 0.92,
    },
    icon: "🛢️",
    rarity: "epic",
    used: false,
    aiWeight: 12,
    counters: ["iran_hormuz"],
    relatedHistoryEra: "esfand_war",
  },
];

// ============================================================
// ISRAEL RESPONSE CARDS - 15 cards
// ============================================================
export const israelCards: GameCard[] = [
  {
    id: "israel_air_strike",
    name: "حمله هوایی گسترده",
    nameEn: "Massive Airstrike",
    category: "military",
    actor: "israel",
    actorLabel: "🇮🇱 اسرائیل",
    description: "حمله ۱۰۰ جنگنده به تأسیسات نظامی و موشکی ایران.",
    longDescription:
      "عملیات با ۱۰۰+ جنگنده F-35، F-15، F-16 به تأسیسات پدافندی، موشکی، تولید پهپاد و فرودگاه‌های نظامی. در جنگ ۱۲ روزه و جنگ اسفند ۱۴۰۳ استفاده شد.",
    effects: {
      militaryCapability: -18,
      nuclearProgress: -10,
      deterrence: -10,
      domesticSupport: 14,
      warEscalation: 1.35,
      negotiationChance: 0.85,
    },
    icon: "🛩️",
    rarity: "legendary",
    used: true,
    usedContext: "جنگ ۱۲ روزه و اسفند ۱۴۰۳",
    aiWeight: 12,
    counters: ["iran_missile_strike", "iran_nuclear_breakout"],
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "israel_assassination",
    name: "ترور فرماندهان ارشد",
    nameEn: "Targeted Assassination",
    category: "intelligence",
    actor: "israel",
    actorLabel: "🇮🇱 اسرائیل",
    description: "ترور فرماندهان سپاه و دانشمندان هسته‌ای.",
    longDescription:
      "کمپین ترور موساد. سابقه: فخری‌زاده (۱۳۹۸)، هنیه (۱۴۰۳)، نصرالله (۱۴۰۳)، خامنه‌ای (اسفند ۱۴۰۳).",
    effects: {
      militaryCapability: -8,
      nuclearProgress: -6,
      deterrence: -8,
      domesticSupport: 10,
      warEscalation: 1.15,
      negotiationChance: 0.9,
    },
    icon: "🎯",
    rarity: "epic",
    used: true,
    usedContext: "فخری‌زاده، هنیه، نصرالله، خامنه‌ای",
    aiWeight: 16,
    counters: ["iran_nuclear_breakout", "iran_hezbollah_full"],
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "israel_nuclear_facility",
    name: "حمله به نطنز و فردو",
    nameEn: "Strike on Natanz & Fordow",
    category: "military",
    actor: "israel",
    actorLabel: "🇮🇱 اسرائیل",
    description: "حمله مستقیم به قلب برنامه هسته‌ای ایران.",
    longDescription:
      "حمله F-35 با بمب‌های سنگرشکن به تأسیسات هسته‌ای. تحقیقات: دکترین Begin - اسرائیل مخالف سلاح هسته‌ای منطقه‌ای است (سابقه: اوسیراک عراق ۱۳۶۰، کادر سوریه ۱۳۸۶). احتمال حمله پیش‌دگیرانه: ۵۰-۶۵٪. اما فوردو (۹۰متر زیر زمین) تخریب کامل سخت.",
    effects: {
      nuclearProgress: -25,
      deterrence: -12,
      militaryCapability: -5,
      domesticSupport: 18,
      warEscalation: 1.45,
      nuclearBreakout: 0.9,
      negotiationChance: 0.78,
    },
    icon: "☢️",
    rarity: "legendary",
    used: true,
    usedContext: "جنگ ۱۲ روزه و اسفند ۱۴۰۳",
    aiWeight: 10,
    counters: ["iran_nuclear_breakout", "iran_npt_withdraw", "iran_nk_nuclear_deal"],
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "israel_preemptive",
    name: "حمله پیش‌دگیرانه همه‌جانبه",
    nameEn: "Pre-emptive Strike",
    category: "military",
    actor: "israel",
    actorLabel: "🇮🇱 اسرائیل",
    description: "حمله غافلگیرانه همه‌جانبه با ۲۰۰ جنگنده.",
    longDescription:
      "حمله همزمان به هسته‌ای، موشکی، پدافندی و فرماندهی سپاه. تحقیقات: این کارت در صورت نزدیک شدن ایران به بمب، احتمال ۵۰-۶۵٪ دارد. پس از بمب، احتمال <۵٪ (حمله به قدرت هسته‌ای خودکشی است).",
    effects: {
      nuclearProgress: -20,
      militaryCapability: -15,
      deterrence: -15,
      domesticSupport: 20,
      warEscalation: 1.6,
      negotiationChance: 0.7,
    },
    icon: "💥",
    rarity: "legendary",
    used: false,
    aiWeight: 6,
    counters: ["iran_nuclear_breakout", "iran_npt_withdraw"],
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "israel_sabotage",
    name: "خرابکاری صنعتی",
    nameEn: "Industrial Sabotage",
    category: "intelligence",
    actor: "israel",
    actorLabel: "🇮🇱 اسرائیل",
    description: "خرابکاری در کارخانه‌های موشکی و سایبری.",
    longDescription:
      "موساد در کارخانه‌های تولید موشک، سایت‌های پهپادی و سیستم‌های سایبری نفوذ می‌کند. سابقه: نطنز (۱۳۸۹، ۱۳۹۹)، پارچین، سایت‌های پهپادی.",
    effects: {
      militaryCapability: -8,
      nuclearProgress: -4,
      deterrence: -4,
      warEscalation: 1.04,
      negotiationChance: 0.98,
    },
    icon: "🔧",
    rarity: "rare",
    used: true,
    usedContext: "نطنز ۱۳۸۹، ۱۳۹۹، پارچین",
    aiWeight: 14,
    relatedHistoryEra: "axis",
  },
  {
    id: "israel_hezbollah_war",
    name: "جنگ با حزب‌الله",
    nameEn: "War on Hezbollah",
    category: "military",
    actor: "israel",
    actorLabel: "🇮🇱 اسرائیل",
    description: "حمله هوایی گسترده به مواضع حزب‌الله در لبنان.",
    longDescription:
      "حمله هوایی و زمینی به لبنان. سابقه: پیجرها (شهریور ۱۴۰۳)، ترور نصرالله (مهر ۱۴۰۳). تحقیقات: در صورت فعال‌سازی کامل حزب‌الله، احتمال ۸۰-۸۵٪.",
    effects: {
      regionalInfluence: -12,
      militaryCapability: 4,
      deterrence: -3,
      warEscalation: 1.18,
      negotiationChance: 0.95,
    },
    icon: "🇱🇧",
    rarity: "epic",
    used: true,
    usedContext: "پیجرها، نصرالله، حمله به لبنان ۱۴۰۳",
    aiWeight: 14,
    counters: ["iran_hezbollah_full"],
    relatedHistoryEra: "direct_war",
  },
  {
    id: "israel_nuclear_strike",
    name: "حمله هسته‌ای به ایران",
    nameEn: "Nuclear Strike on Iran",
    category: "extreme",
    actor: "israel",
    actorLabel: "🇮🇱 اسرائیل",
    description: "استفاده از کلاهک هسته‌ای علیه تهران و تأسیسات استراتژیک.",
    longDescription:
      "اسرائیل دارای ۹۰-۴۰۰ کلاهک هسته‌ای تخمین زده می‌شود. استفاده در صورت خطر وجودی. تحقیقات: بسیار بعید (<۳٪) مگر در صورت حمله زمینی ایران. حتی در این صورت، پاسخ جهانی بسیار ویرانگر خواهد بود.",
    effects: {
      militaryCapability: -50,
      deterrence: -30,
      domesticSupport: -30,
      economicStability: -50,
      warEscalation: 2.5,
      negotiationChance: 0.1,
      regimeChange: 1.8,
    },
    icon: "💀",
    rarity: "apocalyptic",
    used: false,
    aiWeight: 1,
    requiresHighWarEscalation: true,
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "israel_cyber",
    name: "حمله سایبری یگان ۸۲۰۰",
    nameEn: "Unit 8200 Cyber Strike",
    category: "cyber",
    actor: "israel",
    actorLabel: "🇮🇱 اسرائیل",
    description: "حمله به شبکه‌های بانکی، مخابراتی و نظامی ایران.",
    longDescription:
      "یگان ۸۲۰۰ اسرائیل با بدافهای پیشرفته حمله می‌کند. سابقه: استاکس‌نت (با همکاری آمریکا)، فلیم، دوکو.",
    effects: {
      economicStability: -12,
      militaryCapability: -6,
      deterrence: -4,
      warEscalation: 1.06,
    },
    icon: "🦠",
    rarity: "rare",
    used: true,
    usedContext: "استاکس‌نت، فلیم، دوکو",
    aiWeight: 14,
    counters: ["iran_cyber"],
    relatedHistoryEra: "axis",
  },
  {
    id: "israel_assassinate_leader",
    name: "ترور رهبران عالی‌رتبه",
    nameEn: "Assassinate Top Leaders",
    category: "extreme",
    actor: "israel",
    actorLabel: "🇮🇱 اسرائیل",
    description: "ترور رئیس‌جمهور و دیگر مقامات عالی‌رتبه.",
    longDescription:
      "حمله به مقامات عالی‌رتبه نظامی و سیاسی. در اسفند ۱۴۰۳ با ترور سید علی خامنه‌ای استفاده شد. تحقیقات: در صورت موفقیت، پاسخ ایران بسیار شدید خواهد بود.",
    effects: {
      militaryCapability: -10,
      deterrence: -15,
      domesticSupport: 25,
      economicStability: -8,
      warEscalation: 1.5,
      negotiationChance: 0.65,
      regimeChange: 1.3,
    },
    icon: "🎯",
    rarity: "apocalyptic",
    used: true,
    usedContext: "ترور خامنه‌ای اسفند ۱۴۰۳",
    aiWeight: 4,
    requiresHighWarEscalation: true,
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "israel_strike_iran_oil",
    name: "حمله به زیرساخت نفت ایران",
    nameEn: "Strike Iran Oil Infrastructure",
    category: "military",
    actor: "israel",
    actorLabel: "🇮🇱 اسرائیل",
    description: "حمله به سایت‌های نفتی ایران (خارک، جزیره، بندرعباس).",
    longDescription:
      "حمله به زیرساخت نفت ایران. متقابل با بستن هرمز. تحقیقات: ۶۰٪ احتمال در پاسخ به بستن هرمز. آسیب شدید به اقتصاد ایران.",
    effects: {
      economicStability: -22,
      militaryCapability: -3,
      deterrence: -5,
      warEscalation: 1.25,
      negotiationChance: 0.85,
    },
    icon: "🛢️",
    rarity: "epic",
    used: false,
    aiWeight: 10,
    counters: ["iran_hormuz"],
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "israel_hamas_war",
    name: "عملیات گسترده در غزه",
    nameEn: "Major Gaza Operation",
    category: "military",
    actor: "israel",
    actorLabel: "🇮🇱 اسرائیل",
    description: "عملیات نظامی گسترده در غزه و کرانه باختری.",
    longDescription:
      "عملیات نظامی گسترده در غزه و کرانه باختری. تحقیقات: ۸۰-۸۵٪ در صورت فعال‌سازی حماس. سابقه: ۱۴۰۲-۱۴۰۳.",
    effects: {
      regionalInfluence: -8,
      militaryCapability: 2,
      deterrence: -2,
      warEscalation: 1.1,
      negotiationChance: 0.95,
      israelIsolation: 1.15,
    },
    icon: "🇵🇸",
    rarity: "epic",
    used: true,
    usedContext: "۱۴۰۲-۱۴۰۳",
    aiWeight: 12,
    counters: ["iran_hamas"],
    relatedHistoryEra: "soleimani",
  },
  {
    id: "israel_diplomatic_isolate",
    name: "انزوای دیپلماتیک ایران",
    nameEn: "Diplomatic Isolation of Iran",
    category: "diplomatic",
    actor: "israel",
    actorLabel: "🇮🇱 اسرائیل",
    description: "هماهنگی با عربستان، اردن، بحرین برای انزوای ایران.",
    longDescription:
      "هماهنگی دیپلماتیک با کشورهای عربی. سابقه: توافق ابراهیم (۲۰۲۰). فشار بر اروپا برای تشدید تحریم.",
    effects: {
      regionalInfluence: -10,
      economicStability: -4,
      warEscalation: 1.04,
      negotiationChance: 0.95,
    },
    icon: "🌐",
    rarity: "common",
    used: true,
    usedContext: "توافق ابراهیم ۲۰۲۰",
    aiWeight: 10,
    relatedHistoryEra: "soleimani",
  },
  {
    id: "israel_strike_syria",
    name: "حمله به سایت‌های ایران در سوریه",
    nameEn: "Strike Iran Sites in Syria",
    category: "military",
    actor: "israel",
    actorLabel: "🇮🇱 اسرائیل",
    description: "حمله هوایی به سایت‌های ایران در سوریه.",
    longDescription:
      "حمله هوایی مکرر به سایت‌های ایران در سوریه. سابقه: حمله‌های مکرر به فرودگاه دمشق و سایت‌های تسلیحاتی. تحقیقات: ۸۰-۹۰٪ در صورت فعال‌سازی نیابتی سوریه.",
    effects: {
      regionalInfluence: -8,
      militaryCapability: -3,
      deterrence: -3,
      warEscalation: 1.08,
      negotiationChance: 0.98,
    },
    icon: "🇸🇾",
    rarity: "rare",
    used: true,
    usedContext: "حمله‌های مکرر به سوریه",
    aiWeight: 12,
    relatedHistoryEra: "soleimani",
  },
  {
    id: "israel_second_strike",
    name: "تهدید بازتاب دوم",
    nameEn: "Second Strike Threat",
    category: "nuclear",
    actor: "israel",
    actorLabel: "🇮🇱 اسرائیل",
    description: "فعال‌سازی زیردریایی‌های دلفین با موشک کروز هسته‌ای.",
    longDescription:
      "زردریایی‌های دلفین (آلمانی) اسرائیل با موشک کروز هسته‌ای. تحقیقات: اسرائیل توانایی بازتاب دوم تضمین‌شده دارد. در صورت وصول بمب ایران، این کارت به‌عنوان سیگنال بازدارندگی فعال می‌شود.",
    effects: {
      deterrence: -10,
      militaryCapability: -3,
      warEscalation: 1.1,
      negotiationChance: 0.85,
      nuclearBreakout: 0.9,
    },
    icon: "🚢",
    rarity: "legendary",
    used: false,
    aiWeight: 6,
    counters: ["iran_nuclear_breakout", "iran_npt_withdraw"],
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "israel_nuclear_ambiguity_end",
    name: "پایان ابهام هسته‌ای",
    nameEn: "End Nuclear Ambiguity",
    category: "nuclear",
    actor: "israel",
    actorLabel: "🇮🇱 اسرائیل",
    description: "اعلام رسمی داشتن سلاح هسته‌ای.",
    longDescription:
      "اسرائیل از دهه ۱۹۶۰ سیاست «ابهام هسته‌ای» داشته. در صورت وصول بمب ایران، ممکن است این سیاست را کنار بگذارد و رسماً اعلام کند قدرت هسته‌ای دارد. تحقیقات: ۳۰-۴۰٪ احتمال در صورت بمب ایران.",
    effects: {
      deterrence: -8,
      militaryCapability: -2,
      warEscalation: 1.05,
      negotiationChance: 0.9,
      nuclearBreakout: 1.1,
    },
    icon: "☢️",
    rarity: "epic",
    used: false,
    aiWeight: 6,
    counters: ["iran_nuclear_breakout"],
    relatedHistoryEra: "esfand_war",
  },
];

// ============================================================
// ARAB COALITION RESPONSE CARDS - 8 cards
// ============================================================
export const arabCards: GameCard[] = [
  {
    id: "arab_us_alliance",
    name: "ائتلاف نظامی عربی-آمریکایی",
    nameEn: "Arab-US Military Coalition",
    category: "diplomatic",
    actor: "arab",
    actorLabel: "🇸🇦 عربستان + 🇦🇪 امارات + 🇧🇭 بحرین",
    description: "تشکیل ائتلاف نظامی علیه ایران (بدون اسرائیل علناً).",
    longDescription:
      "تحقیقات: ائتلاف نظامی عربی-اسرائیلی-آمریکایی صریح بعید است (۲۰-۳۰٪) - عربستان نمی‌تواند علناً با اسرائیل بجنگد. اما ائتلاف عربی-آمریکایی (بدون اسرائیل openly) ۵۰-۶۰٪ محتمل است.",
    effects: {
      regionalInfluence: -15,
      deterrence: -8,
      militaryCapability: -5,
      warEscalation: 1.1,
      negotiationChance: 0.92,
    },
    icon: "🤝",
    rarity: "epic",
    used: false,
    aiWeight: 8,
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "arab_us_bases",
    name: "اجازه استفاده از پایگاه‌ها",
    nameEn: "Allow US Base Access",
    category: "diplomatic",
    actor: "arab",
    actorLabel: "🇶🇦 قطر + 🇧🇭 بحرین + 🇦🇪 امارات",
    description: "اجازه استفاده کامل از پایگاه‌های آمریکایی در خاک عربی.",
    longDescription:
      "اجازه استفاده کامل از پایگاه العیید (قطر)، ناو پنجم (بحرین)، الظفرہ (امارات). تحقیقات: ۸۰-۹۰٪ در صورت تشدید تنش. بحرین و امارات کاملاً هم‌سو، قطر محتاط‌تر.",
    effects: {
      militaryCapability: -8,
      deterrence: -5,
      warEscalation: 1.08,
      negotiationChance: 0.95,
    },
    icon: "🛬",
    rarity: "rare",
    used: true,
    usedContext: "همیشه فعال",
    aiWeight: 14,
    relatedHistoryEra: "soleimani",
  },
  {
    id: "arab_oil_increase",
    name: "افزایش تولید نفت عربستان",
    nameEn: "Saudi Oil Production Increase",
    category: "economic",
    actor: "arab",
    actorLabel: "🇸🇦 عربستان",
    description: "افزایش تولید نفت برای جبران کاهش ایران.",
    longDescription:
      "عربستان تولید نفت را افزایش می‌دهد تا کاهش نفت ایران جبران شود. تحقیقات: ۷۰-۸۰٪ در صورت بستن هرمز. هدف: تثبیت قیمت جهانی.",
    effects: {
      economicStability: -10,
      deterrence: -3,
      warEscalation: 1.02,
      negotiationChance: 1.0,
    },
    icon: "🛢️",
    rarity: "rare",
    used: false,
    aiWeight: 12,
    counters: ["iran_hormuz"],
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "arab_patriot_defense",
    name: "پدافند موشکی مشترک",
    nameEn: "Joint Missile Defense",
    category: "military",
    actor: "arab",
    actorLabel: "🇸🇦 عربستان + 🇺🇸 آمریکا",
    description: "استقرار پاتریوت و THAAD برای دفاع از کشورهای عربی.",
    longDescription:
      "استقرار سیستم‌های پاتریوت و THAAD. سابقه: رهگیری حمله حوثی‌ها به عربستان ۱۴۰۰. تحقیقات: ۸۰-۹۰٪ در صورت حمله به زیرساخت عربی.",
    effects: {
      militaryCapability: -3,
      deterrence: -2,
      warEscalation: 1.02,
      negotiationChance: 0.98,
    },
    icon: "🛡️",
    rarity: "rare",
    used: true,
    usedContext: "رهگیری حوثی‌ها ۱۴۰۰",
    aiWeight: 10,
    counters: ["iran_houthi"],
    relatedHistoryEra: "soleimani",
  },
  {
    id: "arab_normalize_israel",
    name: "تعمیق عادی‌سازی با اسرائیل",
    nameEn: "Deepen Israel Normalization",
    category: "diplomatic",
    actor: "arab",
    actorLabel: "🇸🇦 عربستان + 🇦🇪 امارات + 🇮🇱 اسرائیل",
    description: "گسترش توافق ابراهیم و همکاری نظامی پنهان با اسرائیل.",
    longDescription:
      "گسترش توافق ابراهیم (۲۰۲۰). تحقیقات: عربستان نمی‌تواند علناً با اسرائیل بجنگد، اما هماهنگی پنهان ۸۰-۹۰٪ در جریان است.",
    effects: {
      regionalInfluence: -12,
      deterrence: -5,
      warEscalation: 1.04,
      negotiationChance: 0.92,
      israelIsolation: 0.85,
    },
    icon: "🤝",
    rarity: "epic",
    used: true,
    usedContext: "توافق ابراهیم ۲۰۲۰",
    aiWeight: 8,
    relatedHistoryEra: "soleimani",
  },
  {
    id: "arab_saudi_nuke",
    name: "کلاهک هسته‌ای از پاکستان",
    nameEn: "Saudi Nuclear Warhead from Pakistan",
    category: "nuclear",
    actor: "arab",
    actorLabel: "🇸🇦 عربستان + 🇵🇰 پاکستان",
    description: "دریافت کلاهک آماده از پاکستان (off-the-shelf).",
    longDescription:
      "تحقیقات: شاهزاده ترکی فیلی گفت: «اگر ایران بمب بگیرد ما دنبال آن می‌رویم - فوراً». توافق‌نامه غیررسمی ۲۰۰۳ پاکستان-عربستان. احتمال ۴۰-۵۰٪ در صورت بمب ایران. مدل «off-the-shelf».",
    effects: {
      nuclearProgress: -8,
      deterrence: -10,
      militaryCapability: -2,
      warEscalation: 1.15,
      nuclearBreakout: 0.85,
      negotiationChance: 0.88,
    },
    icon: "☢️",
    rarity: "legendary",
    used: false,
    aiWeight: 8,
    counters: ["iran_nuclear_breakout", "iran_npt_withdraw"],
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "arab_jordan_air_corridor",
    name: "دریله هوایی اردن",
    nameEn: "Jordan Air Corridor",
    category: "diplomatic",
    actor: "arab",
    actorLabel: "🇯🇴 اردن",
    description: "اجازه عبور جنگنده‌های اسرائیل/آمریکا از حریم هوایی اردن.",
    longDescription:
      "اجازه عبور جنگنده‌ها از حریم هوایی اردن. سابقه: رهگیری موشک ۱۴۰۳. تحقیقات: ۸۰-۹۰٪ در صورت حمله موشکی ایران به اسرائیل.",
    effects: {
      militaryCapability: -5,
      deterrence: -3,
      warEscalation: 1.06,
      negotiationChance: 0.95,
    },
    icon: "✈️",
    rarity: "rare",
    used: true,
    usedContext: "رهگیری موشک ۱۴۰۳",
    aiWeight: 12,
    counters: ["iran_missile_strike"],
    relatedHistoryEra: "direct_war",
  },
  {
    id: "arab_iraq_pressure",
    name: "فشار بر عراق",
    nameEn: "Pressure on Iraq",
    category: "diplomatic",
    actor: "arab",
    actorLabel: "🇸🇦 عربستان + 🇺🇸 آمریکا",
    description: "فشار بر بغداد برای خلع سلاح شبه‌نظامیان عراقی.",
    longDescription:
      "فشار بر بغداد برای خلع سلاح شبه‌نظامیان عراقی و قطع ارتباط با ایران. تحقیقات: ۴۰-۵۰٪. سابقه: تهدید به خروج سفارت.",
    effects: {
      regionalInfluence: -8,
      deterrence: -3,
      warEscalation: 1.04,
      negotiationChance: 0.96,
    },
    icon: "🇮🇶",
    rarity: "rare",
    used: false,
    aiWeight: 8,
    counters: ["iran_iraq_militias"],
    relatedHistoryEra: "soleimani",
  },
];

// ============================================================
// NATO RESPONSE CARDS - 5 cards
// ============================================================
export const natoCards: GameCard[] = [
  {
    id: "nato_logistics",
    name: "حمایت لجستیکی ناتو",
    nameEn: "NATO Logistics Support",
    category: "diplomatic",
    actor: "nato",
    actorLabel: "🌍 ناتو",
    description: "حمایت لجستیکی و اطلاعاتی ناتو از آمریکا.",
    longDescription:
      "تحقیقات: ناتو در ۲۰-۳۰٪ موارد حمایت لجستیکی می‌دهد. سابقه: عراق ۲۰۰۳ (ناتو وارد نشد ولی حمایت لجستیکی داد). ائتلاف ad hoc محتمل‌تر است (۷۰-۸۰٪).",
    effects: {
      militaryCapability: -5,
      deterrence: -3,
      warEscalation: 1.05,
      negotiationChance: 0.96,
    },
    icon: "🌍",
    rarity: "rare",
    used: false,
    aiWeight: 10,
    relatedHistoryEra: "soleimani",
  },
  {
    id: "nato_prosperity_guardian",
    name: "عملیات حفاظت از رونق",
    nameEn: "Operation Prosperity Guardian",
    category: "military",
    actor: "nato",
    actorLabel: "🌍 ائتلاف بین‌المللی",
    description: "تشکیل ائتلاف بین‌المللی برای حفظ امنیت دریای سرخ.",
    longDescription:
      "تحقیقات: این ائتلاف ad hoc (نه ناتو رسمی) ۷۰-۸۰٪ محتمل است. سابقه: ۱۴۰۲. شامل بریتانیا، فرانسه، ایتالیا، اسپانیا و دیگران.",
    effects: {
      militaryCapability: -6,
      deterrence: -4,
      regionalInfluence: -5,
      warEscalation: 1.08,
      negotiationChance: 0.95,
    },
    icon: "🚢",
    rarity: "epic",
    used: true,
    usedContext: "۱۴۰۲",
    aiWeight: 14,
    counters: ["iran_houthi", "iran_bab_el_mandeb"],
    relatedHistoryEra: "soleimani",
  },
  {
    id: "nato_turkey_article5",
    name: "فعال‌سازی ماده ۵ ناتو",
    nameEn: "NATO Article 5 Activation",
    category: "extreme",
    actor: "nato",
    actorLabel: "🌍 ناتو",
    description: "فعال‌سازی ماده ۵ (حمله به یکی = حمله به همه).",
    longDescription:
      "تحقیقات: ماده ۵ فقط در صورت حمله مستقیم ایران به ترکیه (عضو ناتو) فعال می‌شود. احتمال ۶۰-۷۰٪ در این شرایط. ولی در عمل، اقدام لازم مبهم است. برای حمله به پایگاه‌های آمریکا در خاک غیرعضو ناتو، ماده ۵ اجرا نمی‌شود.",
    effects: {
      militaryCapability: -15,
      deterrence: -12,
      regionalInfluence: -10,
      warEscalation: 1.4,
      negotiationChance: 0.7,
    },
    icon: "🌍",
    rarity: "legendary",
    used: false,
    aiWeight: 4,
    requiresHighWarEscalation: true,
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "nato_eu_sanctions",
    name: "تحریم‌های هماهنگ اروپا",
    nameEn: "Coordinated EU Sanctions",
    category: "economic",
    actor: "nato",
    actorLabel: "🇪🇺 اتحادیه اروپا",
    description: "اعمال تحریم‌های هماهنگ اروپا علیه ایران.",
    longDescription:
      "تحقیقات: اتحادیه اروپا در ۸۰-۹۰٪ موارد با تحریم‌های آمریکا هماهنگ می‌کند. تحریم بر نفت، بانک، صنعت.",
    effects: {
      economicStability: -12,
      deterrence: -2,
      warEscalation: 1.02,
      negotiationChance: 0.97,
    },
    icon: "🇪🇺",
    rarity: "rare",
    used: true,
    usedContext: "همیشه فعال",
    aiWeight: 12,
    relatedHistoryEra: "jcpoa",
  },
  {
    id: "nato_uk_france_direct",
    name: "ورود مستقیم بریتانیا و فرانسه",
    nameEn: "UK and France Direct Involvement",
    category: "military",
    actor: "nato",
    actorLabel: "🇬🇧 بریتانیا + 🇫🇷 فرانسه",
    description: "ورود مستقیم بریتانیا و فرانسه به دفاع هوایی اسرائیل.",
    longDescription:
      "تحقیقات: سابقه: آوریل ۲۰۲۴ - بریتانیا و فرانسه در رهگیری موشک‌های ایران شرکت کردند. احتمال ۶۰-۷۰٪ در صورت حمله موشکی گسترده.",
    effects: {
      militaryCapability: -8,
      deterrence: -5,
      warEscalation: 1.1,
      negotiationChance: 0.92,
    },
    icon: "🇬🇧",
    rarity: "epic",
    used: true,
    usedContext: "آوریل ۲۰۲۴",
    aiWeight: 10,
    counters: ["iran_missile_strike"],
    relatedHistoryEra: "direct_war",
  },
];

// ============================================================
// NORTH KOREA / RUSSIA / CHINA CARDS - 5 cards
// ============================================================
export const nkRussiaChinaCards: GameCard[] = [
  {
    id: "nk_missile_tech",
    name: "انتقال فنی موشک از کره شمالی",
    nameEn: "NK Missile Tech Transfer",
    category: "alliance",
    actor: "nk",
    actorLabel: "🇰🇵 کره شمالی",
    description: "کره شمالی طراحی فنی موشک (Nodong، Hwasong) به ایران می‌دهد.",
    longDescription:
      "تحقیقات: انتقال فنی/طراحی موشک ۳۰-۴۰٪ محتمل است. سابقه: موشک‌های Scud، Nodong. ولی ICBM (Hwasong-17) پیچیده‌تر و خطرناک‌تر. انتقال کامل ۵-۱۰٪.",
    effects: {
      deterrence: 12,
      militaryCapability: 15,
      economicStability: -8,
      warEscalation: 1.1,
      negotiationChance: 0.85,
    },
    icon: "🚀",
    rarity: "legendary",
    used: false,
    aiWeight: 8,
    relatedHistoryEra: "axis",
  },
  {
    id: "russia_veto",
    name: "وتوی روسیه در شورای امنیت",
    nameEn: "Russia UN Veto",
    category: "diplomatic",
    actor: "russia",
    actorLabel: "🇷🇺 روسیه",
    description: "وتوی روسیه در شورای امنیت علیه قطعنامه‌های ضد ایرانی.",
    longDescription:
      "تحقیقات: روسیه در ۷۰-۸۰٪ موارد قطعنامه‌های ضد ایرانی را وتو می‌کند. اما در اوکراین درگیر است. حمایت لجستیکی و اطلاعاتی به ایران، ولی نه مستقیم نظامی.",
    effects: {
      deterrence: 8,
      regionalInfluence: 5,
      economicStability: 4,
      warEscalation: 0.9,
      negotiationChance: 1.2,
    },
    icon: "🇷🇺",
    rarity: "epic",
    used: true,
    usedContext: "همیشه فعال",
    aiWeight: 12,
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "russia_s400",
    name: "تحویل S-400 به ایران",
    nameEn: "Russia Delivers S-400",
    category: "military",
    actor: "russia",
    actorLabel: "🇷🇺 روسیه",
    description: "تحویل سیستم پدافندی S-400 به ایران.",
    longDescription:
      "تحقیقات: روسیه ممکن است در صورت تشدید تنش S-400 به ایران بدهد. احتمال ۳۰-۴۰٪. این سیستم پدافندی پیشرفته، توان رهگیری جنگنده‌های F-35 را دارد.",
    effects: {
      militaryCapability: 15,
      deterrence: 12,
      warEscalation: 0.95,
      negotiationChance: 1.05,
    },
    icon: "🛡️",
    rarity: "legendary",
    used: false,
    aiWeight: 8,
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "china_oil_buyer",
    name: "چین خریدار نفت ایران",
    nameEn: "China Buys Iranian Oil",
    category: "economic",
    actor: "china",
    actorLabel: "🇨🇳 چین",
    description: "ادامه خرید نفت ایران با تخفیف و پرداخت با یوان.",
    longDescription:
      "تحقیقات: چین ۵۰٪ نفت خاورمیانه وارد می‌کند. حاضر نیست برای ایران بجنگد (<۵٪) ولی نفت ایران را با تخفیف می‌خرد و با CIPS (بانکداری جایگزین) پرداخت می‌کند. وتو در شورای امنیت.",
    effects: {
      economicStability: 10,
      deterrence: 5,
      regionalInfluence: 4,
      warEscalation: 0.85,
      negotiationChance: 1.15,
    },
    icon: "🐉",
    rarity: "epic",
    used: true,
    usedContext: "همیشه فعال",
    aiWeight: 12,
    relatedHistoryEra: "esfand_war",
  },
  {
    id: "china_infra_investment",
    name: "سرمایه‌گذاری زیرساختی چین",
    nameEn: "China Infrastructure Investment",
    category: "economic",
    actor: "china",
    actorLabel: "🇨🇳 چین",
    description: "سرمایه‌گذاری چین در زیرساخت‌های ایران (بندر، راه‌آهن).",
    longDescription:
      "تحقیقات: چین در پکت ۲۵ ساله (۱۴۰۰) وعده ۴۰۰ میلیارد دلار سرمایه‌گذاری داد. در عمل، به دلیل ترس از تحریم‌های ثانویه، کمتر اجرا شده. احتمال گسترش ۴۰-۵۰٪ در صورت تشدید.",
    effects: {
      economicStability: 18,
      deterrence: 6,
      regionalInfluence: 8,
      warEscalation: 0.82,
      negotiationChance: 1.2,
      usWithdrawal: 1.15,
    },
    icon: "🏗️",
    rarity: "legendary",
    used: false,
    aiWeight: 8,
    relatedHistoryEra: "esfand_war",
  },
];

// All enemy cards combined
export const allEnemyCards = [...usCards, ...israelCards, ...arabCards, ...natoCards, ...nkRussiaChinaCards];

// Note: nkRussiaChinaCards are technically "ally" cards but we include them as "enemy" pool
// because they're "non-Iran" cards. In gameplay, some are positive for Iran (russia_veto, china_oil_buyer)
// and will be selected when Iran plays diplomatic cards. Others (nk_missile_tech, russia_s400)
// will also help Iran. This is intentional - they're "third party" cards.

export const categoryInfo: Record<CardCategory, { label: string; color: string; icon: string }> = {
  nuclear: { label: "هسته‌ای", color: "oklch(0.6 0.25 25)", icon: "☢️" },
  military: { label: "نظامی", color: "oklch(0.55 0.18 250)", icon: "⚔️" },
  proxy: { label: "نیابتی", color: "oklch(0.6 0.18 165)", icon: "🛡️" },
  diplomatic: { label: "دیپلماتیک", color: "oklch(0.65 0.15 85)", icon: "🕊️" },
  economic: { label: "اقتصادی", color: "oklch(0.7 0.18 70)", icon: "💰" },
  cyber: { label: "سایبری", color: "oklch(0.6 0.18 305)", icon: "💻" },
  intelligence: { label: "اطلاعاتی", color: "oklch(0.55 0.15 220)", icon: "🕵️" },
  domestic: { label: "داخلی", color: "oklch(0.65 0.16 165)", icon: "👥" },
  asymmetric: { label: "نامتقارن", color: "oklch(0.6 0.2 35)", icon: "🌊" },
  extreme: { label: "افراطی", color: "oklch(0.5 0.28 25)", icon: "💀" },
  alliance: { label: "ائتلاف", color: "oklch(0.65 0.2 200)", icon: "🤝" },
};

export const rarityInfo: Record<GameCard["rarity"], { label: string; color: string }> = {
  common: { label: "معمولی", color: "oklch(0.7 0.02 80)" },
  rare: { label: "کمیاب", color: "oklch(0.65 0.18 250)" },
  epic: { label: "حماسی", color: "oklch(0.65 0.2 305)" },
  legendary: { label: "افسانه‌ای", color: "oklch(0.7 0.22 35)" },
  apocalyptic: { label: "آخرالزمانی", color: "oklch(0.5 0.28 25)" },
};

// Actor info for color coding
export const actorInfo: Record<CardActor, { label: string; color: string; gradient: string }> = {
  iran: {
    label: "ایران",
    color: "oklch(0.65 0.18 165)",
    gradient: "linear-gradient(135deg, oklch(0.22 0.08 165 / 0.9), oklch(0.18 0.05 165 / 0.95))",
  },
  us: {
    label: "آمریکا",
    color: "oklch(0.6 0.15 250)",
    gradient: "linear-gradient(135deg, oklch(0.22 0.08 250 / 0.9), oklch(0.18 0.05 250 / 0.95))",
  },
  israel: {
    label: "اسرائیل",
    color: "oklch(0.7 0.18 70)",
    gradient: "linear-gradient(135deg, oklch(0.25 0.1 70 / 0.9), oklch(0.2 0.08 70 / 0.95))",
  },
  arab: {
    label: "ائتلاف عربی",
    color: "oklch(0.65 0.15 30)",
    gradient: "linear-gradient(135deg, oklch(0.25 0.08 30 / 0.9), oklch(0.2 0.06 30 / 0.95))",
  },
  nato: {
    label: "ناتو",
    color: "oklch(0.6 0.15 200)",
    gradient: "linear-gradient(135deg, oklch(0.22 0.06 200 / 0.9), oklch(0.18 0.05 200 / 0.95))",
  },
  nk: {
    label: "کره شمالی",
    color: "oklch(0.55 0.15 0)",
    gradient: "linear-gradient(135deg, oklch(0.22 0.06 0 / 0.9), oklch(0.18 0.05 0 / 0.95))",
  },
  russia: {
    label: "روسیه",
    color: "oklch(0.55 0.15 250)",
    gradient: "linear-gradient(135deg, oklch(0.22 0.06 250 / 0.9), oklch(0.18 0.05 250 / 0.95))",
  },
  china: {
    label: "چین",
    color: "oklch(0.6 0.18 0)",
    gradient: "linear-gradient(135deg, oklch(0.25 0.08 0 / 0.9), oklch(0.2 0.06 0 / 0.95))",
  },
};


// ============================================================
// PREPARATION TIMES (real-time seconds)
// Based on research: 1 game day ≈ 0.5 seconds
// ============================================================
export const cardPrepTimes: Record<string, number> = {
  // Iran - instant (hours)
  "iran_missile_strike": 0,
  "iran_drone_swarm": 0,
  "iran_cyber": 0,
  "iran_patience": 0,
  "iran_mobilization": 0,
  // Iran - fast (days, 2-5 sec)
  "iran_hormuz": 3,
  "iran_houthi": 3,
  "iran_iraq_militias": 2,
  "iran_hamas": 2,
  "iran_hezbollah_full": 2,
  "iran_bab_el_mandeb": 3,
  // Iran - medium (weeks-months, 10-20 sec)
  "iran_diplomacy": 10,
  "iran_oil_weapon": 10,
  "iran_npt_withdraw": 15,
  "iran_saudi_normalize": 15,
  "iran_strike_us_bases": 0,
  // Iran - long (months, 20-40 sec)
  "iran_nuclear_breakout": 40,
  "iran_nk_nuclear_deal": 35,
  "iran_russia_alliance": 30,
  "iran_china_deal": 25,
  // Iran - very long (years, 40-60 sec)
  "iran_ground_invasion": 50,
  "iran_icbm": 60,
  
  // US - all instant (AI plays immediately)
  "us_sanctions_max": 0,
  "us_strike_nukes": 0,
  "us_carrier_group": 0,
  "us_negotiation_deception": 0,
  "us_cyber_offensive": 0,
  "us_aid_israel": 0,
  "us_intel_opposition": 0,
  "us_ground_invasion": 0,
  "us_nuclear_strike": 0,
  "us_withdraw_me": 0,
  "us_nuclear_umbrella": 0,
  "us_target_irgc": 0,
  "us_oil_blockade": 0,
  "us_hormuz_operation": 0,
  "us_strike_iraq_militias": 0,
  
  // Israel - all instant
  "israel_air_strike": 0,
  "israel_assassination": 0,
  "israel_nuclear_facility": 0,
  "israel_preemptive": 0,
  "israel_sabotage": 0,
  "israel_hezbollah_war": 0,
  "israel_nuclear_strike": 0,
  "israel_cyber": 0,
  "israel_assassinate_leader": 0,
  "israel_strike_iran_oil": 0,
  "israel_hamas_war": 0,
  "israel_diplomatic_isolate": 0,
  "israel_strike_syria": 0,
  "israel_second_strike": 0,
  "israel_nuclear_ambiguity_end": 0,
  
  // Arab - all instant
  "arab_us_alliance": 0,
  "arab_us_bases": 0,
  "arab_oil_increase": 0,
  "arab_patriot_defense": 0,
  "arab_normalize_israel": 0,
  "arab_saudi_nuke": 0,
  "arab_jordan_air_corridor": 0,
  "arab_iraq_pressure": 0,
  
  // NATO - all instant
  "nato_logistics": 0,
  "nato_prosperity_guardian": 0,
  "nato_turkey_article5": 0,
  "nato_eu_sanctions": 0,
  "nato_uk_france_direct": 0,
  
  // NK/Russia/China - all instant
  "nk_missile_tech": 0,
  "russia_veto": 0,
  "russia_s400": 0,
  "china_oil_buyer": 0,
  "china_infra_investment": 0,
};

// Helper function to get prep time
export function getPrepTime(cardId: string): number {
  return cardPrepTimes[cardId] ?? 0;
}

// NEW: Infrastructure cards (ناجوانمردانه)
export type InfraCard = {
  id: string;
  name: string;
  icon: string;
  target: string;
  description: string;
  prepTime: number;
  impact: string;
  isIranTarget: boolean; // true = Iran attacks, false = enemy attacks Iran
};

export const infraCards: InfraCard[] = [
  // Iran → Israel
  { id: "infra_water_israel", name: "آب شیرین‌کن اسرائیل", icon: "💧", target: "🇮🇱 اسرائیل", description: "۸۰٪ آب آشامیدنی اسرائیل", prepTime: 3, impact: "بحران آب فوری", isIranTarget: true },
  { id: "infra_power_israel", name: "شبکه برق اسرائیل", icon: "⚡", target: "🇮🇱 اسرائیل", description: "نیروگاه‌های گازی حیفا/اشکلون", prepTime: 3, impact: "قطع برق هفت‌ها", isIranTarget: true },
  { id: "infra_dimona", name: "سایت دیمونا", icon: "☢️", target: "🇮🇱 اسرائیل", description: "قلب هسته‌ای اسرائیل - خط قرمز", prepTime: 3, impact: "ریسک پاسخ هسته‌ای", isIranTarget: true },
  { id: "infra_airport_israel", name: "فرودگاه بن گوریون", icon: "✈️", target: "🇮🇱 اسرائیل", description: "بزرگ‌ترین فرودگاه اسرائیل", prepTime: 2, impact: "قطع پروازها", isIranTarget: true },
  { id: "infra_haifa_port", name: "بندر حیفا", icon: "🛢️", target: "🇮🇱 اسرائیل", description: "پالایشگاه + بندر", prepTime: 3, impact: "اختلال سوخت", isIranTarget: true },
  // Iran → Saudi
  { id: "infra_oil_fields", name: "چاه‌های نفت عربستان", icon: "🛢️", target: "🇸🇦 عربستان", description: "آبقیق: ۵٪ کاهش جهانی", prepTime: 3, impact: "شوک نفتی", isIranTarget: true },
  { id: "infra_pipeline", name: "خط لوله شرق-غرب", icon: "🛢️", target: "🇸🇦 عربستان", description: "۷ میلیون بشکه/روز", prepTime: 3, impact: "قطع صادرات", isIranTarget: true },
  { id: "infra_saudi_cities", name: "شهرهای جنوبی", icon: "🏠", target: "🇸🇦 عربستان", description: "جیزان، ابها، نجران", prepTime: 2, impact: "فشار روانی", isIranTarget: true },
  // Enemy → Iran
  { id: "infra_natanz", name: "سایت نطنز/فردو", icon: "☢️", target: "🇮🇷 ایران", description: "B-2 + MOP بمباران", prepTime: 0, impact: "تأخیر ۱-۲ سال", isIranTarget: false },
  { id: "infra_missile_sites", name: "پایگاه‌های موشکی", icon: "🚀", target: "🇮🇷 ایران", description: "۳۶۰ حمله در ۲۷ استان", prepTime: 0, impact: "کاهش توان موشکی", isIranTarget: false },
  { id: "infra_kharg", name: "جزیره خارک", icon: "🛢️", target: "🇮🇷 ایران", description: "پایانه صادرات نفت", prepTime: 0, impact: "قطع صادرات نفت", isIranTarget: false },
  { id: "infra_iran_power", name: "شبکه برق ایران", icon: "⚡", target: "🇮🇷 ایران", description: "اعتراف ایران به حمله", prepTime: 0, impact: "فلج اقتصادی", isIranTarget: false },
  // Asymmetric
  { id: "infra_gps", name: "مختل کردن GPS", icon: "🛰️", target: "🌍 منطقه", description: "۱۰۰۰+ شناور تحت تأثیر", prepTime: 0, impact: "اختلال ناوبری", isIranTarget: true },
  { id: "infra_cables", name: "کابل‌های زیردریایی", icon: "📡", target: "🌍 منطقه", description: "۲۵-۳۰٪ اینترنت اروپا-آسیا", prepTime: 2, impact: "اختلال اینترنت", isIranTarget: true },
  { id: "infra_cyber_us", name: "سایبری آمریکا", icon: "💻", target: "🇺🇸 آمریکا", description: "CyberAv3ngers → PLC", prepTime: 20, impact: "اختلال زیرساخت", isIranTarget: true },
];

// Historical cards for timeline
export type HistoryCard = {
  id: string;
  date: string;
  actor: string;
  title: string;
  icon: string;
  result: "yes" | "no" | "partial";
  effect: string;
  fictional?: boolean; // true = سناریوی فرضی، false یا حذف = واقعی
  source?: string;     // منبع تأیید رویداد
};

export const historyCards: HistoryCard[] = [
  { id: "h01", date: "۱۳۳۲/۵/۲۸", actor: "🇺🇸🇬🇧", title: "کودتای ۲۸ مرداد", icon: "💥", result: "yes", effect: "نمادین" },
  { id: "h02", date: "۱۳۴۳/۷/۲۱", actor: "🇺🇸", title: "کاپیتولاسیون", icon: "⚖️", result: "yes", effect: "نمادین" },
  { id: "h03", date: "۱۳۵۷/۱۱/۲۲", actor: "🇮🇷", title: "پیروزی انقلاب اسلامی", icon: "🕌", result: "yes", effect: "بسیارفعال" },
  { id: "h04", date: "۱۳۵۸/۸/۱۳", actor: "🇮🇷", title: "تسخیر لانه جاسوسی", icon: "🏛️", result: "partial", effect: "بسیارفعال" },
  { id: "h05", date: "۱۳۵۹/۶/۳۱", actor: "🇮🇶", title: "هجوم صدام به ایران", icon: "⚔️", result: "partial", effect: "فعال" },
  { id: "h06", date: "۱۳۶۷/۴/۱۲", actor: "🇺🇸", title: "سرنگونی پرواز ۶۵۵", icon: "✈️", result: "yes", effect: "فعال روانی" },
  { id: "h07", date: "۱۳۸۱/۵/۲۳", actor: "🇺🇸", title: "افشای غیرقانونی نطنز", icon: "☢️", result: "yes", effect: "بسیارفعال" },
  { id: "h08", date: "۱۳۸۹/۴", actor: "🇺🇸🇮🇱", title: "سایبرتروریسم استاکس‌نت", icon: "💻", result: "partial", effect: "سابقه" },
  { id: "h09", date: "۱۳۹۴/۴/۲۳", actor: "🇮🇷🇺🇸", title: "برجام (JCPOA)", icon: "✍️", result: "partial", effect: "مرده" },
  { id: "h10", date: "۱۳۹۷/۲/۱۸", actor: "🇺🇸", title: "خروج یک‌جانبه آمریکا از برجام", icon: "🚪", result: "yes", effect: "بسیارفعال" },
  { id: "h11", date: "۱۳۹۸/۱۰/۱۳", actor: "🇺🇸", title: "شهادت سردار سلطیمانی", icon: "🎯", result: "yes", effect: "فعال نمادین" },
  { id: "h12", date: "۱۳۹۹/۹/۷", actor: "🇮🇱", title: "ترور شهید فخری‌زاده", icon: "🔬", result: "yes", effect: "فعال نمادین" },
  { id: "h13", date: "۱۴۰۲/۷/۱۵", actor: "🇵🇸", title: "طوفان الاقصی", icon: "🌪️", result: "yes", effect: "بسیارفعال" },
  { id: "h14", date: "۱۴۰۳/۱/۲۶", actor: "🇮🇷", title: "عملیات وعده صادق ۱", icon: "🚀", result: "partial", effect: "سابقه", source: "ویکی‌پدیا: حملات فروردین ۱۴۰۳ ایران به اسرائیل" },
  { id: "h15", date: "۱۴۰۳/۵/۱۰", actor: "🇮🇱", title: "ترور شهید هنیه در تهران", icon: "🎯", result: "yes", effect: "فعال نمادین" },
  { id: "h16", date: "۱۴۰۳/۷/۶", actor: "🇮🇱", title: "ترور شهید نصرالله", icon: "🎯", result: "yes", effect: "بسیارفعال" },
  { id: "h17", date: "۱۴۰۳/۹/۱۸", actor: "🇸🇾", title: "سقوط دولت بشار اسد", icon: "📉", result: "yes", effect: "بسیارفعال" },
];

// ============================================================
// CURRENTLY ACTIVE CARDS (حذف شد - اخبار روزانه فرضی بودند)
// بازی فقط بر اساس رویدادهای تاریخی تأییدشده تا ۱۴۰۳/۹/۱۸ کار می‌کند
// ============================================================

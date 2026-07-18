// Game cards data: Iran (player), US, Israel (AI)
// Each card has effects on game state and a probability weighting.

export type CardCategory =
  | "nuclear" // هسته‌ای
  | "military" // نظامی
  | "proxy" // نیابتی
  | "diplomatic" // دیپلماتیک
  | "economic" // اقتصادی
  | "cyber" // سایبری
  | "intelligence" // اطلاعاتی
  | "domestic" // داخلی
  | "asymmetric"; // نامتقارن

export type CardEffects = {
  // Iran stats (0-100)
  nuclearProgress?: number; // پیشرفت هسته‌ای
  regionalInfluence?: number; // نفوذ منطقه‌ای
  economicStability?: number; // ثبات اقتصادی
  domesticSupport?: number; // حمایت داخلی
  militaryCapability?: number; // توان نظامی
  deterrence?: number; // بازدارندگی
  // Enemy stats (0-100)
  usPressure?: number; // فشار آمریکا
  israelThreat?: number; // تهدید اسرائیل
  // Probability multipliers for scenarios (typically 0.95-1.2)
  warEscalation?: number; // شانس جنگ گسترده
  nuclearBreakout?: number; // شانس سلاح هسته‌ای
  regimeChange?: number; // شانس تغییر رژیم
  negotiationChance?: number; // شانس مذاکره
};

export type GameCard = {
  id: string;
  name: string;
  nameEn: string;
  category: CardCategory;
  country: "iran" | "us" | "israel";
  description: string;
  longDescription: string;
  effects: CardEffects;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  // For enemy cards: weight in AI random selection
  aiWeight?: number;
  // Specific counter to certain Iran cards (for smarter AI)
  counters?: string[];
};

export const iranCards: GameCard[] = [
  {
    id: "iran_nuclear_breakout",
    name: "غنی‌سازی تا ۹۰٪",
    nameEn: "90% Enrichment",
    category: "nuclear",
    country: "iran",
    description: "افزایش سطح غنی‌سازی اورانیوم به سطح تسلیحاتی.",
    longDescription:
      "پیش‌برد غنی‌سازی اورانیوم از ۶۰٪ فعلی به سطح ۹۰٪ (سلاح). این تصمیم، نقطه عبور آستانه شکستن بازدارندگی است و احتمالاً پاسخ نظامی آمریکا/اسرائیل را به دنبال دارد. در عوض، در صورت موفقیت، یکカード بازدارندگی دائمی است.",
    effects: {
      nuclearProgress: 22,
      deterrence: 15,
      economicStability: -12,
      domesticSupport: 8,
      usPressure: 18,
      israelThreat: 25,
      warEscalation: 1.18,
      nuclearBreakout: 1.35,
      negotiationChance: 0.85,
    },
    icon: "☢️",
    rarity: "legendary",
  },
  {
    id: "iran_proxy_hezbollah",
    name: "فعال‌سازی حزب‌الله",
    nameEn: "Hezbollah Activation",
    category: "proxy",
    country: "iran",
    description: "شلیک روزانه هزاران موشک از لبنان به شمال اسرائیل.",
    longDescription:
      "دستور به حزب‌الله لبنان برای باز کردن جبهه شمالی. ده‌ها هزار موشک کاتیوشا، فجر و فاتح به سمت شهرهای اسرائیلی. این اقدام، اسرائیل را در دو جبهه قرار می‌دهد اما حزب‌الله را نیز در معرض نابودی قرار می‌دهد.",
    effects: {
      regionalInfluence: 12,
      militaryCapability: 8,
      deterrence: 10,
      economicStability: -5,
      israelThreat: 22,
      usPressure: 8,
      warEscalation: 1.15,
      negotiationChance: 0.92,
    },
    icon: "🇱🇧",
    rarity: "epic",
  },
  {
    id: "iran_hormuz",
    name: "بستن تنگه هرمز",
    nameEn: "Strait of Hormuz Blockade",
    category: "asymmetric",
    country: "iran",
    description: "تعطیل شریان نفت جهان، افزایش قیمت نفت به ۲۰۰ دلار.",
    longDescription:
      "استقرار موشک‌های ساحلی، قایق‌های سواری و مین دریایی برای بستن تنگه هرمز. ۲۰٪ نفت جهان از این مسیر عبور می‌کند. قیمت نفت جهانی ۳ برابر می‌شود. اقتصاد جهانی فلج. اما این اقدام مستقیماً نیروی دریایی آمریکا را درگیر می‌کند.",
    effects: {
      economicStability: -15,
      deterrence: 18,
      regionalInfluence: 14,
      militaryCapability: -8,
      usPressure: 28,
      israelThreat: 4,
      warEscalation: 1.22,
      negotiationChance: 1.08,
    },
    icon: "⚓",
    rarity: "legendary",
  },
  {
    id: "iran_cyber",
    name: "حمله سایبری به زیرساخت‌ها",
    nameEn: "Cyberattack on Infrastructure",
    category: "cyber",
    country: "iran",
    description: "حمله به بانک‌ها، شبکه‌های برق و آب آمریکا و اسرائیل.",
    longDescription:
      "استفاده از تیم‌های سایبری پیشرفته (گروه APT35، نصیر و غیره) برای حمله به زیرساخت‌های حیاتی دشمن. روشی کم‌هزینه و قابل انکار. اما خطر پاسخ سایبری ویرانگر توسط NSA و یگان ۸۲۰۰ اسرائیل وجود دارد.",
    effects: {
      deterrence: 8,
      militaryCapability: 4,
      economicStability: 3,
      usPressure: -5,
      israelThreat: -3,
      warEscalation: 1.02,
      negotiationChance: 0.98,
    },
    icon: "💻",
    rarity: "rare",
  },
  {
    id: "iran_diplomacy",
    name: "دیپلماسی فعال",
    nameEn: "Active Diplomacy",
    category: "diplomatic",
    country: "iran",
    description: "مذاکره با چین، روسیه و اروپا برای کاهش فشار.",
    longDescription:
      "فعال‌سازی کانال‌های دیپلماتیک با پکن، مسکو و اروپا. پیشنهاد محدودیت‌های داوطلبانه در برنامه هسته‌ای در ازای رفع تحریم‌ها. موفقیت وابسته به اعتمادسازی است که پس از سال‌ها بسیار ضعیف است.",
    effects: {
      nuclearProgress: -8,
      economicStability: 12,
      domesticSupport: 6,
      deterrence: -5,
      usPressure: -15,
      israelThreat: -6,
      warEscalation: 0.85,
      negotiationChance: 1.35,
      regimeChange: 0.9,
    },
    icon: "🕊️",
    rarity: "rare",
  },
  {
    id: "iran_missile_strike",
    name: "حمله موشکی به اسرائیل",
    nameEn: "Ballistic Missile Strike",
    category: "military",
    country: "iran",
    description: "شلیک صدها موشک بالستیک به سمت تل‌آویو و سایت‌های نظامی.",
    longDescription:
      "عملیات وعده صادق ۳: شلیک ۳۰۰+ موشک بالستیک از جمله هایپرسونیک فتاح-۱ به سمت اسرائیل. برخی از پدافند (پیکان، فلاخن داوود) عبور می‌کنند. تلفات غیرنظامی احتمالی. اما این، اسرائیل را به حمله متقابل گسترده تحریک می‌کند.",
    effects: {
      deterrence: 18,
      militaryCapability: -8,
      domesticSupport: 15,
      economicStability: -6,
      israelThreat: 22,
      usPressure: 14,
      warEscalation: 1.25,
      negotiationChance: 0.88,
    },
    icon: "🚀",
    rarity: "epic",
  },
  {
    id: "iran_mobilization",
    name: "مردم‌سازی و بسیج",
    nameEn: "Mass Mobilization",
    category: "domestic",
    country: "iran",
    description: "بسیج میلیون‌ها داوطلب برای دفاع از کشور.",
    longDescription:
      "اعلام بسیج عمومی. فراخوان بسیج، تشکیل لشکرهای مردمی. افزایش همبستگی ملی و آمادگی برای جنگ طولانی. اما این کار اقتصاد را بیشتر تضعیف می‌کند و جوانان را به جبهه می‌فرستد.",
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
  },
  {
    id: "iran_patience",
    name: "صبر استراتژیک",
    nameEn: "Strategic Patience",
    category: "diplomatic",
    country: "iran",
    description: "خویشتن‌داری، انتظار برای تغییر شرایط.",
    longDescription:
      "تاکتیک قدیمی ایران: صبر کردن، تحمل فشار، امید به تغییر در آمریکا (مثلاً دولت دموکرات) یا فرصت‌های منطقه‌ای. هزینه: تضعیف تدریجی اقتصاد. مزیت: جلوگیری از جنگ.",
    effects: {
      nuclearProgress: 4,
      economicStability: -6,
      domesticSupport: -8,
      deterrence: -3,
      usPressure: -5,
      israelThreat: -4,
      warEscalation: 0.82,
      negotiationChance: 1.15,
      regimeChange: 1.08,
    },
    icon: "⏳",
    rarity: "common",
  },
  {
    id: "iran_drone_swarm",
    name: "حمله پهپادی انبوه",
    nameEn: "Drone Swarm Attack",
    category: "asymmetric",
    country: "iran",
    description: "شلیک صدها پهپاد انتحاری شاهد به اهداف استراتژیک.",
    longDescription:
      "استفاده از پهپادهای شاهد-۱۳۶ و آرش به صورت انبوه. این پهپادها ارزان (۲۰ هزار دلار) و دقت بالا دارند. پدافند اسرائیل برای رهگیری هر یک، موشک ۵۰۰ هزار دلاری شلیک می‌کند. تضعیف اقتصادی دشمن در بلندمدت.",
    effects: {
      militaryCapability: 6,
      deterrence: 8,
      economicStability: 2,
      israelThreat: 10,
      usPressure: 5,
      warEscalation: 1.05,
      negotiationChance: 1.0,
    },
    icon: "🛩️",
    rarity: "rare",
  },
  {
    id: "iran_oil_weapon",
    name: "سلاح نفت",
    nameEn: "Oil Weapon",
    category: "economic",
    country: "iran",
    description: "قطع صادرات نفت به متحدان آمریکا و اسرائیل.",
    longDescription:
      "قطع صادرات نفت به کشورهای همسو با آمریکا و کاهش تولید اوپک. قیمت نفت جهانی جهش می‌کند. اقتصادهای غربی ضربه می‌خورند اما درآمد ایران نیز کاهش می‌یابد. ابزار شمشیر دو لبه.",
    effects: {
      economicStability: -10,
      deterrence: 12,
      regionalInfluence: 8,
      usPressure: -8,
      warEscalation: 1.1,
      negotiationChance: 1.05,
    },
    icon: "🛢️",
    rarity: "rare",
  },
  {
    id: "iran_nuclear_withdraw",
    name: "خروج از NPT",
    nameEn: "Withdraw from NPT",
    category: "nuclear",
    country: "iran",
    description: "خروج از پیمان منع گسترش سلاح‌های هسته‌ای.",
    longDescription:
      "اقدام نمادین و حقوقی بحرانی: خروج از NPT. این اقدام اعلام غیررسمی ورود به باشگاه هسته‌ای است. کره شمالی و اسرائیل تنها کشورهای خارج از این پیمان هستند. پاسخ آمریکا احتمالاً شدید خواهد بود.",
    effects: {
      nuclearProgress: 12,
      deterrence: 10,
      economicStability: -8,
      domesticSupport: 10,
      usPressure: 16,
      israelThreat: 18,
      warEscalation: 1.2,
      nuclearBreakout: 1.25,
      negotiationChance: 0.8,
    },
    icon: "📜",
    rarity: "epic",
  },
  {
    id: "iran_houthi",
    name: "فعال‌سازی حوثی‌ها",
    nameEn: "Houthi Activation",
    category: "proxy",
    country: "iran",
    description: "حمله حوثی‌ها به کشتیرانی دریای سرخ و باب‌المندب.",
    longDescription:
      "دستور به حوثی‌های یمن برای تشدید حملات به کشتی‌های مرتبط با اسرائیل و غرب در دریای سرخ. اختلال در ۱۲٪ تجارت جهانی. آمریکا و بریتانیا مجبور به عملیات نظامی در یمن می‌شوند.",
    effects: {
      regionalInfluence: 8,
      deterrence: 6,
      militaryCapability: 3,
      economicStability: -2,
      usPressure: 10,
      israelThreat: 8,
      warEscalation: 1.08,
      negotiationChance: 1.0,
    },
    icon: "🚢",
    rarity: "rare",
  },
];

export const usCards: GameCard[] = [
  {
    id: "us_sanctions",
    name: "تحریم‌های حداکثری",
    nameEn: "Maximum Sanctions",
    category: "economic",
    country: "us",
    description: "تحریم تمامی صادرات نفت ایران و قطع نظام بانکی.",
    longDescription:
      "اعمال «حالت حداکثری فشار» ترامپ-گونه: تحریم تمامی خرید نفت ایران، قطع از سیستم SWIFT، تحریم ثانویه علیه خریداران. اقتصاد ایران به تورم ۶۰٪ و کاهش ارزش ریال به نصف می‌رسد.",
    effects: {
      economicStability: -20,
      domesticSupport: -10,
      nuclearProgress: -3,
      usPressure: 20,
      warEscalation: 1.08,
      negotiationChance: 0.95,
      regimeChange: 1.15,
    },
    icon: "💸",
    rarity: "rare",
    aiWeight: 18,
    counters: ["iran_nuclear_breakout", "iran_hormuz"],
  },
  {
    id: "us_military_strike",
    name: "حمله نظامی به هسته‌ای",
    nameEn: "Military Strike on Nukes",
    category: "military",
    country: "us",
    description: "بمباران تأسیسات هسته‌ای با بمب‌های MOP.",
    longDescription:
      "حمله B-2 با بمب‌های GBU-57 (MOP) به فردو، نطنز و اسپاد. ناوهای آمریکایی موشک کروز شلیک می‌کنند. آسیب جدی به برنامه هسته‌ای اما شروع یک جنگ گسترده است.",
    effects: {
      nuclearProgress: -30,
      militaryCapability: -15,
      domesticSupport: 18,
      deterrence: -8,
      usPressure: 15,
      israelThreat: 8,
      warEscalation: 1.5,
      negotiationChance: 0.7,
    },
    icon: "✈️",
    rarity: "legendary",
    aiWeight: 8,
    counters: ["iran_nuclear_breakout", "iran_nuclear_withdraw"],
  },
  {
    id: "us_naval_pressure",
    name: "اعزام ناو هواپیمابر",
    nameEn: "Carrier Strike Group",
    category: "military",
    country: "us",
    description: "اعزام دو ناو هواپیمابر به خلیج فارس.",
    longDescription:
      "اعزام گروه ناو هواپیمابر آبراهام لینکلن و کارل وینسون به خلیج فارس. ۱۲۰ هواپیما، ۹۰ هلیکوپتر، ۸۰۰۰ سرباز. نمایش قدرت، بازدارندگی، آماده برای حمله.",
    effects: {
      militaryCapability: -8,
      deterrence: -5,
      usPressure: 16,
      warEscalation: 1.12,
      negotiationChance: 0.95,
    },
    icon: "🛳️",
    rarity: "epic",
    aiWeight: 14,
  },
  {
    id: "us_negotiation",
    name: "پیشنهاد مذاکره",
    nameEn: "Negotiation Offer",
    category: "diplomatic",
    country: "us",
    description: "پیشنهاد مذاکره بدون پیش‌شرط با رهبری ایران.",
    longDescription:
      "بایدن-گونه: پیشنهاد مذاکره مستقیم بدون پیش‌شرط. کاهش تحریم‌ها در ازای محدودیت‌های هسته‌ای. سیگنال مثبت به جامعه جهانی اما خطر رد توسط ایران به دلیل بی‌اعتمادی عمیق.",
    effects: {
      economicStability: 10,
      nuclearProgress: -6,
      usPressure: -10,
      israelThreat: -3,
      warEscalation: 0.8,
      negotiationChance: 1.5,
      regimeChange: 0.95,
    },
    icon: "🤝",
    rarity: "rare",
    aiWeight: 10,
    counters: ["iran_diplomacy", "iran_patience"],
  },
  {
    id: "us_cyber_offensive",
    name: "حمله سایبری گسترده",
    nameEn: "Major Cyber Offensive",
    category: "cyber",
    country: "us",
    description: "حمله NSA به زیرساخت‌های نظامی و غیرنظامی ایران.",
    longDescription:
      "عملیات استرلنگ (Stuxnet-like): حمله سایبری NSA و سایبرکام به شبکه‌های فرماندهی سپاه، سامانه‌های پدافندی، شبکه‌های ارتباطی. قابل انکار، کم‌هزینه، اما ممکن است ایران را به تلافی وامی‌دارد.",
    effects: {
      militaryCapability: -10,
      nuclearProgress: -4,
      deterrence: -5,
      usPressure: 8,
      warEscalation: 1.04,
    },
    icon: "👾",
    rarity: "rare",
    aiWeight: 12,
    counters: ["iran_cyber"],
  },
  {
    id: "us_aid_israel",
    name: "حمایت همه‌جانبه از اسرائیل",
    nameEn: "Full Israel Support",
    category: "diplomatic",
    country: "us",
    description: "ارسال پاتریوت، تاد و مهمات اضطراری به اسرائیل.",
    longDescription:
      "اعزام سیستم‌های پاتریوت و تاد، مهمات هوشمند، سوخت نظامی. همچنین حمایت دیپلماتیک در سازمان ملل. تشدید همکاری نظامی آمریکا-اسرائیل به بالاترین سطح تاریخ.",
    effects: {
      israelThreat: 16,
      militaryCapability: -6,
      usPressure: 8,
      warEscalation: 1.08,
      negotiationChance: 0.92,
    },
    icon: "🇺🇸",
    rarity: "epic",
    aiWeight: 16,
    counters: ["iran_missile_strike", "iran_proxy_hezbollah"],
  },
  {
    id: "us_intel_support",
    name: "اطلاعات به مخالفان",
    nameEn: "Intel to Opposition",
    category: "intelligence",
    country: "us",
    description: "کمک اطلاعاتی و مالی به گروه‌های مخالف داخلی.",
    longDescription:
      "حمایت از شبکه‌های مخالف، پخش رادیویی و ماهواره‌ای، کمک به سازمان‌های حقوق بشری. نرم‌افزاری برای دور زدن فیلترینگ. هدف: تغییر رژیم نرم.",
    effects: {
      domesticSupport: -15,
      economicStability: -5,
      deterrence: -4,
      usPressure: 8,
      regimeChange: 1.4,
      warEscalation: 1.02,
    },
    icon: "🕵️",
    rarity: "rare",
    aiWeight: 10,
  },
  {
    id: "us_diplomatic_isolation",
    name: "انزوای دیپلماتیک",
    nameEn: "Diplomatic Isolation",
    category: "diplomatic",
    country: "us",
    description: "فشار به کشورهای عربی و اروپایی برای قطع روابط.",
    longDescription:
      "کاخ سفید از ابوظبی، ریاض، دoha و آنکارا می‌خواهد روابط خود را با تهران کاهش دهند. توافق ابراهیم دچار شکاف می‌شود. ایران منزوی‌تر می‌شود اما به سمت روسیه و چین سوق می‌یابد.",
    effects: {
      regionalInfluence: -12,
      economicStability: -8,
      usPressure: 12,
      warEscalation: 1.05,
      negotiationChance: 0.92,
      regimeChange: 1.08,
    },
    icon: "🌐",
    rarity: "common",
    aiWeight: 12,
  },
];

export const israelCards: GameCard[] = [
  {
    id: "israel_air_strike",
    name: "حمله هوایی گسترده",
    nameEn: "Massive Airstrike",
    category: "military",
    country: "israel",
    description: "حمله ۱۰۰ جنگنده به تأسیسات نظامی و موشکی ایران.",
    longDescription:
      "عملیات روزهای بلند: ۱۰۰+ جنگنده F-35، F-15، F-16 به تأسیسات پدافندی، موشکی، تولید پهپاد و فرودگاه‌های نظامی حمله می‌کنند. ضربه جدی به توان نظامی ایران اما پاسخ موشکی قطعی است.",
    effects: {
      militaryCapability: -18,
      nuclearProgress: -10,
      deterrence: -10,
      domesticSupport: 14,
      israelThreat: 18,
      usPressure: 6,
      warEscalation: 1.35,
      negotiationChance: 0.85,
    },
    icon: "🛩️",
    rarity: "legendary",
    aiWeight: 12,
    counters: ["iran_missile_strike", "iran_nuclear_breakout"],
  },
  {
    id: "israel_assassination",
    name: "ترور فرماندهان ارشد",
    nameEn: "Targeted Assassination",
    category: "intelligence",
    country: "israel",
    description: "ترور فرماندهان سپاه و دانشمندان هسته‌ای.",
    longDescription:
      "موساد یک کمپین ترور آغاز می‌کند: فرماندهان نیروی قدس، دانشمندان هسته‌ای، مهندسان موشکی. روش‌ها: بمب‌های متصل به خودرو، شلیک از راه دور، مسمومیت. ضربه به بازدارندگی و حیثیت ایران.",
    effects: {
      militaryCapability: -8,
      nuclearProgress: -6,
      deterrence: -8,
      domesticSupport: 10,
      israelThreat: 12,
      warEscalation: 1.15,
      negotiationChance: 0.9,
    },
    icon: "🎯",
    rarity: "epic",
    aiWeight: 16,
    counters: ["iran_nuclear_breakout", "iran_proxy_hezbollah"],
  },
  {
    id: "israel_nuclear_facility",
    name: "حمله به نطنز و فردو",
    nameEn: "Strike on Natanz & Fordow",
    category: "military",
    country: "israel",
    description: "حمله مستقیم به قلب برنامه هسته‌ای ایران.",
    longDescription:
      "حمله F-35 با بمب‌های سنگرشکن به تأسیسات هسته‌ای نطنز، فردو و اسپاد. آسیب جدی به سانتریفیوژها. این حمله یک قرمز خط قطعی ایران است و حمله متقابل موشکی قطعی است.",
    effects: {
      nuclearProgress: -25,
      deterrence: -12,
      militaryCapability: -5,
      domesticSupport: 18,
      israelThreat: 20,
      usPressure: 8,
      warEscalation: 1.45,
      nuclearBreakout: 0.9,
      negotiationChance: 0.78,
    },
    icon: "☢️",
    rarity: "legendary",
    aiWeight: 10,
    counters: ["iran_nuclear_breakout", "iran_nuclear_withdraw"],
  },
  {
    id: "israel_sabotage",
    name: "خرابکاری صنعتی",
    nameEn: "Industrial Sabotage",
    category: "intelligence",
    country: "israel",
    description: "خرابکاری در کارخانه‌های موشکی و سایبری.",
    longDescription:
      "موساد در کارخانه‌های تولید موشک، سایت‌های پهپادی و سیستم‌های سایبری نفوذ می‌کند. انفجارها، آتش‌سوزی‌ها، خرابی‌های نرم‌افزاری. ضربه زیر پوست، قابل انکار اما تأثیر بلندمدت.",
    effects: {
      militaryCapability: -8,
      nuclearProgress: -4,
      deterrence: -4,
      israelThreat: 6,
      warEscalation: 1.04,
      negotiationChance: 0.98,
    },
    icon: "🔧",
    rarity: "rare",
    aiWeight: 14,
  },
  {
    id: "israel_hezbollah_strike",
    name: "حمله به حزب‌الله",
    nameEn: "Strike on Hezbollah",
    category: "military",
    country: "israel",
    description: "حمله هوایی گسترده به مواضع حزب‌الله در لبنان.",
    longDescription:
      "اسرائیل هزاران موشک حزب‌الله را در لبنان نابود می‌کند. ترور رهبران ارشد. حزب‌الله به‌شدت تضعیف می‌شود اما بقایای آن به شهرهای شمالی اسرائیل شلیک می‌کنند.",
    effects: {
      regionalInfluence: -12,
      militaryCapability: 4,
      deterrence: -3,
      israelThreat: 14,
      warEscalation: 1.18,
      negotiationChance: 0.95,
    },
    icon: "🇱🇧",
    rarity: "epic",
    aiWeight: 12,
    counters: ["iran_proxy_hezbollah"],
  },
  {
    id: "israel_diplomatic",
    name: "دیپلماسی ضد ایرانی",
    nameEn: "Anti-Iran Diplomacy",
    category: "diplomatic",
    country: "israel",
    description: "هماهنگی با عربستان و اردن علیه ایران.",
    longDescription:
      "نتانیاهو با عربستان، امارات، اردن و بحرین هماهنگ می‌کند. توافق‌های امنیتی، مانورهای مشترک، تبادل اطلاعات. تشکیل ائتلاف نظامی ضدایرانی.",
    effects: {
      regionalInfluence: -10,
      economicStability: -4,
      israelThreat: 8,
      usPressure: 6,
      warEscalation: 1.04,
      negotiationChance: 0.95,
    },
    icon: "🌐",
    rarity: "common",
    aiWeight: 10,
  },
  {
    id: "israel_preemptive",
    name: "حمله پیش‌دگیرانه",
    nameEn: "Pre-emptive Strike",
    category: "military",
    country: "israel",
    description: "حمله غافلگیرانه همه‌جانبه با ۲۰۰ جنگنده.",
    longDescription:
      "«عملیات نبرد پایان»: حمله همزمان به هسته‌ای، موشکی، پدافندی و فرماندهی سپاه. ساعت‌اول: ۵۰۰ هدف. تصمیم بسیار پرخطیر که احتمالاً به جنگ تمام‌عیار منطقه‌ای ختم می‌شود.",
    effects: {
      nuclearProgress: -20,
      militaryCapability: -15,
      deterrence: -15,
      domesticSupport: 20,
      israelThreat: 25,
      usPressure: 12,
      warEscalation: 1.6,
      negotiationChance: 0.7,
    },
    icon: "💥",
    rarity: "legendary",
    aiWeight: 6,
    counters: ["iran_nuclear_breakout", "iran_nuclear_withdraw"],
  },
  {
    id: "israel_cyber",
    name: "حمله سایبری یگان ۸۲۰۰",
    nameEn: "Unit 8200 Cyber Strike",
    category: "cyber",
    country: "israel",
    description: "حمله به شبکه‌های بانکی، مخابراتی و نظامی ایران.",
    longDescription:
      "یگان ۸۲۰۰ اسرائیل با بدافهای پیشرفته به بانک مرکزی، شبکه مخابرات، سیستم‌های پدافندی و شبکه سپاه حمله می‌کند. ضربه قابل انکار اما بسیار مؤثر.",
    effects: {
      economicStability: -12,
      militaryCapability: -6,
      deterrence: -4,
      israelThreat: 8,
      warEscalation: 1.06,
    },
    icon: "🦠",
    rarity: "rare",
    aiWeight: 14,
    counters: ["iran_cyber"],
  },
];

export const allEnemyCards = [...usCards, ...israelCards];

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
};

export const rarityInfo: Record<GameCard["rarity"], { label: string; color: string }> = {
  common: { label: "معمولی", color: "oklch(0.7 0.02 80)" },
  rare: { label: "کمیاب", color: "oklch(0.65 0.18 250)" },
  epic: { label: "حماسی", color: "oklch(0.65 0.2 305)" },
  legendary: { label: "افسانه‌ای", color: "oklch(0.7 0.22 35)" },
};

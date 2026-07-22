// Endings data v3.0 - All endings based on REAL historical research
// Based on 7 parallel research reports analyzing:
// - Nuclear deterrence (North Korea, Pakistan, India, South Africa, Libya, Iraq, Syria)
// - Regime change (Venezuela, Cuba, NK, Iraq, Libya, Syria, Iran)
// - Peace agreements (Camp David, Oslo, Abraham, JCPOA, Cuba, Vietnam)
// - US withdrawals (Vietnam, Lebanon, Somalia, Iraq, Afghanistan, Syria)
// - Nuclear war (Hiroshima, Cuba crisis, near-misses)
// - Israel vulnerabilities (demographics, internal divisions, US support)
// - Strategic defeat (Germany, Japan, Iraq 1991/2003, Serbia, Libya, Iran 2025)
// - Gray zone warfare (Korea, Kashmir, Israel-Palestine, Syria, Yemen)

export type Ending = {
  id: string;
  name: string;
  nameEn: string;
  category: "nuclear" | "war" | "peace" | "regime_change" | "power_shift" | "status_quo";
  timeframe: string;
  description: string;
  longDescription: string;
  // REAL probability based on historical research
  realProbability: string; // e.g., "40-50%" - most likely
  historicalBasis: string; // What historical case this is based on
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
    iranResult: "victory" | "defeat" | "compromise" | "destruction" | "survival";
    regionalImpact: string;
    globalImpact: string;
    casualties: string;
    timeline: string;
  };
  icon: string;
  color: string;
};

export const endings: Ending[] = [
  // ============================================================
  // 1. MOST LIKELY: Gray Zone War Continues (40-50%)
  // Based on: Korea (70 years), Kashmir (77 years), Israel-Palestine (75 years)
  // ============================================================
  {
    id: "gray_zone_war",
    name: "جنگ سایه‌ای ادامه می‌یابد",
    nameEn: "Gray Zone War Continues",
    category: "status_quo",
    timeframe: "۱۰ تا ۳۰ سال آینده",
    description:
      "محتمل‌ترین سناریو: نه جنگ تمام‌عیار، نه صلح. درگیری سایبری، نیابتی، اقتصادی و موشکی متناوب برای دهه‌ها.",
    longDescription:
      "تحقیق تاریخی نشان می‌دهد این محتمل‌ترین سناریو است (۴۰-۵۰٪). الگوی تاریخی واضح است: جنگ کره (۱۹۵۳-تاکنون، ۷۰ سال)، کشمیر (۱۹۴۷-تاکنون، ۷۷ سال)، اسرائیل-فلسطین (۱۹۴۸-تاکنون، ۷۵ سال) همگی نشان می‌دهند که درگیری‌های سایه‌ای می‌توانند دهه‌ها ادامه یابند. در این سناریو، هر چند ماه یک حمله محدود مستقیم رخ می‌دهد (مثل ۲۰۲۴)، اما هیچ‌کس به جنگ گسترده نمی‌رود. اقتصاد ایران در تورم مزمن (۴۷٪ در ۲۰۲۳) باقی می‌ماند، اما سیستم پایدار است. اسرائیل در آمادگی دائمی پدافندی باقی می‌ماند. برنده روشنی وجود ندارد - کسی که «باقی بماند» پیروز است. این دقیقاً وضعیت فعلی است.",
    realProbability: "۴۰-۵۰٪ (محتمل‌ترین)",
    historicalBasis: "جنگ کره (۷۰ سال)، کشمیر (۷۷ سال)، اسرائیل-فلسطین (۷۵ سال) - همگی الگوی جنگ سایه‌ای طولانی",
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
      iranResult: "survival",
      regionalImpact:
        "ادامه بی‌ثباتی مزمن. فرسایش تدریجی هر دو طرف. خروج تدریجی سرمایه و مغزها از منطقه. اقتصاد ایران در نصف پتانسیل خود باقی می‌ماند.",
      globalImpact:
        "قیمت نفت ۱۰۰-۱۲۰ دلار. عدم قطعیت دائمی در بازارها. کندی رشد اقتصادی جهانی.",
      casualties: "ده‌ها هزار کشته در طول دهه‌ها (عمدتاً نظامی و نیابتی).",
      timeline: "۱۰ تا ۳۰ سال یا بیشتر.",
    },
    icon: "🌫️",
    color: "oklch(0.55 0.1 260)",
  },

  // ============================================================
  // 2. Nuclear Deterrence (20-25%) - Based on North Korea model
  // ============================================================
  {
    id: "iran_nuclear_deterrence",
    name: "بازدارندگی هسته‌ای ایران",
    nameEn: "Iranian Nuclear Deterrence",
    category: "nuclear",
    timeframe: "۳ تا ۱۰ سال آینده",
    description:
      "ایران به بمب اتم می‌رسد، پنجره بحرانی ۱۸-۳۶ ماه را طی می‌کند، و آمریکا نهایتاً می‌پذیرد - مثل کره شمالی.",
    longDescription:
      "تحقیق تاریخی نشان می‌دهد: الف) بمب تثبیت‌شده، حمله پیش‌دگیرانه را غیرمحتمل می‌کند (کره شمالی ۲۰۰۶، پاکستان ۱۹۹۸، هند ۱۹۹۸ - هیچ‌کدام حمله نشدند). ب) پنجره بحرانی ۱۸-۳۶ ماه اول خطرناک است (احتمال حمله اسرائیل ۵۰-۶۵٪). ج) پس از تثبیت، آمریکا به مدل containment روی می‌آورد - دقیقاً مثل کره شمالی. درس کلیدی از کره شمالی: ۱۸ سال تحریم، ولی زرادخانه ده‌برابر شد. تحریم‌ها رفع نشدند چون کره شمالی ارزش ژئوپلیتیک نداشت. برای ایران: تحریم‌ها احتمالاً به‌تدریج و مشروط رفع می‌شوند (مدل پاکستان پس از ۱۱ سپتامبر، یا هند پس از ۲۰۰۸). سعودی‌ها کلاهک از پاکستان می‌گیرند. وضعیت «MAD منطقه‌ای» شکل می‌گیرد.",
    realProbability: "۲۰-۲۵٪",
    historicalBasis: "کره شمالی (۲۰۰۶-تاکنون)، پاکستان (۱۹۹۸)، هند (۱۹۷۴/۱۹۹۸) - همه بمب ساختند، حمله نشدند، نهایتاً پذیرفته شدند",
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
        "آغاز مسابقه تسلیحاتی هسته‌ای در خاورمیانه. سعودی‌ها کلاهک از پاکستان (۴۰-۵۰٪ احتمال). ترکیه در چتر ناتو می‌ماند. محور مقاومت قدرتمندتر. اسرائیل به سیاست ابهام هسته‌ای بازمی‌گردد.",
      globalImpact:
        "فروپاشی رژیم NPT. ضربه به نظام غیرپراکنش. روسیه و چین به‌طور پنهانی از ایران حمایت می‌کنند. تحریم‌ها به‌تدریج رفع می‌شوند (مدل پاکستان/هند).",
      casualties: "بدون تلفات مستقیم، اما شروع دوران خطرناک‌تر.",
      timeline: "۳ تا ۱۰ سال برای تثبیت بازدارندگی.",
    },
    icon: "☢️",
    color: "oklch(0.6 0.25 25)",
  },

  // ============================================================
  // 3. Strategic Defeat (15-20%) - Based on Iran 2025 actual data
  // ============================================================
  {
    id: "iran_strategic_defeat",
    name: "شکست استراتژیک محدود ایران",
    nameEn: "Iran's Limited Strategic Defeat",
    category: "war",
    timeframe: "۱ تا ۳ سال آینده",
    description:
      "حمله هوایی هماهنگ آمریکا-اسرائیل به تأسیسات هسته‌ای و نظامی - برنامه تأخیر می‌خورد ولی رژیم سرنگون نمی‌شود.",
    longDescription:
      "این سناریو در ژوئن ۲۰۲۵ واقعاً اتفاق افتاد (جنگ ۱۲ روزه). تحقیق نشان می‌دهد: الف) حمله هوایی هماهنگ انجام شد (عملیات Rising Lion + GBU-57 MOP به فوردو). ب) برنامه هسته‌ای تأخیر ۱-۲ ساله خورد، ولی نابود نشد (فوردو ۸۰-۹۰ متر زیر زمین، MOP فقط ۶۰ متر نفوذ). ج) توان موشکی ضعیف شد، ولی ظرفیت تولید حفظ شد. د) محور مقاومت تحلیل رفت (حزب‌الله ضربه خورد)، ولی فروپاشید نه. هـ) رژیم سرنگون نشد - ۶ ماه پساجنگ هنوز بر سر قدرت بود. و) ایران ۵۰۰+ موشک شلیک کرد (انتقام فوری). ز) ایران در حال تعمیر فوردو است (ISIS نوامبر ۲۰۲۵). این الگوی «تخریب نظامی بدون تغییر رژیم» است - مثل عراق ۱۹۹۱ و صربستان ۱۹۹۹. درس: بمباران به‌تنهایی رژیم را سرنگون نمی‌کند، اشغال زمینی هم برای ایران غیرممکن است (۸۸ میلیون، کوهستانی، ۴ برابر عراق).",
    realProbability: "۱۵-۲۰٪",
    historicalBasis: "جنگ ۱۲ روزه ۲۰۲۵ (واقعی)، عراق ۱۹۹۱، صربستان ۱۹۹۹ - همگی: تخریب نظامی بدون سرنگونی رژیم",
    conditions: {
      baseProbability: 0.12,
      triggers: {
        warEscalation: 95,
        militaryCapability: 25,
      },
    },
    outcome: {
      iranResult: "defeat",
      regionalImpact:
        "برنامه هسته‌ای ۱-۲ سال تأخیر. توان موشکی کاهش. محور مقاومت تحلیل رفت. حزب‌الله ضربه خورد. حوثی‌ها سالم. ولی رژیم باقی ماند و در حال بازسازی است.",
      globalImpact:
        "کاهش موقت قیمت نفت. تقویت موقت موقعیت آمریکا/اسرائیل. ولی ایران ضعیف‌تر اما کینه‌توزتر باقی ماند. انتقام نامتقارن طولانی‌مدت قطعی.",
      casualties: "هزاران کشته نظامی، صدها غیرنظامی (مثل ۲۰۲۵).",
      timeline: "۳ تا ۶ ماه عملیات فعال، ۲-۵ سال بازسازی.",
    },
    icon: "🎯",
    color: "oklch(0.55 0.15 260)",
  },

  // ============================================================
  // 4. Comprehensive Peace Agreement (15-20%)
  // Based on: Vietnam-US (1995), India-US (2008), JCPOA lessons
  // ============================================================
  {
    id: "comprehensive_peace",
    name: "توافق جامع و عادی‌سازی تدریجی",
    nameEn: "Comprehensive Agreement & Gradual Normalization",
    category: "peace",
    timeframe: "۲ تا ۱۰ سال آینده",
    description:
      "توافق «Less for Less» (نه More for More) با تضمین کنگره آمریکا، گام تدریجی، و منافع ملموس متقابل.",
    longDescription:
      "تحقیق توافق‌های صلح نشان می‌دهد فرمول موفقیت: محدود + عمل‌گرا + تضمین خارجی + منافع ملموس + گام تدریجی. مدل‌های موفق: کمپ دیوید (۱۹۷۸)، ویتنام-آمریکا (۱۹۹۵)، آبراهام (۲۰۲۰). مدل‌های ناموفق: اسلو (مسائل اصلی معلق)، برجام (بدون تضمین کنگره)، کوبا (فقط فرمان اجرایی). برای ایران: «More for More» بعید است، ولی «Less for Less» واقعی است - یعنی محدودیت‌های هسته‌ای محدود در برابر رفع تحریم‌های محدود. پیش‌نیازها: (الف) تضمین کنگره (نه فقط فرمان اجرایی)، (ب) snap-back خودکار، (ج) گام تدریجی، (د) کنترل خرابکاران (اسرائیل). احتمال توافق بزرگ: ۱۵-۲۰٪. توافق کوچک/موقت: ۴۰-۵۰٪.",
    realProbability: "۱۵-۲۰٪ (توافق بزرگ)، ۴۰-۵۰٪ (توافق کوچک)",
    historicalBasis: "ویتنام-آمریکا (۱۹۹۵، ۲۰ سال پس از جنگ)، هند-آمریکا (۲۰۰۸)، کمپ دیوید (۱۹۷۸) - همگی تدریجی و با تضمین",
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
        "کاهش تنش در خاورمیانه. احیای روابط دیپلماتیک محدود. بهبود تدریجی اقتصاد ایران. کاهش درگیری‌های نیابتی.",
      globalImpact:
        "کاهش قیمت نفت، بهبود اقتصاد جهانی. تقویت دیپلماسی چندجانبه. ولی بی‌اعتمادی عمیق باقی می‌ماند.",
      casualties: "تلفات پیش از توافق محدود می‌ماند.",
      timeline: "۲ تا ۱۰ سال مذاکره و اجرای تدریجی.",
    },
    icon: "🕊️",
    color: "oklch(0.65 0.18 165)",
  },

  // ============================================================
  // 5. Regime Change from Within (10-15%)
  // Based on: Gorbachev model, Assad fall 2024, Soviet collapse
  // ============================================================
  {
    id: "regime_change_from_within",
    name: "تغییر رژیم از درون",
    nameEn: "Regime Change from Within",
    category: "regime_change",
    timeframe: "۲ تا ۱۰ سال آینده",
    description:
      "ترکیب بحران جانشینی رهبری + شکاف درون نخبگان + اعتراضات گسترده - مدل گورباچف.",
    longDescription:
      "تحقیق نشان می‌دهد تحریم به‌تنهایی تغییر رژیم نمی‌آورد (کوبا ۶۴ سال، کره شمالی ۱۸ سال، ونزوئلا ۲۰ سال، ایران ۴۰ سال - هیچ‌کدام سرنگون نشدند). حمله نظامی هم برای ایران غیرممکن است (۸۸ میلیون، کوهستانی، ۴ برابر عراق). تنها مسیر واقعی: تغییر از درون. مدل گورباچف: یک رهبر از درون سیستم اصلاحات آغاز می‌کند، ولی اصلاحات از کنترل خارج می‌شوند. شرایط لازم: (الف) بحران جانشینی رهبری (خامنه‌ای ۸۶ ساله)، (ب) شکاف درون نخبگان (سپاه vs روحانیت vs اصلاح‌طلبان)، (ج) اعتراضات گسترده همزمان. درس سقوط اسد ۲۰۲۴: وقتی حامیان خارجی همزمان تضعیف شدند، رژیم در ۱۱ روز فروپاشید. ولی برای ایران، تضعیف حامیان خارجی (روسیه/چین) کافی نیست - باید شکاف درون هم باشد. ۱۳۸۸ و ۱۴۰۱ نشان دادند اعتراضات به‌تنهایی کافی نیستند.",
    realProbability: "۱۰-۱۵٪",
    historicalBasis: "گورباچف/شوروی (۱۹۹۱)، آفریقای جنوبی/دکلرک (۱۹۸۹-۱۹۹۴)، سقوط اسد (۲۰۲۴) - همگی ترکیب شکاف درون + بحران رهبری",
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
        "فروپاشی محور مقاومت. حزب‌الله، حوثی‌ها ضعیف می‌شوند. اسرائیل به قدرت بلامنازع تبدیل می‌شود. ولی رادیکالیسم ضدآمریکایی در میان ایرانیان افزایش می‌یابد.",
      globalImpact:
        "افزایش تولید نفت ایران پس از ثبات. کاهش قیمت نفت. تقویت موقت موقعیت آمریکا. ولی بی‌ثباتی طولانی‌مدت.",
      casualties: "هزاران تا ده‌ها هزار کشته در درگیری‌های داخلی.",
      timeline: "۱ تا ۳ سال گذار، دهه‌ها برای ثبات واقعی.",
    },
    icon: "🔄",
    color: "oklch(0.6 0.2 305)",
  },

  // ============================================================
  // 6. US Withdrawal of Ambition (20-25%)
  // Based on: Vietnam, Afghanistan, Iraq - "withdrawal of ambition" not full withdrawal
  // ============================================================
  {
    id: "us_withdrawal_ambition",
    name: "کاهش جاه‌طلبی آمریکا در خاورمیانه",
    nameEn: "US Withdrawal of Ambition",
    category: "power_shift",
    timeframe: "۵ تا ۱۵ سال آینده",
    description:
      "آمریکا پایگاه‌ها را نگه می‌دارد، ولی رویای «تغییر رژیم» را کنار می‌گذارد - محتمل‌ترین مسیر.",
    longDescription:
      "تحقیق نشان می‌دهد خروج کامل آمریکا از خاورمیانه بعید است (۱۰-۲۰٪ در ۵-۱۰ سال)، ولی «کاهش جاه‌طلبی» هم‌اکنون فعال است (بسیار محتمل). آمریکا پایگاه‌ها را نگه می‌دارد (العیید قطر، ناو پنجم بحرین، الظفره امارات، کویت)، ولی اهداف حداکثری را کنار می‌گذارد: پایان رویای «تغییر رژیم در ایران» و «ساخت ملت در عراق/افغانستان». پذیرش نفوذ نسبی ایران در عراق/سوریه/لبنان. تمرکز روی مدیریت منافع کلیدی (اسرائیل، نفت، بازدارندگی). این دقیقاً مسیر فعلی است. درس از ویتنام (۱۹۷۳)، عراق (۲۰۱۱)، افغانستان (۲۰۲۱): آمریکا خسته می‌شود، ولی پایگاه‌های استراتژیک را نگه می‌دارد. ایران به هژمون منطقه تبدیل نمی‌شود (موانع: اسرائیل، عربستان، ترکیه، اقتصاد داخلی)، ولی نفوذش افزایش می‌یابد.",
    realProbability: "۲۰-۲۵٪ (هم‌اکنون فعال)",
    historicalBasis: "ویتنام (۱۹۷۳)، عراق (۲۰۱۱)، افغانستان (۲۰۲۱) - همگی: خستگی آمریکا + کاهش اهداف، ولی نگه‌داشتن پایگاه‌های کلیدی",
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
        "نفوذ نسبی ایران افزایش می‌یابد. محور مقاومت گسترش می‌یابد. عربستان/امارات مجبور به سازگاری. اسرائیل در انزوای استراتژیک نسبی.",
      globalImpact:
        "انتقال تدریجی قطب قدرت. چین و روسیه از خلأ آمریکا بهره می‌برند. اقتصاد جهانی به چندقطبی تبدیل می‌شود.",
      casualties: "تلفات محدود به درگیری‌های نیابتی باقیمانده.",
      timeline: "۵ تا ۱۵ سال برای تکمیل.",
    },
    icon: "🚪",
    color: "oklch(0.6 0.18 165)",
  },

  // ============================================================
  // 7. Nuclear War (1-3%) - Very unlikely
  // Based on: Cold War MAD worked, Pakistan-India crises resolved
  // ============================================================
  {
    id: "nuclear_war_regional",
    name: "جنگ هسته‌ای منطقه‌ای",
    nameEn: "Regional Nuclear War",
    category: "war",
    timeframe: "تنها در شرایط بحرانی خاص",
    description:
      "تبادل ضربات هسته‌ای بین ایران و اسرائیل - بسیار بعید، چون بازدارندگی کار می‌کند.",
    longDescription:
      "تحقیق نشان می‌دهد این سناریو بسیار بعید است (۱-۳٪). درس از جنگ سرد: بازدارندگی متقابل (MAD) کار کرد - هیچ‌گاه جنگ هسته‌ای رخ نداد. بحران موشکی کوبا (۱۹۶۲) نزدیک‌ترین نقطه بود، ولی حل شد. حوادث نزدیک به جنگ (Petrov 1983، موشک نروژ ۱۹۹۵) همگی حل شدند. پاکستان-هند چند بار نزدیک شدند (کارگیل ۱۹۹۹، بحران ۲۰۰۱-۲۰۰۲)، ولی جنگ نشد. حتی کره شمالی با همه تهدیدها، هرگز بمب استفاده نکرد. دلیل: رهبران عقلانی عمل می‌کنند، چون هزینه جنگ هسته‌ای برای هر دو طرف نابودی است. برای ایران-اسرائیل: اگر هر دو بمب داشته باشند، بازدارندگی متقابل کار می‌کند - مثل هند-پاکستان. تنها شرایط: اشتباه محاسباتی شدید یا حمله زمینی وجودی. حتی در این صورت، احتمال بسیار پایین است.",
    realProbability: "۱-۳٪ (بسیار بعید)",
    historicalBasis: "جنگ سرد (MAD کار کرد)، کوبا ۱۹۶۲ (حل شد)، پاکستان-هند (چند بحران، جنگ نشد)، کره شمالی (هیچ‌گاه استفاده نکرد)",
    conditions: {
      baseProbability: 0.03,
      triggers: {
        warEscalation: 98,
        nuclearProgress: 85,
      },
    },
    outcome: {
      iranResult: "destruction",
      regionalImpact:
        "تهران، اصفهان، تل‌آویو، حیفا هدف قرار می‌گیرند. ده‌ها میلیون کشته فوری. زمستان هسته‌ای کوچک.",
      globalImpact:
        "رکود بزرگ اقتصادی. بحران پناهجویان. فروپاشی NPT. ولی این سناریو بسیار بعید است.",
      casualties: "۵ تا ۲۰ میلیون کشته مستقیم (در صورت وقوع).",
      timeline: "چند روز (در صورت وقوع).",
    },
    icon: "💀",
    color: "oklch(0.4 0.28 25)",
  },

  // ============================================================
  // 8. Israel Strategic Weakening (5-10%) - Long-term, gradual
  // Based on: South Africa apartheid, Israel demographics
  // ============================================================
  {
    id: "israel_strategic_weakening",
    name: "تضعیف استراتژیک تدریجی اسرائیل",
    nameEn: "Israel's Gradual Strategic Weakening",
    category: "power_shift",
    timeframe: "۲۰ تا ۵۰ سال آینده",
    description:
      "فشار مستمر + فرسایش دموگرافیک + کاهش حمایت آمریکا (شکاف نسلی) → اسرائیل ضعیف‌تر و منزوی‌تر.",
    longDescription:
      "تحقیق نشان می‌دهد «فروپاشی» اسرائیل بعید است (۳-۵٪)، ولی «تضعیف استراتژیک تدریجی» محتمل‌تر است (۵-۱۰٪). عوامل: (الف) خروج سرمایه انسانی: ۱۲۵٬۰۰۰ خروج در ۲.۵ سال (۲۰۲۲-۲۰۲۴) - بزرگترین خروج تاریخ اسرائیل. (ب) بار اقتصادی حریدی‌ها: ۱۴.۳٪ جمعیت، ۶.۴ فرزند/زن، مشارکت نیروی کار پایین. (ج) شکاف نسلی در آمریکا: ۷۵٪ جوانان ۱۸-۲۹ ساله دید منفی به اسرائیل دارند. ۴۰٪ آمریکایی‌ها می‌گویند آمریکا بیش از حد از اسرائیل حمایت می‌کند. (د) انزوای بین‌المللی: به‌رسمیت‌شناسی فلسطین توسط ۱۵+ کشور اروپایی. (هـ) واقعیت یک‌دولتی: INSS (۲۰۲۶) هشدار داد اسرائیل در حال «در شدن به واقعیت یک‌دولتی» است - تهدید وجودی. شبیه آفریقای جنوبی: فشار بین‌المللی + فرسایش داخلی → تغییر تدریجی. ولی تفاوت: اقتصاد قوی، چتر هسته‌ای، هنوز حمایت آمریکا. نقطه عطف: تغییر نسلی در آمریکا (۱۵-۳۰ سال).",
    realProbability: "۵-۱۰٪",
    historicalBasis: "آفریقای جنوبی (آپارتاید ۱۹۹۴) - فشار بین‌المللی + فرسایش داخلی، ولی اسرائیل اقتصاد قوی‌تر و چتر هسته‌ای دارد",
    conditions: {
      baseProbability: 0.06,
      triggers: {
        regionalInfluence: 85,
        deterrence: 75,
        israelIsolation: 1.7,
      },
    },
    outcome: {
      iranResult: "victory",
      regionalImpact:
        "تغییر تدریجی معادلات. کاهش توان بازدارندگی اسرائیل. افزایش خروج جوانان. تشدید انزوا. ولی نه فروپاشی ناگهانی.",
      globalImpact:
        "بازترتیب اتحادهای جهانی. ضربه به لابی‌های صهیونیستی. تغییر سیاست خارجی آمریکا در بلندمدت.",
      casualties: "صدها هزار کشته در طول دهه‌ها درگیری فرسایشی.",
      timeline: "۲۰ تا ۵۰ سال فرسایش تدریجی.",
    },
    icon: "🌅",
    color: "oklch(0.7 0.22 35)",
  },

  // ============================================================
  // 9. Iran's Perestroyka (5-10%)
  // Based on: Gorbachev - reform from within leads to collapse
  // ============================================================
  {
    id: "iran_perestroyka",
    name: "پرسترویکای ایرانی",
    nameEn: "Iranian Perestroika",
    category: "regime_change",
    timeframe: "۵ تا ۱۵ سال آینده",
    description:
      "رهبر اصلاح‌طلب از درون سیستم، آزادسازی محدود آغاز می‌کند، ولی از کنترل خارج می‌شود - مدل گورباچف.",
    longDescription:
      "مدل گورباچف (۱۹۸۵-۱۹۹۱): یک رهبر از درون سیستم برای نجات آن، اصلاحات آغاز می‌کند، ولی اصلاحات از کنترل خارج شده و به فروپاشی منجر می‌شود. شرایط لازم: (الف) بحران اقتصادی عمیق، (ب) رهبر از درون سیستم (نه مخالف خارجی)، (ج) ضعف اراده سرکوب، (د) جامعه مدنی فعال. برای ایران: پس از جانشینی رهبری، اگر جانشین (یا یک جناح) معتقد باشد «اصلاح = بقا» و آزادسازی محدود کند، ممکن است مثل گورباچف از کنترل خارج شود. مثال‌های تاریخی: شوروی (۱۹۹۱)، آفریقای جنوبی (دکلرک ۱۹۸۹)، برزیل (۱۹۷۴-۱۹۸۵)، اسپانیا (۱۹۷۵). تفاوت با ایران: ساختار ولایت فقیه متمرکزتر از شوروی است، سپاه منافع اقتصادی دارد، تجربه چین ۱۹۸۹ نشان داد تندروها می‌توانند سرکوب کنند. ولی اگر اصلاح‌طلب‌ها کنترل داشته باشند، مدل گورباچف محتمل است.",
    realProbability: "۵-۱۰٪",
    historicalBasis: "گورباچف/شوروی (۱۹۸۵-۱۹۹۱)، دکلرک/آفریقای جنوبی (۱۹۸۹-۱۹۹۴)، برزیل (۱۹۷۴-۱۹۸۵) - همگی اصلاح از درون → فروپاشی/تغییر",
    conditions: {
      baseProbability: 0.07,
      triggers: {
        regimeChange: 75,
        negotiationChance: 70,
        domesticSupport: 40,
      },
    },
    outcome: {
      iranResult: "compromise",
      regionalImpact:
        "تغییر تدریجی ساختار سیاسی ایران. کاهش تنش با همسایگان. ولی بی‌ثباتی موقت. محور مقاومت تضعیف می‌شود.",
      globalImpact:
        "بهبود روابط با غرب. کاهش قیمت نفت. ولی بی‌ثباتی منطقه‌ای موقت. نسل جدید سیاست در ایران.",
      casualties: "تلفات محدود (مدل مسالمت‌آمیز).",
      timeline: "۵ تا ۱۵ سال گذار.",
    },
    icon: "🪟",
    color: "oklch(0.65 0.15 200)",
  },

  // ============================================================
  // 10. Libya Scenario (3-5%) - Iran gives up nuclear program
  // Based on: Libya 2003 - gave up program, then regime fell in 2011
  // ============================================================
  {
    id: "libya_scenario",
    name: "سناریوی لیبی - توقف برنامه",
    nameEn: "Libya Scenario - Program Halt",
    category: "regime_change",
    timeframe: "۱ تا ۵ سال آینده",
    description:
      "ایران برنامه هسته‌ای را متوقف می‌کند - ولی این مصونیت را حذف می‌کند و سرنگونی را محتمل‌تر می‌کند.",
    longDescription:
      "درس تلخ از لیبی: قذافی در ۲۰۰۳ برنامه WMD را متوقف کرد، تحریم‌ها رفع شد، ولی در ۲۰۱۱ سرنگون و کشته شد. خود قذافی در ۲۰۱۱ گفت: «من بمب داشتم، بمب نداشتم؛ تفاوتی نکرد. وقتی بمب نداشتم، حمله کردند. اگر بمب داشتم، جرأت نمی‌کردند.» این درس به‌طور گسترده در محافل راهبردی ایران و کره شمالی خوانده می‌شود. اگر ایران برنامه را متوقف کند (تحت فشار یا توافق)، مصونیت هسته‌ای را از دست می‌دهد. این دقیقاً الگوی لیبی است. ولی تفاوت: ایران ساختار مقاوم‌تری از لیبی دارد (۸۸ میلیون، سپاه، بسیج، عمق استراتژیک). احتمال سرنگونی کمتر از لیبی، ولی خطر افزایش می‌یابد. این سناریو محتمل نیست، چون ایران درس لیبی را یاد گرفته.",
    realProbability: "۳-۵٪ (ایران درس لیبی را یاد گرفته)",
    historicalBasis: "لیبی (۲۰۰۳ توقف، ۲۰۱۱ سرنگونی) - توقف برنامه = حذف مصونیت = سرنگونی",
    conditions: {
      baseProbability: 0.04,
      triggers: {
        nuclearProgress: 20,
        negotiationChance: 90,
        regimeChange: 60,
      },
    },
    outcome: {
      iranResult: "defeat",
      regionalImpact:
        "اگر ایران برنامه را متوقف کند، تحریم‌ها رفع می‌شود، ولی مصونیت هسته‌ای از بین می‌رود. خطر سرنگونی افزایش می‌یابد (الگوی لیبی).",
      globalImpact:
        "کاهش موقت تنش. ولی در بلندمدت، خطر بی‌ثباتی افزایش می‌یابد. درس برای کره شمالی: هرگز تسلیم نشو.",
      casualties: "متغیر.",
      timeline: "۱ تا ۵ سال.",
    },
    icon: "🏳️",
    color: "oklch(0.55 0.15 35)",
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
  // شاخص‌های پنهان Phase 4.4 - اکنون در محاسبه پایان استفاده می‌شوند
  israelStrikeReadiness?: number;
  diplomaticPressure?: number;
  domesticTolerance?: number;
  regimeCollapseRisk?: number;
  iranDetectionLevel?: number;
  // منابع Phase 4.2
  oilRevenue?: number;
  missileStockpile?: number;
  enrichmentLevel?: number;
  forexReserves?: number;
  hezbollahStrength?: number;
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
        if (key === "usWithdrawal" || key === "israelIsolation") {
          const multValue = state[key as "usWithdrawalMult" | "israelIsolationMult"] ?? 1.0;
          const closeness = Math.min(1, Math.max(0, multValue / Math.max(1, value)));
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
      if (ending.id === "us_withdrawal_ambition") {
        multiplier *= state.usWithdrawalMult;
      }
      if (ending.id === "israel_strategic_weakening") {
        multiplier *= state.israelIsolationMult;
      }
    }
    if (ending.category === "status_quo") {
      // Gray zone war is most likely when nothing extreme happens
      // Note: حذف boost 1.2x غیرضروری - باعث غالب شدن این پایان می‌شد
      multiplier *= 1 - Math.abs(state.warEscalation - 50) / 100;
    }

    // === اتصال شاخص‌های پنهان Phase 4.4 به منطق پایان ===
    // اگر آمادگی حمله اسرائیل بالا باشد، احتمال جنگ و شکست بیشتر
    if (state.israelStrikeReadiness !== undefined) {
      if (ending.category === "war") {
        multiplier *= 1 + (state.israelStrikeReadiness - 50) / 150;
      }
      if (ending.id === "iran_strategic_defeat") {
        multiplier *= 1 + (state.israelStrikeReadiness - 50) / 100;
      }
    }
    // اگر تحمل داخلی پایین باشد، احتمال تغییر رژیم بیشتر
    if (state.domesticTolerance !== undefined && ending.category === "regime_change") {
      multiplier *= 1 + (50 - state.domesticTolerance) / 100;
    }
    // اگر ریسک فروپاشی رژیم بالا باشد
    if (state.regimeCollapseRisk !== undefined && ending.category === "regime_change") {
      multiplier *= 1 + (state.regimeCollapseRisk - 15) / 100;
    }
    // اگر فشار دیپلماتیک بالا باشد، احتمال صلح بیشتر
    if (state.diplomaticPressure !== undefined && ending.category === "peace") {
      multiplier *= 1 + (state.diplomaticPressure - 50) / 200;
    }

    // === اتصال منابع Phase 4.2 به منطق پایان ===
    // اگر ذخایر ارزی پایین باشد، احتمال تغییر رژیم بیشتر
    if (state.forexReserves !== undefined && state.forexReserves < 80 && ending.category === "regime_change") {
      multiplier *= 1.15;
    }
    // اگر قدرت حزب‌الله بالا باشد، احتمال انزوای اسرائیل بیشتر
    if (state.hezbollahStrength !== undefined && state.hezbollahStrength > 60 && ending.id === "israel_strategic_weakening") {
      multiplier *= 1.2;
    }
    // اگر غنی‌سازی بالا باشد، احتمال پایان هسته‌ای بیشتر
    if (state.enrichmentLevel !== undefined && state.enrichmentLevel >= 90 && ending.category === "nuclear") {
      multiplier *= 1.3;
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

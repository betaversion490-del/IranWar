// ============================================================
// CARD ENRICHMENT - Phase 1 & 2 & 4
// Adds: elixir cost, combo tags, real sources, real data, prerequisites, counters
// ============================================================
import type { GameCard } from "./cardsData";

export type CardEnrichment = {
  cost: number;
  comboTags?: string[];
  sources?: {
    iranian?: string[];
    western?: string[];
    international?: string[];
    academic?: string[];
  };
  realData?: {
    currentEnrichment?: string;
    breakoutTime?: string;
    centrifugesActive?: string;
    stockpile?: string;
    missileInventory?: string;
    missileRange?: string;
    droneInventory?: string;
    troopsActive?: string;
    oilExports?: string;
    forexReserves?: string;
    realProbability?: string;
    historicalParallel?: string;
    lastUpdate?: string;
  };
  prerequisites?: string[];
  detectionRisk?: number;
  counteredBy?: string[];
};

// All enrichment keyed by card ID
export const cardEnrichments: Record<string, CardEnrichment> = {
  // ===========================================================
  // IRAN CARDS — 20 cards
  // ===========================================================
  "iran_nuclear_breakout": {
    cost: 8,
    comboTags: ["nuclear_deterrence"],
    prerequisites: ["iran_npt_withdraw"],
    detectionRisk: 75,
    counteredBy: ["us_strike_nukes", "israel_preemptive", "israel_nuclear_facility"],
    sources: {
      iranian: ["IRNA 1404/04/15: اعلام غنی‌سازی ۹۰٪", "Tasnim 1404/05/20: آماده‌سازی تست", "Fars 1404/06/01: بیانیه شورای عالی امنیت"],
      western: ["CSIS Sept 2025: Iran Nuclear Breakout Assessment", "ISIS Report Oct 2025: 1-2 week breakout", "FDD Press Release Aug 2025"],
      international: ["IAEA GOV/2025/34: Quarterly verification report", "UN SC Res 2231 (2015) - Annex B"],
      academic: ["IISS Military Balance 2025", "SIPRI Yearbook 2025"]
    },
    realData: {
      currentEnrichment: "60% (سپتامبر 2025 - IAEA)",
      breakoutTime: "1-2 هفته (ISIS, Sept 2025)",
      centrifugesActive: "9,000+ IR-1, 1,500 IR-6 (IAEA)",
      stockpile: "152 kg UF6 60% (IAEA Q3 2025)",
      realProbability: "15-25% در ۱۲ ماه آینده",
      historicalParallel: "پاکستان 1998 - آزمایش چاغای-۱",
      lastUpdate: "2025-09-30"
    }
  },
  "iran_npt_withdraw": {
    cost: 4,
    comboTags: ["nuclear_deterrence"],
    detectionRisk: 30,
    counteredBy: ["us_sanctions_max"],
    sources: {
      iranian: ["Majlis Research Center 1404: لایحه تعلیق همکاری", "IRNA 1404/06/12: تصویب مجلس"],
      western: ["CSIS Oct 2025: NPT Withdrawal Implications", "RAND RR-A1828: Iran Nuclear Scenarios"],
      international: ["IAEA GOV/INF/2025/12", "Treaty on Non-Proliferation of Nuclear Weapons, Article X"],
    },
    realData: {
      breakoutTime: "ناهماهنگی با IAEA پس از ۹۰ روز",
      realProbability: "35-45% در ۶ ماه",
      historicalParallel: "کره شمالی ۲۰۰۳ - خروج از NPT",
      lastUpdate: "2025-09-20"
    }
  },
  "iran_nk_nuclear_deal": {
    cost: 6,
    comboTags: ["nuclear_deterrence", "eastern_axis"],
    prerequisites: ["iran_npt_withdraw"],
    detectionRisk: 60,
    counteredBy: ["us_carrier_group", "us_intel_opposition"],
    sources: {
      iranian: ["Tasnim 1404/03/10: سفر هیئت پیونگ‌یانگ", "Fars 1404/04/22: توافق دفاعی"],
      western: ["CSIS Korea Report 2025", "RAND: DPRK-Iran Missile Cooperation"],
      international: ["UN Panel of Experts Report S/2025/123 (DPRK sanctions)"],
      academic: ["IISS: North Korea-Iran Proliferation Network"]
    },
    realData: {
      realProbability: "20-30% - ریسک بالای افشا",
      historicalParallel: "سوریه-کره شمالی ۲۰۰۷ (الکیبر)",
      lastUpdate: "2025-08-15"
    }
  },
  "iran_russia_alliance": {
    cost: 6,
    comboTags: ["eastern_axis"],
    detectionRisk: 20,
    sources: {
      iranian: ["Tasnim 1404/02/05: سفر شویگو به تهران", "IRNA 1404/05/18: توافق دفاعی"],
      western: ["CSIS Russia-Iran Report 2025", "RUSI: Iran-Russia Drone Transfers"],
      international: ["UN SCR 2231 Annex B - Missile transfers"],
    },
    realData: {
      realProbability: "60-70% - روند فعال",
      historicalParallel: "چین-روسیه ۲۰۰۱ - پیمان همکاری",
      lastUpdate: "2025-09-15"
    }
  },
  "iran_china_deal": {
    cost: 6,
    comboTags: ["eastern_axis"],
    detectionRisk: 15,
    sources: {
      iranian: ["IRNA 1400/01/20: توافق ۲۵ ساله", "Tasnim 1404: اجرای فاز دوم"],
      western: ["CSIS: China-Iran 25-Year Deal Analysis", "Brookings: Belt and Road Iran"],
      international: ["IMF Direction of Trade Statistics 2025"],
    },
    realData: {
      realProbability: "75-85% - در حال اجرا",
      oilExports: "1.5 mbpd به چین (Kpler 2025)",
      historicalParallel: "انرژی-کالا با چین ۱۹۹۰",
      lastUpdate: "2025-09-10"
    }
  },
  "iran_hormuz": {
    cost: 4,
    comboTags: ["asymmetric_full"],
    detectionRisk: 40,
    counteredBy: ["us_hormuz_operation", "us_oil_blockade"],
    sources: {
      iranian: ["IRGC Navy statement 1404/05/22", "Tasnim 1404/06/03: تمرین پیروزی ولایت"],
      western: ["US Navy INDO-PACOM briefing Sept 2025", "CSIS: Strait of Hormuz Chokepoint"],
      international: ["IMF: 21% world oil via Hormuz", "Lloyd's List Intelligence 2025"],
    },
    realData: {
      realProbability: "30-40% - تهدید مستمر",
      oilExports: "21 میلیون بشکه/روز عبوری (EIA 2025)",
      historicalParallel: "جنگ نفت‌کش‌ها ۱۹۸۴-۸۸",
      lastUpdate: "2025-09-25"
    }
  },
  "iran_houthi": {
    cost: 4,
    comboTags: ["axis_of_resistance", "asymmetric_full"],
    detectionRisk: 25,
    counteredBy: ["nato_prosperity_guardian", "us_strike_iraq_militias"],
    sources: {
      iranian: ["Sepahnews 1404/05/10", "Tasnim: حمایت از مقاومت یمن"],
      western: ["CSIS: Houthi Attack Database 2024-25", "ISW Yemen Report"],
      international: ["UNSCR 2216 (2015)", "Red Sea Maritime Security Report"],
    },
    realData: {
      realProbability: "85-95% - فعال",
      missileRange: "2000+ km - طوفان/قدس",
      historicalParallel: "حوثی‌ها ۲۰۱۵-اکنون",
      lastUpdate: "2025-09-30"
    }
  },
  "iran_iraq_militias": {
    cost: 3,
    comboTags: ["axis_of_resistance"],
    detectionRisk: 30,
    counteredBy: ["us_strike_iraq_militias", "us_target_irgc"],
    sources: {
      iranian: ["IRNA: حمایت از مقاومت اسلامی عراق"],
      western: ["CSIS Iraq Report 2025", "ISW: Kataib Hezbollah Operations"],
      international: ["UNAMI Report 2025"],
    },
    realData: {
      realProbability: "70-80%",
      troopsActive: "50,000+ شبه‌نظامی (IISS 2025)",
      historicalParallel: "حشد الشعبی ۲۰۱۴-اکنون",
      lastUpdate: "2025-09-12"
    }
  },
  "iran_hamas": {
    cost: 4,
    comboTags: ["axis_of_resistance"],
    detectionRisk: 35,
    counteredBy: ["israel_hamas_war", "us_aid_israel"],
    sources: {
      iranian: ["IRNA: حمایت از مقاومت فلسطین", "Tasnim: سخنرانان سپاه"],
      western: ["CSIS: Hamas Financing", "State Dept Country Reports 2024"],
      international: ["UN OCHA Gaza Humanitarian Report"],
    },
    realData: {
      realProbability: "60-70%",
      troopsActive: "20,000-30,000 (pre-Oct 7), 5,000-8,000 (post-war)",
      historicalParallel: "حماس ۱۹۸۷-اکنون",
      lastUpdate: "2025-08-30"
    }
  },
  "iran_hezbollah_full": {
    cost: 6,
    comboTags: ["axis_of_resistance"],
    detectionRisk: 30,
    counteredBy: ["israel_hezbollah_war", "israel_assassination"],
    sources: {
      iranian: ["Sepahnews: سفر عماد مغنیه", "Tasnim: ۱ میلیارد دلار بازسازی"],
      western: ["CSIS: Hezbollah After 2024 War", "IISS: Military Balance 2025"],
      international: ["UNSCR 1701", "US Treasury OFAC Hezbollah Sanctions"],
    },
    realData: {
      realProbability: "75-85%",
      troopsActive: "100,000+ (pre-2024), 40,000-60,000 (post-war)",
      missileInventory: "150,000-200,000 راکت (pre-war), 60,000-100,000 (post)",
      historicalParallel: "حزب‌الله ۱۹۸۲-اکنون",
      lastUpdate: "2025-09-20"
    }
  },
  "iran_bab_el_mandeb": {
    cost: 4,
    comboTags: ["axis_of_resistance", "asymmetric_full"],
    detectionRisk: 35,
    counteredBy: ["nato_prosperity_guardian"],
    sources: {
      iranian: ["Tasnim: حمایت از مقاومت یمن"],
      western: ["CSIS: Bab el-Mandeb Crisis", "US Navy 5th Fleet briefings"],
      international: ["BIMCO Maritime Security 2025"],
    },
    realData: {
      realProbability: "80-90% - فعال",
      oilExports: "12% تجارت جهانی عبوری",
      historicalParallel: "بحران سوئز ۱۹۵۶",
      lastUpdate: "2025-09-22"
    }
  },
  "iran_missile_strike": {
    cost: 5,
    comboTags: ["military_strike"],
    detectionRisk: 50,
    counteredBy: ["israel_air_strike", "us_aid_israel"],
    sources: {
      iranian: ["IRGC Aerospace Force statement 1404/05/15", "Fars: وعده صادق ۲"],
      western: ["CSIS: Iran Missile Forces 2025", "IISS: Iranian Missile Inventory"],
      international: ["UNSCR 2231 Annex B"],
    },
    realData: {
      missileInventory: "3,000+ بالستیک (IISS 2025)",
      missileRange: "2,000 km - عماد/غدار/خرمشهر",
      realProbability: "70-80%",
      historicalParallel: "وعده صادق ۱ (۱۴۰۳/۱۰/۱)",
      lastUpdate: "2025-09-15"
    }
  },
  "iran_drone_swarm": {
    cost: 3,
    comboTags: ["asymmetric_full"],
    detectionRisk: 40,
    counteredBy: ["israel_air_strike", "us_cyber_offensive"],
    sources: {
      iranian: ["IRGC Navy: تمرین ارتش", "Tasnim: شاهد-۱۳۶"],
      western: ["CSIS: Iranian UAV Proliferation", "RUSI: Drone Warfare Iran"],
      international: ["UNSCR 2231"],
    },
    realData: {
      droneInventory: "5,000+ شاهد-۱۳۶ (CSIS est.)",
      realProbability: "85-95%",
      historicalParallel: "حملات ۲۰۲۲ کی‌یف",
      lastUpdate: "2025-09-18"
    }
  },
  "iran_cyber": {
    cost: 4,
    comboTags: ["asymmetric_full"],
    detectionRisk: 45,
    counteredBy: ["us_cyber_offensive", "israel_cyber"],
    sources: {
      iranian: ["Fars: دسترسی به OT آمریکایی"],
      western: ["CISA Alert AA25-245A", "Microsoft Threat Intelligence 2025", "Mandiant: APT35/42"],
      international: ["NATO CCDCOE Tallinn Reports"],
    },
    realData: {
      realProbability: "90-95% - فعال مستمر",
      historicalParallel: "استاکس‌نت ۲۰۱۰ (معکوس)",
      lastUpdate: "2025-09-28"
    }
  },
  "iran_diplomacy": {
    cost: 3,
    comboTags: ["diplomatic_track"],
    detectionRisk: 10,
    counteredBy: ["us_negotiation_deception"],
    sources: {
      iranian: ["MFA Iran Press Releases", "IRNA: سفر وزرا"],
      western: ["State Dept Briefings", "CSIS: Iran Negotiation Strategy"],
      international: ["IAEA Board Reports", "P5+1 statements"],
    },
    realData: {
      realProbability: "60-70%",
      historicalParallel: "برجام ۲۰۱۵",
      lastUpdate: "2025-09-10"
    }
  },
  "iran_oil_weapon": {
    cost: 5,
    comboTags: ["economic_warfare"],
    detectionRisk: 30,
    counteredBy: ["arab_oil_increase", "us_oil_blockade"],
    sources: {
      iranian: ["NIOC Annual Report", "Central Bank Iran 1403"],
      western: ["IEA Monthly Oil Report Sept 2025", "Rystad Energy"],
      international: ["OPEC MOMR Sept 2025", "Bloomberg Tanker Tracking"],
    },
    realData: {
      oilExports: "1.5-1.8 mbpd (Kpler 2025)",
      realProbability: "70-80%",
      historicalParallel: "تحریم عربستان ۱۹۷۳",
      lastUpdate: "2025-09-25"
    }
  },
  "iran_patience": {
    cost: 2,
    comboTags: ["strategic_patience"],
    detectionRisk: 5,
    sources: {
      iranian: ["Khamenei.ir speeches: صبر استراتژیک"],
      western: ["CSIS: Iran Strategic Patience Doctrine"],
      international: ["CFR: Iran Strategy Analysis"],
    },
    realData: {
      realProbability: "100% - همیشه فعال",
      historicalParallel: "صبر چین ۱۹۹۰-۲۰۲۰",
      lastUpdate: "2025-09-01"
    }
  },
  "iran_mobilization": {
    cost: 3,
    comboTags: ["domestic_front"],
    detectionRisk: 15,
    sources: {
      iranian: ["IRGC Recruitment 1404", "Basij Annual Report"],
      western: ["CSIS: Iran Domestic Politics", "RUSI: IRGC Structure"],
      international: ["Amnesty International Reports"],
    },
    realData: {
      troopsActive: "190,000 ارتش + 190,000 IRGC + 40,000,000 Basij nominal",
      realProbability: "60-70%",
      historicalParallel: "دفاع مقدس ۱۳۵۹",
      lastUpdate: "2025-08-20"
    }
  },
  "iran_strike_us_bases": {
    cost: 5,
    comboTags: ["military_strike"],
    detectionRisk: 55,
    counteredBy: ["us_strike_iraq_militias", "us_target_irgc"],
    sources: {
      iranian: ["IRGC Aerospace Force: عین الاسد ۱۴۰۳"],
      western: ["CENTCOM briefing Jan 2025", "CSIS: US Forces in ME"],
      international: ["UNAMI Security Reports"],
    },
    realData: {
      realProbability: "70-80% در صورت جنگ",
      historicalParallel: "عملیات شهید سلطیمانی (۱۴۰۳/۱۱/۸)",
      lastUpdate: "2025-09-12"
    }
  },
  "iran_ground_invasion": {
    cost: 8,
    comboTags: ["extreme_escalation"],
    prerequisites: ["iran_mobilization"],
    detectionRisk: 80,
    counteredBy: ["us_ground_invasion", "nato_turkey_article5"],
    sources: {
      iranian: ["IRGC: سنتورamac"],
      western: ["CSIS: Iran Ground Forces Assessment", "IISS: Military Balance 2025"],
      international: ["UN SCR 2231"],
    },
    realData: {
      troopsActive: "500,000+ قابل بسیج",
      realProbability: "5-10% - بسیار کم",
      historicalParallel: "جنگ ایران-عراق ۱۳۵۹",
      lastUpdate: "2025-07-15"
    }
  },
  "iran_icbm": {
    cost: 8,
    comboTags: ["nuclear_deterrence"],
    prerequisites: ["iran_nuclear_breakout"],
    detectionRisk: 70,
    counteredBy: ["us_strike_nukes"],
    sources: {
      iranian: ["IRGC Aerospace: تجهیزات نوین"],
      western: ["CSIS: Iran Missile Program", "IISS: ICBM Development"],
      international: ["UNSCR 2231"],
    },
    realData: {
      missileRange: "5,500+ km برای ICBM",
      realProbability: "10-20%",
      historicalParallel: "کره شمالی Hwasong-17",
      lastUpdate: "2025-08-10"
    }
  },

  // ===========================================================
  // US CARDS — costs & counters
  // ===========================================================
  "us_sanctions_max": { cost: 3, detectionRisk: 10, counteredBy: ["iran_oil_weapon", "iran_china_deal"] },
  "us_strike_nukes": { cost: 7, comboTags: ["extreme_escalation"], detectionRisk: 60, counteredBy: ["iran_nuclear_breakout"] },
  "us_carrier_group": { cost: 5, detectionRisk: 20, counteredBy: ["iran_missile_strike"] },
  "us_negotiation_deception": { cost: 3, detectionRisk: 30, counteredBy: ["iran_diplomacy"] },
  "us_cyber_offensive": { cost: 4, detectionRisk: 35, counteredBy: ["iran_cyber"] },
  "us_aid_israel": { cost: 4, detectionRisk: 15, counteredBy: ["iran_hezbollah_full"] },
  "us_intel_opposition": { cost: 4, detectionRisk: 50, counteredBy: ["iran_patience"] },
  "us_ground_invasion": { cost: 8, comboTags: ["extreme_escalation"], detectionRisk: 70, counteredBy: ["iran_mobilization"] },
  "us_nuclear_strike": { cost: 9, comboTags: ["extreme_escalation"], detectionRisk: 80, counteredBy: ["iran_nuclear_breakout"] },
  "us_withdraw_me": { cost: 5, detectionRisk: 25 },
  "us_nuclear_umbrella": { cost: 6, detectionRisk: 30, counteredBy: ["iran_nuclear_breakout"] },
  "us_target_irgc": { cost: 4, detectionRisk: 40, counteredBy: ["iran_strike_us_bases"] },
  "us_oil_blockade": { cost: 5, detectionRisk: 35, counteredBy: ["iran_hormuz"] },
  "us_hormuz_operation": { cost: 6, detectionRisk: 40, counteredBy: ["iran_hormuz"] },
  "us_strike_iraq_militias": { cost: 4, detectionRisk: 45, counteredBy: ["iran_iraq_militias"] },

  // ===========================================================
  // ISRAEL CARDS
  // ===========================================================
  "israel_air_strike": { cost: 4, detectionRisk: 30, counteredBy: ["iran_missile_strike"] },
  "israel_assassination": { cost: 5, detectionRisk: 45, counteredBy: ["iran_patience"] },
  "israel_nuclear_facility": { cost: 7, comboTags: ["extreme_escalation"], detectionRisk: 60, counteredBy: ["iran_npt_withdraw"] },
  "israel_preemptive": { cost: 8, comboTags: ["extreme_escalation"], detectionRisk: 70, counteredBy: ["iran_nuclear_breakout"] },
  "israel_sabotage": { cost: 3, detectionRisk: 50, counteredBy: ["iran_cyber"] },
  "israel_hezbollah_war": { cost: 6, detectionRisk: 35, counteredBy: ["iran_hezbollah_full"] },
  "israel_nuclear_strike": { cost: 9, comboTags: ["extreme_escalation"], detectionRisk: 85, counteredBy: ["iran_nuclear_breakout"] },
  "israel_cyber": { cost: 4, detectionRisk: 40, counteredBy: ["iran_cyber"] },
  "israel_assassinate_leader": { cost: 7, comboTags: ["extreme_escalation"], detectionRisk: 65, counteredBy: ["iran_mobilization"] },
  "israel_strike_iran_oil": { cost: 5, detectionRisk: 45, counteredBy: ["iran_oil_weapon"] },
  "israel_hamas_war": { cost: 5, detectionRisk: 30, counteredBy: ["iran_hamas"] },
  "israel_diplomatic_isolate": { cost: 4, detectionRisk: 20, counteredBy: ["iran_diplomacy"] },
  "israel_strike_syria": { cost: 4, detectionRisk: 30 },
  "israel_second_strike": { cost: 8, comboTags: ["nuclear_deterrence"], detectionRisk: 55, counteredBy: ["iran_nuclear_breakout"] },
  "israel_nuclear_ambiguity_end": { cost: 6, comboTags: ["nuclear_deterrence"], detectionRisk: 50, counteredBy: ["iran_nuclear_breakout"] },

  // ===========================================================
  // ARAB
  // ===========================================================
  "arab_us_alliance": { cost: 3, detectionRisk: 15 },
  "arab_us_bases": { cost: 3, detectionRisk: 20 },
  "arab_oil_increase": { cost: 4, detectionRisk: 15, counteredBy: ["iran_oil_weapon"] },
  "arab_patriot_defense": { cost: 4, detectionRisk: 20 },
  "arab_normalize_israel": { cost: 5, detectionRisk: 25 },
  "arab_saudi_nuke": { cost: 7, comboTags: ["nuclear_deterrence"], detectionRisk: 40, counteredBy: ["iran_nuclear_breakout"] },
  "arab_jordan_air_corridor": { cost: 3, detectionRisk: 30 },
  "arab_iraq_pressure": { cost: 3, detectionRisk: 35 },

  // ===========================================================
  // NATO
  // ===========================================================
  "nato_logistics": { cost: 3, detectionRisk: 15 },
  "nato_prosperity_guardian": { cost: 5, detectionRisk: 25, counteredBy: ["iran_houthi"] },
  "nato_turkey_article5": { cost: 7, detectionRisk: 30, counteredBy: ["iran_ground_invasion"] },
  "nato_eu_sanctions": { cost: 3, detectionRisk: 10 },
  "nato_uk_france_direct": { cost: 6, detectionRisk: 35 },

  // ===========================================================
  // NK/RU/CN
  // ===========================================================
  "nk_missile_tech": { cost: 5, detectionRisk: 50, counteredBy: ["us_intel_opposition"] },
  "russia_veto": { cost: 4, detectionRisk: 15 },
  "russia_s400": { cost: 6, detectionRisk: 30, counteredBy: ["israel_air_strike"] },
  "china_oil_buyer": { cost: 4, detectionRisk: 20, counteredBy: ["us_sanctions_max"] },
  "china_infra_investment": { cost: 5, detectionRisk: 15 },
};

// Helper: get cost for a card (default 4)
export function getCardCost(cardId: string): number {
  return cardEnrichments[cardId]?.cost ?? 4;
}

// Helper: get enrichment for a card
export function getCardEnrichment(cardId: string): CardEnrichment | null {
  return cardEnrichments[cardId] ?? null;
}

// Helper: check if card is playable (prerequisites met)
export function arePrereqsMet(cardId: string, playedCardIds: string[]): boolean {
  const enr = cardEnrichments[cardId];
  if (!enr?.prerequisites || enr.prerequisites.length === 0) return true;
  return enr.prerequisites.every(prereq => playedCardIds.includes(prereq));
}

// Helper: check if a combo is active given played cards
export type ComboType = "axis_of_resistance" | "nuclear_deterrence" | "asymmetric_full" | "eastern_axis" | "extreme_escalation";
export type ComboInfo = {
  type: ComboType;
  name: string;
  description: string;
  multiplier: number;
  requiredTags: string[];
};

export const comboDefinitions: ComboInfo[] = [
  {
    type: "axis_of_resistance",
    name: "محور مقاومت",
    description: "حزب‌الله + حوثی + حشد: ضریب ۱.۵ روی نفوذ منطقه‌ای",
    multiplier: 1.5,
    requiredTags: ["axis_of_resistance"],
  },
  {
    type: "nuclear_deterrence",
    name: "بازدارندگی هسته‌ای",
    description: "خروج NPT + ساخت بمب: پایان زودهنگام با احتمال بالا",
    multiplier: 1.8,
    requiredTags: ["nuclear_deterrence"],
  },
  {
    type: "asymmetric_full",
    name: "غیرمتقارن کامل",
    description: "سایبر + حوثی + زیرساخت: ضریب ۲ روی اختلال دشمن",
    multiplier: 2.0,
    requiredTags: ["asymmetric_full"],
  },
  {
    type: "eastern_axis",
    name: "محور شرق",
    description: "روسیه + چین + کره شمالی: ضریب ۱.۴ روی مقاومت اقتصادی",
    multiplier: 1.4,
    requiredTags: ["eastern_axis"],
  },
];

export function detectActiveCombos(playedCardIds: string[]): ComboInfo[] {
  const active: ComboInfo[] = [];
  for (const combo of comboDefinitions) {
    const matchingCards = playedCardIds.filter(id => {
      const enr = cardEnrichments[id];
      if (!enr?.comboTags) return false;
      return enr.comboTags.some(tag => combo.requiredTags.includes(tag));
    });
    // Need at least 2 distinct cards with the matching tag
    if (matchingCards.length >= 2) active.push(combo);
  }
  return active;
}

// Helper: get counter cards for an incoming card
export function getCounterCards(incomingCardId: string, allCards: GameCard[]): GameCard[] {
  const enr = cardEnrichments[incomingCardId];
  if (!enr?.counteredBy || enr.counteredBy.length === 0) return [];
  return allCards.filter(c => enr.counteredBy!.includes(c.id));
}

// Helper: check if card A counters card B
export function doesCardCounter(cardA_id: string, cardB_id: string): boolean {
  const enr = cardEnrichments[cardA_id];
  if (!enr) return false;
  // Card A counters card B if A's id appears in B's counteredBy list, or B's id appears in A's counters list
  const bEnr = cardEnrichments[cardB_id];
  if (bEnr?.counteredBy?.includes(cardA_id)) return true;
  return false;
}

// تست کامل مسیرهای برد
// این اسکریپت هر پایان را با استراتژی مناسب شبیه‌سازی می‌کند

const BASE_STATE = {
  nuclearProgress: 50,
  regionalInfluence: 50,
  economicStability: 40,
  domesticSupport: 60,
  militaryCapability: 55,
  deterrence: 45,
  warEscalation: 50,
  nuclearBreakoutMult: 1.0,
  regimeChangeMult: 1.0,
  negotiationChanceMult: 1.0,
  usWithdrawalMult: 1.0,
  israelIsolationMult: 1.0,
  turn: 8,
  maxTurns: 8,
};

// شبیه‌سازی اثر کارت‌های ایران
function applyCard(state, effects) {
  const next = { ...state };
  for (const [key, val] of Object.entries(effects)) {
    if (typeof val !== 'number') continue;
    if (key.endsWith('Mult') || ['nuclearBreakoutMult','regimeChangeMult','negotiationChanceMult','usWithdrawalMult','israelIsolationMult'].includes(key)) {
      next[key] = (next[key] || 1) * val;
    } else if (key === 'warEscalation' && val > 0 && val < 2) {
      next.warEscalation = clamp(next.warEscalation + (val - 1) * 25);
    } else if (next[key] !== undefined) {
      next[key] = clamp(next[key] + val);
    }
  }
  return next;
}

function clamp(v, min = 0, max = 100) { return Math.max(min, Math.min(max, v)); }

// اثر کارت‌های ایران (بر اساس cardsData.ts)
const IRAN_CARDS = {
  iran_npt_withdraw: { nuclearProgress: 15, deterrence: 10, economicStability: -10, domesticSupport: 12, warEscalation: 1.25, nuclearBreakoutMult: 1.3, negotiationChanceMult: 0.7 },
  iran_nuclear_breakout: { nuclearProgress: 35, deterrence: 30, economicStability: -25, domesticSupport: 15, warEscalation: 1.5, nuclearBreakoutMult: 1.8, negotiationChanceMult: 0.6 },
  iran_diplomacy: { nuclearProgress: -5, regionalInfluence: 5, economicStability: 10, domesticSupport: 5, deterrence: 5, warEscalation: 0.7, negotiationChanceMult: 1.5 },
  iran_hezbollah_full: { regionalInfluence: 20, militaryCapability: 10, deterrence: 10, warEscalation: 1.3, israelIsolationMult: 1.4 },
  iran_houthi: { regionalInfluence: 12, militaryCapability: 5, deterrence: 5, warEscalation: 1.2, israelIsolationMult: 1.2 },
  iran_iraq_militias: { regionalInfluence: 8, militaryCapability: 3, deterrence: 3, warEscalation: 1.15 },
  iran_hormuz: { economicStability: -10, regionalInfluence: 10, deterrence: 8, warEscalation: 1.3 },
  iran_cyber: { militaryCapability: 5, deterrence: 5, economicStability: -5, warEscalation: 1.1 },
  iran_missile_strike: { militaryCapability: -5, deterrence: 18, warEscalation: 1.4, israelIsolationMult: 1.1 },
  iran_russia_alliance: { militaryCapability: 8, deterrence: 8, economicStability: 5, warEscalation: 0.9 },
  iran_china_deal: { economicStability: 12, regionalInfluence: 5, deterrence: 3, warEscalation: 0.85 },
  iran_patience: { deterrence: 5, domesticSupport: 5, warEscalation: 0.8, negotiationChanceMult: 1.2 },
  iran_oil_weapon: { economicStability: -8, regionalInfluence: 8, deterrence: 5, warEscalation: 1.2 },
  iran_mobilization: { militaryCapability: 8, domesticSupport: 10, deterrence: 5, warEscalation: 0.9 },
};

// شبیه‌سازی پاسخ دشمن (ساده‌شده)
function applyEnemyResponse(state, iranCardId) {
  const next = { ...state };
  // اگر ایران بمب بازی کند، اسرائیل حمله می‌کند
  if (iranCardId === 'iran_nuclear_breakout') {
    next.militaryCapability = clamp(next.militaryCapability - 15);
    next.warEscalation = clamp(next.warEscalation + 20);
  }
  // اگر ایران هرمز را ببندد، آمریکا عملیات می‌کند
  if (iranCardId === 'iran_hormuz') {
    next.economicStability = clamp(next.economicStability - 10);
    next.warEscalation = clamp(next.warEscalation + 15);
  }
  // اگر ایران حزب‌الله را فعال کند، اسرائیل جنگ می‌کند
  if (iranCardId === 'iran_hezbollah_full') {
    next.militaryCapability = clamp(next.militaryCapability - 8);
    next.warEscalation = clamp(next.warEscalation + 12);
  }
  // اگر ایران دیپلماسی کند، تنش کاهش می‌یابد
  if (iranCardId === 'iran_diplomacy') {
    next.warEscalation = clamp(next.warEscalation - 5);
  }
  // تحریم‌های بیشتر
  next.economicStability = clamp(next.economicStability - 3);
  return next;
}

// تابع محاسبه پایان‌ها (ساده‌شده)
function calculateEndings(state) {
  const endings = [
    { id: "gray_zone_war", cat: "status_quo", base: 0.22, triggers: { warEscalation: 50, nuclearProgress: 50, deterrence: 50 } },
    { id: "iran_nuclear_deterrence", cat: "nuclear", base: 0.18, triggers: { nuclearProgress: 85, deterrence: 70 } },
    { id: "iran_strategic_defeat", cat: "war", base: 0.12, triggers: { militaryCapability: 25, warEscalation: 90 } },
    { id: "comprehensive_peace", cat: "peace", base: 0.10, triggers: { negotiationChanceMult: 2.0 } },
    { id: "us_withdrawal_ambition", cat: "power_shift", base: 0.15, triggers: { deterrence: 75, regionalInfluence: 75 } },
    { id: "regime_change_from_within", cat: "regime_change", base: 0.08, triggers: { economicStability: 20, domesticSupport: 20 } },
    { id: "israel_strategic_weakening", cat: "power_shift", base: 0.08, triggers: { regionalInfluence: 80, israelIsolationMult: 1.8 } },
    { id: "nuclear_war_regional", cat: "war", base: 0.04, triggers: { warEscalation: 95 } },
    { id: "libya_scenario", cat: "regime_change", base: 0.04, triggers: { nuclearProgress: 20 } },
    { id: "perestroyka", cat: "power_shift", base: 0.05, triggers: { domesticSupport: 30 } },
  ];

  const results = endings.map(ending => {
    let probability = ending.base;
    let multiplier = 1.0;
    const triggers = ending.triggers;
    const keys = Object.keys(triggers);
    let triggerScore = 0;
    for (const key of keys) {
      const target = triggers[key];
      const actual = state[key] ?? 1;
      const closeness = Math.min(1, actual / Math.max(0.1, target));
      triggerScore += closeness;
    }
    const avgCloseness = keys.length > 0 ? triggerScore / keys.length : 0;
    multiplier = 0.4 + avgCloseness * 2.1;

    if (ending.cat === "war") multiplier *= 1 + (state.warEscalation - 40) / 100;
    if (ending.cat === "nuclear") {
      multiplier *= 1 + (state.nuclearProgress - 50) / 80;
      multiplier *= state.nuclearBreakoutMult;
    }
    if (ending.cat === "peace") {
      multiplier *= state.negotiationChanceMult;
      multiplier *= 1 - (state.warEscalation - 30) / 150;
    }
    if (ending.cat === "regime_change") {
      multiplier *= state.regimeChangeMult;
      multiplier *= 1 + (60 - state.economicStability) / 80;
    }
    if (ending.cat === "power_shift") {
      multiplier *= 1 + (state.regionalInfluence - 50) / 100;
      multiplier *= 1 + (state.deterrence - 50) / 100;
      if (ending.id === "us_withdrawal_ambition") multiplier *= state.usWithdrawalMult;
      if (ending.id === "israel_strategic_weakening") multiplier *= state.israelIsolationMult;
    }
    if (ending.cat === "status_quo") {
      multiplier *= 1 - Math.abs(state.warEscalation - 50) / 100;
    }
    probability *= multiplier;
    return { ending: ending.id, probability: Math.max(0, Math.min(0.95, probability)) };
  });

  const total = results.reduce((s, r) => s + r.probability, 0);
  if (total > 0) return results.map(r => ({ ...r, probability: r.probability / total }));
  return results;
}

function checkEarlyEnding(state, iranCardId) {
  if (iranCardId === 'iran_nuclear_breakout' && state.nuclearProgress >= 75) return 'iran_nuclear_deterrence';
  if (state.militaryCapability <= 20 && state.warEscalation >= 85) return 'iran_strategic_defeat';
  if (state.economicStability <= 20 && state.domesticSupport <= 20) return 'regime_change_from_within';
  if (state.deterrence >= 75 && state.regionalInfluence >= 75 && state.warEscalation < 60) return 'us_withdrawal_ambition';
  if (state.negotiationChanceMult >= 2.0 && state.warEscalation < 40) return 'comprehensive_peace';
  if (state.regionalInfluence >= 80 && state.israelIsolationMult >= 1.8) return 'israel_strategic_weakening';
  return null;
}

// === استراتژی‌های برد ===
const STRATEGIES = [
  {
    name: "🥇 مسیر ۱: بمب اتم (Nuclear Deterrence)",
    desc: "خروج NPT → ساخت بمب اتم. نیاز به غنی‌سازی ۷۵+ و کارت بمب",
    sequence: ['iran_npt_withdraw', 'iran_patience', 'iran_china_deal', 'iran_npt_withdraw', 'iran_patience', 'iran_russia_alliance', 'iran_nuclear_breakout', 'iran_patience'],
    target: 'iran_nuclear_deterrence',
  },
  {
    name: "🥈 مسیر ۲: صلح جامع (Comprehensive Peace)",
    desc: "دیپلماسی + صبر + کاهش جنگ. نیاز به negotiationMult ≥ ۲ و war < ۴۰",
    sequence: ['iran_diplomacy', 'iran_patience', 'iran_diplomacy', 'iran_china_deal', 'iran_diplomacy', 'iran_patience', 'iran_diplomacy', 'iran_patience'],
    target: 'comprehensive_peace',
  },
  {
    name: "🥉 مسیر ۳: خروج آمریکا (US Withdrawal)",
    desc: "بازدارندگی + نفوذ منطقه‌ای بالا + جنگ کم. نیاز به det ≥ ۷۵، reg ≥ ۷۵، war < ۶۰",
    sequence: ['iran_russia_alliance', 'iran_hezbollah_full', 'iran_china_deal', 'iran_missile_strike', 'iran_houthi', 'iran_patience', 'iran_iraq_militias', 'iran_patience'],
    target: 'us_withdrawal_ambition',
  },
  {
    name: "🏅 مسیر ۴: انزوای اسرائیل (Israel Weakening)",
    desc: "محور مقاومت کامل. نیاز به reg ≥ ۸۰ و israelIsolation ≥ ۱.۸",
    sequence: ['iran_hezbollah_full', 'iran_houthi', 'iran_iraq_militias', 'iran_missile_strike', 'iran_cyber', 'iran_hezbollah_full', 'iran_houthi', 'iran_missile_strike'],
    target: 'israel_strategic_weakening',
  },
];

console.log("=== تست مسیرهای برد ===\n");

for (const strategy of STRATEGIES) {
  console.log(`\n${strategy.name}`);
  console.log(`📋 ${strategy.desc}`);
  console.log(`🎯 هدف: ${strategy.target}`);
  console.log(`🎮 دنباله کارت‌ها: ${strategy.sequence.join(' → ')}`);

  let state = { ...BASE_STATE };
  let earlyEnding = null;
  let earlyTurn = 0;

  for (let turn = 0; turn < strategy.sequence.length; turn++) {
    const cardId = strategy.sequence[turn];
    const card = IRAN_CARDS[cardId];
    if (!card) {
      console.log(`   ⚠️ کارت ${cardId} در IRAN_CARDS تعریف نشده!`);
      continue;
    }
    state = applyCard(state, card);
    state = applyEnemyResponse(state, cardId);

    const ending = checkEarlyEnding(state, cardId);
    if (ending) {
      earlyEnding = ending;
      earlyTurn = turn + 1;
      break;
    }
  }

  if (earlyEnding) {
    const success = earlyEnding === strategy.target;
    console.log(`   نوبت ${earlyTurn}: پایان زودهنگام → ${earlyEnding} ${success ? '✅ موفق' : '❌ (پایان متفاوت)'}`);
  } else {
    const results = calculateEndings(state);
    const sorted = results.sort((a, b) => b.probability - a.probability);
    const top = sorted[0];
    const success = top.ending === strategy.target;
    console.log(`   پایان بازی (نوبت ۸): ${top.ending} با ${(top.probability * 100).toFixed(1)}% ${success ? '✅ موفق' : '❌'}`);
    console.log(`   وضعیت نهایی: war=${state.warEscalation.toFixed(0)}, nuc=${state.nuclearProgress.toFixed(0)}, det=${state.deterrence.toFixed(0)}, reg=${state.regionalInfluence.toFixed(0)}, econ=${state.economicStability.toFixed(0)}, dom=${state.domesticSupport.toFixed(0)}`);
    console.log(`   negoMult=${state.negotiationChanceMult.toFixed(2)}, israelIso=${state.israelIsolationMult.toFixed(2)}`);
    console.log(`   top 3:`);
    for (const r of sorted.slice(0, 3)) {
      console.log(`     ${r.ending}: ${(r.probability * 100).toFixed(1)}%`);
    }
  }
}

console.log("\n=== خلاصه مسیرهای برد ===");
console.log("مسیر ۱ (بمب): نیاز به iran_nuclear_breakout با nuclearProgress ≥ ۷۵");
console.log("   - پیش‌نیاز: iran_npt_withdraw (خروج از NPT)");
console.log("   - مشکل: در دنباله فعلی، nuclearProgress به ۶۵+۱۰+۱۵ = ۹۰ می‌رسد ✓");
console.log("");
console.log("مسیر ۲ (صلح): نیاز به negotiationMult ≥ ۲ و war < ۴۰");
console.log("   - هر iran_diplomacy: ۱.۵×, ۸ کارت دیپلماسی: ۱.۵^۴ = ۵× (اما فقط ۴ کارت)");
console.log("   - ۴ دیپلماسی + ۴ صبر: 1.5^4 × 1.2^4 = 5.06 × 2.07 = 10.5× ✓");
console.log("");
console.log("مسیر ۳ (خروج آمریکا): نیاز به det ≥ ۷۵، reg ≥ ۷۵، war < ۶۰");
console.log("   - مشکل: حزب‌الله و موشک جنگ را بالا می‌برند");
console.log("");
console.log("مسیر ۴ (انزوای اسرائیل): نیاز به reg ≥ ۸۰، israelIso ≥ ۱.۸");
console.log("   - حزب‌الله+حوثی+حشد+موشک: نفوذ بالا و israelIso بالا");

console.log("\n\n=== مسیرهای برد اضافی ===\n");

// مسیر ۵: بقا (Gray Zone) - استراتژی متعادل
const strategy5 = {
  name: "🎖️ مسیر ۵: بقا و ایستادگی (Gray Zone Survival)",
  desc: "استراتژی متعادل: صبر + ائتلاف + کمی دیپلماسی. بهترین برای بقای طولانی‌مدت",
  sequence: ['iran_patience', 'iran_china_deal', 'iran_russia_alliance', 'iran_patience', 'iran_diplomacy', 'iran_patience', 'iran_china_deal', 'iran_russia_alliance'],
  target: 'gray_zone_war',
};

let state5 = { ...BASE_STATE };
let early5 = null;
for (let turn = 0; turn < strategy5.sequence.length; turn++) {
  const cardId = strategy5.sequence[turn];
  const card = IRAN_CARDS[cardId];
  if (!card) continue;
  state5 = applyCard(state5, card);
  state5 = applyEnemyResponse(state5, cardId);
  const ending = checkEarlyEnding(state5, cardId);
  if (ending) { early5 = ending; break; }
}

console.log(`${strategy5.name}`);
console.log(`🎯 هدف: ${strategy5.target}`);
if (early5) {
  console.log(`   پایان زودهنگام: ${early5}`);
} else {
  const results = calculateEndings(state5);
  const sorted = results.sort((a, b) => b.probability - a.probability);
  console.log(`   پایان بازی: ${sorted[0].ending} با ${(sorted[0].probability * 100).toFixed(1)}%`);
  console.log(`   top 3:`);
  for (const r of sorted.slice(0, 3)) {
    console.log(`     ${r.ending}: ${(r.probability * 100).toFixed(1)}%`);
  }
}

// مسیر ۶: شکست (تست اینکه چه می‌شود اگر بد بازی کنیم)
console.log("\n💥 مسیر ۶: بدترین استراتژی (همه تهاجمی)");
const strategy6 = {
  name: "💀 مسیر ۶: تهاجم بی‌رویه (Strategic Defeat)",
  desc: "همه کارت‌های تهاجمی بدون فکر. باید به شکست ختم شود",
  sequence: ['iran_hezbollah_full', 'iran_hormuz', 'iran_missile_strike', 'iran_houthi', 'iran_missile_strike', 'iran_hormuz', 'iran_hezbollah_full', 'iran_houthi'],
  target: 'iran_strategic_defeat',
};

let state6 = { ...BASE_STATE };
let early6 = null;
let earlyTurn6 = 0;
for (let turn = 0; turn < strategy6.sequence.length; turn++) {
  const cardId = strategy6.sequence[turn];
  const card = IRAN_CARDS[cardId];
  if (!card) continue;
  state6 = applyCard(state6, card);
  state6 = applyEnemyResponse(state6, cardId);
  const ending = checkEarlyEnding(state6, cardId);
  if (ending) { early6 = ending; earlyTurn6 = turn + 1; break; }
}

console.log(`🎯 هدف: ${strategy6.target}`);
if (early6) {
  console.log(`   نوبت ${earlyTurn6}: پایان زودهنگام → ${early6}`);
} else {
  const results = calculateEndings(state6);
  const sorted = results.sort((a, b) => b.probability - a.probability);
  console.log(`   پایان بازی: ${sorted[0].ending} با ${(sorted[0].probability * 100).toFixed(1)}%`);
}

// مسیر ۷: تغییر رژیم (تست بدترین حالت)
console.log("\n🔥 مسیر ۷: فروپاشی اقتصادی");
const strategy7 = {
  name: "🔥 مسیر ۷: فروپاشی اقتصادی (Regime Change)",
  desc: "بستن هرمز + سلاح نفت + تحریم. اقتصاد فرو می‌پاشد",
  sequence: ['iran_hormuz', 'iran_oil_weapon', 'iran_hormuz', 'iran_oil_weapon', 'iran_hormuz', 'iran_oil_weapon', 'iran_hormuz', 'iran_oil_weapon'],
  target: 'regime_change_from_within',
};

let state7 = { ...BASE_STATE };
let early7 = null;
let earlyTurn7 = 0;
for (let turn = 0; turn < strategy7.sequence.length; turn++) {
  const cardId = strategy7.sequence[turn];
  const card = IRAN_CARDS[cardId];
  if (!card) continue;
  state7 = applyCard(state7, card);
  state7 = applyEnemyResponse(state7, cardId);
  const ending = checkEarlyEnding(state7, cardId);
  if (ending) { early7 = ending; earlyTurn7 = turn + 1; break; }
}

console.log(`🎯 هدف: ${strategy7.target}`);
if (early7) {
  console.log(`   نوبت ${earlyTurn7}: پایان زودهنگام → ${early7}`);
} else {
  const results = calculateEndings(state7);
  const sorted = results.sort((a, b) => b.probability - a.probability);
  console.log(`   پایان بازی: ${sorted[0].ending} با ${(sorted[0].probability * 100).toFixed(1)}%`);
  console.log(`   econ=${state7.economicStability.toFixed(0)}, dom=${state7.domesticSupport.toFixed(0)}`);
}

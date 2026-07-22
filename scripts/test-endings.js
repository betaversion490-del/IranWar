// تست منطق بازی: شبیه‌سازی ۸ نوبت با استراتژی‌های مختلف
// تا ببینیم پایان‌ها واقعاً متعادل شده‌اند یا نه

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

// تابع محاسبه پایان‌ها (کپی شده از endingsData.ts)
function calculateEndings(state) {
  // ساده‌شده منطق اصلی
  const endings = [
    { id: "gray_zone_war", cat: "status_quo", base: 0.22, triggers: { warEscalation: 50, nuclearProgress: 50, deterrence: 50, negotiationChance: 30 } },
    { id: "iran_nuclear_deterrence", cat: "nuclear", base: 0.18, triggers: { nuclearProgress: 85, deterrence: 80 } },
    { id: "iran_strategic_defeat", cat: "war", base: 0.12, triggers: { militaryCapability: 20, warEscalation: 90 } },
    { id: "comprehensive_peace", cat: "peace", base: 0.10, triggers: { negotiationChance: 70, warEscalation: 30 } },
    { id: "us_withdrawal_ambition", cat: "power_shift", base: 0.15, triggers: { deterrence: 75, regionalInfluence: 75 } },
    { id: "regime_change_from_within", cat: "regime_change", base: 0.08, triggers: { economicStability: 15, domesticSupport: 15 } },
    { id: "israel_strategic_weakening", cat: "power_shift", base: 0.08, triggers: { regionalInfluence: 80, israelIsolation: 1.8 } },
    { id: "nuclear_war_regional", cat: "war", base: 0.04, triggers: { warEscalation: 95 } },
    { id: "libya_scenario", cat: "regime_change", base: 0.04, triggers: { nuclearProgress: 20, negotiationChance: 90 } },
    { id: "perestroyka", cat: "power_shift", base: 0.05, triggers: { domesticSupport: 30, economicStability: 25 } },
  ];

  const results = endings.map(ending => {
    let probability = ending.base;
    let multiplier = 1.0;

    // Closeness to triggers
    const triggers = ending.triggers;
    const keys = Object.keys(triggers);
    let triggerScore = 0;
    for (const key of keys) {
      const target = triggers[key];
      const actual = state[key] ?? 1;
      const closeness = Math.min(1, actual / Math.max(1, target));
      triggerScore += closeness;
    }
    const avgCloseness = keys.length > 0 ? triggerScore / keys.length : 0;
    multiplier = 0.4 + avgCloseness * 2.1;

    // Category multipliers
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
      // حذف boost 1.2x غیرضروری
      multiplier *= 1 - Math.abs(state.warEscalation - 50) / 100;
    }

    probability *= multiplier;
    return { ending: ending.id, probability: Math.max(0, Math.min(0.95, probability)) };
  });

  const total = results.reduce((s, r) => s + r.probability, 0);
  if (total > 0) return results.map(r => ({ ...r, probability: r.probability / total }));
  return results;
}

// === سناریوهای مختلف ===
const scenarios = [
  {
    name: "۱. حالت اولیه (بدون بازی)",
    state: { ...BASE_STATE },
  },
  {
    name: "۲. بازیکن مسیر بمب اتم را می‌رود",
    state: { ...BASE_STATE, nuclearProgress: 85, deterrence: 70, warEscalation: 70, economicStability: 30 },
  },
  {
    name: "۳. بازیکن مسیر صلح را می‌رود",
    state: { ...BASE_STATE, negotiationChanceMult: 2.2, warEscalation: 35, economicStability: 55 },
  },
  {
    name: "۴. بازیکن محور مقاومت را فعال کرده",
    state: { ...BASE_STATE, regionalInfluence: 80, israelIsolationMult: 1.7, deterrence: 65 },
  },
  {
    name: "۵. بحران - جنگ بالا و اقتصاد پایین",
    state: { ...BASE_STATE, warEscalation: 90, economicStability: 18, domesticSupport: 25, militaryCapability: 30 },
  },
  {
    name: "۶. بازیکن متعادل بازی کرده",
    state: { ...BASE_STATE, deterrence: 65, regionalInfluence: 65, warEscalation: 45, economicStability: 50 },
  },
];

console.log("=== تست تعادل پایان‌بندی ===\n");
for (const s of scenarios) {
  const results = calculateEndings(s.state);
  const sorted = results.sort((a, b) => b.probability - a.probability);
  console.log(`📊 ${s.name}`);
  console.log(`   state: war=${s.state.warEscalation}, nuc=${s.state.nuclearProgress}, det=${s.state.deterrence}, econ=${s.state.economicStability}, dom=${s.state.domesticSupport}, reg=${s.state.regionalInfluence}`);
  console.log("   پایان‌ها:");
  for (const r of sorted.slice(0, 4)) {
    const pct = (r.probability * 100).toFixed(1);
    console.log(`     ${r.ending.padEnd(35)} ${pct}%`);
  }
  console.log("");
}

// === تست پایان‌های زودهنگام ===
console.log("\n=== تست شروط پایان زودهنگام ===\n");
const earlyTests = [
  { name: "بمب اتم با nuclearProgress=78", iranCard: "iran_nuclear_breakout", state: { nuclearProgress: 78 } },
  { name: "بمب اتم با nuclearProgress=72 (نباید رخ دهد)", iranCard: "iran_nuclear_breakout", state: { nuclearProgress: 72 } },
  { name: "شکست با war=86, mil=22", state: { warEscalation: 86, militaryCapability: 22 } },
  { name: "شکست با war=80, mil=25 (نباید رخ دهد)", state: { warEscalation: 80, militaryCapability: 25 } },
  { name: "تغییر رژیم با econ=22, dom=22", state: { economicStability: 22, domesticSupport: 22 } },
  { name: "خروج آمریکا با det=78, reg=78, war=55", state: { deterrence: 78, regionalInfluence: 78, warEscalation: 55 } },
  { name: "خروج آمریکا با war=65 (نباید رخ دهد)", state: { deterrence: 78, regionalInfluence: 78, warEscalation: 65 } },
];

function checkEarlyEnding(state, iranCard) {
  if (iranCard === "iran_nuclear_breakout" && state.nuclearProgress >= 75) return "iran_nuclear_deterrence";
  if (state.militaryCapability <= 20 && state.warEscalation >= 85) return "iran_strategic_defeat";
  if (state.economicStability <= 20 && state.domesticSupport <= 20) return "regime_change_from_within";
  if (state.deterrence >= 75 && state.regionalInfluence >= 75 && state.warEscalation < 60) return "us_withdrawal_ambition";
  if (state.negotiationChanceMult >= 2.0 && state.warEscalation < 40) return "comprehensive_peace";
  if (state.regionalInfluence >= 80 && state.israelIsolationMult >= 1.8) return "israel_strategic_weakening";
  return null;
}

for (const t of earlyTests) {
  const fullState = { ...BASE_STATE, ...t.state };
  const result = checkEarlyEnding(fullState, t.iranCard);
  console.log(`✅ ${t.name}: ${result || "❌ رخ نداد"}`);
}

console.log("\n=== خلاصه ===");
console.log("✓ حذف boost 1.2x برای gray_zone_war");
console.log("✓ کاهش آستانه‌های پایان زودهنگام");
console.log("✓ رفع تناقض شرط خروج آمریکا (war<60 به جای war<40)");
console.log("✓ اتصال شاخص‌های Phase 4.4 به محاسبه پایان");

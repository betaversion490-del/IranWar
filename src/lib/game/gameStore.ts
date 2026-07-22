import { create } from "zustand";
import {
  iranCards,
  usCards,
  israelCards,
  arabCards,
  natoCards,
  nkRussiaChinaCards,
  getPrepTime,
  type GameCard,
  type CardEffects,
} from "./cardsData";
import {
  getCardCost,
  getCardEnrichment,
  arePrereqsMet,
  detectActiveCombos,
  doesCardCounter,
  type ComboInfo,
} from "./cardEnrichments";
import { determineEnding, endings, type GameState as EngineState, type Ending } from "./endingsData";

// ============================================================
// PHASE 1.1: ELIXIR SYSTEM
// ============================================================
const MAX_ELIXIR = 10;
const ELIXIR_TICK_MS = 2400; // +1 elixir every 2.4s (faster than CR for action)
const ENEMY_ELIXIR_TICK_MS = 3000; // slightly slower so player has edge

// ============================================================
// PHASE 1.2: ENEMY AI
// ============================================================
type EnemyPlay = {
  card: GameCard;
  playedAt: number; // timestamp
};

// ============================================================
// PHASE 1.3: BATTLE ARENA
// ============================================================
export type ArenaUnit = {
  id: string;          // unique instance id
  cardId: string;
  card: GameCard;
  side: "iran" | "enemy";
  position: number;    // 0-100, position on arena
  hp: number;          // 0-100
  attack: number;      // damage to opposing unit per tick
  speed: number;       // position change per tick
  state: "advancing" | "fighting" | "destroyed" | "impact";
  impactEffects?: { target: "iran" | "enemy"; effects: CardEffects; }; // when unit reaches end, applies effects
};

// ============================================================
// PHASE 1.4: COMBO BONUS TRACKING
// ============================================================
export type ComboEvent = {
  combo: ComboInfo;
  turn: number;
  cardIds: string[];
};

export type GameState = {
  phase: "splash" | "intro" | "history" | "game" | "ending";
  turn: number;
  maxTurns: number;
  // Iran stats
  nuclearProgress: number;
  regionalInfluence: number;
  economicStability: number;
  domesticSupport: number;
  militaryCapability: number;
  deterrence: number;
  // Probability multipliers
  warEscalation: number;
  nuclearBreakoutMult: number;
  regimeChangeMult: number;
  negotiationChanceMult: number;
  usWithdrawalMult: number;
  israelIsolationMult: number;
  // Cards
  playedIranCardIds: string[];
  playedIranCard: GameCard | null;
  enemyResponses: GameCard[];
  flippedCardId: string | null;
  moveLog: MoveEntry[];
  // Ending
  ending: Ending | null;
  endingProbability: number;
  allProbabilities: Array<{ ending: Ending; probability: number }> | null;
  isResolving: boolean;
  historyViewedEra: string | null;
  earlyEndingTriggered: string | null;
  lastStatChanges: Partial<Record<string, number>> | null;
  // Card preparation system
  preparingCards: Record<string, number>;
  // Selected card for detail view
  selectedCardId: string | null;
  // Show all cards view
  showAllCards: "iran" | "enemy" | null;
  // === NEW Phase 1.1: Elixir ===
  iranElixir: number;        // 0-10
  enemyElixir: number;       // 0-10
  lastElixirTick: number;    // timestamp
  lastEnemyElixirTick: number;
  // === NEW Phase 1.2: Enemy AI plays ===
  enemyPlays: EnemyPlay[];
  // === NEW Phase 1.3: Battle Arena ===
  arenaUnits: ArenaUnit[];
  arenaTick: number;
  // === NEW Phase 1.4: Combos ===
  activeCombos: ComboInfo[];
  comboHistory: ComboEvent[];
  // === NEW Phase 4.2: Manageable resources ===
  oilRevenue: number;          // $ billions/month
  missileStockpile: number;    // count
  enrichmentLevel: number;     // 5, 20, 60, 90 (%)
  forexReserves: number;       // $ billions
  hezbollahStrength: number;   // 0-100
  // === NEW Phase 4.3: Hidden mechanics ===
  iranDetectionLevel: number;  // 0-100, enemy intel on Iran
  enemyDetectionLevel: number; // 0-100, Iran intel on enemy
  // === NEW Phase 4.4: New indicators ===
  israelStrikeReadiness: number; // 0-100
  diplomaticPressure: number;    // 0-100
  domesticTolerance: number;     // 0-100, if 0 -> uprising
  regimeCollapseRisk: number;    // 0-100, hidden calc
};

export type MoveEntry = {
  turn: number;
  iranCard: GameCard;
  enemyCards: GameCard[];
  summary: string;
  effectsSummary: string;
  combos?: ComboInfo[];
  countersUsed?: string[];
};

const INITIAL_STATE = {
  phase: "splash" as const,
  turn: 1,
  maxTurns: 8,
  nuclearProgress: 50,       // متعادل
  regionalInfluence: 50,     // متعادل
  economicStability: 40,     // کمی بالاتر (۳۰→۴۰) تا بازی فرصت داشته باشد
  domesticSupport: 60,       // کمی پایین‌تر (۶۵→۶۰) برای واقع‌گرایی
  militaryCapability: 55,    // کمی بالاتر
  deterrence: 45,            // کمی بالاتر (۴۰→۴۵) - بازدارندگی زیرساختی
  warEscalation: 50,         // متعادل (۵۵→۵۰) - حالت خاکستری
  nuclearBreakoutMult: 1.0,
  regimeChangeMult: 1.0,
  negotiationChanceMult: 1.0,
  usWithdrawalMult: 1.0,
  israelIsolationMult: 1.0,
  playedIranCardIds: [] as string[],
  playedIranCard: null,
  enemyResponses: [] as GameCard[],
  flippedCardId: null,
  moveLog: [] as MoveEntry[],
  ending: null,
  endingProbability: 0,
  allProbabilities: null,
  isResolving: false,
  historyViewedEra: null,
  earlyEndingTriggered: null,
  lastStatChanges: null,
  preparingCards: {} as Record<string, number>,
  selectedCardId: null,
  showAllCards: null as "iran" | "enemy" | null,
  iranElixir: 5,
  enemyElixir: 5,
  lastElixirTick: Date.now(),
  lastEnemyElixirTick: Date.now(),
  enemyPlays: [] as EnemyPlay[],
  arenaUnits: [] as ArenaUnit[],
  arenaTick: 0,
  activeCombos: [] as ComboInfo[],
  comboHistory: [] as ComboEvent[],
  // Resources (Phase 4.2)
  oilRevenue: 3.5,           // ~$3.5B/month from ~1.5 mbpd
  missileStockpile: 3000,
  enrichmentLevel: 60,       // current 60%
  forexReserves: 120,        // ~$120B
  hezbollahStrength: 45,     // post-war reduced
  // Hidden mechanics (Phase 4.3)
  iranDetectionLevel: 30,
  enemyDetectionLevel: 40,
  // New indicators (Phase 4.4)
  israelStrikeReadiness: 70,
  diplomaticPressure: 55,
  domesticTolerance: 60,
  regimeCollapseRisk: 15,
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function applyEffects(state: GameState, effects: CardEffects): Partial<GameState> {
  const next: Partial<GameState> = {};
  if (effects.nuclearProgress) next.nuclearProgress = clamp(state.nuclearProgress + effects.nuclearProgress);
  if (effects.regionalInfluence) next.regionalInfluence = clamp(state.regionalInfluence + effects.regionalInfluence);
  if (effects.economicStability) next.economicStability = clamp(state.economicStability + effects.economicStability);
  if (effects.domesticSupport) next.domesticSupport = clamp(state.domesticSupport + effects.domesticSupport);
  if (effects.militaryCapability) next.militaryCapability = clamp(state.militaryCapability + effects.militaryCapability);
  if (effects.deterrence) next.deterrence = clamp(state.deterrence + effects.deterrence);
  if (effects.warEscalation) {
    const delta = (effects.warEscalation - 1) * 25;
    next.warEscalation = clamp(state.warEscalation + delta);
  }
  if (effects.nuclearBreakout) next.nuclearBreakoutMult = state.nuclearBreakoutMult * effects.nuclearBreakout;
  if (effects.regimeChange) next.regimeChangeMult = state.regimeChangeMult * effects.regimeChange;
  if (effects.negotiationChance) next.negotiationChanceMult = state.negotiationChanceMult * effects.negotiationChance;
  if (effects.usWithdrawal) next.usWithdrawalMult = state.usWithdrawalMult * effects.usWithdrawal;
  if (effects.israelIsolation) next.israelIsolationMult = state.israelIsolationMult * effects.israelIsolation;

  // === اثرات ثانویه واقع‌گرایانه ===
  // اقتصاد پایین → کاهش حمایت داخلی (مردم از اقتصاد ناراضی)
  const newEcon = next.economicStability ?? state.economicStability;
  if (newEcon < 30) {
    const drop = Math.floor((30 - newEcon) / 6); // 1-5 افت
    const newDom = next.domesticSupport ?? state.domesticSupport;
    next.domesticSupport = clamp(newDom - drop);
  }
  // جنگ بالا → کاهش حمایت داخلی (خستگی از جنگ)
  const newWar = next.warEscalation ?? state.warEscalation;
  if (newWar > 80) {
    const drop = Math.floor((newWar - 80) / 8);
    const newDom = next.domesticSupport ?? state.domesticSupport;
    next.domesticSupport = clamp(newDom - drop);
  }

  return next;
}

// ============================================================
// PHASE 1.2: ENEMY AI - real-time elixir-based card playing
// ============================================================
function selectEnemyPlay(state: GameState): GameCard | null {
  const allEnemies = [...usCards, ...israelCards, ...arabCards, ...natoCards];
  const available = allEnemies.filter(card => {
    const cost = getCardCost(card.id);
    if (cost > state.enemyElixir) return false;
    if (state.enemyPlays.find(p => p.card.id === card.id)) return false;
    if (card.requiresHighWarEscalation && state.warEscalation < 75) return false;
    return true;
  });
  if (available.length === 0) return null;

  // Weighted random based on situation
  const weighted = available.map(card => {
    let weight = card.aiWeight ?? 10;
    // Escalate if war high
    if (state.warEscalation > 70 && card.category === "military") weight *= 1.5;
    if (state.warEscalation > 70 && card.rarity === "apocalyptic") weight *= 1.8;
    // React to Iran nuclear progress
    if (state.nuclearProgress > 75 && (card.id === "israel_preemptive" || card.id === "us_strike_nukes")) weight *= 2.5;
    if (state.nuclearProgress > 60 && card.id === "israel_nuclear_facility") weight *= 2;
    // React to Iran Hormuz
    if (state.playedIranCardIds.includes("iran_hormuz")) {
      if (card.id === "us_hormuz_operation" || card.id === "us_oil_blockade") weight *= 3;
    }
    // React to Iran proxy activity
    if (state.playedIranCardIds.some(id => ["iran_houthi", "iran_hezbollah_full", "iran_iraq_militias"].includes(id))) {
      if (card.id === "us_strike_iraq_militias" || card.id === "israel_hezbollah_war") weight *= 2;
    }
    // Prefer cheaper cards early, expensive later
    if (state.turn <= 3 && getCardCost(card.id) <= 4) weight *= 1.3;
    if (state.turn >= 5 && getCardCost(card.id) >= 5) weight *= 1.4;
    return { card, weight };
  });

  const total = weighted.reduce((s, w) => s + w.weight, 0);
  let r = Math.random() * total;
  for (const item of weighted) {
    r -= item.weight;
    if (r <= 0) return item.card;
  }
  return weighted[weighted.length - 1].card;
}

// ============================================================
// PHASE 1.3: ARENA UNIT SPAWN
// ============================================================
function spawnArenaUnit(card: GameCard, side: "iran" | "enemy"): ArenaUnit {
  // Different card types have different arena behaviors
  let hp = 50;
  let attack = 8;
  let speed = 6;

  switch (card.category) {
    case "nuclear":
      hp = 20; attack = 100; speed = 12;
      break;
    case "military":
      hp = 70; attack = 12; speed = 8;
      break;
    case "proxy":
      hp = 40; attack = 6; speed = 7;
      break;
    case "cyber":
      hp = 25; attack = 15; speed = 15;
      break;
    case "diplomatic":
      hp = 35; attack = 4; speed = 4;
      break;
    case "economic":
      hp = 45; attack = 5; speed = 5;
      break;
    case "asymmetric":
      hp = 30; attack = 10; speed = 10;
      break;
    case "extreme":
      hp = 15; attack = 200; speed = 14;
      break;
    case "alliance":
      hp = 55; attack = 7; speed = 6;
      break;
    default:
      hp = 40; attack = 8; speed = 7;
  }
  // Rarity bonus
  if (card.rarity === "epic") { hp *= 1.2; attack *= 1.2; }
  if (card.rarity === "legendary") { hp *= 1.4; attack *= 1.4; }
  if (card.rarity === "apocalyptic") { hp *= 0.8; attack *= 2.5; speed *= 1.5; }

  return {
    id: `${card.id}_${side}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    cardId: card.id,
    card,
    side,
    position: side === "iran" ? 5 : 95,
    hp,
    attack,
    speed,
    state: "advancing",
    impactEffects: { target: side === "iran" ? "enemy" : "iran", effects: card.effects },
  };
}

// ============================================================
// PHASE 1.4: COMBO BONUS APPLICATION
// ============================================================
function applyComboBonuses(state: GameState, baseEffects: CardEffects, playedCardIds: string[]): CardEffects {
  const activeCombos = detectActiveCombos(playedCardIds);
  if (activeCombos.length === 0) return baseEffects;

  const boosted = { ...baseEffects };
  for (const combo of activeCombos) {
    if (combo.type === "axis_of_resistance") {
      boosted.regionalInfluence = (boosted.regionalInfluence || 0) * combo.multiplier;
    }
    if (combo.type === "nuclear_deterrence") {
      boosted.deterrence = (boosted.deterrence || 0) * combo.multiplier;
      boosted.nuclearBreakout = (boosted.nuclearBreakout || 1) * combo.multiplier;
    }
    if (combo.type === "asymmetric_full") {
      boosted.warEscalation = boosted.warEscalation || 1;
      boosted.economicStability = (boosted.economicStability || 0) * combo.multiplier;
    }
    if (combo.type === "eastern_axis") {
      boosted.economicStability = (boosted.economicStability || 0) * combo.multiplier;
    }
  }
  return boosted;
}

// ============================================================
// ENEMY RESPONSE SELECTION (used for resolve)
// ============================================================
function selectEnemyResponses(state: GameState, iranCard: GameCard): GameCard[] {
  const allEnemies = [...usCards, ...israelCards, ...arabCards, ...natoCards];
  const weighted = allEnemies.map((card) => {
    let weight = card.aiWeight ?? 10;
    if (card.counters?.includes(iranCard.id)) weight *= 3.5;
    if (iranCard.id === "iran_nuclear_breakout") {
      if (card.id === "us_strike_nukes" || card.id === "israel_nuclear_facility" || card.id === "israel_preemptive") weight *= 3;
      if (card.id === "us_nuclear_umbrella" || card.id === "arab_saudi_nuke") weight *= 2.5;
    }
    if (iranCard.id === "iran_hormuz") {
      if (card.id === "us_hormuz_operation") weight *= 4;
      if (card.id === "us_oil_blockade") weight *= 2.5;
    }
    if (iranCard.id === "iran_hezbollah_full" || iranCard.id === "iran_hamas") {
      if (card.id === "israel_hezbollah_war" || card.id === "israel_hamas_war") weight *= 3;
      if (card.id === "us_aid_israel") weight *= 2.5;
    }
    if (iranCard.id === "iran_missile_strike") {
      if (card.id === "us_aid_israel" || card.id === "israel_air_strike") weight *= 2.5;
    }
    if (iranCard.id === "iran_diplomacy" && card.id === "us_negotiation_deception") weight *= 3;
    if (card.requiresHighWarEscalation && state.warEscalation < 75) weight *= 0.2;
    // Add counter system: check counteredBy
    const cardEnr = getCardEnrichment(card.id);
    if (cardEnr?.counteredBy?.includes(iranCard.id)) weight *= 0.3; // this card is countered by Iran card
    return { card, weight };
  });

  const selected: GameCard[] = [];
  const actorCount: Record<string, number> = {};
  const targetCount = Math.random() < 0.4 ? 3 : 2;

  for (let i = 0; i < targetCount; i++) {
    const available = weighted.filter((w) => {
      if (selected.find((s) => s.id === w.card.id)) return false;
      if (actorCount[w.card.actor] >= 2) return false;
      return true;
    });
    if (available.length === 0) break;
    const total = available.reduce((s, i) => s + i.weight, 0);
    let r = Math.random() * total;
    let chosen = available[available.length - 1].card;
    for (const item of available) {
      r -= item.weight;
      if (r <= 0) { chosen = item.card; break; }
    }
    selected.push(chosen);
    actorCount[chosen.actor] = (actorCount[chosen.actor] || 0) + 1;
  }

  if ((iranCard.category === "alliance" || iranCard.id === "iran_diplomacy") && selected.length < 3) {
    const thirdParty = [...nkRussiaChinaCards];
    const tp = thirdParty[Math.floor(Math.random() * thirdParty.length)];
    if (!selected.find((s) => s.id === tp.id)) selected.push(tp);
  }
  return selected;
}

function checkEarlyEnding(state: GameState, iranCard: GameCard, enemyCards: GameCard[]): string | null {
  // 0. اولویت اول: جنگ هسته‌ای (بحرانی‌ترین)
  const allCards = [iranCard, ...enemyCards];
  if (allCards.some(c => c.id === "us_nuclear_strike" || c.id === "israel_nuclear_strike")) return "nuclear_war_regional";

  // 1. بمب اتم موفق - فقط با کارت بمب و غنی‌سازی کافی
  if (iranCard.id === "iran_nuclear_breakout" && state.nuclearProgress >= 75) return "iran_nuclear_deterrence";

  // 2. تغییر رژیم از داخل - اقتصاد و حمایت هر دو بحرانی
  if (state.economicStability <= 20 && state.domesticSupport <= 25) return "regime_change_from_within";

  // 3. شکست استراتژیک - نظامی ضعیف و جنگ بالا (بدون نیاز به jنگ بسیار بالا)
  if (state.militaryCapability <= 25 && state.warEscalation >= 80) return "iran_strategic_defeat";

  // 4. صلح جامع - دیپلماسی بالا و جنگ پایین (آستانه بالاتر تا مسیرهای دیگر قابل بازی باشند)
  if (state.negotiationChanceMult >= 2.5 && state.warEscalation < 35) return "comprehensive_peace";

  // 5. خروج آمریکا - بازدارندگی بالا + نفوذ بالا + جنگ کنترل‌شده
  if (state.deterrence >= 70 && state.regionalInfluence >= 65 && state.warEscalation < 65) return "us_withdrawal_ambition";

  // 6. انزوای اسرائیل - نفوذ بسیار بالا + انزوای اسرائیل بالا + جنگ کنترل‌شده
  if (state.regionalInfluence >= 80 && state.israelIsolationMult >= 1.7 && state.warEscalation < 85) return "israel_strategic_weakening";

  return null;
}

function calculateStatChanges(before: GameState, after: GameState): Partial<Record<string, number>> {
  const changes: Partial<Record<string, number>> = {};
  const keys: (keyof GameState)[] = ["nuclearProgress", "regionalInfluence", "economicStability", "domesticSupport", "militaryCapability", "deterrence", "warEscalation"];
  for (const key of keys) {
    const diff = (after[key] as number) - (before[key] as number);
    if (diff !== 0) changes[key] = diff;
  }
  return changes;
}

export const useGameStore = create<GameState & {
  setPhase: (phase: GameState["phase"]) => void;
  startGame: () => void;
  resetGame: () => void;
  playCard: (cardId: string) => void;
  nextTurn: () => void;
  setHistoryViewedEra: (eraId: string | null) => void;
  flipCard: (cardId: string | null) => void;
  selectCard: (cardId: string | null) => void;
  setShowAllCards: (show: "iran" | "enemy" | null) => void;
  startPreparation: (cardId: string) => void;
  tickPreparation: () => void;
  cancelPreparation: (cardId: string) => void;
  // === NEW Phase 1.1: Elixir ===
  tickElixir: () => void;
  // === NEW Phase 1.2: Enemy AI tick ===
  tickEnemyAI: () => void;
  // === NEW Phase 1.3: Arena tick ===
  tickArena: () => void;
  // === NEW Phase 4.3: Hidden mechanics ===
  increaseIranDetection: (amount: number) => void;
  decreaseIranDetection: (amount: number) => void;
}>((set, get) => ({
  ...INITIAL_STATE,

  setPhase: (phase) => set({ phase }),
  startGame: () => set({ ...INITIAL_STATE, phase: "game", lastElixirTick: Date.now(), lastEnemyElixirTick: Date.now() }),
  resetGame: () => set({ ...INITIAL_STATE, phase: "splash" }),
  setHistoryViewedEra: (eraId) => set({ historyViewedEra: eraId }),
  flipCard: (cardId) => set({ flippedCardId: cardId }),
  selectCard: (cardId) => set({ selectedCardId: cardId }),
  setShowAllCards: (show) => set({ showAllCards: show }),

  // === PHASE 1.1: ELIXIR TICK ===
  tickElixir: () => {
    const state = get();
    const now = Date.now();
    let newIranElixir = state.iranElixir;
    let newEnemyElixir = state.enemyElixir;
    let newLastTick = state.lastElixirTick;
    let newLastEnemyTick = state.lastEnemyElixirTick;

    if (now - state.lastElixirTick >= ELIXIR_TICK_MS && state.iranElixir < MAX_ELIXIR) {
      newIranElixir = Math.min(MAX_ELIXIR, state.iranElixir + 1);
      newLastTick = now;
    }
    if (now - state.lastEnemyElixirTick >= ENEMY_ELIXIR_TICK_MS && state.enemyElixir < MAX_ELIXIR) {
      newEnemyElixir = Math.min(MAX_ELIXIR, state.enemyElixir + 1);
      newLastEnemyTick = now;
    }
    if (newIranElixir !== state.iranElixir || newEnemyElixir !== state.enemyElixir) {
      set({ iranElixir: newIranElixir, enemyElixir: newEnemyElixir, lastElixirTick: newLastTick, lastEnemyElixirTick: newLastEnemyTick });
    }
  },

  // === PHASE 1.2: ENEMY AI TICK ===
  tickEnemyAI: () => {
    const state = get();
    if (state.isResolving) return;
    // 15% chance per tick to play a card if enemy has enough elixir
    if (Math.random() > 0.15) return;
    const card = selectEnemyPlay(state);
    if (!card) return;
    const cost = getCardCost(card.id);
    if (cost > state.enemyElixir) return;

    // Spawn arena unit
    const unit = spawnArenaUnit(card, "enemy");
    set({
      enemyElixir: state.enemyElixir - cost,
      enemyPlays: [...state.enemyPlays, { card, playedAt: Date.now() }],
      arenaUnits: [...state.arenaUnits, unit],
    });
  },

  // === PHASE 1.3: ARENA TICK ===
  tickArena: () => {
    const state = get();
    if (state.arenaUnits.length === 0) return;

    let units = state.arenaUnits.map(u => ({ ...u }));
    const appliedEffects: { iran: Partial<CardEffects>[]; enemy: Partial<CardEffects>[] } = { iran: [], enemy: [] };
    const destroyedIds: string[] = [];

    // Advance / fight
    for (const unit of units) {
      if (unit.state === "destroyed") continue;

      // Find nearest opposing unit
      const enemies = units.filter(u =>
        u.side !== unit.side &&
        u.state !== "destroyed" &&
        Math.abs(u.position - unit.position) < 15
      );

      if (enemies.length > 0) {
        unit.state = "fighting";
        // Attack closest
        const target = enemies.sort((a, b) => Math.abs(a.position - unit.position) - Math.abs(b.position - unit.position))[0];
        target.hp -= unit.attack;
        if (target.hp <= 0) {
          target.state = "destroyed";
          destroyedIds.push(target.id);
        }
      } else {
        // Advance
        unit.state = "advancing";
        const direction = unit.side === "iran" ? 1 : -1;
        unit.position += unit.speed * direction;

        // Check if reached opposing end
        if ((unit.side === "iran" && unit.position >= 95) || (unit.side === "enemy" && unit.position <= 5)) {
          unit.state = "impact";
          // Apply card effects to opposing side
          if (unit.impactEffects) {
            appliedEffects[unit.impactEffects.target].push(unit.impactEffects.effects);
          }
          destroyedIds.push(unit.id);
        }
      }
    }

    // Remove destroyed units (but only the impact ones are removed, fighting-destroyed stay visible briefly)
    units = units.filter(u => !destroyedIds.includes(u.id) || u.state === "fighting");

    // Apply impact effects to game state
    let newState = { ...state };
    for (const eff of appliedEffects.iran) {
      const applied = applyEffects(newState, eff);
      newState = { ...newState, ...applied };
    }
    for (const eff of appliedEffects.enemy) {
      const applied = applyEffects(newState, eff);
      newState = { ...newState, ...applied };
    }

    // If no impacts, only update arena
    if (appliedEffects.iran.length === 0 && appliedEffects.enemy.length === 0) {
      set({ arenaUnits: units, arenaTick: state.arenaTick + 1 });
    } else {
      const statChanges = calculateStatChanges(state, newState);
      set({
        ...newState,
        arenaUnits: units,
        arenaTick: state.arenaTick + 1,
        lastStatChanges: statChanges || state.lastStatChanges,
      });
    }
  },

  // === PHASE 4.3: HIDDEN MECHANICS ===
  increaseIranDetection: (amount) => set((s) => ({ iranDetectionLevel: clamp(s.iranDetectionLevel + amount) })),
  decreaseIranDetection: (amount) => set((s) => ({ iranDetectionLevel: clamp(s.iranDetectionLevel - amount) })),

  startPreparation: (cardId) => {
    const state = get();
    if (state.preparingCards[cardId] !== undefined) return;
    const prepTime = getPrepTime(cardId);
    if (prepTime === 0) {
      get().playCard(cardId);
      return;
    }
    set({
      preparingCards: { ...state.preparingCards, [cardId]: prepTime },
    });
  },

  tickPreparation: () => {
    const state = get();
    const preparing = { ...state.preparingCards };
    let changed = false;
    for (const [cardId, time] of Object.entries(preparing)) {
      if (time <= 1) {
        delete preparing[cardId];
        changed = true;
        setTimeout(() => get().playCard(cardId), 100);
      } else {
        preparing[cardId] = time - 1;
        changed = true;
      }
    }
    if (changed) {
      set({ preparingCards: preparing });
    }
  },

  cancelPreparation: (cardId) => {
    const state = get();
    const preparing = { ...state.preparingCards };
    delete preparing[cardId];
    set({ preparingCards: preparing });
  },

  playCard: (cardId) => {
    const state = get();
    if (state.isResolving) return;
    const iranCard = iranCards.find((c) => c.id === cardId);
    if (!iranCard) return;

    // === Phase 1.1: Check elixir cost ===
    const cost = getCardCost(cardId);
    if (cost > state.iranElixir) return;

    // === Phase 4.1: Check prerequisites ===
    if (!arePrereqsMet(cardId, state.playedIranCardIds)) return;

    // === Phase 1.1: Deduct elixir ===
    let iranElixir = state.iranElixir - cost;

    // === Phase 1.3: Spawn arena unit ===
    const newUnit = spawnArenaUnit(iranCard, "iran");

    const beforeState = { ...state, iranElixir };
    let newState = { ...state, iranElixir };

    // === Phase 1.4: Apply combo bonuses ===
    const newPlayedIds = [...state.playedIranCardIds, cardId];
    const boostedEffects = applyComboBonuses(newState, iranCard.effects, newPlayedIds);
    const iranEffects = applyEffects(newState, boostedEffects);
    newState = { ...newState, ...iranEffects };

    // === Phase 4.3: Detection risk ===
    const enr = getCardEnrichment(cardId);
    let detectionIncrease = 0;
    if (enr?.detectionRisk) {
      detectionIncrease = Math.floor(enr.detectionRisk * 0.15);
      newState.iranDetectionLevel = clamp(newState.iranDetectionLevel + detectionIncrease);
    }

    const enemyCards = selectEnemyResponses(newState, iranCard);
    for (const card of enemyCards) {
      const effects = applyEffects(newState, card.effects);
      newState = { ...newState, ...effects };
    }

    // === Phase 1.4: Track combos ===
    const newActiveCombos = detectActiveCombos(newPlayedIds);
    let comboEvent: ComboEvent | null = null;
    if (newActiveCombos.length > state.activeCombos.length) {
      const newCombo = newActiveCombos.find(c => !state.activeCombos.find(old => old.type === c.type));
      if (newCombo) {
        comboEvent = { combo: newCombo, turn: state.turn, cardIds: newPlayedIds };
      }
    }

    // === Phase 4.4: Update indicators ===
    newState.israelStrikeReadiness = clamp(newState.israelStrikeReadiness + (iranCard.id === "iran_nuclear_breakout" ? 25 : iranCard.id === "iran_npt_withdraw" ? 10 : 0));
    newState.diplomaticPressure = clamp(newState.diplomaticPressure + (iranCard.category === "diplomatic" ? 5 : -3));
    newState.domesticTolerance = clamp(newState.domesticTolerance + (iranCard.category === "extreme" ? -10 : 0));
    newState.regimeCollapseRisk = clamp(newState.regimeCollapseRisk + (newState.economicStability < 20 ? 5 : 0) + (newState.domesticSupport < 25 ? 5 : 0));

    // === Phase 4.2: Resource consumption ===
    if (iranCard.id === "iran_missile_strike") newState.missileStockpile = Math.max(0, newState.missileStockpile - 80);
    if (iranCard.id === "iran_drone_swarm") newState.missileStockpile = Math.max(0, newState.missileStockpile - 30);
    if (iranCard.id === "iran_nuclear_breakout") newState.enrichmentLevel = 90;
    if (iranCard.id === "iran_npt_withdraw") newState.enrichmentLevel = Math.max(newState.enrichmentLevel, 70);
    if (iranCard.id === "iran_oil_weapon") newState.oilRevenue = Math.max(0, newState.oilRevenue - 1.2);
    if (iranCard.id === "iran_hezbollah_full") newState.hezbollahStrength = Math.min(100, newState.hezbollahStrength + 15);

    const statChanges = calculateStatChanges(beforeState, newState);
    const earlyEnding = checkEarlyEnding(newState, iranCard, enemyCards);

    // Detect counters used
    const countersUsed = enemyCards
      .filter(c => doesCardCounter(c.id, cardId))
      .map(c => c.id);

    set({
      ...newState,
      iranElixir,
      playedIranCard: iranCard,
      enemyResponses: enemyCards,
      playedIranCardIds: newPlayedIds,
      flippedCardId: null,
      selectedCardId: null,
      isResolving: true,
      lastStatChanges: statChanges,
      earlyEndingTriggered: earlyEnding,
      arenaUnits: [...state.arenaUnits, newUnit],
      activeCombos: newActiveCombos,
      comboHistory: comboEvent ? [...state.comboHistory, comboEvent] : state.comboHistory,
      moveLog: [...state.moveLog, {
        turn: state.turn,
        iranCard,
        enemyCards,
        summary: `ایران «${iranCard.name}» را بازی کرد.`,
        effectsSummary: "",
        combos: newActiveCombos.length > state.activeCombos.length ? newActiveCombos : undefined,
        countersUsed: countersUsed.length > 0 ? countersUsed : undefined,
      }],
    });
  },

  nextTurn: () => {
    const state = get();
    if (!state.isResolving) return;

    if (state.earlyEndingTriggered) {
      const ending = endings.find((e) => e.id === state.earlyEndingTriggered);
      if (ending) {
        set({ phase: "ending", ending, endingProbability: 1.0, allProbabilities: [{ ending, probability: 1.0 }], isResolving: false, playedIranCard: null, enemyResponses: [], earlyEndingTriggered: null, lastStatChanges: null, arenaUnits: [], enemyPlays: [] });
        return;
      }
    }

    if (state.turn >= state.maxTurns) {
      const engineState: EngineState = {
        nuclearProgress: state.nuclearProgress, regionalInfluence: state.regionalInfluence,
        economicStability: state.economicStability, domesticSupport: state.domesticSupport,
        militaryCapability: state.militaryCapability, deterrence: state.deterrence,
        warEscalation: state.warEscalation, nuclearBreakoutMult: state.nuclearBreakoutMult,
        regimeChangeMult: state.regimeChangeMult, negotiationChanceMult: state.negotiationChanceMult,
        usWithdrawalMult: state.usWithdrawalMult, israelIsolationMult: state.israelIsolationMult,
        turn: state.turn, maxTurns: state.maxTurns,
        // شاخص‌های پنهان Phase 4.4
        israelStrikeReadiness: state.israelStrikeReadiness,
        diplomaticPressure: state.diplomaticPressure,
        domesticTolerance: state.domesticTolerance,
        regimeCollapseRisk: state.regimeCollapseRisk,
        iranDetectionLevel: state.iranDetectionLevel,
        // منابع Phase 4.2
        oilRevenue: state.oilRevenue,
        missileStockpile: state.missileStockpile,
        enrichmentLevel: state.enrichmentLevel,
        forexReserves: state.forexReserves,
        hezbollahStrength: state.hezbollahStrength,
      };
      const { ending, probability, allProbabilities } = determineEnding(engineState);
      set({ phase: "ending", ending, endingProbability: probability, allProbabilities, isResolving: false, playedIranCard: null, enemyResponses: [], lastStatChanges: null, arenaUnits: [], enemyPlays: [] });
      return;
    }

    set({
      turn: state.turn + 1,
      isResolving: false,
      playedIranCard: null,
      enemyResponses: [],
      lastStatChanges: null,
      arenaUnits: [],
      enemyPlays: [],
    });
  },
}));

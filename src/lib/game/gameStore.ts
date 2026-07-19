import { create } from "zustand";
import {
  iranCards,
  usCards,
  israelCards,
  arabCards,
  natoCards,
  nkRussiaChinaCards,
  type GameCard,
  type CardEffects,
} from "./cardsData";
import { determineEnding, type GameState as EngineState, type Ending } from "./endingsData";

export type GameState = {
  phase: "splash" | "intro" | "history" | "game" | "ending";
  turn: number;
  maxTurns: number;
  // Iran stats (0-100)
  nuclearProgress: number;
  regionalInfluence: number;
  economicStability: number;
  domesticSupport: number;
  militaryCapability: number;
  deterrence: number;
  // Probability multipliers (accumulated)
  warEscalation: number; // 0-100
  nuclearBreakoutMult: number;
  regimeChangeMult: number;
  negotiationChanceMult: number;
  usWithdrawalMult: number;
  israelIsolationMult: number;
  // Cards
  playedIranCardIds: string[];
  playedIranCard: GameCard | null;
  // Enemy responses (up to 3)
  enemyResponses: GameCard[];
  // Card flip state
  flippedCardId: string | null;
  // Log
  moveLog: MoveEntry[];
  // Ending
  ending: Ending | null;
  endingProbability: number;
  allProbabilities: Array<{ ending: Ending; probability: number }> | null;
  // Animation
  isResolving: boolean;
  historyViewedEra: string | null;
};

export type MoveEntry = {
  turn: number;
  iranCard: GameCard;
  enemyCards: GameCard[];
  summary: string;
  effectsSummary: string;
};

const INITIAL_STATE = {
  phase: "splash" as const,
  turn: 1,
  maxTurns: 8,
  // Initial state reflects post-Esfand 1404 situation
  nuclearProgress: 55,
  regionalInfluence: 50,
  economicStability: 30,
  domesticSupport: 65,
  militaryCapability: 50,
  deterrence: 40,
  warEscalation: 55,
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
  if (effects.nuclearBreakout) {
    next.nuclearBreakoutMult = state.nuclearBreakoutMult * effects.nuclearBreakout;
  }
  if (effects.regimeChange) {
    next.regimeChangeMult = state.regimeChangeMult * effects.regimeChange;
  }
  if (effects.negotiationChance) {
    next.negotiationChanceMult = state.negotiationChanceMult * effects.negotiationChance;
  }
  if (effects.usWithdrawal) {
    next.usWithdrawalMult = state.usWithdrawalMult * effects.usWithdrawal;
  }
  if (effects.israelIsolation) {
    next.israelIsolationMult = state.israelIsolationMult * effects.israelIsolation;
  }
  return next;
}

// AI: Select 2-3 enemy response cards based on Iran's action
function selectEnemyResponses(state: GameState, iranCard: GameCard): GameCard[] {
  // Combine all enemy pools
  const allEnemies = [...usCards, ...israelCards, ...arabCards, ...natoCards];

  const weighted = allEnemies.map((card) => {
    let weight = card.aiWeight ?? 10;
    // Strong counter boost
    if (card.counters?.includes(iranCard.id)) weight *= 3.5;
    // Diplomatic cards from Iran → US diplomacy likely
    if (iranCard.category === "diplomatic" && card.category === "diplomatic") weight *= 1.8;
    // Nuclear cards from Iran → military/nuclear responses more likely
    if (iranCard.id === "iran_nuclear_breakout") {
      if (card.id === "us_strike_nukes") weight *= 2.5;
      if (card.id === "israel_nuclear_facility" || card.id === "israel_preemptive") weight *= 3;
      if (card.id === "us_nuclear_umbrella" || card.id === "arab_saudi_nuke") weight *= 2.5;
      if (card.id === "israel_second_strike" || card.id === "israel_nuclear_ambiguity_end") weight *= 2;
    }
    if (iranCard.id === "iran_npt_withdraw") {
      if (card.id === "israel_nuclear_facility" || card.id === "israel_preemptive") weight *= 2.5;
      if (card.id === "us_nuclear_umbrella") weight *= 2;
    }
    if (iranCard.id === "iran_nk_nuclear_deal") {
      if (card.id === "us_sanctions_max") weight *= 2.5;
      if (card.id === "us_strike_nukes" || card.id === "israel_preemptive") weight *= 3;
      if (card.id === "israel_nuclear_facility") weight *= 2.5;
    }
    // Hormuz → US Hormuz operation likely
    if (iranCard.id === "iran_hormuz") {
      if (card.id === "us_hormuz_operation") weight *= 4;
      if (card.id === "us_oil_blockade") weight *= 2.5;
      if (card.id === "arab_oil_increase") weight *= 2;
      if (card.id === "israel_strike_iran_oil") weight *= 2;
    }
    // Hezbollah → Israel war on Hezbollah likely
    if (iranCard.id === "iran_hezbollah_full") {
      if (card.id === "israel_hezbollah_war") weight *= 4;
      if (card.id === "us_aid_israel") weight *= 2.5;
      if (card.id === "israel_assassination") weight *= 2;
    }
    // Houthi → Prosperity Guardian likely
    if (iranCard.id === "iran_houthi" || iranCard.id === "iran_bab_el_mandeb") {
      if (card.id === "nato_prosperity_guardian") weight *= 3.5;
      if (card.id === "arab_patriot_defense") weight *= 2;
    }
    // Missile strike → defense + retaliation
    if (iranCard.id === "iran_missile_strike") {
      if (card.id === "us_aid_israel") weight *= 2.5;
      if (card.id === "nato_uk_france_direct") weight *= 3;
      if (card.id === "arab_jordan_air_corridor") weight *= 2.5;
      if (card.id === "israel_air_strike") weight *= 2.5;
      if (card.id === "israel_assassination") weight *= 2;
    }
    // Ground invasion → extreme response
    if (iranCard.id === "iran_ground_invasion") {
      if (card.id === "israel_nuclear_strike") weight *= 5;
      if (card.id === "us_ground_invasion") weight *= 3;
      if (card.id === "us_nuclear_strike") weight *= 3;
    }
    // ICBM → nuclear responses
    if (iranCard.id === "iran_icbm") {
      if (card.id === "us_nuclear_strike") weight *= 4;
      if (card.id === "us_ground_invasion") weight *= 3;
    }
    // Cyber → cyber retaliation
    if (iranCard.category === "cyber") {
      if (card.id === "us_cyber_offensive" || card.id === "israel_cyber") weight *= 3;
    }
    // Diplomacy from Iran → negotiation likely (also deception)
    if (iranCard.id === "iran_diplomacy") {
      if (card.id === "us_negotiation_deception") weight *= 3;
      if (card.id === "israel_diplomatic_isolate") weight *= 2;
    }
    // Russia alliance → counters
    if (iranCard.id === "iran_russia_alliance") {
      if (card.id === "us_sanctions_max") weight *= 2;
      if (card.id === "us_intel_opposition") weight *= 2;
    }
    // China deal → counters
    if (iranCard.id === "iran_china_deal") {
      if (card.id === "us_sanctions_max") weight *= 2;
    }
    // Saudi normalize → Israel isolation
    if (iranCard.id === "iran_saudi_normalize") {
      if (card.id === "israel_diplomatic_isolate") weight *= 0.5; // less likely
      if (card.id === "arab_us_alliance") weight *= 0.3; // less likely
    }
    // Iraq militias → strike
    if (iranCard.id === "iran_iraq_militias") {
      if (card.id === "us_strike_iraq_militias") weight *= 3.5;
      if (card.id === "arab_iraq_pressure") weight *= 2.5;
    }
    // Hamas → Gaza operation
    if (iranCard.id === "iran_hamas") {
      if (card.id === "israel_hamas_war") weight *= 4;
    }
    // Strike US bases → US retaliation
    if (iranCard.id === "iran_strike_us_bases") {
      if (card.id === "us_carrier_group") weight *= 3;
      if (card.id === "us_target_irgc") weight *= 3;
      if (card.id === "us_strike_nukes") weight *= 2;
    }
    // Reduce extreme cards unless war escalation high
    if (card.requiresHighWarEscalation && state.warEscalation < 75) weight *= 0.2;
    if (card.requiresNuclearProgress && state.nuclearProgress < card.requiresNuclearProgress) weight *= 0.3;
    // Don't pick duplicate actors too much (limit same actor to 2)
    return { card, weight };
  });

  // Select 2-3 cards with weighted random, avoiding too many from same actor
  const selected: GameCard[] = [];
  const actorCount: Record<string, number> = {};
  const targetCount = Math.random() < 0.4 ? 3 : 2;

  for (let i = 0; i < targetCount; i++) {
    const available = weighted.filter((w) => {
      if (selected.find((s) => s.id === w.card.id)) return false;
      const actor = w.card.actor;
      // Limit same actor to 2 (to avoid 3 US cards)
      if (actorCount[actor] >= 2) return false;
      return true;
    });
    if (available.length === 0) break;

    const total = available.reduce((s, i) => s + i.weight, 0);
    let r = Math.random() * total;
    let chosen = available[available.length - 1].card;
    for (const item of available) {
      r -= item.weight;
      if (r <= 0) {
        chosen = item.card;
        break;
      }
    }
    selected.push(chosen);
    actorCount[chosen.actor] = (actorCount[chosen.actor] || 0) + 1;
  }

  // Sometimes add a third-party (NK/Russia/China) card if Iran played alliance/diplomatic
  if (iranCard.category === "alliance" || iranCard.id === "iran_diplomacy" || iranCard.id === "iran_patience") {
    if (Math.random() < 0.5 && selected.length < 3) {
      const thirdPartyPool = [...nkRussiaChinaCards];
      const thirdParty = thirdPartyPool[Math.floor(Math.random() * thirdPartyPool.length)];
      if (!selected.find((s) => s.id === thirdParty.id)) {
        selected.push(thirdParty);
      }
    }
  }

  return selected;
}

function summarizeMove(iranCard: GameCard, enemyCards: GameCard[]): string {
  let summary = `ایران «${iranCard.name}» را بازی کرد.`;
  if (enemyCards.length > 0) {
    summary += ` پاسخ‌ها: `;
    summary += enemyCards.map((c) => `${c.actorLabel}: «${c.name}»`).join("، ");
    summary += ".";
  }
  return summary;
}

function effectsSummaryText(iranCard: GameCard, enemyCards: GameCard[]): string {
  const parts: string[] = [];
  const e = iranCard.effects;
  if (e.nuclearProgress) parts.push(`پیشرفت هسته‌ای ${e.nuclearProgress > 0 ? "+" : ""}${e.nuclearProgress}`);
  if (e.deterrence) parts.push(`بازدارندگی ${e.deterrence > 0 ? "+" : ""}${e.deterrence}`);
  if (e.economicStability) parts.push(`اقتصاد ${e.economicStability > 0 ? "+" : ""}${e.economicStability}`);
  if (e.domesticSupport) parts.push(`حمایت داخلی ${e.domesticSupport > 0 ? "+" : ""}${e.domesticSupport}`);
  for (const card of enemyCards) {
    const ce = card.effects;
    if (ce.militaryCapability) parts.push(`${card.actorLabel}: توان نظامی ${ce.militaryCapability}`);
    if (ce.economicStability) parts.push(`${card.actorLabel}: اقتصاد ${ce.economicStability}`);
    if (ce.nuclearProgress) parts.push(`${card.actorLabel}: هسته‌ای ${ce.nuclearProgress}`);
    if (ce.deterrence) parts.push(`${card.actorLabel}: بازدارندگی ${ce.deterrence}`);
  }
  return parts.slice(0, 6).join("، ");
}

export const useGameStore = create<GameState & {
  setPhase: (phase: GameState["phase"]) => void;
  startGame: () => void;
  resetGame: () => void;
  playCard: (cardId: string) => void;
  nextTurn: () => void;
  setHistoryViewedEra: (eraId: string | null) => void;
  flipCard: (cardId: string | null) => void;
}>((set, get) => ({
  ...INITIAL_STATE,

  setPhase: (phase) => set({ phase }),

  startGame: () =>
    set({
      ...INITIAL_STATE,
      phase: "game",
    }),

  resetGame: () =>
    set({
      ...INITIAL_STATE,
      phase: "splash",
    }),

  setHistoryViewedEra: (eraId) => set({ historyViewedEra: eraId }),

  flipCard: (cardId) => set({ flippedCardId: cardId }),

  playCard: (cardId) => {
    const state = get();
    if (state.isResolving) return;
    const iranCard = iranCards.find((c) => c.id === cardId);
    if (!iranCard) return;

    let newState = { ...state };
    // Apply Iran card effects
    const iranEffects = applyEffects(newState, iranCard.effects);
    newState = { ...newState, ...iranEffects };

    // Select enemy responses
    const enemyCards = selectEnemyResponses(newState, iranCard);

    // Apply enemy card effects in sequence
    for (const card of enemyCards) {
      const effects = applyEffects(newState, card.effects);
      newState = { ...newState, ...effects };
    }

    const summary = summarizeMove(iranCard, enemyCards);
    const effectsSummary = effectsSummaryText(iranCard, enemyCards);

    const moveEntry: MoveEntry = {
      turn: state.turn,
      iranCard,
      enemyCards,
      summary,
      effectsSummary,
    };

    set({
      ...newState,
      playedIranCard: iranCard,
      enemyResponses: enemyCards,
      playedIranCardIds: [...state.playedIranCardIds, cardId],
      flippedCardId: null,
      isResolving: true,
      moveLog: [...state.moveLog, moveEntry],
    });
  },

  nextTurn: () => {
    const state = get();
    if (!state.isResolving) return;

    if (state.turn >= state.maxTurns) {
      const engineState: EngineState = {
        nuclearProgress: state.nuclearProgress,
        regionalInfluence: state.regionalInfluence,
        economicStability: state.economicStability,
        domesticSupport: state.domesticSupport,
        militaryCapability: state.militaryCapability,
        deterrence: state.deterrence,
        warEscalation: state.warEscalation,
        nuclearBreakoutMult: state.nuclearBreakoutMult,
        regimeChangeMult: state.regimeChangeMult,
        negotiationChanceMult: state.negotiationChanceMult,
        usWithdrawalMult: state.usWithdrawalMult,
        israelIsolationMult: state.israelIsolationMult,
        turn: state.turn,
        maxTurns: state.maxTurns,
      };
      const { ending, probability, allProbabilities } = determineEnding(engineState);
      set({
        phase: "ending",
        ending,
        endingProbability: probability,
        allProbabilities,
        isResolving: false,
        playedIranCard: null,
        enemyResponses: [],
      });
      return;
    }

    set({
      turn: state.turn + 1,
      isResolving: false,
      playedIranCard: null,
      enemyResponses: [],
    });
  },
}));

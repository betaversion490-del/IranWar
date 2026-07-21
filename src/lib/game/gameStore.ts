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
import { determineEnding, endings, type GameState as EngineState, type Ending } from "./endingsData";

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
  // NEW: Card preparation system
  preparingCards: Record<string, number>; // cardId -> remaining prep time (seconds)
  // NEW: Selected card for detail view
  selectedCardId: string | null;
  // NEW: Show all cards view
  showAllCards: "iran" | "enemy" | null;
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
  earlyEndingTriggered: null,
  lastStatChanges: null,
  preparingCards: {} as Record<string, number>,
  selectedCardId: null,
  showAllCards: null as "iran" | "enemy" | null,
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
  if (effects.usPressure) next.warEscalation = clamp(state.warEscalation + (effects.usPressure > 0 ? effects.usPressure : 0));
  if (effects.israelThreat) next.warEscalation = clamp(state.warEscalation + (effects.israelThreat > 0 ? effects.israelThreat : 0));
  if (effects.warEscalation) {
    const delta = (effects.warEscalation - 1) * 25;
    next.warEscalation = clamp(state.warEscalation + delta);
  }
  if (effects.nuclearBreakout) next.nuclearBreakoutMult = state.nuclearBreakoutMult * effects.nuclearBreakout;
  if (effects.regimeChange) next.regimeChangeMult = state.regimeChangeMult * effects.regimeChange;
  if (effects.negotiationChance) next.negotiationChanceMult = state.negotiationChanceMult * effects.negotiationChance;
  if (effects.usWithdrawal) next.usWithdrawalMult = state.usWithdrawalMult * effects.usWithdrawal;
  if (effects.israelIsolation) next.israelIsolationMult = state.israelIsolationMult * effects.israelIsolation;
  return next;
}

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
  if (iranCard.id === "iran_nuclear_breakout" && state.nuclearProgress >= 85) return "iran_nuclear_deterrence";
  const allCards = [iranCard, ...enemyCards];
  if (allCards.some(c => c.id === "us_nuclear_strike" || c.id === "israel_nuclear_strike")) return "nuclear_war_regional";
  if (state.militaryCapability <= 15 && state.warEscalation >= 90) return "iran_strategic_defeat";
  if (state.economicStability <= 10 && state.domesticSupport <= 15) return "regime_change_from_within";
  if (state.deterrence >= 85 && state.regionalInfluence >= 85 && state.warEscalation < 40) return "us_withdrawal_ambition";
  if (state.negotiationChanceMult >= 2.5 && state.warEscalation < 30) return "comprehensive_peace";
  if (state.regionalInfluence >= 90 && state.israelIsolationMult >= 2.0) return "israel_strategic_weakening";
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
}>((set, get) => ({
  ...INITIAL_STATE,

  setPhase: (phase) => set({ phase }),
  startGame: () => set({ ...INITIAL_STATE, phase: "game" }),
  resetGame: () => set({ ...INITIAL_STATE, phase: "splash" }),
  setHistoryViewedEra: (eraId) => set({ historyViewedEra: eraId }),
  flipCard: (cardId) => set({ flippedCardId: cardId }),
  selectCard: (cardId) => set({ selectedCardId: cardId }),
  setShowAllCards: (show) => set({ showAllCards: show }),

  startPreparation: (cardId) => {
    const state = get();
    if (state.preparingCards[cardId] !== undefined) return;
    const prepTime = getPrepTime(cardId);
    if (prepTime === 0) {
      // Instant - play immediately
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
        // Card is ready!
        delete preparing[cardId];
        changed = true;
        // Auto-play the card
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

    const beforeState = { ...state };
    let newState = { ...state };
    const iranEffects = applyEffects(newState, iranCard.effects);
    newState = { ...newState, ...iranEffects };

    const enemyCards = selectEnemyResponses(newState, iranCard);
    for (const card of enemyCards) {
      const effects = applyEffects(newState, card.effects);
      newState = { ...newState, ...effects };
    }

    const statChanges = calculateStatChanges(beforeState, newState);
    const earlyEnding = checkEarlyEnding(newState, iranCard, enemyCards);

    set({
      ...newState,
      playedIranCard: iranCard,
      enemyResponses: enemyCards,
      playedIranCardIds: [...state.playedIranCardIds, cardId],
      flippedCardId: null,
      selectedCardId: null,
      isResolving: true,
      lastStatChanges: statChanges,
      earlyEndingTriggered: earlyEnding,
      moveLog: [...state.moveLog, {
        turn: state.turn,
        iranCard,
        enemyCards,
        summary: `ایران «${iranCard.name}» را بازی کرد.`,
        effectsSummary: "",
      }],
    });
  },

  nextTurn: () => {
    const state = get();
    if (!state.isResolving) return;

    if (state.earlyEndingTriggered) {
      const ending = endings.find((e) => e.id === state.earlyEndingTriggered);
      if (ending) {
        set({ phase: "ending", ending, endingProbability: 1.0, allProbabilities: [{ ending, probability: 1.0 }], isResolving: false, playedIranCard: null, enemyResponses: [], earlyEndingTriggered: null, lastStatChanges: null });
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
      };
      const { ending, probability, allProbabilities } = determineEnding(engineState);
      set({ phase: "ending", ending, endingProbability: probability, allProbabilities, isResolving: false, playedIranCard: null, enemyResponses: [], lastStatChanges: null });
      return;
    }

    set({ turn: state.turn + 1, isResolving: false, playedIranCard: null, enemyResponses: [], lastStatChanges: null });
  },
}));

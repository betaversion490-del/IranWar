import { create } from "zustand";
import { iranCards, usCards, israelCards, allEnemyCards, type GameCard, type CardEffects } from "./cardsData";
import { determineEnding, type GameState as EngineState, type Ending } from "./endingsData";

export type GameState = {
  // Game flow
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
  // Enemy stats (0-100)
  usPressure: number;
  israelThreat: number;
  // Probability multipliers (accumulated, normalized 0-100 for warEscalation)
  warEscalation: number;
  nuclearBreakoutMult: number;
  regimeChangeMult: number;
  negotiationChanceMult: number;
  // Cards
  iranHand: GameCard[];
  playedIranCard: GameCard | null;
  playedUsCard: GameCard | null;
  playedIsraelCard: GameCard | null;
  // Log of moves
  moveLog: MoveEntry[];
  // Ending
  ending: Ending | null;
  endingProbability: number;
  allProbabilities: Array<{ ending: Ending; probability: number }> | null;
  // Animation control
  isResolving: boolean;
  historyViewedEra: string | null;
};

export type MoveEntry = {
  turn: number;
  iranCard: GameCard;
  usCard: GameCard | null;
  israelCard: GameCard | null;
  summary: string;
  effectsSummary: string;
};

const INITIAL_STATE = {
  phase: "splash" as const,
  turn: 1,
  maxTurns: 8,
  nuclearProgress: 55,
  regionalInfluence: 60,
  economicStability: 35,
  domesticSupport: 50,
  militaryCapability: 65,
  deterrence: 50,
  usPressure: 65,
  israelThreat: 70,
  warEscalation: 35,
  nuclearBreakoutMult: 1.0,
  regimeChangeMult: 1.0,
  negotiationChanceMult: 1.0,
  iranHand: [] as GameCard[],
  playedIranCard: null,
  playedUsCard: null,
  playedIsraelCard: null,
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

function applyEffects(state: GameState, effects: CardEffects, isEnemy: boolean): Partial<GameState> {
  const next: Partial<GameState> = {};
  // Direct stat changes
  if (effects.nuclearProgress) next.nuclearProgress = clamp(state.nuclearProgress + effects.nuclearProgress);
  if (effects.regionalInfluence) next.regionalInfluence = clamp(state.regionalInfluence + effects.regionalInfluence);
  if (effects.economicStability) next.economicStability = clamp(state.economicStability + effects.economicStability);
  if (effects.domesticSupport) next.domesticSupport = clamp(state.domesticSupport + effects.domesticSupport);
  if (effects.militaryCapability) next.militaryCapability = clamp(state.militaryCapability + effects.militaryCapability);
  if (effects.deterrence) next.deterrence = clamp(state.deterrence + effects.deterrence);
  if (effects.usPressure) next.usPressure = clamp(state.usPressure + (isEnemy ? Math.abs(effects.usPressure) : effects.usPressure));
  if (effects.israelThreat) next.israelThreat = clamp(state.israelThreat + (isEnemy ? Math.abs(effects.israelThreat) : effects.israelThreat));

  // Multipliers accumulate (just multiply directly)
  if (effects.warEscalation) {
    const delta = (effects.warEscalation - 1) * 25; // Convert mult to escalation points
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
  return next;
}

// AI: select enemy cards based on current state
function selectEnemyCards(state: GameState, iranCard: GameCard): { usCard: GameCard; israelCard: GameCard } {
  // Determine which US cards are more likely given Iran's action
  const weightedUs = usCards.map((card) => {
    let weight = card.aiWeight ?? 10;
    // Increase weight if it counters Iran's card
    if (card.counters?.includes(iranCard.id)) weight *= 2.5;
    // Diplomacy card more likely if Iran plays diplomacy
    if (iranCard.category === "diplomatic" && card.category === "diplomatic") weight *= 2;
    // Sanctions more likely if Iran escalates nuclear
    if (iranCard.category === "nuclear" && card.id === "us_sanctions") weight *= 1.8;
    // Military strike more likely if Iran escalates nuclear significantly
    if (iranCard.id === "iran_nuclear_breakout" && card.id === "us_military_strike") weight *= 1.5;
    // Reduce war cards if warEscalation already high
    if (card.category === "military" && state.warEscalation > 70) weight *= 0.7;
    // Negotiation more likely if Iran plays diplomatically
    if (iranCard.id === "iran_diplomacy" && card.id === "us_negotiation") weight *= 3;
    return { card, weight };
  });

  const weightedIsrael = israelCards.map((card) => {
    let weight = card.aiWeight ?? 10;
    if (card.counters?.includes(iranCard.id)) weight *= 2.5;
    if (iranCard.id === "iran_proxy_hezbollah" && card.id === "israel_hezbollah_strike") weight *= 2.5;
    if (iranCard.id === "iran_nuclear_breakout" && (card.id === "israel_nuclear_facility" || card.id === "israel_preemptive")) weight *= 2;
    if (iranCard.id === "iran_missile_strike" && card.id === "israel_air_strike") weight *= 2;
    if (iranCard.category === "cyber" && card.id === "israel_cyber") weight *= 2;
    // Reduce preemptive probability unless really necessary
    if (card.id === "israel_preemptive" && state.warEscalation < 60) weight *= 0.5;
    if (card.category === "military" && state.warEscalation > 80) weight *= 0.7;
    return { card, weight };
  });

  // Weighted random selection
  const pickWeighted = <T,>(items: Array<{ card: T; weight: number }>): T => {
    const total = items.reduce((s, i) => s + i.weight, 0);
    let r = Math.random() * total;
    for (const item of items) {
      r -= item.weight;
      if (r <= 0) return item.card;
    }
    return items[items.length - 1].card;
  };

  return {
    usCard: pickWeighted(weightedUs),
    israelCard: pickWeighted(weightedIsrael),
  };
}

function summarizeMove(iranCard: GameCard, usCard: GameCard | null, israelCard: GameCard | null): string {
  let summary = `ایران «${iranCard.name}» را بازی کرد.`;
  if (usCard) summary += ` آمریکا با «${usCard.name}» پاسخ داد.`;
  if (israelCard) summary += ` اسرائیل با «${israelCard.name}» واکنش نشان داد.`;
  return summary;
}

function effectsSummaryText(iranCard: GameCard, usCard: GameCard | null, israelCard: GameCard | null): string {
  const parts: string[] = [];
  const e = iranCard.effects;
  if (e.nuclearProgress) parts.push(`پیشرفت هسته‌ای ${e.nuclearProgress > 0 ? "+" : ""}${e.nuclearProgress}`);
  if (e.deterrence) parts.push(`بازدارندگی ${e.deterrence > 0 ? "+" : ""}${e.deterrence}`);
  if (e.economicStability) parts.push(`اقتصاد ${e.economicStability > 0 ? "+" : ""}${e.economicStability}`);
  if (e.domesticSupport) parts.push(`حمایت داخلی ${e.domesticSupport > 0 ? "+" : ""}${e.domesticSupport}`);
  if (usCard) {
    const ue = usCard.effects;
    if (ue.usPressure) parts.push(`فشار آمریکا +${Math.abs(ue.usPressure)}`);
    if (ue.economicStability) parts.push(`اقتصاد ${ue.economicStability}`);
    if (ue.militaryCapability) parts.push(`توان نظامی ${ue.militaryCapability}`);
  }
  if (israelCard) {
    const ie = israelCard.effects;
    if (ie.israelThreat) parts.push(`تهدید اسرائیل +${Math.abs(ie.israelThreat)}`);
    if (ie.militaryCapability) parts.push(`توان نظامی ${ie.militaryCapability}`);
    if (ie.nuclearProgress) parts.push(`پیشرفت هسته‌ای ${ie.nuclearProgress}`);
  }
  return parts.join("، ");
}

function drawIranHand(): GameCard[] {
  // 5 random cards from Iran deck, with at least 1 diplomatic, 1 military, 1 asymmetric
  const shuffled = [...iranCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
}

export const useGameStore = create<GameState & {
  setPhase: (phase: GameState["phase"]) => void;
  startGame: () => void;
  resetGame: () => void;
  playCard: (cardId: string) => void;
  nextTurn: () => void;
  setHistoryViewedEra: (eraId: string | null) => void;
}>((set, get) => ({
  ...INITIAL_STATE,

  setPhase: (phase) => set({ phase }),

  startGame: () =>
    set({
      ...INITIAL_STATE,
      phase: "game",
      iranHand: drawIranHand(),
    }),

  resetGame: () =>
    set({
      ...INITIAL_STATE,
      phase: "splash",
    }),

  setHistoryViewedEra: (eraId) => set({ historyViewedEra: eraId }),

  playCard: (cardId) => {
    const state = get();
    if (state.isResolving) return;
    const iranCard = state.iranHand.find((c) => c.id === cardId);
    if (!iranCard) return;

    // Apply Iran card effects
    let newState = { ...state };
    const iranEffects = applyEffects(newState, iranCard.effects, false);
    newState = { ...newState, ...iranEffects };

    // Enemy AI selects cards
    const { usCard, israelCard } = selectEnemyCards(newState, iranCard);

    // Apply US card effects
    const usEffects = applyEffects(newState, usCard.effects, true);
    newState = { ...newState, ...usEffects };

    // Apply Israel card effects
    const israelEffects = applyEffects(newState, israelCard.effects, true);
    newState = { ...newState, ...israelEffects };

    const summary = summarizeMove(iranCard, usCard, israelCard);
    const effectsSummary = effectsSummaryText(iranCard, usCard, israelCard);

    const moveEntry: MoveEntry = {
      turn: state.turn,
      iranCard,
      usCard,
      israelCard,
      summary,
      effectsSummary,
    };

    set({
      ...newState,
      playedIranCard: iranCard,
      playedUsCard: usCard,
      playedIsraelCard: israelCard,
      iranHand: newState.iranHand.filter((c) => c.id !== cardId),
      isResolving: true,
      moveLog: [...state.moveLog, moveEntry],
    });
  },

  nextTurn: () => {
    const state = get();
    if (!state.isResolving) return;

    // Check if game is over
    if (state.turn >= state.maxTurns) {
      // Determine ending
      const engineState: EngineState = {
        nuclearProgress: state.nuclearProgress,
        regionalInfluence: state.regionalInfluence,
        economicStability: state.economicStability,
        domesticSupport: state.domesticSupport,
        militaryCapability: state.militaryCapability,
        deterrence: state.deterrence,
        usPressure: state.usPressure,
        israelThreat: state.israelThreat,
        warEscalation: state.warEscalation,
        nuclearBreakoutMult: state.nuclearBreakoutMult,
        regimeChangeMult: state.regimeChangeMult,
        negotiationChanceMult: state.negotiationChanceMult,
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
        playedUsCard: null,
        playedIsraelCard: null,
      });
      return;
    }

    // Draw a new card if hand is empty (typically not, since we draw 5 and play 8 turns)
    let newHand = state.iranHand;
    if (newHand.length === 0) {
      newHand = drawIranHand();
    } else if (newHand.length < 4 && Math.random() < 0.4) {
      // Occasionally add a new card
      const availableCards = iranCards.filter((c) => !newHand.find((h) => h.id === c.id));
      if (availableCards.length > 0) {
        const newCard = availableCards[Math.floor(Math.random() * availableCards.length)];
        newHand = [...newHand, newCard];
      }
    }

    set({
      turn: state.turn + 1,
      isResolving: false,
      playedIranCard: null,
      playedUsCard: null,
      playedIsraelCard: null,
      iranHand: newHand,
    });
  },
}));

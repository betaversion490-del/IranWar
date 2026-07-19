import { create } from "zustand";
import { iranCards, usCards, israelCards, type GameCard, type CardEffects } from "./cardsData";
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
  // Enemy stats (0-100)
  usPressure: number;
  israelThreat: number;
  // Probability multipliers (accumulated, normalized 0-100 for warEscalation)
  warEscalation: number;
  nuclearBreakoutMult: number;
  regimeChangeMult: number;
  negotiationChanceMult: number;
  // Cards: ALL Iran cards available, but some marked as used (still playable, but at reduced novelty)
  playedIranCardIds: string[]; // Track which cards player has used this game
  playedIranCard: GameCard | null;
  playedUsCard: GameCard | null;
  playedIsraelCard: GameCard | null;
  // Card flip state
  flippedCardId: string | null;
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
  // Initial state reflects post-Esfand 1404 situation: war restarting
  nuclearProgress: 60, // برنامه هسته‌ای آسیب دیده اما همچنان پیشرفته
  regionalInfluence: 55, // محور مقاومت تضعیف شده اما زنده
  economicStability: 30, // اقتصاد در تورم شدید
  domesticSupport: 65, // حمایت داخلی به‌دلیل جنگ افزایش یافته
  militaryCapability: 50, // توان نظامی آسیب دیده اما بازسازی می‌شود
  deterrence: 45, // بازدارندگی متوسط
  usPressure: 70, // فشار آمریکا بالا
  israelThreat: 75, // تهدید اسرائیل بالا
  warEscalation: 50, // جنگ سایه‌ای فعال
  nuclearBreakoutMult: 1.0,
  regimeChangeMult: 1.0,
  negotiationChanceMult: 1.0,
  playedIranCardIds: [] as string[],
  playedIranCard: null,
  playedUsCard: null,
  playedIsraelCard: null,
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

function applyEffects(state: GameState, effects: CardEffects, isEnemy: boolean): Partial<GameState> {
  const next: Partial<GameState> = {};
  if (effects.nuclearProgress) next.nuclearProgress = clamp(state.nuclearProgress + effects.nuclearProgress);
  if (effects.regionalInfluence) next.regionalInfluence = clamp(state.regionalInfluence + effects.regionalInfluence);
  if (effects.economicStability) next.economicStability = clamp(state.economicStability + effects.economicStability);
  if (effects.domesticSupport) next.domesticSupport = clamp(state.domesticSupport + effects.domesticSupport);
  if (effects.militaryCapability) next.militaryCapability = clamp(state.militaryCapability + effects.militaryCapability);
  if (effects.deterrence) next.deterrence = clamp(state.deterrence + effects.deterrence);
  if (effects.usPressure) next.usPressure = clamp(state.usPressure + (isEnemy ? Math.abs(effects.usPressure) : effects.usPressure));
  if (effects.israelThreat) next.israelThreat = clamp(state.israelThreat + (isEnemy ? Math.abs(effects.israelThreat) : effects.israelThreat));

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
  return next;
}

function selectEnemyCards(state: GameState, iranCard: GameCard): { usCard: GameCard; israelCard: GameCard } {
  const weightedUs = usCards.map((card) => {
    let weight = card.aiWeight ?? 10;
    if (card.counters?.includes(iranCard.id)) weight *= 2.5;
    if (iranCard.category === "diplomatic" && card.category === "diplomatic") weight *= 2;
    if (iranCard.category === "nuclear" && card.id === "us_sanctions") weight *= 1.8;
    if (iranCard.id === "iran_nuclear_breakout" && card.id === "us_military_strike") weight *= 2;
    if (iranCard.id === "iran_nuclear_breakout" && card.id === "us_nuclear_strike") weight *= 3;
    if (iranCard.id === "iran_ground_invasion" && card.id === "us_ground_invasion") weight *= 3;
    if (iranCard.id === "iran_icbm" && card.id === "us_nuclear_strike") weight *= 4;
    if (card.category === "extreme" && state.warEscalation < 70) weight *= 0.3;
    if (iranCard.category === "extreme" && card.category === "extreme") weight *= 2;
    if (iranCard.id === "iran_diplomacy" && card.id === "us_negotiation") weight *= 3;
    if (iranCard.id === "iran_russia_alliance" && card.id === "us_withdraw") weight *= 2;
    return { card, weight };
  });

  const weightedIsrael = israelCards.map((card) => {
    let weight = card.aiWeight ?? 10;
    if (card.counters?.includes(iranCard.id)) weight *= 2.5;
    if (iranCard.id === "iran_hezbollah_full" && card.id === "israel_hezbollah_strike") weight *= 2.5;
    if (iranCard.id === "iran_nuclear_breakout" && (card.id === "israel_nuclear_facility" || card.id === "israel_preemptive")) weight *= 2.5;
    if (iranCard.id === "iran_nuclear_breakout" && card.id === "israel_nuclear_strike") weight *= 4;
    if (iranCard.id === "iran_ground_invasion" && card.id === "israel_nuclear_strike") weight *= 3;
    if (iranCard.id === "iran_missile_strike" && card.id === "israel_air_strike") weight *= 2;
    if (iranCard.category === "cyber" && card.id === "israel_cyber") weight *= 2;
    if (card.id === "israel_preemptive" && state.warEscalation < 60) weight *= 0.5;
    if (card.id === "israel_nuclear_strike" && state.warEscalation < 90) weight *= 0.2;
    if (card.category === "extreme" && state.warEscalation < 80) weight *= 0.3;
    if (iranCard.category === "extreme" && card.category === "extreme") weight *= 2;
    return { card, weight };
  });

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
    const iranEffects = applyEffects(newState, iranCard.effects, false);
    newState = { ...newState, ...iranEffects };

    const { usCard, israelCard } = selectEnemyCards(newState, iranCard);

    const usEffects = applyEffects(newState, usCard.effects, true);
    newState = { ...newState, ...usEffects };

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

    set({
      turn: state.turn + 1,
      isResolving: false,
      playedIranCard: null,
      playedUsCard: null,
      playedIsraelCard: null,
    });
  },
}));

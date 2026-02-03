import { Bid, CardState, Game, PhaseName, PlayerId } from "@shared/types/StateTypes";

export const clearCurrentRound = (state: Game): Game => ({
  ...state,
  currentRound: null
});

export const incrementTrickIndex = (state: Game): Game => ({
  ...state,
  currentRound: {
    ...state.currentRound!,
    trickIndex: state.currentRound!.trickIndex + 1
  }
});

export const setBid = (
  state: Game,
  bid: Bid
): Game => {
  const round = state.currentRound!;
  const bids = round.bids.filter(b => b.playerId !== bid.playerId);

  return {
    ...state,
    currentRound: {
      ...round,
      bids: [...bids, bid]
    }
  };
};

export const setCardsState = (
  state: Game,
  cardsState: CardState
): Game => ({
  ...state,
  currentRound: {
    ...state.currentRound!,
    cardsState
  }
});

export const setPhase = (
  state: Game,
  phase: PhaseName
): Game => ({
  ...state,
  currentRound: {
    ...state.currentRound!,
    phase
  }
});

export const setRainbowForPlayer = (
  state: Game,
  playerId: PlayerId
): Game => {
  const round = state.currentRound!;
  const existing = round.bids.find(b => b.playerId === playerId);

  const updatedBid: Bid = existing
    ? { ...existing, rainbow: true }
    : { playerId, bid: 0, trip: false, rainbow: true };

  return setBid(state, updatedBid);
};

export const setTurnPlayer = (
  state: Game,
  playerId: PlayerId
): Game => ({
  ...state,
  currentRound: {
    ...state.currentRound!,
    turnPlayerId: playerId
  }
});

export const startCurrentRound = (
  state: Game,
  roundIndex: number,
  dealerPlayerId: PlayerId
): Game => {
  const round = state.rounds[roundIndex];

  return {
    ...state,
    currentRound: {
      roundIndex,
      phase: "DEALING",
      dealerPlayerId,
      turnPlayerId: dealerPlayerId,
      bids: [],
      trickIndex: 0,
      cardsState: {
        deck: [],
        trump: null,
        hands: [],
        currentTrick: null,
        books: []
      }
    }
  };
};

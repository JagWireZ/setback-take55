import { Game, CardState, Hand, Card, PlayerId, TrickPlay, Book } from "@shared/types/StateTypes";
import * as CurrentRound from "./currentRound";

export const setDeck = (state: Game, deck: Card[]): Game => {
  if (!state.currentRound) return state;
  
  return CurrentRound.setCardsState(state, {
    ...state.currentRound.cardsState,
    deck
  });
};

export const dealHand = (state: Game, hands: Hand[]): Game => {
  if (!state.currentRound) return state;
  
  return CurrentRound.setCardsState(state, {
    ...state.currentRound.cardsState,
    hands
  });
};

export const playCard = (state: Game, play: TrickPlay): Game => {
  if (!state.currentRound) return state;

  const { cardsState } = state.currentRound;

  return CurrentRound.setCardsState(state, {
    ...cardsState,
    currentTrick: cardsState.currentTrick
      ? {
          ...cardsState.currentTrick,
          plays: [...cardsState.currentTrick.plays, play],
        }
      : {
          trickIndex: state.currentRound.trickIndex,
          plays: [play],
        },
    hands: cardsState.hands.map(h =>
      h.playerId === play.playerId
        ? { ...h, cards: h.cards.filter(c => !(c.rank === play.card.rank && c.suit === play.card.suit)) }
        : h
    ),
  });
};

export const endTrick = (state: Game, winnerId: PlayerId): Game => {
  if (!state.currentRound) return state;
  if (!state.currentRound.cardsState.currentTrick) return state;

  const currentTrick = state.currentRound.cardsState.currentTrick;
  
  const book: Book = {
    trickIndex: currentTrick.trickIndex,
    winnerId,
    cards: currentTrick.plays.map(p => p.card)
  };

  return CurrentRound.setCardsState(state, {
    ...state.currentRound.cardsState,
    currentTrick: null,
    books: [...state.currentRound.cardsState.books, book]
  });
};

import * as Types from "@shared/types";
import { generateGameId } from "./engine/helpers/generateGameId";
import { generateCardDeck } from "./engine/helpers/generateCardDeck";
import { generateLongId, generateShortId } from "./engine/helpers/generateUuid";

// Initial blueprint (state)
const initialState: Types.Game = {
  gameId: generateGameId(),
  version: 1,
  options: {
    maxCards: 10,
    blindBid: false
  },
  players: [],
  score: {
    rounds: [],
    total: []
  },
  rounds: [],
  currentRound: null
};

// VERSION
const increaseVersion = (state: Types.Game) => {
  return {
    ...state,
    version: state.version + 1
  }
}

// OPTIONS
const setOptions = (state: Types.Game, options: Types.Options) => {
  return {
    ...state,
    version: state.version + 1,
    options: {
      ...state.options,
      ...options
    }
  }
}

// PLAYER FUNCTIONS
const addPlayer = (state: Types.Game, payload: {
  playerName: string;
  type: "ai" | "human";
}): Types.Game => {
  const player: Types.Player = {
    playerId: generateShortId(),
    playerToken: generateLongId(),
    playerName: payload.playerName,
    seat: state.players.length,
    type: payload.type,
    connected: true,
  }
  return {
    ...state,
    players: [
      ...state.players,
      player
    ]
  }
}

const setPlayer = (
  state: Types.Game,
  payload: Partial<Types.Player> & { playerId: Types.PlayerId }
): Types.Game => {

  const players = state.players.map(p =>
    p.playerId === payload.playerId
      ? { ...p, ...payload }   // merge any provided fields
      : p
  );

  return {
    ...state,
    players
  };
};

// ---------- Actions ----------
export type GameAction =
  | { type: "INIT_GAME"; payload: { gameId: string; options: Types.Options; players: Types.Player[] } }
  | { type: "START_ROUND"; payload: { roundIndex: number; cardCount: number; direction: "down" | "up" } }
  | { type: "SET_PHASE"; payload: { phase: Types.PhaseName } }
  | { type: "SET_TURN"; payload: { playerId: Types.PlayerId } }
  | { type: "DEAL_CARDS"; payload: { cardsState: Types.CardState } }
  | { type: "PLAY_CARD"; payload: { play: Types.TrickPlay } }
  | { type: "END_TRICK"; payload: { trick: Types.Trick; book: Types.Book } }
  | { type: "UPDATE_SCORE"; payload: { roundScore: Types.RoundScore[]; totalScore: Types.GameScore[] } }
  | { type: "END_ROUND" }
  | { type: "RESET_GAME" };

export function gameReducer(state: Types.Game, action: GameAction): Types.Game {
  switch (action.type) {

    // ---------- INIT GAME ----------
    case "INIT_GAME": {
      return {
        gameId: action.payload.gameId,
        version: state.version + 1,
        options: action.payload.options,
        players: action.payload.players,
        score: {
          rounds: [],
          total: action.payload.players.map(p => ({
            playerId: p.playerId,
            total: 0,
            possible: 0,
          })),
        },
        rounds: [],
        currentRound: null,
      };
    }

    // ---------- START ROUND ----------
    case "START_ROUND": {
      return {
        ...state,
        currentRound: {
          roundIndex: action.payload.roundIndex,
          phase: "DEALING",
          dealerPlayerId: state.players[0].playerId,
          turnPlayerId: state.players[0].playerId, // default; you can override
          bids: [],
          trickIndex: 0,
          cardsState: {
            deck: [],
            trump: null,
            hands: [],
            currentTrick: null,
            books: [],
          },
        },
      };
    }

    // ---------- SET PHASE ----------
    case "SET_PHASE": {
      if (!state.currentRound) return state;
      return {
        ...state,
        currentRound: {
          ...state.currentRound,
          phase: action.payload.phase,
        },
      };
    }

    // ---------- SET TURN ----------
    case "SET_TURN": {
      if (!state.currentRound) return state;
      return {
        ...state,
        currentRound: {
          ...state.currentRound,
          turnPlayerId: action.payload.playerId,
        },
      };
    }

    // ---------- DEAL CARDS ----------
    case "DEAL_CARDS": {
      if (!state.currentRound) return state;
      return {
        ...state,
        currentRound: {
          ...state.currentRound,
          cardsState: action.payload.cardsState,
        },
      };
    }

    // ---------- PLAY CARD ----------
    case "PLAY_CARD": {
      if (!state.currentRound) return state;

      const { play } = action.payload;
      const { cardsState } = state.currentRound;

      return {
        ...state,
        currentRound: {
          ...state.currentRound,
          cardsState: {
            ...cardsState,
            currentTrick: cardsState.currentTrick
              ? {
                  ...cardsState.currentTrick,
                  plays: [...cardsState.currentTrick.plays, play],
                }
              : {
                  trickIndex: 0,
                  plays: [play],
                },
            hands: cardsState.hands.map((h: Types.Hand) =>
              h.playerId === play.playerId
                ? { ...h, cards: h.cards.filter((c: Types.Card) => !(c.rank === play.card.rank && c.suit === play.card.suit)) }
                : h
            ),
          },
        },
      };
    }

    // ---------- END TRICK ----------
    case "END_TRICK": {
      if (!state.currentRound) return state;

      const { trick, book } = action.payload;

      return {
        ...state,
        currentRound: {
          ...state.currentRound,
          cardsState: {
            ...state.currentRound.cardsState,
            currentTrick: null,
            books: [...state.currentRound.cardsState.books, book],
          },
        },
      };
    }

    // ---------- UPDATE SCORE ----------
    case "UPDATE_SCORE": {
      return {
        ...state,
        score: {
          rounds: [...state.score.rounds, ...action.payload.roundScore],
          total: action.payload.totalScore,
        },
      };
    }

    // ---------- END ROUND ----------
    case "END_ROUND": {
      return {
        ...state,
        currentRound: null,
      };
    }

    // ---------- RESET GAME ----------
    case "RESET_GAME": {
      return {
        ...state,
        currentRound: null,
        score: {
          rounds: [],
          total: state.players.map(p => ({
            playerId: p.playerId,
            total: 0,
            possible: 0,
          })),
        },
      };
    }

    default:
      return state;
  }
}

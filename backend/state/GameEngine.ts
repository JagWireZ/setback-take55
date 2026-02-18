import * as Types from "@shared/types";

// Domain modules
import * as Players from "./engine/players";
import * as Options from "./engine/options";
import * as Rounds from "./engine/rounds";
import * as Cards from "./engine/cards";
import * as Scoring from "./engine/scoring";

// Initial state factory
import { generateGameId } from "./engine/helpers/generateGameId";

export const createInitialState = (): Types.Game => ({
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
});

// Public API surface
export const GameEngine = {
  // Versioning
  increaseVersion: Players.increaseVersion,

  // Players
  addPlayer: Players.addPlayer,
  setPlayer: Players.setPlayer,
  convertPlayerType: Players.convertPlayerType,

  // Options
  setOptions: Options.setOptions,

  // Rounds
  startRound: Rounds.startRound,
  advancePhase: Rounds.advancePhase,
  setTurn: Rounds.setTurn,

  // Cards
  setDeck: Cards.setDeck,
  dealHand: Cards.dealHand,
  playCard: Cards.playCard,
  endTrick: Cards.endTrick,

  // Scoring
  recordRoundScore: Scoring.recordRoundScore,
  finalizeRound: Scoring.finalizeRound
};

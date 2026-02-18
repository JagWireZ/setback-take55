import { RouteContext } from "../router";
import { initialState, gameReducer } from "../state/state";
import * as Types from "@shared/types";

// Type for game store entries
export type GameStoreEntry = {
  state: Types.Game;
  playerTokens: { playerId: string; playerToken: string }[];
};

// In-memory storage for testing (would be replaced with DynamoDB in production)
const gameStore = new Map<string, GameStoreEntry>();

export async function createGame(ctx: RouteContext) {
  const { playerName, options } = ctx.payload ?? {};

  if (!playerName || typeof playerName !== "string") {
    throw new Error("playerName is required");
  }

  // Create initial game state
  let game = initialState;

  // Set options if provided
  if (options) {
    game = gameReducer(game, { type: "SET_OPTIONS", payload: options });
  }

  // Add the creator as the first player
  game = gameReducer(game, {
    type: "ADD_PLAYER",
    payload: {
      playerName,
      type: "human",
    },
  });

  const creator = game.players[0];
  if (!creator) {
    throw new Error("Failed to create player");
  }

  // Store game state (in-memory for now)
  gameStore.set(game.gameId, {
    state: game,
    playerTokens: [
      {
        playerId: creator.playerId,
        playerToken: creator.playerToken,
      },
    ],
  });

  return {
    gameId: game.gameId,
    playerId: creator.playerId,
    playerToken: creator.playerToken,
    state: game,
  };
}

// Export for testing
export { gameStore };

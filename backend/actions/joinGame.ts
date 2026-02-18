import { RouteContext } from "../router";
import { gameReducer } from "../state/state";
import { gameStore } from "./createGame";
import { MAX_PLAYERS } from "../constants";

export async function joinGame(ctx: RouteContext) {
  const { gameId, playerName } = ctx.payload ?? {};

  if (!gameId || typeof gameId !== "string") {
    throw new Error("gameId is required");
  }

  if (!playerName || typeof playerName !== "string") {
    throw new Error("playerName is required");
  }

  // Get game from store
  const gameData = gameStore.get(gameId);
  if (!gameData) {
    throw new Error("Game not found");
  }

  let game = gameData.state;

  // Check if game is already full
  if (game.players.length >= MAX_PLAYERS) {
    throw new Error(`Game is full. Maximum ${MAX_PLAYERS} players allowed.`);
  }

  // Add the new player
  game = gameReducer(game, {
    type: "ADD_PLAYER",
    payload: {
      playerName,
      type: "human",
    },
  });

  const newPlayer = game.players[game.players.length - 1];
  if (!newPlayer) {
    throw new Error("Failed to add player");
  }

  // Update game store
  gameStore.set(gameId, {
    state: game,
    playerTokens: [
      ...gameData.playerTokens,
      {
        playerId: newPlayer.playerId,
        playerToken: newPlayer.playerToken,
      },
    ],
  });

  return {
    gameId: game.gameId,
    playerId: newPlayer.playerId,
    playerToken: newPlayer.playerToken,
    state: game,
  };
}

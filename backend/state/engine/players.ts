import { generateLongId, generateShortId } from "./helpers/generateUuid";

import { Game, Player, PlayerId } from "@shared/types/StateTypes";

export const addPlayer = (state: Game, payload: {
  playerName: string;
  type: "ai" | "human";
}): Game => {
  const player: Player = {
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

export const connectPlayer = (
  state: Game,
  payload: { playerId: PlayerId }
): Game => {
  const { playerId } = payload;

  return {
    ...state,
    players: state.players.map(p =>
      p.playerId === playerId
        ? { ...p, connected: true }
        : p
    ),
  };
};

export const convertPlayer = (
  state: Game,
  payload: { playerId: PlayerId; type: "human" | "ai" }
): Game => {
  const { playerId, type } = payload;

  return {
    ...state,
    players: state.players.map(p =>
      p.playerId === playerId
        ? { ...p, type }
        : p
    ),
  };
};

export const disconnectPlayer = (
  state: Game,
  payload: { playerId: PlayerId }
): Game => {
  const { playerId } = payload;

  return {
    ...state,
    players: state.players.map(p =>
      p.playerId === playerId
        ? { ...p, connected: false }
        : p
    ),
  };
};

export const movePlayer = (
  state: Game,
  payload: { playerId: PlayerId; direction: "left" | "right" }
): Game => {
  const { playerId, direction } = payload;

  const players = state.players;
  const index = players.findIndex(p => p.playerId === playerId);
  if (index === -1) return state;

  const max = players.length;
  const currentSeat = players[index].seat;

  // Compute target seat with wrap-around
  const targetSeat =
    direction === "left"
      ? (currentSeat - 1 + max) % max
      : (currentSeat + 1) % max;

  // Find the player currently in that seat
  const other = players.find(p => p.seat === targetSeat);
  if (!other) return state;

  return {
    ...state,
    players: players.map(p => {
      if (p.playerId === playerId) {
        return { ...p, seat: targetSeat };
      }
      if (p.playerId === other.playerId) {
        return { ...p, seat: currentSeat };
      }
      return p;
    }),
  };
};

export const renamePlayer = (
  state: Game,
  payload: { playerId: PlayerId; playerName: string }
): Game => {
  const name = payload.playerName.trim();
  if (name.length === 0) return state;

  return {
    ...state,
    players: state.players.map(p =>
      p.playerId === payload.playerId
        ? { ...p, playerName: name }
        : p
    ),
  };
};

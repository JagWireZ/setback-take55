// router.ts

import { createGame } from "./actions/createGame";
import { startGame } from "./actions/startGame";
import { joinGame } from "./actions/joinGame";
import { getGameState } from "./actions/getGameState";
import { dealCards } from "./actions/dealCards";
import { submitBid } from "./actions/submitBid";
import { playCard } from "./actions/playCard";

export type Auth = {
  playerId: string;
  playerToken: string;
} | null;

export type RouteContext = {
  auth?: Auth;   // undefined for createGame / joinGame
  payload: any;
};

type ActionHandler = (ctx: RouteContext) => Promise<any>;

const ACTIONS: Record<string, ActionHandler> = {
  createGame,
  startGame,
  joinGame,
  getGameState,
  dealCards,
  submitBid,
  playCard
};

export async function router(action: string, ctx: RouteContext) {
  const fn = ACTIONS[action];

  if (!fn) {
    throw new Error(`Unknown action: ${action}`);
  }

  return fn(ctx);
}

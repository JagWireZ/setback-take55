import { Game, PhaseName, PlayerId } from "@shared/types/StateTypes";
import * as CurrentRound from "./currentRound";

export const startRound = (
  state: Game,
  roundIndex: number,
  dealerPlayerId: PlayerId
): Game => {
  return CurrentRound.startCurrentRound(state, roundIndex, dealerPlayerId);
};

export const advancePhase = (state: Game, phase: PhaseName): Game => {
  return CurrentRound.setPhase(state, phase);
};

export const setTurn = (state: Game, playerId: PlayerId): Game => {
  return CurrentRound.setTurnPlayer(state, playerId);
};

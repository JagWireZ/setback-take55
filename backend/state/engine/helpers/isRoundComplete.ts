import { Game } from "@shared/types/StateTypes";

export const isRoundComplete = (state: Game): boolean => {
  const round = state.currentRound!;
  const totalTricks = state.rounds[round.roundIndex].cards;
  return round.trickIndex >= totalTricks;
};

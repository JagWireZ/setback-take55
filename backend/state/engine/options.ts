import { Game, Options } from "@shared/types/StateTypes";

import { generateRounds } from "./helpers/generateRounds";

export const setOptions = (
  state: Game,
  options: Partial<Options>
): Game => {
  const merged = {
    ...state.options,
    ...options
  };

  return {
    ...state,
    version: state.version + 1,
    options: merged,
    rounds: generateRounds(merged.maxCards)
  };
};

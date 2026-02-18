import {
  Bid,
  Game,
  GameScore,
  PlayerId,
  RoundScore
} from "@shared/types/StateTypes";

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------

const calculateBooksForPlayer = (state: Game, playerId: PlayerId): number => {
  return state.currentRound!.cardsState.books.filter(
    b => b.winnerId === playerId
  ).length;
};

const calculatePossiblePoints = (bid: Bid): number => {
  // Base possible points = bid * 10
  // Trip adds +10
  // Rainbow adds +25
  let possible = bid.bid * 10;

  if (bid.trip) possible += 10;
  if (bid.rainbow) possible += 25;

  return possible;
};

const calculateTotalPoints = (bid: Bid, books: number): number => {
  // If player meets or exceeds their bid, they score:
  //   (bid * 10) + (books - bid)
  // If they fail, they lose:
  //   bid * 10
  const metBid = books >= bid.bid;

  if (metBid) {
    return bid.bid * 10 + (books - bid.bid);
  } else {
    return -(bid.bid * 10);
  }
};

// ---------------------------------------------------------
// Round Score Computation
// ---------------------------------------------------------

export const computeRoundScores = (state: Game): RoundScore[] => {
  const round = state.currentRound!;
  const roundIndex = round.roundIndex;

  return round.bids.map(bid => {
    const books = calculateBooksForPlayer(state, bid.playerId);

    return {
      playerId: bid.playerId,
      roundIndex,
      bid: bid.bid,
      trip: bid.trip,
      books,
      rainbow: bid.rainbow,
      total: calculateTotalPoints(bid, books),
      possible: calculatePossiblePoints(bid)
    };
  });
};

// ---------------------------------------------------------
// Apply Round Scores to Game
// ---------------------------------------------------------

export const recordRoundScore = (state: Game, scores: RoundScore[]): Game => {
  return applyRoundScores(state, scores);
};

export const applyRoundScores = (state: Game, scores: RoundScore[]): Game => {
  // Update cumulative totals
  const updatedTotals: GameScore[] = state.players.map(player => {
    const previous = state.score.total.find(t => t.playerId === player.playerId);

    const earned = scores.find(s => s.playerId === player.playerId)?.total ?? 0;
    const possible = scores.find(s => s.playerId === player.playerId)?.possible ?? 0;

    return {
      playerId: player.playerId,
      total: (previous?.total ?? 0) + earned,
      possible: (previous?.possible ?? 0) + possible
    };
  });

  return {
    ...state,
    score: {
      rounds: [...state.score.rounds, ...scores],
      total: updatedTotals
    }
  };
};

// ---------------------------------------------------------
// Finalize Round
// ---------------------------------------------------------

export const finalizeRound = (state: Game): Game => {
  const scores = computeRoundScores(state);

  return {
    ...applyRoundScores(state, scores),
    currentRound: null
  };
};

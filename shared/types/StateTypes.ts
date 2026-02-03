// ---------- Common IDs ----------
export type PlayerId = string;

export type RoundId =
  | "10d" | "9d" | "8d" | "7d" | "6d" | "5d" | "4d" | "3d" | "2d" | "1d"
  | "2u" | "3u" | "4u" | "5u" | "6u" | "7u" | "8u" | "9u" | "10u";

// ---------- Players ----------
export type Player = {
  playerId: PlayerId;
  playerToken: string;
  playerName: string;
  seat: number;
  type: "human" | "ai";
  connected: boolean;
};

// ---------- Cards ----------
export type Rank =
  | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  | "10" | "J" | "Q" | "K" | "A"
  | "LJ" | "BJ";

export type Suit =
  | "hearts" | "diamonds" | "clubs" | "spades" | "joker";

export type Card = {
  rank: Rank;
  suit: Suit;
};

// ---------- Hands / Trick / Books ----------
// These types represent the lifecycle of cards during a trick:
// Hand → TrickPlay → Trick → Book

// What's in a player's hand
export type Hand = {
  playerId: PlayerId;
  cards: Card[];
};

// Which card from a player's hand is being played
export type TrickPlay = {
  playerId: PlayerId;
  card: Card;
};

// Cards being played on a table
export type Trick = {
  trickIndex: number;
  plays: TrickPlay[];
  winnerId?: PlayerId;
};

// A trick that a player has won and now owns
export type Book = {
  trickIndex: number;
  winnerId: PlayerId;
  cards: Card[];
};

// ---------- Card State ----------
export type CardState = {
  deck: Card[];

  trump: {
    active: Card;
    discarded: Card[];
  } | null;

  hands: Hand[];
  currentTrick: Trick | null;
  books: Book[];
};

// ---------- Bidding / Rounds ----------
export type Bid = {
  playerId: PlayerId;
  bid: number;
  trip: boolean;
  rainbow: boolean;
};

export type Round = {
  cards: number;
  direction: "down" | "up";
};

export type RoundState = {
  roundIndex: number;
  phase: PhaseName;
  dealerPlayerId: PlayerId;
  turnPlayerId: PlayerId;

  bids: Bid[];
  trickIndex: number;
  cardsState: CardState;
};


// ---------- Phase ----------
export type PhaseName =
  | "DEALING"
  | "BIDDING"
  | "PLAYING";

// ---------- Scoring ----------
export type RoundScore = {
  playerId: PlayerId;
  roundIndex: number;
  bid: number;
  trip: boolean;
  books: number;
  rainbow: boolean;
  total: number;
  possible: number;
};

export type GameScore = {
  playerId: PlayerId;
  total: number;
  possible: number;
};

// ---------- Options ----------
export type Options = {
  maxCards: number;
  blindBid: boolean;
};

// ---------- Game ----------
export type Game = {
  gameId: string;
  version: number;
  options: Options;
  rounds: Round[];
  players: Player[];
  score: {
    rounds: RoundScore[];
    total: GameScore[];
  };
  currentRound: RoundState | null;
};

import { Card, Rank, Suit } from "@shared/types";

export const generateCardDeck = () => {

  // Start with empty deck
  let deck: Card[] = [];

  // Add 52 cards
  const ranks: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];

  for ( let suit of suits ) {
    for ( let rank of ranks ) {
      deck = [
        ...deck,
        { rank, suit }
      ]
    }
  }

  // Add the jokers
  deck = [
    ...deck,
    { rank: "LJ", suit: "joker" },
    { rank: "BJ", suit: "joker" }
  ]

  return deck;

}
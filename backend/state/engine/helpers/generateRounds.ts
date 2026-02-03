export const generateRounds = (maxCards: number) => {
  const down = Array.from({ length: maxCards }, (_, i) => ({
    cards: maxCards - i,
    direction: "down" as const
  }));

  const up = Array.from({ length: maxCards - 1 }, (_, i) => ({
    cards: i + 2,
    direction: "up" as const
  }));

  return [...down, ...up];
};

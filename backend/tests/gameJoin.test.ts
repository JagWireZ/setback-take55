import { describe, it, expect, beforeEach } from 'vitest';
import { createGame, gameStore } from '../actions/createGame';
import { joinGame } from '../actions/joinGame';

describe('Game Creation and Player Joining', () => {
  // Clear the game store before each test
  beforeEach(() => {
    gameStore.clear();
  });

  // Helper function to create a game with multiple players
  async function createGameWithPlayers(playerCount: number): Promise<{ gameId: string }> {
    const game = await createGame({
      payload: {
        playerName: 'Player 1',
      },
    });

    // Add additional players
    for (let i = 2; i <= playerCount; i++) {
      await joinGame({
        payload: {
          gameId: game.gameId,
          playerName: `Player ${i}`,
        },
      });
    }

    return { gameId: game.gameId };
  }

  it('should create a new game as Player 1', async () => {
    const result = await createGame({
      payload: {
        playerName: 'Player 1',
      },
    });

    expect(result).toBeDefined();
    expect(result.gameId).toBeDefined();
    expect(result.playerId).toBeDefined();
    expect(result.playerToken).toBeDefined();
    expect(result.state).toBeDefined();
    expect(result.state.players).toHaveLength(1);
    expect(result.state.players[0].playerName).toBe('Player 1');
    expect(result.state.players[0].type).toBe('human');
    expect(result.state.players[0].seat).toBe(0);
  });

  it('should allow Player 2 to join the game', async () => {
    const game = await createGame({
      payload: {
        playerName: 'Player 1',
      },
    });

    const result = await joinGame({
      payload: {
        gameId: game.gameId,
        playerName: 'Player 2',
      },
    });

    expect(result).toBeDefined();
    expect(result.gameId).toBe(game.gameId);
    expect(result.playerId).toBeDefined();
    expect(result.playerToken).toBeDefined();
    expect(result.state.players).toHaveLength(2);
    expect(result.state.players[1].playerName).toBe('Player 2');
    expect(result.state.players[1].type).toBe('human');
    expect(result.state.players[1].seat).toBe(1);
  });

  it('should allow Player 3 to join the game', async () => {
    const { gameId } = await createGameWithPlayers(2);

    const result = await joinGame({
      payload: {
        gameId,
        playerName: 'Player 3',
      },
    });

    expect(result).toBeDefined();
    expect(result.state.players).toHaveLength(3);
    expect(result.state.players[2].playerName).toBe('Player 3');
    expect(result.state.players[2].seat).toBe(2);
  });

  it('should allow Player 4 to join the game', async () => {
    const { gameId } = await createGameWithPlayers(3);

    const result = await joinGame({
      payload: {
        gameId,
        playerName: 'Player 4',
      },
    });

    expect(result).toBeDefined();
    expect(result.state.players).toHaveLength(4);
    expect(result.state.players[3].playerName).toBe('Player 4');
    expect(result.state.players[3].seat).toBe(3);
  });

  it('should allow Player 5 to join the game', async () => {
    const { gameId } = await createGameWithPlayers(4);

    const result = await joinGame({
      payload: {
        gameId,
        playerName: 'Player 5',
      },
    });

    expect(result).toBeDefined();
    expect(result.state.players).toHaveLength(5);
    expect(result.state.players[4].playerName).toBe('Player 5');
    expect(result.state.players[4].seat).toBe(4);
  });

  it('should fail when Player 6 tries to join a full game', async () => {
    const { gameId } = await createGameWithPlayers(5);

    await expect(
      joinGame({
        payload: {
          gameId,
          playerName: 'Player 6',
        },
      })
    ).rejects.toThrow('Game is full. Maximum 5 players allowed.');
  });
});

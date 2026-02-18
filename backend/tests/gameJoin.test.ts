import { describe, it, expect, beforeEach } from 'vitest';
import { createGame, gameStore } from '../actions/createGame';
import { joinGame } from '../actions/joinGame';

describe('Game Creation and Player Joining', () => {
  // Clear the game store before each test
  beforeEach(() => {
    gameStore.clear();
  });

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
    // First, create a game as Player 1
    const game = await createGame({
      payload: {
        playerName: 'Player 1',
      },
    });

    // Player 2 joins
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
    // Create a game and add Player 1 and Player 2
    const game = await createGame({
      payload: {
        playerName: 'Player 1',
      },
    });

    await joinGame({
      payload: {
        gameId: game.gameId,
        playerName: 'Player 2',
      },
    });

    // Player 3 joins
    const result = await joinGame({
      payload: {
        gameId: game.gameId,
        playerName: 'Player 3',
      },
    });

    expect(result).toBeDefined();
    expect(result.state.players).toHaveLength(3);
    expect(result.state.players[2].playerName).toBe('Player 3');
    expect(result.state.players[2].seat).toBe(2);
  });

  it('should allow Player 4 to join the game', async () => {
    // Create a game and add Players 1-3
    const game = await createGame({
      payload: {
        playerName: 'Player 1',
      },
    });

    await joinGame({
      payload: {
        gameId: game.gameId,
        playerName: 'Player 2',
      },
    });

    await joinGame({
      payload: {
        gameId: game.gameId,
        playerName: 'Player 3',
      },
    });

    // Player 4 joins
    const result = await joinGame({
      payload: {
        gameId: game.gameId,
        playerName: 'Player 4',
      },
    });

    expect(result).toBeDefined();
    expect(result.state.players).toHaveLength(4);
    expect(result.state.players[3].playerName).toBe('Player 4');
    expect(result.state.players[3].seat).toBe(3);
  });

  it('should allow Player 5 to join the game', async () => {
    // Create a game and add Players 1-4
    const game = await createGame({
      payload: {
        playerName: 'Player 1',
      },
    });

    await joinGame({
      payload: {
        gameId: game.gameId,
        playerName: 'Player 2',
      },
    });

    await joinGame({
      payload: {
        gameId: game.gameId,
        playerName: 'Player 3',
      },
    });

    await joinGame({
      payload: {
        gameId: game.gameId,
        playerName: 'Player 4',
      },
    });

    // Player 5 joins (should be the last player allowed)
    const result = await joinGame({
      payload: {
        gameId: game.gameId,
        playerName: 'Player 5',
      },
    });

    expect(result).toBeDefined();
    expect(result.state.players).toHaveLength(5);
    expect(result.state.players[4].playerName).toBe('Player 5');
    expect(result.state.players[4].seat).toBe(4);
  });

  it('should fail when Player 6 tries to join a full game', async () => {
    // Create a game and add Players 1-5 (max capacity)
    const game = await createGame({
      payload: {
        playerName: 'Player 1',
      },
    });

    await joinGame({
      payload: {
        gameId: game.gameId,
        playerName: 'Player 2',
      },
    });

    await joinGame({
      payload: {
        gameId: game.gameId,
        playerName: 'Player 3',
      },
    });

    await joinGame({
      payload: {
        gameId: game.gameId,
        playerName: 'Player 4',
      },
    });

    await joinGame({
      payload: {
        gameId: game.gameId,
        playerName: 'Player 5',
      },
    });

    // Player 6 tries to join (should fail)
    await expect(
      joinGame({
        payload: {
          gameId: game.gameId,
          playerName: 'Player 6',
        },
      })
    ).rejects.toThrow('Game is full. Maximum 5 players allowed.');
  });
});

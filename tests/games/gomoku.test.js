import { describe, test, expect } from 'vitest';
import { initBoard, placeStone, checkWin, evaluatePosition, findBestMove } from '../../games/gomoku/game.js';

describe('Gomoku', () => {
  describe('initBoard', () => {
    test('creates 15x15 board', () => {
      const board = initBoard();
      expect(board.length).toBe(15);
      expect(board[0].length).toBe(15);
    });

    test('initializes all cells to 0', () => {
      const board = initBoard();
      for (let r = 0; r < 15; r++) {
        for (let c = 0; c < 15; c++) {
          expect(board[r][c]).toBe(0);
        }
      }
    });
  });

  describe('placeStone', () => {
    test('places stone on board', () => {
      const board = initBoard();
      placeStone(board, 7, 7, 1);
      expect(board[7][7]).toBe(1);
    });

    test('returns false if cell occupied', () => {
      const board = initBoard();
      placeStone(board, 7, 7, 1);
      const result = placeStone(board, 7, 7, 2);
      expect(result).toBe(false);
    });
  });

  describe('checkWin', () => {
    test('detects horizontal win', () => {
      const board = initBoard();
      for (let c = 0; c < 5; c++) {
        board[7][c] = 1;
      }
      expect(checkWin(board, 7, 0, 1)).toBe(true);
    });

    test('detects vertical win', () => {
      const board = initBoard();
      for (let r = 0; r < 5; r++) {
        board[r][7] = 1;
      }
      expect(checkWin(board, 0, 7, 1)).toBe(true);
    });

    test('detects diagonal win', () => {
      const board = initBoard();
      for (let i = 0; i < 5; i++) {
        board[i][i] = 1;
      }
      expect(checkWin(board, 0, 0, 1)).toBe(true);
    });

    test('returns false for no win', () => {
      const board = initBoard();
      board[7][7] = 1;
      expect(checkWin(board, 7, 7, 1)).toBe(false);
    });
  });

  describe('evaluatePosition', () => {
    test('gives higher score to center', () => {
      const board = initBoard();
      const centerScore = evaluatePosition(board, 7, 7, 1);
      const edgeScore = evaluatePosition(board, 0, 0, 1);
      expect(centerScore).toBeGreaterThan(edgeScore);
    });

    test('gives high score to winning position', () => {
      const board = initBoard();
      for (let c = 0; c < 4; c++) {
        board[7][c] = 1;
      }
      const score = evaluatePosition(board, 7, 4, 1);
      expect(score).toBeGreaterThan(10000);
    });
  });

  describe('findBestMove', () => {
    test('finds winning move', () => {
      const board = initBoard();
      for (let c = 0; c < 4; c++) {
        board[7][c] = 2;
      }
      const move = findBestMove(board, 2);
      expect(move.row).toBe(7);
      expect(move.col).toBe(4);
    });

    test('blocks opponent winning move', () => {
      const board = initBoard();
      for (let c = 0; c < 4; c++) {
        board[7][c] = 1;
      }
      const move = findBestMove(board, 2);
      expect(move.row).toBe(7);
      expect(move.col).toBe(4);
    });
  });
});
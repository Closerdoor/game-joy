import { describe, test, expect } from 'vitest';
import { initBoard, placeMines, countAdjacentMines, reveal, checkWin } from '../../games/minesweeper/game.js';

describe('Minesweeper', () => {
  describe('initBoard', () => {
    test('creates board with correct dimensions', () => {
      const board = initBoard(9, 9);
      expect(board.length).toBe(9);
      expect(board[0].length).toBe(9);
    });

    test('each cell is initialized correctly', () => {
      const board = initBoard(9, 9);
      expect(board[0][0]).toEqual({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        count: 0
      });
    });
  });

  describe('placeMines', () => {
    test('places correct number of mines', () => {
      const board = initBoard(9, 9);
      placeMines(board, 10, 0, 0);
      
      let mineCount = 0;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c].isMine) mineCount++;
        }
      }
      expect(mineCount).toBe(10);
    });

    test('excludes specified cell from mines', () => {
      const board = initBoard(9, 9);
      placeMines(board, 10, 4, 4);
      expect(board[4][4].isMine).toBe(false);
    });
  });

  describe('reveal', () => {
    test('reveals cell', () => {
      const board = initBoard(3, 3);
      reveal(board, 1, 1);
      expect(board[1][1].isRevealed).toBe(true);
    });

    test('does not reveal flagged cell', () => {
      const board = initBoard(3, 3);
      board[1][1].isFlagged = true;
      reveal(board, 1, 1);
      expect(board[1][1].isRevealed).toBe(false);
    });

    test('reveals adjacent cells when count is 0', () => {
      const board = initBoard(3, 3);
      reveal(board, 1, 1);
      expect(board[0][0].isRevealed).toBe(true);
      expect(board[2][2].isRevealed).toBe(true);
    });
  });

  describe('checkWin', () => {
    test('returns true when all non-mine cells are revealed', () => {
      const board = initBoard(2, 2);
      board[0][0].isMine = true;
      board[0][1].isRevealed = true;
      board[1][0].isRevealed = true;
      board[1][1].isRevealed = true;
      
      expect(checkWin(board, 1)).toBe(true);
    });

    test('returns false when cells remain hidden', () => {
      const board = initBoard(2, 2);
      board[0][0].isMine = true;
      board[0][1].isRevealed = true;
      
      expect(checkWin(board, 1)).toBe(false);
    });
  });
});

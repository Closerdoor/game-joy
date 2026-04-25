import { describe, test, expect } from 'vitest';
import { createBoard, createPiece, rotatePiece, isValidPosition, placePiece, clearLines } from '../../games/tetris/game.js';

describe('Tetris', () => {
  describe('createBoard', () => {
    test('creates 10x20 board', () => {
      const board = createBoard();
      expect(board.length).toBe(20);
      expect(board[0].length).toBe(10);
    });

    test('initializes all cells to 0', () => {
      const board = createBoard();
      for (let r = 0; r < 20; r++) {
        for (let c = 0; c < 10; c++) {
          expect(board[r][c]).toBe(0);
        }
      }
    });
  });

  describe('createPiece', () => {
    test('creates I piece', () => {
      const piece = createPiece('I');
      expect(piece.shape[0].length).toBe(4);
      expect(piece.color).toBe('#00F0F0');
    });

    test('creates all piece types', () => {
      const types = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      types.forEach(type => {
        const piece = createPiece(type);
        expect(piece.shape).toBeDefined();
        expect(piece.color).toBeDefined();
      });
    });
  });

  describe('rotatePiece', () => {
    test('rotates piece clockwise', () => {
      const piece = createPiece('L');
      const rotated = rotatePiece(piece.shape);
      expect(rotated[0].length).toBe(piece.shape.length);
    });
  });

  describe('isValidPosition', () => {
    test('returns true for valid position', () => {
      const board = createBoard();
      const piece = createPiece('I');
      piece.x = 3;
      piece.y = 0;
      expect(isValidPosition(board, piece)).toBe(true);
    });

    test('returns false for out of bounds', () => {
      const board = createBoard();
      const piece = createPiece('I');
      piece.x = -1;
      piece.y = 0;
      expect(isValidPosition(board, piece)).toBe(false);
    });

    test('returns false for collision', () => {
      const board = createBoard();
      board[0][3] = 1;
      const piece = createPiece('I');
      piece.x = 3;
      piece.y = 0;
      expect(isValidPosition(board, piece)).toBe(false);
    });
  });

  describe('placePiece', () => {
    test('places piece on board', () => {
      const board = createBoard();
      const piece = createPiece('O');
      piece.x = 4;
      piece.y = 0;
      placePiece(board, piece);
      expect(board[0][4]).toBe(piece.color);
      expect(board[0][5]).toBe(piece.color);
    });
  });

  describe('clearLines', () => {
    test('clears full line', () => {
      const board = createBoard();
      for (let c = 0; c < 10; c++) {
        board[19][c] = '#FF0000';
      }
      const linesCleared = clearLines(board);
      expect(linesCleared).toBe(1);
      expect(board[19].every(cell => cell === 0)).toBe(true);
    });

    test('clears multiple lines', () => {
      const board = createBoard();
      for (let r = 18; r < 20; r++) {
        for (let c = 0; c < 10; c++) {
          board[r][c] = '#FF0000';
        }
      }
      const linesCleared = clearLines(board);
      expect(linesCleared).toBe(2);
    });

    test('does not clear partial line', () => {
      const board = createBoard();
      for (let c = 0; c < 9; c++) {
        board[19][c] = '#FF0000';
      }
      const linesCleared = clearLines(board);
      expect(linesCleared).toBe(0);
    });
  });
});
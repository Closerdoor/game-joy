import { describe, test, expect } from 'vitest';
import { initGrid, addRandomTile, move, canMove, isGameOver } from '../../games/2048/game.js';

describe('2048', () => {
  describe('initGrid', () => {
    test('creates 4x4 grid', () => {
      const grid = initGrid();
      expect(grid.length).toBe(4);
      expect(grid[0].length).toBe(4);
    });

    test('initializes all cells to 0', () => {
      const grid = initGrid();
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          expect(grid[r][c]).toBe(0);
        }
      }
    });
  });

  describe('addRandomTile', () => {
    test('adds a tile to empty grid', () => {
      const grid = initGrid();
      addRandomTile(grid);
      
      let count = 0;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (grid[r][c] !== 0) count++;
        }
      }
      expect(count).toBe(1);
    });

    test('tile value is 2 or 4', () => {
      const grid = initGrid();
      addRandomTile(grid);
      
      let value = 0;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (grid[r][c] !== 0) value = grid[r][c];
        }
      }
      expect([2, 4]).toContain(value);
    });
  });

  describe('move', () => {
    test('moves tiles left', () => {
      const grid = initGrid();
      grid[0][0] = 0;
      grid[0][1] = 2;
      grid[0][2] = 0;
      grid[0][3] = 4;
      
      const score = move(grid, 'left');
      
      expect(grid[0][0]).toBe(2);
      expect(grid[0][1]).toBe(4);
      expect(grid[0][2]).toBe(0);
      expect(grid[0][3]).toBe(0);
    });

    test('merges same tiles', () => {
      const grid = initGrid();
      grid[0][0] = 2;
      grid[0][1] = 2;
      
      const score = move(grid, 'left');
      
      expect(grid[0][0]).toBe(4);
      expect(grid[0][1]).toBe(0);
      expect(score).toBe(4);
    });

    test('does not merge different tiles', () => {
      const grid = initGrid();
      grid[0][0] = 2;
      grid[0][1] = 4;
      
      move(grid, 'left');
      
      expect(grid[0][0]).toBe(2);
      expect(grid[0][1]).toBe(4);
    });

    test('moves tiles right', () => {
      const grid = initGrid();
      grid[0][0] = 2;
      grid[0][1] = 0;
      grid[0][2] = 4;
      grid[0][3] = 0;
      
      move(grid, 'right');
      
      expect(grid[0][2]).toBe(2);
      expect(grid[0][3]).toBe(4);
    });

    test('moves tiles up', () => {
      const grid = initGrid();
      grid[0][0] = 0;
      grid[1][0] = 2;
      grid[2][0] = 0;
      grid[3][0] = 4;
      
      move(grid, 'up');
      
      expect(grid[0][0]).toBe(2);
      expect(grid[1][0]).toBe(4);
    });

    test('moves tiles down', () => {
      const grid = initGrid();
      grid[0][0] = 2;
      grid[1][0] = 0;
      grid[2][0] = 4;
      grid[3][0] = 0;
      
      move(grid, 'down');
      
      expect(grid[2][0]).toBe(2);
      expect(grid[3][0]).toBe(4);
    });
  });

  describe('canMove', () => {
    test('returns true when empty cells exist', () => {
      const grid = initGrid();
      grid[0][0] = 2;
      expect(canMove(grid)).toBe(true);
    });

    test('returns true when merge is possible', () => {
      const grid = initGrid();
      grid[0][0] = 2;
      grid[0][1] = 2;
      grid[0][2] = 4;
      grid[0][3] = 8;
      grid[1][0] = 4;
      grid[1][1] = 8;
      grid[1][2] = 16;
      grid[1][3] = 32;
      grid[2][0] = 8;
      grid[2][1] = 16;
      grid[2][2] = 32;
      grid[2][3] = 64;
      grid[3][0] = 16;
      grid[3][1] = 32;
      grid[3][2] = 64;
      grid[3][3] = 128;
      expect(canMove(grid)).toBe(true);
    });
  });

  describe('isGameOver', () => {
    test('returns false when moves available', () => {
      const grid = initGrid();
      grid[0][0] = 2;
      expect(isGameOver(grid)).toBe(false);
    });

    test('returns true when no moves available', () => {
      const grid = initGrid();
      grid[0][0] = 2;
      grid[0][1] = 4;
      grid[0][2] = 8;
      grid[0][3] = 16;
      grid[1][0] = 32;
      grid[1][1] = 64;
      grid[1][2] = 128;
      grid[1][3] = 256;
      grid[2][0] = 512;
      grid[2][1] = 1024;
      grid[2][2] = 2;
      grid[2][3] = 4;
      grid[3][0] = 8;
      grid[3][1] = 16;
      grid[3][2] = 32;
      grid[3][3] = 64;
      expect(isGameOver(grid)).toBe(true);
    });
  });
});
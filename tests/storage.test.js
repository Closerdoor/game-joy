import { describe, test, expect, beforeEach } from 'vitest';
import { Storage } from '../js/common.js';

describe('Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getHighScore', () => {
    test('returns 0 when no high score exists', () => {
      expect(Storage.getHighScore('test-game')).toBe(0);
    });

    test('returns stored high score', () => {
      localStorage.setItem('gamejoy_highscore_test-game', '100');
      expect(Storage.getHighScore('test-game')).toBe(100);
    });
  });

  describe('setHighScore', () => {
    test('stores high score in localStorage', () => {
      Storage.setHighScore('test-game', 200);
      expect(localStorage.getItem('gamejoy_highscore_test-game')).toBe('200');
    });
  });

  describe('getHistory', () => {
    test('returns empty array when no history exists', () => {
      expect(Storage.getHistory('test-game')).toEqual([]);
    });

    test('returns stored history', () => {
      const history = [{ score: 100, date: '2024-01-01' }];
      localStorage.setItem('gamejoy_history_test-game', JSON.stringify(history));
      expect(Storage.getHistory('test-game')).toEqual(history);
    });
  });

  describe('addRecord', () => {
    test('adds record and returns top 5 sorted by score', () => {
      Storage.addRecord('test-game', 100);
      Storage.addRecord('test-game', 300);
      Storage.addRecord('test-game', 200);
      
      const history = Storage.getHistory('test-game');
      expect(history).toHaveLength(3);
      expect(history[0].score).toBe(300);
      expect(history[1].score).toBe(200);
      expect(history[2].score).toBe(100);
    });

    test('keeps only top 5 records', () => {
      for (let i = 1; i <= 7; i++) {
        Storage.addRecord('test-game', i * 10);
      }
      
      const history = Storage.getHistory('test-game');
      expect(history).toHaveLength(5);
      expect(history[0].score).toBe(70);
    });
  });

  describe('getSettings', () => {
    test('returns default settings when none exist', () => {
      expect(Storage.getSettings()).toEqual({ soundEnabled: false });
    });

    test('returns stored settings', () => {
      localStorage.setItem('gamejoy_settings', JSON.stringify({ soundEnabled: true }));
      expect(Storage.getSettings()).toEqual({ soundEnabled: true });
    });
  });

  describe('playCount', () => {
    test('getPlayCount returns 0 when no count exists', () => {
      expect(Storage.getPlayCount('test-game')).toBe(0);
    });

    test('incrementPlayCount increments and returns count', () => {
      expect(Storage.incrementPlayCount('test-game')).toBe(1);
      expect(Storage.incrementPlayCount('test-game')).toBe(2);
      expect(Storage.getPlayCount('test-game')).toBe(2);
    });
  });
});
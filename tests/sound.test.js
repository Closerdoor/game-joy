import { describe, test, expect, beforeEach, vi } from 'vitest';
import { Storage, Sound } from '../js/common.js';

describe('Sound', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('init', () => {
    test('initializes with sound disabled by default', () => {
      Sound.init();
      expect(Sound.isEnabled()).toBe(false);
    });

    test('initializes with sound enabled if stored', () => {
      localStorage.setItem('gamejoy_settings', JSON.stringify({ soundEnabled: true }));
      Sound.init();
      expect(Sound.isEnabled()).toBe(true);
    });
  });

  describe('toggle', () => {
    test('toggles sound on and off', () => {
      Sound.init();
      expect(Sound.isEnabled()).toBe(false);
      
      const result1 = Sound.toggle();
      expect(result1).toBe(true);
      expect(Sound.isEnabled()).toBe(true);
      
      const result2 = Sound.toggle();
      expect(result2).toBe(false);
      expect(Sound.isEnabled()).toBe(false);
    });

    test('persists sound setting', () => {
      Sound.init();
      Sound.toggle();
      
      const settings = JSON.parse(localStorage.getItem('gamejoy_settings'));
      expect(settings.soundEnabled).toBe(true);
    });
  });

  describe('play', () => {
    test('does nothing when sound is disabled', () => {
      Sound.init();
      Sound.play('click');
    });

    test('plays sound when enabled', () => {
      Sound.init();
      Sound.toggle();
      Sound.play('click');
    });
  });
});
import { describe, test, expect } from 'vitest';
import { Dino, Obstacle, Game } from '../../games/dino/game.js';

describe('Dino', () => {
  test('initializes on ground', () => {
    const dino = new Dino(100, 300);
    expect(dino.y).toBe(300);
    expect(dino.groundY).toBe(300);
  });

  test('jump changes state', () => {
    const dino = new Dino(100, 300);
    dino.jump();
    expect(dino.isJumping).toBe(true);
  });

  test('update while jumping moves up then down', () => {
    const dino = new Dino(100, 300);
    dino.jump();
    const startY = dino.y;
    dino.update(16);
    expect(dino.y).toBeLessThan(startY);
  });

  test('lands on ground', () => {
    const dino = new Dino(100, 300);
    dino.jump();
    for (let i = 0; i < 100; i++) {
      dino.update(16);
    }
    expect(dino.y).toBe(300);
    expect(dino.isJumping).toBe(false);
  });
});

describe('Obstacle', () => {
  test('moves left', () => {
    const obstacle = new Obstacle(800, 280, 20, 40);
    obstacle.update(5);
    expect(obstacle.x).toBeLessThan(800);
  });

  test('is off screen when x < -width', () => {
    const obstacle = new Obstacle(-25, 280, 20, 40);
    expect(obstacle.isOffScreen()).toBe(true);
  });
});

describe('Game', () => {
  test('initializes with score 0', () => {
    const game = new Game(800, 400);
    expect(game.score).toBe(0);
  });

  test('score increases over time', () => {
    const game = new Game(800, 400);
    game.start();
    game.update(100);
    expect(game.score).toBeGreaterThan(0);
  });

  test('detects collision', () => {
    const game = new Game(800, 400);
    game.dino.x = 100;
    game.dino.y = 280;
    game.dino.width = 40;
    game.dino.height = 40;
    
    const obstacle = new Obstacle(100, 280, 40, 40);
    game.obstacles = [obstacle];
    
    expect(game.checkCollision()).toBe(true);
  });

  test('no collision when dino is above', () => {
    const game = new Game(800, 400);
    game.dino.x = 100;
    game.dino.y = 200;
    game.dino.width = 40;
    game.dino.height = 40;
    
    const obstacle = new Obstacle(100, 280, 40, 40);
    game.obstacles = [obstacle];
    
    expect(game.checkCollision()).toBe(false);
  });
});
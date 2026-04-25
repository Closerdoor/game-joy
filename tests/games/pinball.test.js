import { describe, test, expect } from 'vitest';
import { Ball, Paddle, Brick, Game } from '../../games/pinball/game.js';

describe('Ball', () => {
  test('initializes with position and velocity', () => {
    const ball = new Ball(400, 300, 5);
    expect(ball.x).toBe(400);
    expect(ball.y).toBe(300);
    expect(ball.radius).toBe(5);
  });

  test('moves according to velocity', () => {
    const ball = new Ball(400, 300, 5);
    ball.vx = 2;
    ball.vy = 3;
    ball.update();
    expect(ball.x).toBe(402);
    expect(ball.y).toBe(303);
  });

  test('bounces off walls', () => {
    const ball = new Ball(5, 300, 5);
    ball.vx = -3;
    ball.bounceOffWalls(800, 600);
    expect(ball.vx).toBe(3);
  });
});

describe('Paddle', () => {
  test('initializes at bottom center', () => {
    const paddle = new Paddle(400, 580, 100, 10);
    expect(paddle.width).toBe(100);
    expect(paddle.height).toBe(10);
  });

  test('moves left and right', () => {
    const paddle = new Paddle(400, 580, 100, 10);
    paddle.moveLeft(10);
    expect(paddle.x).toBe(390);
    paddle.moveRight(10);
    expect(paddle.x).toBe(400);
  });

  test('stays within bounds', () => {
    const paddle = new Paddle(400, 580, 100, 10);
    paddle.x = 10;
    paddle.moveLeft(20);
    expect(paddle.x).toBe(0);
    
    paddle.x = 700;
    paddle.moveRight(200, 800);
    expect(paddle.x).toBe(700);
  });
});

describe('Brick', () => {
  test('initializes with position and color', () => {
    const brick = new Brick(100, 50, 60, 20, '#FF0000');
    expect(brick.x).toBe(100);
    expect(brick.color).toBe('#FF0000');
    expect(brick.active).toBe(true);
  });

  test('can be destroyed', () => {
    const brick = new Brick(100, 50, 60, 20, '#FF0000');
    brick.destroy();
    expect(brick.active).toBe(false);
  });
});

describe('Game', () => {
  test('initializes with score 0', () => {
    const game = new Game(800, 600);
    expect(game.score).toBe(0);
  });

  test('detects ball-paddle collision', () => {
    const game = new Game(800, 600);
    game.ball.x = 400;
    game.ball.y = 575;
    game.ball.radius = 5;
    game.ball.vy = 5;
    
    game.paddle.x = 350;
    game.paddle.y = 580;
    game.paddle.width = 100;
    game.paddle.height = 10;
    
    expect(game.checkPaddleCollision()).toBe(true);
  });

  test('detects ball-brick collision', () => {
    const game = new Game(800, 600);
    game.ball.x = 130;
    game.ball.y = 60;
    game.ball.radius = 5;
    
    const brick = new Brick(100, 50, 60, 20, '#FF0000');
    game.bricks = [brick];
    
    const hitBrick = game.checkBrickCollision();
    expect(hitBrick).toBe(brick);
  });
});
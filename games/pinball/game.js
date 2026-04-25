class Ball {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vx = 4;
    this.vy = -4;
    this.speed = 5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  bounceOffWalls(width, height) {
    if (this.x - this.radius <= 0) {
      this.x = this.radius;
      this.vx = Math.abs(this.vx);
    }
    if (this.x + this.radius >= width) {
      this.x = width - this.radius;
      this.vx = -Math.abs(this.vx);
    }
    if (this.y - this.radius <= 0) {
      this.y = this.radius;
      this.vy = Math.abs(this.vy);
    }
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 4 * (Math.random() > 0.5 ? 1 : -1);
    this.vy = -4;
  }
}

class Paddle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 8;
  }

  moveLeft(amount) {
    this.x -= amount;
    if (this.x < 0) this.x = 0;
  }

  moveRight(amount, maxWidth) {
    this.x += amount;
    if (this.x + this.width > maxWidth) this.x = maxWidth - this.width;
  }
}

class Brick {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.active = true;
  }

  destroy() {
    this.active = false;
  }
}

class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.ball = new Ball(width / 2, height - 100, 8);
    this.paddle = new Paddle(width / 2 - 50, height - 30, 100, 12);
    this.bricks = [];
    this.score = 0;
    this.lives = 3;
    this.isRunning = false;
    
    this.initBricks();
  }

  initBricks() {
    const colors = ['#F5222D', '#FA541C', '#FA8C16', '#FADB14', '#52C41A', '#1890FF'];
    const rows = 6;
    const cols = 10;
    const brickWidth = 70;
    const brickHeight = 20;
    const padding = 8;
    const offsetX = 35;
    const offsetY = 50;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = offsetX + c * (brickWidth + padding);
        const y = offsetY + r * (brickHeight + padding);
        this.bricks.push(new Brick(x, y, brickWidth, brickHeight, colors[r]));
      }
    }
  }

  start() {
    this.isRunning = true;
    this.ball.reset(this.width / 2, this.height - 100);
  }

  update() {
    if (!this.isRunning) return;

    this.ball.update();
    this.ball.bounceOffWalls(this.width, this.height);

    if (this.checkPaddleCollision()) {
      this.ball.y = this.paddle.y - this.ball.radius;
      const hitPos = (this.ball.x - this.paddle.x) / this.paddle.width;
      this.ball.vx = 8 * (hitPos - 0.5);
      this.ball.vy = -Math.abs(this.ball.vy);
    }

    const hitBrick = this.checkBrickCollision();
    if (hitBrick) {
      hitBrick.destroy();
      this.score += 10;
      this.ball.vy = -this.ball.vy;
    }

    if (this.ball.y > this.height) {
      this.lives--;
      if (this.lives <= 0) {
        this.isRunning = false;
      } else {
        this.ball.reset(this.width / 2, this.height - 100);
      }
    }

    if (this.bricks.every(b => !b.active)) {
      this.isRunning = false;
    }
  }

  checkPaddleCollision() {
    const ball = this.ball;
    const paddle = this.paddle;

    return (
      ball.y + ball.radius >= paddle.y &&
      ball.y - ball.radius <= paddle.y + paddle.height &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.width
    );
  }

  checkBrickCollision() {
    const ball = this.ball;

    for (const brick of this.bricks) {
      if (!brick.active) continue;

      if (
        ball.x + ball.radius > brick.x &&
        ball.x - ball.radius < brick.x + brick.width &&
        ball.y + ball.radius > brick.y &&
        ball.y - ball.radius < brick.y + brick.height
      ) {
        return brick;
      }
    }

    return null;
  }
}

export { Ball, Paddle, Brick, Game };
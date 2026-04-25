class Dino {
  constructor(x, groundY) {
    this.x = x;
    this.y = groundY;
    this.groundY = groundY;
    this.width = 40;
    this.height = 44;
    this.velocityY = 0;
    this.isJumping = false;
    this.jumpForce = -15;
    this.gravity = 0.8;
  }

  jump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.velocityY = this.jumpForce;
    }
  }

  update(deltaTime) {
    if (this.isJumping) {
      this.velocityY += this.gravity;
      this.y += this.velocityY;

      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.isJumping = false;
        this.velocityY = 0;
      }
    }
  }
}

class Obstacle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 6;
  }

  update(speed) {
    this.x -= speed;
  }

  isOffScreen() {
    return this.x < -this.width;
  }
}

class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.groundY = height - 60;
    this.dino = new Dino(50, this.groundY - 44);
    this.obstacles = [];
    this.score = 0;
    this.speed = 6;
    this.isRunning = false;
    this.obstacleTimer = 0;
    this.minObstacleInterval = 1500;
  }

  start() {
    this.isRunning = true;
    this.score = 0;
    this.obstacles = [];
    this.dino = new Dino(50, this.groundY - 44);
  }

  update(deltaTime) {
    if (!this.isRunning) return;

    this.score += deltaTime * 0.01;
    this.dino.update(deltaTime);

    this.obstacleTimer += deltaTime;
    if (this.obstacleTimer >= this.minObstacleInterval + Math.random() * 1000) {
      this.spawnObstacle();
      this.obstacleTimer = 0;
    }

    this.obstacles.forEach(obstacle => obstacle.update(this.speed));
    this.obstacles = this.obstacles.filter(o => !o.isOffScreen());

    if (this.checkCollision()) {
      this.isRunning = false;
    }
  }

  spawnObstacle() {
    const height = 30 + Math.random() * 30;
    const obstacle = new Obstacle(
      this.width,
      this.groundY - height,
      20 + Math.random() * 20,
      height
    );
    this.obstacles.push(obstacle);
  }

  checkCollision() {
    const dino = this.dino;
    const dinoBox = {
      x: dino.x + 5,
      y: dino.y + 5,
      width: dino.width - 10,
      height: dino.height - 5
    };

    for (const obstacle of this.obstacles) {
      if (
        dinoBox.x < obstacle.x + obstacle.width &&
        dinoBox.x + dinoBox.width > obstacle.x &&
        dinoBox.y < obstacle.y + obstacle.height &&
        dinoBox.y + dinoBox.height > obstacle.y
      ) {
        return true;
      }
    }
    return false;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Dino, Obstacle, Game };
}
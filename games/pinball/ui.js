const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let game = null;
let animationId = null;

function init() {
  Sound.init();
  loadHighScore();
  loadLeaderboard();
  bindEvents();
  game = new Game(canvas.width, canvas.height);
  draw();
}

function startGame() {
  game = new Game(canvas.width, canvas.height);
  game.start();
  document.getElementById('start-btn').textContent = '重新开始';
  gameLoop();
}

function gameLoop() {
  if (!game.isRunning) {
    if (game.lives <= 0) {
      showMessage('游戏结束!', 'lose');
      Sound.play('lose');
    } else {
      showMessage('恭喜获胜!', 'win');
      Sound.play('win');
    }
    saveScore();
    return;
  }

  game.update();
  updateUI();
  draw();

  animationId = requestAnimationFrame(gameLoop);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawPaddle();
  drawBall();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.fillStyle = '#1890FF';
  ctx.fillRect(game.paddle.x, game.paddle.y, game.paddle.width, game.paddle.height);
  
  ctx.fillStyle = '#40A9FF';
  ctx.fillRect(game.paddle.x, game.paddle.y, game.paddle.width, 4);
}

function drawBricks() {
  for (const brick of game.bricks) {
    if (!brick.active) continue;
    
    ctx.fillStyle = brick.color;
    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(brick.x, brick.y, brick.width, 4);
  }
}

function updateUI() {
  document.getElementById('score').textContent = game.score;
  document.getElementById('lives').textContent = game.lives;
}

function loadHighScore() {
  const highScore = Storage.getHighScore('pinball');
  document.getElementById('high-score').textContent = highScore;
}

function saveScore() {
  const currentHigh = Storage.getHighScore('pinball');
  if (game.score > currentHigh) {
    Storage.setHighScore('pinball', game.score);
    document.getElementById('high-score').textContent = game.score;
  }
  Storage.addRecord('pinball', game.score);
  loadLeaderboard();
}

function loadLeaderboard() {
  const history = Storage.getHistory('pinball');
  const container = document.getElementById('leaderboard');
  
  if (history.length === 0) {
    container.innerHTML = '<div class="info-section-content">暂无记录</div>';
    return;
  }
  
  container.innerHTML = history.map((record, index) => `
    <div class="leaderboard-item">
      <span class="leaderboard-rank">#${index + 1}</span>
      <span class="leaderboard-score">${record.score}</span>
      <span class="leaderboard-date">${new Date(record.date).toLocaleDateString()}</span>
    </div>
  `).join('');
}

function showMessage(text, type) {
  removeMessage();
  const msg = document.createElement('div');
  msg.className = `game-message ${type}`;
  msg.textContent = text;
  document.body.appendChild(msg);
}

function removeMessage() {
  const msg = document.querySelector('.game-message');
  if (msg) msg.remove();
}

function bindEvents() {
  document.getElementById('start-btn').addEventListener('click', startGame);
  
  const keys = {};
  
  document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
    }
  });
  
  document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });
  
  function handleInput() {
    if (!game || !game.isRunning) return;
    
    if (keys['ArrowLeft']) {
      game.paddle.moveLeft(game.paddle.speed);
    }
    if (keys['ArrowRight']) {
      game.paddle.moveRight(game.paddle.speed, canvas.width);
    }
    
    requestAnimationFrame(handleInput);
  }
  
  handleInput();
}

document.addEventListener('DOMContentLoaded', init);
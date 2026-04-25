const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let game = new Game(canvas.width, canvas.height);
let lastTime = 0;
let animationId = null;

function init() {
  Sound.init();
  loadHighScore();
  loadLeaderboard();
  bindEvents();
  draw();
}

function startGame() {
  game = new Game(canvas.width, canvas.height);
  game.start();
  document.getElementById('start-btn').textContent = '重新开始';
  lastTime = performance.now();
  gameLoop();
}

function gameLoop(currentTime = 0) {
  if (!game.isRunning) {
    drawGameOver();
    saveScore();
    return;
  }

  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  game.update(deltaTime);
  updateScore();
  draw();

  animationId = requestAnimationFrame(gameLoop);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGround();
  drawDino();
  drawObstacles();
}

function drawGround() {
  ctx.fillStyle = '#535353';
  ctx.fillRect(0, game.groundY, canvas.width, 2);
}

function drawDino() {
  ctx.fillStyle = '#535353';
  const dino = game.dino;
  
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
  
  ctx.fillStyle = '#F7F7F7';
  ctx.fillRect(dino.x + 28, dino.y + 8, 8, 8);
}

function drawObstacles() {
  ctx.fillStyle = '#535353';
  game.obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#535353';
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('游戏结束!', canvas.width / 2, canvas.height / 2);
  
  ctx.font = '16px sans-serif';
  ctx.fillText('按空格键重新开始', canvas.width / 2, canvas.height / 2 + 40);
}

function updateScore() {
  document.getElementById('score').textContent = Math.floor(game.score);
}

function loadHighScore() {
  const highScore = Storage.getHighScore('dino');
  document.getElementById('high-score').textContent = highScore;
}

function saveScore() {
  const finalScore = Math.floor(game.score);
  const currentHigh = Storage.getHighScore('dino');
  
  if (finalScore > currentHigh) {
    Storage.setHighScore('dino', finalScore);
    document.getElementById('high-score').textContent = finalScore;
  }
  
  Storage.addRecord('dino', finalScore);
  loadLeaderboard();
}

function loadLeaderboard() {
  const history = Storage.getHistory('dino');
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

function bindEvents() {
  document.getElementById('start-btn').addEventListener('click', startGame);
  
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (game.isRunning) {
        game.dino.jump();
        Sound.play('click');
      } else {
        startGame();
      }
    }
  });
  
  canvas.addEventListener('click', () => {
    if (game.isRunning) {
      game.dino.jump();
      Sound.play('click');
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-canvas');
const nextCtx = nextCanvas.getContext('2d');

const CELL_SIZE = 30;
const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let level = 1;
let lines = 0;
let gameOver = false;
let isRunning = false;
let dropInterval = null;

function init() {
  Sound.init();
  loadHighScore();
  loadLeaderboard();
  bindEvents();
  draw();
}

function startGame() {
  board = createBoard();
  score = 0;
  level = 1;
  lines = 0;
  gameOver = false;
  isRunning = true;
  
  currentPiece = getRandomPiece();
  nextPiece = getRandomPiece();
  
  updateScore();
  draw();
  drawNextPiece();
  
  document.getElementById('start-btn').textContent = '重新开始';
  
  if (dropInterval) clearInterval(dropInterval);
  dropInterval = setInterval(drop, 1000 - (level - 1) * 100);
}

function getRandomPiece() {
  const type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
  return createPiece(type);
}

function drop() {
  if (!isRunning || gameOver) return;
  
  currentPiece.y++;
  
  if (!isValidPosition(board, currentPiece)) {
    currentPiece.y--;
    placePiece(board, currentPiece);
    
    const cleared = clearLines(board);
    if (cleared > 0) {
      lines += cleared;
      score += cleared * 100 * level;
      
      if (lines >= level * 10) {
        level++;
        clearInterval(dropInterval);
        dropInterval = setInterval(drop, Math.max(100, 1000 - (level - 1) * 100));
      }
      
      updateScore();
      Sound.play('win');
    }
    
    currentPiece = nextPiece;
    nextPiece = getRandomPiece();
    drawNextPiece();
    
    if (!isValidPosition(board, currentPiece)) {
      gameOver = true;
      isRunning = false;
      showMessage('游戏结束!');
      Sound.play('lose');
      saveScore();
    }
  }
  
  draw();
}

function moveLeft() {
  if (!isRunning || gameOver) return;
  currentPiece.x--;
  if (!isValidPosition(board, currentPiece)) {
    currentPiece.x++;
  } else {
    Sound.play('click');
    draw();
  }
}

function moveRight() {
  if (!isRunning || gameOver) return;
  currentPiece.x++;
  if (!isValidPosition(board, currentPiece)) {
    currentPiece.x--;
  } else {
    Sound.play('click');
    draw();
  }
}

function rotate() {
  if (!isRunning || gameOver) return;
  const oldShape = currentPiece.shape;
  currentPiece.shape = rotatePiece(currentPiece.shape);
  
  if (!isValidPosition(board, currentPiece)) {
    currentPiece.shape = oldShape;
  } else {
    Sound.play('click');
    draw();
  }
}

function softDrop() {
  if (!isRunning || gameOver) return;
  drop();
}

function hardDrop() {
  if (!isRunning || gameOver) return;
  while (isValidPosition(board, { ...currentPiece, y: currentPiece.y + 1 })) {
    currentPiece.y++;
    score += 2;
  }
  updateScore();
  drop();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#16213E';
  for (let r = 0; r < 20; r++) {
    for (let c = 0; c < 10; c++) {
      if (board[r][c] !== 0) {
        ctx.fillStyle = board[r][c];
        ctx.fillRect(c * CELL_SIZE + 1, r * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      }
    }
  }
  
  if (currentPiece && !gameOver) {
    ctx.fillStyle = currentPiece.color;
    const shape = currentPiece.shape;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const x = (currentPiece.x + c) * CELL_SIZE + 1;
          const y = (currentPiece.y + r) * CELL_SIZE + 1;
          ctx.fillRect(x, y, CELL_SIZE - 2, CELL_SIZE - 2);
        }
      }
    }
  }
  
  ctx.strokeStyle = '#0F3460';
  ctx.lineWidth = 1;
  for (let r = 0; r <= 20; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * CELL_SIZE);
    ctx.lineTo(canvas.width, r * CELL_SIZE);
    ctx.stroke();
  }
  for (let c = 0; c <= 10; c++) {
    ctx.beginPath();
    ctx.moveTo(c * CELL_SIZE, 0);
    ctx.lineTo(c * CELL_SIZE, canvas.height);
    ctx.stroke();
  }
}

function drawNextPiece() {
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  
  if (!nextPiece) return;
  
  nextCtx.fillStyle = nextPiece.color;
  const shape = nextPiece.shape;
  const offsetX = (nextCanvas.width - shape[0].length * 20) / 2;
  const offsetY = (nextCanvas.height - shape.length * 20) / 2;
  
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        nextCtx.fillRect(offsetX + c * 20 + 1, offsetY + r * 20 + 1, 18, 18);
      }
    }
  }
}

function updateScore() {
  document.getElementById('score').textContent = score;
  document.getElementById('level').textContent = level;
}

function loadHighScore() {
  const highScore = Storage.getHighScore('tetris');
  document.getElementById('high-score').textContent = highScore;
}

function saveScore() {
  const currentHigh = Storage.getHighScore('tetris');
  if (score > currentHigh) {
    Storage.setHighScore('tetris', score);
    document.getElementById('high-score').textContent = score;
  }
  Storage.addRecord('tetris', score);
  loadLeaderboard();
}

function loadLeaderboard() {
  const history = Storage.getHistory('tetris');
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

function showMessage(text) {
  const msg = document.createElement('div');
  msg.className = 'game-message';
  msg.textContent = text;
  document.body.appendChild(msg);
}

function bindEvents() {
  document.getElementById('start-btn').addEventListener('click', startGame);
  
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        moveLeft();
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveRight();
        break;
      case 'ArrowUp':
        e.preventDefault();
        rotate();
        break;
      case 'ArrowDown':
        e.preventDefault();
        softDrop();
        break;
      case ' ':
        e.preventDefault();
        hardDrop();
        break;
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const CELL_SIZE = 40;
const BOARD_SIZE = 15;
const PADDING = 0;

let board = [];
let currentPlayer = 1;
let gameOver = false;
let wins = 0;
let losses = 0;

function init() {
  Sound.init();
  loadStats();
  bindEvents();
  newGame();
}

function newGame() {
  board = initBoard();
  currentPlayer = 1;
  gameOver = false;
  document.getElementById('status').textContent = '你的回合 (黑棋)';
  removeMessage();
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < BOARD_SIZE; i++) {
    const pos = CELL_SIZE / 2 + i * CELL_SIZE;
    
    ctx.beginPath();
    ctx.moveTo(CELL_SIZE / 2, pos);
    ctx.lineTo(canvas.width - CELL_SIZE / 2, pos);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(pos, CELL_SIZE / 2);
    ctx.lineTo(pos, canvas.height - CELL_SIZE / 2);
    ctx.stroke();
  }
  
  const starPoints = [3, 7, 11];
  ctx.fillStyle = '#8B4513';
  for (const r of starPoints) {
    for (const c of starPoints) {
      const x = CELL_SIZE / 2 + c * CELL_SIZE;
      const y = CELL_SIZE / 2 + r * CELL_SIZE;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== 0) {
        drawStone(r, c, board[r][c]);
      }
    }
  }
}

function drawStone(row, col, player) {
  const x = CELL_SIZE / 2 + col * CELL_SIZE;
  const y = CELL_SIZE / 2 + row * CELL_SIZE;
  const radius = CELL_SIZE / 2 - 3;
  
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  
  if (player === 1) {
    ctx.fillStyle = '#1A1A1A';
  } else {
    ctx.fillStyle = '#F5F5F5';
  }
  ctx.fill();
  
  ctx.strokeStyle = player === 1 ? '#000000' : '#CCCCCC';
  ctx.lineWidth = 1;
  ctx.stroke();
}

function handleClick(e) {
  if (gameOver || currentPlayer !== 1) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const col = Math.round((x - CELL_SIZE / 2) / CELL_SIZE);
  const row = Math.round((y - CELL_SIZE / 2) / CELL_SIZE);
  
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return;
  
  if (placeStone(board, row, col, 1)) {
    drawStone(row, col, 1);
    Sound.play('click');
    
    if (checkWin(board, row, col, 1)) {
      gameOver = true;
      showMessage('你赢了!', 'win');
      Sound.play('win');
      wins++;
      saveStats();
      return;
    }
    
    currentPlayer = 2;
    document.getElementById('status').textContent = 'AI 思考中...';
    
    setTimeout(aiMove, 100);
  }
}

function aiMove() {
  if (gameOver) return;
  
  const move = findBestMove(board, 2);
  placeStone(board, move.row, move.col, 2);
  drawStone(move.row, move.col, 2);
  Sound.play('click');
  
  if (checkWin(board, move.row, move.col, 2)) {
    gameOver = true;
    showMessage('AI 获胜!', 'lose');
    Sound.play('lose');
    losses++;
    saveStats();
    return;
  }
  
  currentPlayer = 1;
  document.getElementById('status').textContent = '你的回合 (黑棋)';
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

function loadStats() {
  wins = Storage.getHighScore('gomoku_wins') || 0;
  losses = Storage.getHighScore('gomoku_losses') || 0;
  document.getElementById('wins').textContent = wins;
  updateStats();
}

function saveStats() {
  Storage.setHighScore('gomoku_wins', wins);
  Storage.setHighScore('gomoku_losses', losses);
  document.getElementById('wins').textContent = wins;
  updateStats();
}

function updateStats() {
  const total = wins + losses;
  const winRate = total > 0 ? Math.round(wins / total * 100) : 0;
  
  document.getElementById('stats').innerHTML = `
    <div class="info-section-content">
      总局数: ${total} | 胜: ${wins} | 负: ${losses} | 胜率: ${winRate}%
    </div>
  `;
}

function bindEvents() {
  canvas.addEventListener('click', handleClick);
  document.getElementById('new-game').addEventListener('click', newGame);
}

document.addEventListener('DOMContentLoaded', init);
let grid = [];
let score = 0;
let best = 0;
let gameOver = false;

function init() {
  Sound.init();
  loadBest();
  loadLeaderboard();
  bindEvents();
  newGame();
}

function newGame() {
  grid = initGrid();
  score = 0;
  gameOver = false;
  
  addRandomTile(grid);
  addRandomTile(grid);
  
  updateScore();
  renderGrid();
  removeMessage();
}

function renderGrid() {
  const gridEl = document.getElementById('grid');
  gridEl.innerHTML = '';
  
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const tile = document.createElement('div');
      const value = grid[r][c];
      tile.className = `tile tile-${value > 2048 ? 'super' : value}`;
      tile.textContent = value || '';
      gridEl.appendChild(tile);
    }
  }
}

function handleKeydown(e) {
  if (gameOver) return;
  
  const keyMap = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down'
  };
  
  const direction = keyMap[e.key];
  if (!direction) return;
  
  e.preventDefault();
  
  const oldGrid = JSON.stringify(grid);
  const addedScore = move(grid, direction);
  
  if (JSON.stringify(grid) !== oldGrid) {
    score += addedScore;
    updateScore();
    addRandomTile(grid);
    renderGrid();
    Sound.play('click');
    
    if (isGameOver(grid)) {
      gameOver = true;
      showMessage('游戏结束!', 'lose');
      Sound.play('lose');
      saveScore();
    }
    
    if (hasWon()) {
      showMessage('恭喜获胜!', 'win');
      Sound.play('win');
      saveScore();
    }
  }
}

function hasWon() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] >= 2048) return true;
    }
  }
  return false;
}

function updateScore() {
  document.getElementById('score').textContent = score;
  if (score > best) {
    best = score;
    document.getElementById('best').textContent = best;
  }
}

function loadBest() {
  best = Storage.getHighScore('2048');
  document.getElementById('best').textContent = best;
  document.getElementById('high-score').textContent = best;
}

function saveScore() {
  if (score > best) {
    Storage.setHighScore('2048', score);
    best = score;
    document.getElementById('best').textContent = score;
    document.getElementById('high-score').textContent = score;
  }
  Storage.addRecord('2048', score);
  loadLeaderboard();
}

function loadLeaderboard() {
  const history = Storage.getHistory('2048');
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
  document.addEventListener('keydown', handleKeydown);
  document.getElementById('new-game').addEventListener('click', newGame);
}

document.addEventListener('DOMContentLoaded', init);
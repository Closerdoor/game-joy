const DIFFICULTIES = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 }
};

let board = [];
let rows = 9;
let cols = 9;
let mines = 10;
let minesLeft = 10;
let gameOver = false;
let gameStarted = false;
let timer = 0;
let timerInterval = null;
let firstClick = true;

function init() {
  Sound.init();
  loadHighScore();
  loadLeaderboard();
  bindEvents();
  newGame();
}

function newGame() {
  const difficulty = document.getElementById('difficulty').value;
  const config = DIFFICULTIES[difficulty];
  rows = config.rows;
  cols = config.cols;
  mines = config.mines;
  minesLeft = mines;
  gameOver = false;
  gameStarted = false;
  firstClick = true;
  timer = 0;
  
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  document.getElementById('timer').textContent = '0';
  document.getElementById('mines-count').textContent = minesLeft;
  
  board = initBoard(rows, cols);
  renderBoard();
  removeMessage();
}

function renderBoard() {
  const boardEl = document.getElementById('board');
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
  boardEl.innerHTML = '';
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      boardEl.appendChild(cell);
    }
  }
}

function handleClick(e) {
  if (gameOver) return;
  
  const cell = e.target.closest('.cell');
  if (!cell) return;
  
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  
  if (e.button === 0) {
    handleLeftClick(row, col);
  }
}

function handleRightClick(e) {
  e.preventDefault();
  if (gameOver) return;
  
  const cell = e.target.closest('.cell');
  if (!cell) return;
  
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  
  toggleFlag(row, col);
}

function handleLeftClick(row, col) {
  const cellData = board[row][col];
  
  if (cellData.isFlagged || cellData.isRevealed) return;
  
  if (firstClick) {
    firstClick = false;
    placeMines(board, mines, row, col);
    startTimer();
  }
  
  if (cellData.isMine) {
    gameOver = true;
    revealAllMines();
    showMessage('游戏结束!', 'lose');
    Sound.play('lose');
    stopTimer();
    return;
  }
  
  reveal(board, row, col);
  renderCell(row, col);
  Sound.play('click');
  
  if (checkWin(board, mines)) {
    gameOver = true;
    showMessage('恭喜获胜!', 'win');
    Sound.play('win');
    stopTimer();
    saveScore();
  }
}

function toggleFlag(row, col) {
  const cellData = board[row][col];
  
  if (cellData.isRevealed) return;
  
  cellData.isFlagged = !cellData.isFlagged;
  minesLeft += cellData.isFlagged ? -1 : 1;
  
  document.getElementById('mines-count').textContent = minesLeft;
  
  const cellEl = getCellElement(row, col);
  cellEl.classList.toggle('flagged', cellData.isFlagged);
  
  Sound.play('click');
}

function renderCell(row, col) {
  const cellData = board[row][col];
  const cellEl = getCellElement(row, col);
  
  if (cellData.isRevealed) {
    cellEl.classList.add('revealed');
    
    if (cellData.isMine) {
      cellEl.classList.add('mine');
      cellEl.textContent = '💣';
    } else if (cellData.count > 0) {
      cellEl.textContent = cellData.count;
      cellEl.dataset.count = cellData.count;
    }
  }
}

function revealAllMines() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) {
        board[r][c].isRevealed = true;
        renderCell(r, c);
      }
    }
  }
}

function getCellElement(row, col) {
  return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById('timer').textContent = timer;
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
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

function loadHighScore() {
  const highScore = Storage.getHighScore('minesweeper');
  document.getElementById('high-score').textContent = highScore;
}

function saveScore() {
  const currentHigh = Storage.getHighScore('minesweeper');
  if (timer < currentHigh || currentHigh === 0) {
    Storage.setHighScore('minesweeper', timer);
    document.getElementById('high-score').textContent = timer;
  }
  Storage.addRecord('minesweeper', timer);
  loadLeaderboard();
}

function loadLeaderboard() {
  const history = Storage.getHistory('minesweeper');
  const container = document.getElementById('leaderboard');
  
  if (history.length === 0) {
    container.innerHTML = '<div class="info-section-content">暂无记录</div>';
    return;
  }
  
  container.innerHTML = history.map((record, index) => `
    <div class="leaderboard-item">
      <span class="leaderboard-rank">#${index + 1}</span>
      <span class="leaderboard-score">${record.score} 秒</span>
      <span class="leaderboard-date">${new Date(record.date).toLocaleDateString()}</span>
    </div>
  `).join('');
}

function bindEvents() {
  document.getElementById('board').addEventListener('click', handleClick);
  document.getElementById('board').addEventListener('contextmenu', handleRightClick);
  document.getElementById('new-game').addEventListener('click', newGame);
  document.getElementById('difficulty').addEventListener('change', newGame);
}

document.addEventListener('DOMContentLoaded', init);
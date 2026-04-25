function initBoard(rows, cols) {
  const board = [];
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      board[r][c] = {
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        count: 0
      };
    }
  }
  return board;
}

function countAdjacentMines(board, row, col) {
  const rows = board.length;
  const cols = board[0].length;
  let count = 0;
  
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c].isMine) {
        count++;
      }
    }
  }
  return count;
}

function placeMines(board, mines, excludeRow, excludeCol) {
  const rows = board.length;
  const cols = board[0].length;
  let placed = 0;
  
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    
    if (!board[r][c].isMine && !(r === excludeRow && c === excludeCol)) {
      board[r][c].isMine = true;
      placed++;
    }
  }
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].isMine) {
        board[r][c].count = countAdjacentMines(board, r, c);
      }
    }
  }
}

function reveal(board, row, col) {
  const rows = board.length;
  const cols = board[0].length;
  
  if (row < 0 || row >= rows || col < 0 || col >= cols) return;
  
  const cell = board[row][col];
  if (cell.isRevealed || cell.isFlagged) return;
  
  cell.isRevealed = true;
  
  if (cell.count === 0 && !cell.isMine) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        reveal(board, row + dr, col + dc);
      }
    }
  }
}

function checkWin(board, mines) {
  const rows = board.length;
  const cols = board[0].length;
  let revealedCount = 0;
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isRevealed && !board[r][c].isMine) {
        revealedCount++;
      }
    }
  }
  
  return revealedCount === rows * cols - mines;
}

export { initBoard, placeMines, countAdjacentMines, reveal, checkWin };

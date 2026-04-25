const PIECES = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: '#00F0F0'
  },
  O: {
    shape: [[1, 1], [1, 1]],
    color: '#F0F000'
  },
  T: {
    shape: [[0, 1, 0], [1, 1, 1]],
    color: '#A000F0'
  },
  S: {
    shape: [[0, 1, 1], [1, 1, 0]],
    color: '#00F000'
  },
  Z: {
    shape: [[1, 1, 0], [0, 1, 1]],
    color: '#F00000'
  },
  J: {
    shape: [[1, 0, 0], [1, 1, 1]],
    color: '#0000F0'
  },
  L: {
    shape: [[0, 0, 1], [1, 1, 1]],
    color: '#F0A000'
  }
};

function createBoard() {
  return Array(20).fill(null).map(() => Array(10).fill(0));
}

function createPiece(type) {
  const piece = PIECES[type];
  return {
    type,
    shape: piece.shape.map(row => [...row]),
    color: piece.color,
    x: 3,
    y: 0
  };
}

function rotatePiece(shape) {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated = [];
  
  for (let c = 0; c < cols; c++) {
    rotated[c] = [];
    for (let r = rows - 1; r >= 0; r--) {
      rotated[c].push(shape[r][c]);
    }
  }
  
  return rotated;
}

function isValidPosition(board, piece) {
  const shape = piece.shape;
  const rows = shape.length;
  const cols = shape[0].length;
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (shape[r][c]) {
        const boardX = piece.x + c;
        const boardY = piece.y + r;
        
        if (boardX < 0 || boardX >= 10 || boardY >= 20) {
          return false;
        }
        
        if (boardY >= 0 && board[boardY][boardX] !== 0) {
          return false;
        }
      }
    }
  }
  
  return true;
}

function placePiece(board, piece) {
  const shape = piece.shape;
  const rows = shape.length;
  const cols = shape[0].length;
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (shape[r][c]) {
        const boardY = piece.y + r;
        const boardX = piece.x + c;
        if (boardY >= 0) {
          board[boardY][boardX] = piece.color;
        }
      }
    }
  }
}

function clearLines(board) {
  let linesCleared = 0;
  
  for (let r = board.length - 1; r >= 0; r--) {
    if (board[r].every(cell => cell !== 0)) {
      board.splice(r, 1);
      board.unshift(Array(10).fill(0));
      linesCleared++;
      r++;
    }
  }
  
  return linesCleared;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createBoard, createPiece, rotatePiece, isValidPosition, placePiece, clearLines, PIECES };
}
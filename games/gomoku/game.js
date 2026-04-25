function initBoard() {
  return Array(15).fill(null).map(() => Array(15).fill(0));
}

function placeStone(board, row, col, player) {
  if (board[row][col] !== 0) return false;
  board[row][col] = player;
  return true;
}

function checkWin(board, row, col, player) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
  ];

  for (const [dr, dc] of directions) {
    let count = 1;

    for (let i = 1; i < 5; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r >= 0 && r < 15 && c >= 0 && c < 15 && board[r][c] === player) {
        count++;
      } else {
        break;
      }
    }

    for (let i = 1; i < 5; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r >= 0 && r < 15 && c >= 0 && c < 15 && board[r][c] === player) {
        count++;
      } else {
        break;
      }
    }

    if (count >= 5) return true;
  }

  return false;
}

function evaluatePosition(board, row, col, player) {
  if (board[row][col] !== 0) return -1;

  let score = 0;
  const centerBonus = 15 - Math.abs(row - 7) - Math.abs(col - 7);
  score += centerBonus * 2;

  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
  const opponent = player === 1 ? 2 : 1;

  for (const [dr, dc] of directions) {
    let myCount = 0;
    let oppCount = 0;
    let myOpen = 0;
    let oppOpen = 0;

    for (let i = 1; i <= 4; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= 15 || c < 0 || c >= 15) break;
      if (board[r][c] === player) myCount++;
      else if (board[r][c] === 0) { myOpen++; break; }
      else break;
    }

    for (let i = 1; i <= 4; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r < 0 || r >= 15 || c < 0 || c >= 15) break;
      if (board[r][c] === player) myCount++;
      else if (board[r][c] === 0) { myOpen++; break; }
      else break;
    }

    for (let i = 1; i <= 4; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= 15 || c < 0 || c >= 15) break;
      if (board[r][c] === opponent) oppCount++;
      else if (board[r][c] === 0) { oppOpen++; break; }
      else break;
    }

    for (let i = 1; i <= 4; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r < 0 || r >= 15 || c < 0 || c >= 15) break;
      if (board[r][c] === opponent) oppCount++;
      else if (board[r][c] === 0) { oppOpen++; break; }
      else break;
    }

    if (myCount >= 4) score += 100000;
    else if (myCount >= 3 && myOpen >= 1) score += 10000;
    else if (myCount >= 2 && myOpen >= 2) score += 1000;
    else if (myCount >= 1 && myOpen >= 2) score += 100;

    if (oppCount >= 4) score += 50000;
    else if (oppCount >= 3 && oppOpen >= 1) score += 5000;
    else if (oppCount >= 2 && oppOpen >= 2) score += 500;
  }

  return score;
}

function findBestMove(board, player) {
  let bestScore = -Infinity;
  let bestMove = { row: 7, col: 7 };

  for (let r = 0; r < 15; r++) {
    for (let c = 0; c < 15; c++) {
      if (board[r][c] !== 0) continue;

      let hasNeighbor = false;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < 15 && nc >= 0 && nc < 15 && board[nr][nc] !== 0) {
            hasNeighbor = true;
            break;
          }
        }
        if (hasNeighbor) break;
      }

      if (!hasNeighbor && !(r === 7 && c === 7)) continue;

      const score = evaluatePosition(board, r, c, player);
      if (score > bestScore) {
        bestScore = score;
        bestMove = { row: r, col: c };
      }
    }
  }

  return bestMove;
}

export { initBoard, placeStone, checkWin, evaluatePosition, findBestMove };
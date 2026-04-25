function initGrid() {
  return Array(4).fill(null).map(() => Array(4).fill(0));
}

function addRandomTile(grid) {
  const emptyCells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) {
        emptyCells.push({ r, c });
      }
    }
  }
  
  if (emptyCells.length === 0) return false;
  
  const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return true;
}

function move(grid, direction) {
  let score = 0;
  
  if (direction === 'left') {
    for (let r = 0; r < 4; r++) {
      const result = slideAndMerge(grid[r]);
      grid[r] = result.row;
      score += result.score;
    }
  } else if (direction === 'right') {
    for (let r = 0; r < 4; r++) {
      const result = slideAndMerge(grid[r].slice().reverse());
      grid[r] = result.row.reverse();
      score += result.score;
    }
  } else if (direction === 'up') {
    for (let c = 0; c < 4; c++) {
      const col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
      const result = slideAndMerge(col);
      for (let r = 0; r < 4; r++) {
        grid[r][c] = result.row[r];
      }
      score += result.score;
    }
  } else if (direction === 'down') {
    for (let c = 0; c < 4; c++) {
      const col = [grid[3][c], grid[2][c], grid[1][c], grid[0][c]];
      const result = slideAndMerge(col);
      for (let r = 0; r < 4; r++) {
        grid[3 - r][c] = result.row[r];
      }
      score += result.score;
    }
  }
  
  return score;
}

function slideAndMerge(row) {
  let score = 0;
  let newRow = row.filter(x => x !== 0);
  
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      score += newRow[i];
      newRow.splice(i + 1, 1);
    }
  }
  
  while (newRow.length < 4) {
    newRow.push(0);
  }
  
  return { row: newRow, score };
}

function canMove(grid) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return true;
      if (c < 3 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < 3 && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

function isGameOver(grid) {
  return !canMove(grid);
}

export { initGrid, addRandomTile, move, canMove, isGameOver };
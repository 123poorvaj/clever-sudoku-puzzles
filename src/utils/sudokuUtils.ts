
// Utility functions for Sudoku game logic

export const generateSudoku = (clues: number) => {
  // Create a complete valid Sudoku solution
  const solution = generateCompleteSudoku();
  
  // Create puzzle by removing numbers
  const puzzle = createPuzzle(solution, clues);
  
  return { puzzle, solution };
};

const generateCompleteSudoku = (): number[][] => {
  const grid: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
  
  // Fill the grid using backtracking
  fillGrid(grid);
  
  return grid;
};

const fillGrid = (grid: number[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        // Try numbers 1-9 in random order
        const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        
        for (const num of numbers) {
          if (isValidMove(grid, row, col, num)) {
            grid[row][col] = num;
            
            if (fillGrid(grid)) {
              return true;
            }
            
            grid[row][col] = 0;
          }
        }
        
        return false;
      }
    }
  }
  
  return true;
};

const createPuzzle = (solution: number[][], clues: number): number[][] => {
  const puzzle = solution.map(row => [...row]);
  const totalCells = 81;
  const cellsToRemove = totalCells - clues;
  
  // Create array of all positions
  const positions: { row: number; col: number }[] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push({ row, col });
    }
  }
  
  // Shuffle and remove cells
  const shuffledPositions = shuffleArray(positions);
  
  for (let i = 0; i < cellsToRemove && i < shuffledPositions.length; i++) {
    const { row, col } = shuffledPositions[i];
    puzzle[row][col] = 0;
  }
  
  return puzzle;
};

export const isValidMove = (grid: number[][], row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (x !== col && grid[row][x] === num) {
      return false;
    }
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (x !== row && grid[x][col] === num) {
      return false;
    }
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if ((i !== row || j !== col) && grid[i][j] === num) {
        return false;
      }
    }
  }
  
  return true;
};

export const isSudokuComplete = (grid: number[][]): boolean => {
  // Check if all cells are filled
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        return false;
      }
    }
  }
  
  // Check if all rules are satisfied
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = grid[row][col];
      if (!isValidMove(grid, row, col, num)) {
        return false;
      }
    }
  }
  
  return true;
};

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

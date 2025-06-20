import React from 'react';
import { cn } from '@/lib/utils';

interface SudokuGridProps {
  grid: number[][];
  initialGrid: number[][];
  selectedCell: { row: number; col: number } | null;
  onCellSelect: (row: number, col: number) => void;
  errors: Set<string>;
  isGameComplete: boolean;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({
  grid,
  initialGrid,
  selectedCell,
  onCellSelect,
  errors,
  isGameComplete
}) => {
  const getCellClassName = (row: number, col: number) => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isInitial = initialGrid[row] && initialGrid[row][col] !== 0;
    const hasError = errors.has(`${row}-${col}`);
    const isEmpty = !grid[row] || grid[row][col] === 0;
    
    return cn(
      "w-12 h-12 border border-gray-400 flex items-center justify-center text-lg font-bold cursor-pointer transition-all duration-200",
      "hover:bg-blue-100 hover:scale-105",
      {
        // Grid borders for 3x3 boxes
        "border-r-2 border-r-gray-800": col === 2 || col === 5 || col === 8,
        "border-b-2 border-b-gray-800": row === 2 || row === 5 || row === 8,
        "border-l-2 border-l-gray-800": col === 0,
        "border-t-2 border-t-gray-800": row === 0,
        
        // Cell states
        "bg-blue-200 border-blue-500": isSelected && !isGameComplete,
        "bg-gray-200 text-gray-800 cursor-not-allowed": isInitial,
        "bg-red-200 border-red-500": hasError,
        "bg-white": !isSelected && !isInitial && !hasError && !isGameComplete,
        "bg-green-100": isGameComplete && !isEmpty,
        "text-blue-600": !isInitial && !isEmpty,
        "text-gray-800": isInitial,
        "text-red-600": hasError,
      }
    );
  };

  if (grid.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 flex items-center justify-center">
        <div className="text-white text-lg">Loading puzzle...</div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 animate-scale-in">
      <div className="grid grid-cols-9 gap-0 w-fit mx-auto bg-gray-800 p-1 rounded-lg shadow-2xl">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClassName(rowIndex, colIndex)}
              onClick={() => onCellSelect(rowIndex, colIndex)}
            >
              {cell !== 0 && cell}
            </div>
          ))
        )}
      </div>
      
      {isGameComplete && (
        <div className="text-center mt-6 animate-fade-in">
          <div className="text-green-400 text-2xl font-bold mb-2">🎉 Puzzle Complete! 🎉</div>
          <div className="text-gray-300">Congratulations on solving this {grid.length > 0 ? 'puzzle' : ''}!</div>
        </div>
      )}
    </div>
  );
};

export default SudokuGrid;

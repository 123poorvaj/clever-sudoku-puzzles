
import React, { useState, useEffect } from 'react';
import SudokuGrid from './SudokuGrid';
import NumberPad from './NumberPad';
import GameStats from './GameStats';
import TopNavigation from './layout/TopNavigation';
import { Button } from "@/components/ui/button";
import { generateSudoku, isValidMove, isSudokuComplete } from '../utils/sudokuUtils';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface SudokuGameProps {
  difficulty: string;
  onBackToMenu: () => void;
  onLevelComplete: () => void;
  currentLevel: number;
  clues: number;
}

const SudokuGame: React.FC<SudokuGameProps> = ({ 
  difficulty, 
  onBackToMenu, 
  onLevelComplete, 
  currentLevel, 
  clues 
}) => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [initialGrid, setInitialGrid] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const { puzzle, solution } = generateSudoku(clues);
    setGrid(puzzle);
    setInitialGrid(puzzle);
    console.log('Generated puzzle with', clues, 'clues');
    console.log('Solution:', solution);
  }, [clues]);

  useEffect(() => {
    if (grid.length > 0 && isSudokuComplete(grid)) {
      setIsGameComplete(true);
      toast({
        title: "Congratulations! 🎉",
        description: `Level ${currentLevel} completed in ${Math.floor(gameTime / 60)}:${(gameTime % 60).toString().padStart(2, '0')}!`,
      });
      
      // Show level complete after a short delay
      setTimeout(() => {
        onLevelComplete();
        toast({
          title: "Level Up! 🚀",
          description: `Ready for Level ${currentLevel + 1}?`,
        });
      }, 2000);
    }
  }, [grid, currentLevel, gameTime, toast, onLevelComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isGameComplete || !selectedCell) return;

      const key = event.key;
      
      // Number keys 1-9
      if (key >= '1' && key <= '9') {
        event.preventDefault();
        handleNumberSelect(parseInt(key));
      }
      
      // Delete/Backspace to clear cell
      if (key === 'Delete' || key === 'Backspace') {
        event.preventDefault();
        handleClearCell();
      }
      
      // Arrow keys for navigation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        event.preventDefault();
        navigateCell(key);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, isGameComplete]);

  const navigateCell = (direction: string) => {
    if (!selectedCell) return;
    
    let { row, col } = selectedCell;
    
    switch (direction) {
      case 'ArrowUp':
        row = Math.max(0, row - 1);
        break;
      case 'ArrowDown':
        row = Math.min(8, row + 1);
        break;
      case 'ArrowLeft':
        col = Math.max(0, col - 1);
        break;
      case 'ArrowRight':
        col = Math.min(8, col + 1);
        break;
    }
    
    setSelectedCell({ row, col });
  };

  const handleCellSelect = (row: number, col: number) => {
    if (initialGrid[row] && initialGrid[row][col] === 0) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberSelect = (number: number) => {
    if (selectedCell && !isGameComplete) {
      const { row, col } = selectedCell;
      
      if (initialGrid[row][col] !== 0) return;

      const newGrid = grid.map(row => [...row]);
      newGrid[row][col] = number;
      
      const cellKey = `${row}-${col}`;
      const newErrors = new Set(errors);
      
      if (!isValidMove(newGrid, row, col, number)) {
        newErrors.add(cellKey);
        toast({
          title: "Invalid move!",
          description: "This number conflicts with the Sudoku rules.",
          variant: "destructive",
        });
      } else {
        newErrors.delete(cellKey);
      }
      
      setGrid(newGrid);
      setErrors(newErrors);
      setMoves(prev => prev + 1);
      setSelectedNumber(number);
    }
  };

  const handleClearCell = () => {
    if (selectedCell && !isGameComplete) {
      const { row, col } = selectedCell;
      
      if (initialGrid[row][col] !== 0) return;

      const newGrid = grid.map(row => [...row]);
      newGrid[row][col] = 0;
      
      const cellKey = `${row}-${col}`;
      const newErrors = new Set(errors);
      newErrors.delete(cellKey);
      
      setGrid(newGrid);
      setErrors(newErrors);
      setMoves(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setGrid(initialGrid.map(row => [...row]));
    setSelectedCell(null);
    setSelectedNumber(null);
    setGameTime(0);
    setMoves(0);
    setIsGameComplete(false);
    setErrors(new Set());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4">
      <TopNavigation />
      
      <div className="max-w-6xl mx-auto pt-12 sm:pt-16">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-4">
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm sm:text-base"
            onClick={onBackToMenu}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white capitalize">
              Level {currentLevel} - {difficulty}
            </h2>
          </div>
          
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm sm:text-base"
            onClick={resetGame}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2 order-1">
            <SudokuGrid
              grid={grid}
              initialGrid={initialGrid}
              selectedCell={selectedCell}
              onCellSelect={handleCellSelect}
              errors={errors}
              isGameComplete={isGameComplete}
            />
          </div>
          
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-3">
            <GameStats
              gameTime={gameTime}
              setGameTime={setGameTime}
              moves={moves}
              difficulty={difficulty}
              isGameComplete={isGameComplete}
            />
            
            <NumberPad
              onNumberSelect={handleNumberSelect}
              onClear={handleClearCell}
              selectedNumber={selectedNumber}
              disabled={isGameComplete}
            />
            
            <div className="text-center text-xs sm:text-sm text-gray-400 bg-white/5 p-3 rounded-lg">
              <p className="mb-1">Keyboard Controls:</p>
              <p>1-9: Place numbers | Arrow keys: Navigate</p>
              <p>Delete/Backspace: Clear cell</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SudokuGame;

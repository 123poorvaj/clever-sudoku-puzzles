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
  clues: number;
}

const SudokuGame: React.FC<SudokuGameProps> = ({ difficulty, onBackToMenu, clues }) => {
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
        description: `You completed the ${difficulty} puzzle in ${Math.floor(gameTime / 60)}:${(gameTime % 60).toString().padStart(2, '0')}!`,
      });
    }
  }, [grid, difficulty, gameTime, toast]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <TopNavigation />
      
      <div className="max-w-6xl mx-auto pt-16">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={onBackToMenu}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          
          <h2 className="text-2xl font-bold text-white capitalize">
            {difficulty} Level
          </h2>
          
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={resetGame}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SudokuGrid
              grid={grid}
              initialGrid={initialGrid}
              selectedCell={selectedCell}
              onCellSelect={handleCellSelect}
              errors={errors}
              isGameComplete={isGameComplete}
            />
          </div>
          
          <div className="space-y-6">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SudokuGame;
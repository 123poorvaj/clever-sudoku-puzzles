
import React, { useState } from 'react';
import SudokuGame from '../components/SudokuGame';
import TopNavigation from '../components/layout/TopNavigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [gameKey, setGameKey] = useState(0);
  const { currentUser } = useAuth();

  const difficulties = [
    {
      id: 'easy',
      name: 'Easy',
      description: 'Perfect for beginners',
      color: 'from-green-400 to-green-600',
      clues: 45
    },
    {
      id: 'medium',
      name: 'Medium',
      description: 'A balanced challenge',
      color: 'from-yellow-400 to-orange-500',
      clues: 35
    },
    {
      id: 'complex',
      name: 'Complex',
      description: 'For puzzle masters',
      color: 'from-red-400 to-red-600',
      clues: 25
    }
  ];

  const startNewGame = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setGameKey(prev => prev + 1);
  };

  const backToMenu = () => {
    setSelectedDifficulty(null);
  };

  // If user is not logged in, show login requirement message
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 flex items-center justify-center p-4">
        <TopNavigation />
        
        <div className="max-w-md w-full text-center animate-fade-in">
          <h1 className="text-6xl font-bold text-white mb-4">
            SUDOKU
          </h1>
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome Back!
            </h2>
            <p className="text-gray-600 mb-6">
              Please log in to start playing Sudoku. Click the login button in the top right corner to get started.
            </p>
            <div className="text-sm text-gray-500">
              Create an account or sign in to track your progress and enjoy the full Sudoku experience!
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedDifficulty) {
    return (
      <>
        <TopNavigation />
        <SudokuGame 
          key={gameKey}
          difficulty={selectedDifficulty} 
          onBackToMenu={backToMenu}
          clues={difficulties.find(d => d.id === selectedDifficulty)?.clues || 35}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <TopNavigation />
      
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            SUDOKU
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Challenge your mind with the classic number puzzle
          </p>
          <p className="text-lg text-blue-300">
            Welcome back, {currentUser.displayName || 'Player'}!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 animate-scale-in">
          {difficulties.map((difficulty, index) => (
            <Card 
              key={difficulty.id}
              className={`bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105 animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => startNewGame(difficulty.id)}
            >
              <CardHeader className="text-center">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${difficulty.color} flex items-center justify-center`}>
                  <span className="text-2xl font-bold text-white">
                    {difficulty.clues}
                  </span>
                </div>
                <CardTitle className="text-2xl text-white">
                  {difficulty.name}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {difficulty.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  className={`w-full bg-gradient-to-r ${difficulty.color} hover:opacity-90 text-white font-semibold py-3 rounded-lg transition-all duration-300`}
                  onClick={(e) => {
                    e.stopPropagation();
                    startNewGame(difficulty.id);
                  }}
                >
                  Start Game
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <p className="text-gray-400 text-sm">
            Fill the 9×9 grid so that each column, row, and 3×3 box contains all digits from 1 to 9
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

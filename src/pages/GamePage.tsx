import React, { useState } from 'react';
import SudokuGame from '@/components/SudokuGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Clock, Target } from 'lucide-react';

interface GamePageProps {
  onBackToMenu: () => void;
}

const GamePage: React.FC<GamePageProps> = ({ onBackToMenu }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  const difficulties = [
    { 
      name: 'easy', 
      label: 'Easy', 
      clues: 45, 
      color: 'from-green-400 to-green-600',
      description: 'Perfect for beginners'
    },
    { 
      name: 'medium', 
      label: 'Medium', 
      clues: 35, 
      color: 'from-yellow-400 to-orange-500',
      description: 'A good challenge'
    },
    { 
      name: 'hard', 
      label: 'Hard', 
      clues: 28, 
      color: 'from-orange-400 to-red-500',
      description: 'For experienced players'
    },
    { 
      name: 'expert', 
      label: 'Expert', 
      clues: 22, 
      color: 'from-red-400 to-red-600',
      description: 'Ultimate challenge'
    }
  ];

  const handleDifficultySelect = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setCurrentLevel(1);
    setShowLevelComplete(false);
  };

  const handleLevelComplete = () => {
    setShowLevelComplete(true);
  };

  const handleNextLevel = () => {
    setCurrentLevel(prev => prev + 1);
    setShowLevelComplete(false);
  };

  const handleBackToMenu = () => {
    setSelectedDifficulty(null);
    setShowLevelComplete(false);
    onBackToMenu();
  };

  const getCluesForLevel = (difficulty: string, level: number) => {
    const baseDifficulty = difficulties.find(d => d.name === difficulty);
    if (!baseDifficulty) return 35;
    
    // Reduce clues slightly as level increases (max reduction of 5)
    const reduction = Math.min(Math.floor((level - 1) / 2), 5);
    return Math.max(baseDifficulty.clues - reduction, 17); // Minimum 17 clues for solvability
  };

  if (showLevelComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">Level Complete! 🎉</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-gray-300">
              Congratulations! You've completed Level {currentLevel} on {selectedDifficulty} difficulty.
            </p>
            <div className="flex justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleNextLevel}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next Level ({currentLevel + 1})
              </Button>
              <Button
                onClick={() => setSelectedDifficulty(null)}
                variant="outline"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Change Difficulty
              </Button>
              <Button
                onClick={handleBackToMenu}
                variant="outline"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Main Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedDifficulty) {
    const clues = getCluesForLevel(selectedDifficulty, currentLevel);
    
    return (
      <SudokuGame
        difficulty={selectedDifficulty}
        onBackToMenu={() => setSelectedDifficulty(null)}
        onLevelComplete={handleLevelComplete}
        currentLevel={currentLevel}
        clues={clues}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto pt-6 sm:pt-8 px-2 sm:px-0">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Choose Difficulty
          </h1>
          <p className="text-gray-300 text-lg">
            Select your challenge level to begin playing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {difficulties.map((difficulty) => (
            <Card
              key={difficulty.name}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => handleDifficultySelect(difficulty.name)}
            >
              <CardHeader>
                <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-r ${difficulty.color} rounded-full flex items-center justify-center`}>
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-center text-2xl">
                  {difficulty.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <p className="text-gray-300">{difficulty.description}</p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{difficulty.clues} clues</span>
                  </div>
                </div>
                <Button
                  className={`w-full bg-gradient-to-r ${difficulty.color} text-white font-semibold hover:opacity-90 transition-opacity`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDifficultySelect(difficulty.name);
                  }}
                >
                  Start Playing
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleBackToMenu}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Back to Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
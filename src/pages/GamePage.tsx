import React, { useState, useEffect } from 'react';
import SudokuGame from '@/components/SudokuGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Trophy, Star, Clock, Target } from 'lucide-react';
import { useGameProgress } from '@/contexts/GameProgressContext';
import { useToast } from '@/hooks/use-toast';

interface GamePageProps {
  onBackToMenu: () => void;
}

const GamePage: React.FC<GamePageProps> = ({ onBackToMenu }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const { gameProgress, saveProgress } = useGameProgress();
  const { toast } = useToast();

  // Load saved progress when component mounts
  useEffect(() => {
    if (gameProgress && !selectedDifficulty) {
      // Only auto-load if user hasn't manually selected a difficulty
      const shouldResume = window.confirm(
        `Welcome back! You were on Level ${gameProgress.currentLevel} (${gameProgress.difficulty}). Would you like to continue from where you left off?`
      );
      
      if (shouldResume) {
        setSelectedDifficulty(gameProgress.difficulty);
        setCurrentLevel(gameProgress.currentLevel);
        toast({
          title: "Progress Restored!",
          description: `Continuing from Level ${gameProgress.currentLevel} on ${gameProgress.difficulty} difficulty.`,
        });
      }
    }
  }, [gameProgress, selectedDifficulty, toast]);

  // Generate levels 1-100 with progressive difficulty
  const generateLevels = () => {
    const levels = [];
    for (let i = 1; i <= 100; i++) {
      let clues, color, difficulty;
      
      if (i <= 25) {
        clues = Math.max(45 - Math.floor(i / 5), 35);
        color = 'from-green-400 to-green-600';
        difficulty = 'easy';
      } else if (i <= 50) {
        clues = Math.max(35 - Math.floor((i - 25) / 5), 25);
        color = 'from-yellow-400 to-orange-500';
        difficulty = 'medium';
      } else if (i <= 75) {
        clues = Math.max(25 - Math.floor((i - 50) / 5), 20);
        color = 'from-orange-400 to-red-500';
        difficulty = 'hard';
      } else {
        clues = Math.max(20 - Math.floor((i - 75) / 5), 17);
        color = 'from-red-400 to-red-600';
        difficulty = 'expert';
      }
      
      levels.push({
        level: i,
        clues,
        color,
        difficulty,
        isUnlocked: i <= (gameProgress?.currentLevel || 1)
      });
    }
    return levels;
  };

  const levels = generateLevels();

  const handleLevelSelect = (level: number) => {
    const selectedLevel = levels.find(l => l.level === level);
    if (!selectedLevel || !selectedLevel.isUnlocked) return;
    
    setSelectedDifficulty(selectedLevel.difficulty);
    setCurrentLevel(level);
    setShowLevelComplete(false);
    // Save progress when starting a level
    saveProgress(level, selectedLevel.difficulty);
  };

  const handleLevelComplete = () => {
    setShowLevelComplete(true);
    // Save progress when completing a level
    if (selectedDifficulty) {
      saveProgress(currentLevel + 1, selectedDifficulty);
    }
  };

  const handleNextLevel = () => {
    setCurrentLevel(prev => prev + 1);
    setShowLevelComplete(false);
    // Progress is already saved in handleLevelComplete
  };

  const handleBackToMenu = () => {
    setSelectedDifficulty(null);
    setShowLevelComplete(false);
    onBackToMenu();
  };

  const getCluesForLevel = (level: number) => {
    const levelData = levels.find(l => l.level === level);
    return levelData?.clues || 35;
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
              Congratulations! You've completed Level {currentLevel}!
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
                Select Another Level
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
    const clues = getCluesForLevel(currentLevel);
    
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
            Select Level
          </h1>
          <p className="text-gray-300 text-lg">
            Choose from 100 challenging levels
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Progress: {gameProgress?.currentLevel || 1}/100 levels unlocked
          </p>
        </div>

        <div className="relative px-4 sm:px-8">
          <Carousel className="w-full max-w-6xl mx-auto">
            <CarouselContent className="-ml-1 md:-ml-2">
              {levels.map((level) => (
                <CarouselItem key={level.level} className="pl-1 md:pl-2 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                  <Card
                    className={`bg-white/10 backdrop-blur-sm border-white/20 transition-all duration-300 h-full ${
                      level.isUnlocked 
                        ? 'hover:bg-white/20 cursor-pointer transform hover:scale-105' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => level.isUnlocked && handleLevelSelect(level.level)}
                  >
                    <CardHeader className="pb-2">
                      <div className={`w-10 h-10 mx-auto mb-2 bg-gradient-to-r ${level.color} rounded-full flex items-center justify-center ${
                        level.isUnlocked ? '' : 'grayscale'
                      }`}>
                        {level.isUnlocked ? (
                          <span className="text-white font-bold text-sm">{level.level}</span>
                        ) : (
                          <span className="text-white text-lg">🔒</span>
                        )}
                      </div>
                      <CardTitle className="text-white text-center text-lg">
                        Level {level.level}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-2 pt-0">
                      <div className="text-xs text-gray-400">
                        {level.clues} clues
                      </div>
                      <div className="text-xs text-gray-300 capitalize">
                        {level.difficulty}
                      </div>
                      {level.isUnlocked && (
                        <Button
                          size="sm"
                          className={`w-full bg-gradient-to-r ${level.color} text-white font-semibold hover:opacity-90 transition-opacity text-xs`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLevelSelect(level.level);
                          }}
                        >
                          Play
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20" />
            <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20" />
          </Carousel>
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
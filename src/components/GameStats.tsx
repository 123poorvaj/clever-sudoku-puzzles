
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MousePointer, Trophy } from 'lucide-react';

interface GameStatsProps {
  gameTime: number;
  setGameTime: (time: number | ((prev: number) => number)) => void;
  moves: number;
  difficulty: string;
  isGameComplete: boolean;
}

const GameStats: React.FC<GameStatsProps> = ({
  gameTime,
  setGameTime,
  moves,
  difficulty,
  isGameComplete
}) => {
  useEffect(() => {
    if (!isGameComplete) {
      const timer = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isGameComplete, setGameTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'from-green-400 to-green-600';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'complex': return 'from-red-400 to-red-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-white text-center flex items-center justify-center gap-2">
          <Trophy className="w-5 h-5" />
          Game Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Time</span>
          </div>
          <span className="font-mono text-lg font-bold">
            {formatTime(gameTime)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <MousePointer className="w-4 h-4" />
            <span>Moves</span>
          </div>
          <span className="font-mono text-lg font-bold">
            {moves}
          </span>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between text-white mb-2">
            <span>Difficulty</span>
          </div>
          <div className={`bg-gradient-to-r ${getDifficultyColor(difficulty)} rounded-lg px-4 py-2 text-center`}>
            <span className="text-white font-bold capitalize">
              {difficulty}
            </span>
          </div>
        </div>
        
        {isGameComplete && (
          <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-center animate-pulse">
            <div className="text-green-400 font-bold">🎉 Completed! 🎉</div>
            <div className="text-green-300 text-sm mt-1">
              Well done!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameStats;

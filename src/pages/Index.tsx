import React, { useState } from 'react';
import TopNavigation from '../components/layout/TopNavigation';
import GamePage from './GamePage';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Trophy, Settings, Info } from 'lucide-react';
import { useGameProgress } from '@/contexts/GameProgressContext';

const Index = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [currentView, setCurrentView] = useState<'menu' | 'game' | 'stats' | 'settings' | 'howToPlay'>('menu');
  const { currentUser } = useAuth();
  const { gameProgress } = useGameProgress();

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  const handleStartGame = () => {
    setCurrentView('game');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
  };

  // If user is not logged in, show auth forms
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-2 sm:p-4">
        <TopNavigation />
        
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SUDOKU
            </h1>
            <p className="text-lg text-gray-300">
              {isLoginMode ? 'Sign in to start playing' : 'Join the Sudoku community'}
            </p>
          </div>

          <div className="animate-scale-in">
            {isLoginMode ? (
              <LoginForm onToggleMode={toggleMode} />
            ) : (
              <RegisterForm onToggleMode={toggleMode} />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show game page
  if (currentView === 'game') {
    return <GamePage onBackToMenu={handleBackToMenu} />;
  }

  // Show stats page
  if (currentView === 'stats') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <TopNavigation />
        <div className="max-w-4xl mx-auto pt-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Your Statistics</h1>
            <p className="text-gray-300">Track your Sudoku progress</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Games Played</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-blue-400">0</div>
                <p className="text-gray-400 text-sm">Total games</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Best Time</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-green-400">--:--</div>
                <p className="text-gray-400 text-sm">Fastest completion</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Win Rate</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-purple-400">--%</div>
                <p className="text-gray-400 text-sm">Success rate</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Button
              onClick={handleBackToMenu}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show how to play page
  if (currentView === 'howToPlay') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <TopNavigation />
        <div className="max-w-4xl mx-auto pt-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">How to Play Sudoku</h1>
            <p className="text-gray-300">Master the classic number puzzle game</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Basic Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300">
                <p>• Fill the 9×9 grid with numbers 1-9</p>
                <p>• Each row must contain all numbers 1-9</p>
                <p>• Each column must contain all numbers 1-9</p>
                <p>• Each 3×3 box must contain all numbers 1-9</p>
                <p>• No number can repeat in any row, column, or box</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Game Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300">
                <p>• Click on a cell to select it</p>
                <p>• Use number keys 1-9 to enter numbers</p>
                <p>• Use arrow keys to navigate between cells</p>
                <p>• Press Delete or Backspace to clear a cell</p>
                <p>• Use the number pad for quick entry</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Solving Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300">
                <p>• Start with numbers that appear most frequently</p>
                <p>• Look for cells with only one possible number</p>
                <p>• Check rows, columns, and boxes systematically</p>
                <p>• Use the process of elimination</p>
                <p>• Take breaks if you get stuck</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Game Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300">
                <p>• Timer to track your solving speed</p>
                <p>• Hint system for when you're stuck</p>
                <p>• Error checking to prevent mistakes</p>
                <p>• Statistics tracking your progress</p>
                <p>• Multiple difficulty levels</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Button
              onClick={handleBackToMenu}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 mr-4"
            >
              Back to Menu
            </Button>
            <Button
              onClick={handleStartGame}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Start Playing
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show settings page
  if (currentView === 'settings') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <TopNavigation />
        <div className="max-w-2xl mx-auto pt-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Settings</h1>
            <p className="text-gray-300">Customize your game experience</p>
          </div>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Game Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-300">
                <p>• Sound effects: Coming soon</p>
                <p>• Auto-save: Enabled</p>
                <p>• Hints: Available during gameplay</p>
                <p>• Timer: Always visible</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <Button
              onClick={handleBackToMenu}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main menu for logged in users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4">
      <TopNavigation />
      
      <div className="max-w-4xl mx-auto pt-12 sm:pt-16 px-2 sm:px-0">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            SUDOKU
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Welcome back, {currentUser.displayName || 'Player'}!
          </p>
          <p className="text-gray-400">
            Ready to challenge your mind?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card 
            className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
            onClick={handleStartGame}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">
                {gameProgress && gameProgress.difficulty ? 'Continue Game' : 'Start Game'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {gameProgress && gameProgress.difficulty ? (
                <div className="mb-4">
                  <p className="text-gray-300 mb-2">
                    Continue from Level {gameProgress.currentLevel}
                  </p>
                  <p className="text-sm text-gray-400 capitalize">
                    {gameProgress.difficulty} difficulty
                  </p>
                </div>
              ) : (
                <p className="text-gray-300 mb-4">
                  Begin a new Sudoku challenge
                </p>
              )}
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartGame();
                }}
              >
                {gameProgress && gameProgress.difficulty ? 'Continue' : 'Play Now'}
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
            onClick={() => setCurrentView('stats')}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-4">
                View your progress and achievements
              </p>
              <Button 
                variant="outline"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentView('stats');
                }}
              >
                View Stats
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
            onClick={() => setCurrentView('settings')}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Settings</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-4">
                Customize your game preferences
              </p>
              <Button 
                variant="outline"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentView('settings');
                }}
              >
                Open Settings
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
            onClick={() => setCurrentView('howToPlay')}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Info className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">How to Play</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-4">
                Learn the rules and strategies
              </p>
              <Button 
                variant="outline"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentView('howToPlay');
                }}
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            Use keyboard controls: 1-9 to place numbers, Arrow keys to navigate, Delete to clear
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
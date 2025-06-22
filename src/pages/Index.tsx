
import React, { useState } from 'react';
import TopNavigation from '../components/layout/TopNavigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const Index = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { currentUser } = useAuth();

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  // If user is logged in, redirect them or show a different interface
  if (currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <TopNavigation />
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome {currentUser.displayName || 'Player'}!
          </h1>
          <p className="text-gray-300 mb-6">
            You are successfully logged in. Game features will be available soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
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
};

export default Index;

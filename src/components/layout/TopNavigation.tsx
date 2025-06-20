import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from '@/components/auth/UserProfile';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';
import { User, LogIn } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TopNavigation: React.FC = () => {
  const { currentUser } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-200"
          >
            {currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {currentUser.displayName || 'Profile'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="p-0 bg-transparent border-none shadow-none" 
          align="end"
          sideOffset={8}
        >
          {currentUser ? (
            <UserProfile />
          ) : (
            <div className="w-80">
              {isLoginMode ? (
                <LoginForm onToggleMode={toggleMode} />
              ) : (
                <RegisterForm onToggleMode={toggleMode} />
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TopNavigation;
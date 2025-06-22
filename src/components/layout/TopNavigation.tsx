
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from '@/components/auth/UserProfile';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

const TopNavigation: React.FC = () => {
  const { currentUser } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  const authContent = currentUser ? (
    <UserProfile />
  ) : (
    <div className={isMobile ? "w-full p-4" : "w-80"}>
      {isLoginMode ? (
        <LoginForm onToggleMode={toggleMode} />
      ) : (
        <RegisterForm onToggleMode={toggleMode} />
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
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
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Login</span>
                </div>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[90vh]">
            <div className="overflow-y-auto h-full">
              {authContent}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

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
          {authContent}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TopNavigation;

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserProfile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!currentUser) return null;

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-gray-300 text-sm">Name</p>
          <p className="text-white font-semibold">
            {currentUser.displayName || 'Anonymous Player'}
          </p>
        </div>
        <div>
          <p className="text-gray-300 text-sm">Email</p>
          <p className="text-white font-semibold">{currentUser.email}</p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30 hover:text-red-300"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
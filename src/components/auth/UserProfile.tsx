
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Edit2, Save, X, Camera, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';

const UserProfile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

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

  const handleSaveProfile = async () => {
    try {
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: displayName,
          photoURL: photoURL
        });
        
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploadingPhoto(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoURL(e.target?.result as string);
        setIsUploadingPhoto(false);
        if (!isEditing) {
          setIsEditing(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!currentUser) return null;

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 w-80">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </div>
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-white hover:bg-white/20"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveProfile}
                className="text-green-400 hover:bg-green-500/20"
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setDisplayName(currentUser.displayName || '');
                  setPhotoURL(currentUser.photoURL || '');
                }}
                className="text-red-400 hover:bg-red-500/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile Photo */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
              {photoURL ? (
                <img 
                  src={photoURL} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            
            {/* Upload button - always visible */}
            <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 cursor-pointer hover:bg-blue-600 transition-colors">
              <Camera className="w-3 h-3 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>
          
          {/* Alternative upload button for better UX */}
          <label className="cursor-pointer">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              asChild
            >
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {isUploadingPhoto ? 'Uploading...' : 'Change Photo'}
              </div>
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Display Name */}
        <div>
          <Label className="text-gray-300 text-sm">Name</Label>
          {isEditing ? (
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 mt-1"
              placeholder="Enter your name"
            />
          ) : (
            <p className="text-white font-semibold mt-1">
              {currentUser.displayName || 'Anonymous Player'}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label className="text-gray-300 text-sm">Email</Label>
          <p className="text-white font-semibold mt-1">{currentUser.email}</p>
        </div>

        {/* Bio */}
        <div>
          <Label className="text-gray-300 text-sm">Bio</Label>
          {isEditing ? (
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 mt-1 resize-none"
              placeholder="Tell us about yourself..."
              rows={3}
            />
          ) : (
            <p className="text-gray-300 mt-1 text-sm">
              {bio || 'No bio added yet.'}
            </p>
          )}
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

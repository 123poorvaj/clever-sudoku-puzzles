
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Edit2, Save, X, Camera, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserProfileData {
  bio?: string;
  displayName?: string;
  photoURL?: string;
}

const UserProfile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Load user profile data from Firestore
  const loadUserProfile = async () => {
    if (currentUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfileData;
          setBio(userData.bio || '');
          setDisplayName(userData.displayName || currentUser.displayName || '');
          setPhotoURL(userData.photoURL || currentUser.photoURL || '');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, [currentUser]);

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
    if (!currentUser) return;
    
    // Validate inputs
    if (displayName.trim().length < 2) {
      toast({
        title: "Validation Error",
        description: "Display name must be at least 2 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (bio.length > 500) {
      toast({
        title: "Validation Error", 
        description: "Bio must be less than 500 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: displayName.trim(),
        photoURL: photoURL
      });

      // Save additional profile data to Firestore
      const profileData: UserProfileData = {
        displayName: displayName.trim(),
        bio: bio.trim(),
        photoURL: photoURL
      };

      await setDoc(doc(db, 'users', currentUser.uid), profileData, { merge: true });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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

  if (isLoading) {
    return (
      <Card className="bg-card/10 backdrop-blur-sm border-border w-80">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/10 backdrop-blur-sm border-border w-80">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </div>
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-foreground hover:bg-accent"
              disabled={isSaving}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveProfile}
                className="text-green-600 hover:bg-green-500/20"
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setDisplayName(currentUser.displayName || '');
                  setPhotoURL(currentUser.photoURL || '');
                  // Reset bio to original value
                  loadUserProfile();
                }}
                className="text-destructive hover:bg-destructive/20"
                disabled={isSaving}
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
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              {photoURL ? (
                <img 
                  src={photoURL} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-primary-foreground" />
              )}
            </div>
            
            {/* Upload button - always visible */}
            <label className="absolute bottom-0 right-0 bg-primary rounded-full p-1 cursor-pointer hover:bg-primary/80 transition-colors">
              <Camera className="w-3 h-3 text-primary-foreground" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={isSaving}
              />
            </label>
          </div>
          
          {/* Alternative upload button for better UX */}
          <label className="cursor-pointer">
            <Button
              variant="outline"
              size="sm"
              className="bg-card/10 border-border text-foreground hover:bg-accent"
              asChild
            >
              <div className="flex items-center gap-2">
                {isUploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isUploadingPhoto ? 'Uploading...' : 'Change Photo'}
              </div>
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={isSaving || isUploadingPhoto}
            />
          </label>
        </div>

        {/* Display Name */}
        <div>
          <Label className="text-muted-foreground text-sm">Name</Label>
          {isEditing ? (
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground mt-1"
              placeholder="Enter your name"
              disabled={isSaving}
              maxLength={50}
            />
          ) : (
            <p className="text-foreground font-semibold mt-1">
              {displayName || 'Anonymous Player'}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label className="text-muted-foreground text-sm">Email</Label>
          <p className="text-foreground font-semibold mt-1">{currentUser.email}</p>
        </div>

        {/* Bio */}
        <div>
          <Label className="text-muted-foreground text-sm">
            Bio {bio.length > 0 && <span className="text-xs">({bio.length}/500)</span>}
          </Label>
          {isEditing ? (
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground mt-1 resize-none"
              placeholder="Tell us about yourself..."
              rows={3}
              disabled={isSaving}
              maxLength={500}
            />
          ) : (
            <p className="text-muted-foreground mt-1 text-sm">
              {bio || 'No bio added yet.'}
            </p>
          )}
        </div>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full bg-destructive/20 border-destructive/30 text-destructive hover:bg-destructive/30"
          disabled={isSaving}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfile;

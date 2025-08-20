import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';

interface GameProgress {
  currentLevel: number;
  difficulty: string;
  lastPlayed: Date;
  currentGrid?: number[][];
  moves?: number;
  gameTime?: number;
}

interface GameProgressContextType {
  gameProgress: GameProgress | null;
  saveProgress: (level: number, difficulty: string, gameState?: Partial<GameProgress>) => Promise<void>;
  loadProgress: () => Promise<GameProgress | null>;
  clearProgress: () => Promise<void>;
  loading: boolean;
}

const GameProgressContext = createContext<GameProgressContextType | undefined>(undefined);

export const useGameProgress = () => {
  const context = useContext(GameProgressContext);
  if (context === undefined) {
    throw new Error('useGameProgress must be used within a GameProgressProvider');
  }
  return context;
};

export const GameProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [gameProgress, setGameProgress] = useState<GameProgress | null>(null);
  const [loading, setLoading] = useState(false);

  const saveProgress = async (level: number, difficulty: string, gameState?: Partial<GameProgress>) => {
    if (!currentUser) return;

    try {
      const progressData: GameProgress = {
        currentLevel: level,
        difficulty,
        lastPlayed: new Date(),
        ...gameState
      };

      await setDoc(doc(db, 'gameProgress', currentUser.uid), progressData);
      setGameProgress(progressData);
      console.log('Game progress saved:', progressData);
    } catch (error) {
      console.error('Error saving game progress:', error);
      throw error; // Re-throw to handle in calling component
    }
  };

  const loadProgress = async (): Promise<GameProgress | null> => {
    if (!currentUser) return null;

    setLoading(true);
    try {
      const docRef = doc(db, 'gameProgress', currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as GameProgress;
        // Convert Firestore timestamp back to Date
        const progress = {
          ...data,
          lastPlayed: data.lastPlayed instanceof Date ? data.lastPlayed : new Date(data.lastPlayed)
        };
        setGameProgress(progress);
        return progress;
      }
      return null;
    } catch (error) {
      console.error('Error loading game progress:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearProgress = async () => {
    if (!currentUser) return;

    try {
      await setDoc(doc(db, 'gameProgress', currentUser.uid), {
        currentLevel: 1,
        difficulty: '',
        lastPlayed: new Date()
      });
      setGameProgress(null);
    } catch (error) {
      console.error('Error clearing game progress:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadProgress();
    } else {
      setGameProgress(null);
    }
  }, [currentUser]);

  const value: GameProgressContextType = {
    gameProgress,
    saveProgress,
    loadProgress,
    clearProgress,
    loading
  };

  return (
    <GameProgressContext.Provider value={value}>
      {children}
    </GameProgressContext.Provider>
  );
};
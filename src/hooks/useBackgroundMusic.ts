import { useEffect, useRef, useState } from 'react';

export const useBackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    // Create audio element with a simple background music
    // Using a data URL for a simple sine wave tone as placeholder
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Create a simple ambient tone
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3 note
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const startMusic = () => {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.5);
      oscillator.start();
      setIsPlaying(true);
    };

    const stopMusic = () => {
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
      setTimeout(() => {
        try {
          oscillator.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
        setIsPlaying(false);
      }, 500);
    };

    return () => {
      try {
        audioContext.close();
      } catch (e) {
        // Context might already be closed
      }
    };
  }, []);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  const changeVolume = (newVolume: number) => {
    setVolume(newVolume);
  };

  return {
    isPlaying,
    volume,
    toggleMusic,
    changeVolume
  };
};
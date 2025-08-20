import React from 'react';
import { Button } from './button';
import { Slider } from './slider';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Card, CardContent } from './card';

interface MusicControlsProps {
  isPlaying: boolean;
  volume: number;
  onToggleMusic: () => void;
  onVolumeChange: (volume: number) => void;
}

export const MusicControls: React.FC<MusicControlsProps> = ({
  isPlaying,
  volume,
  onToggleMusic,
  onVolumeChange
}) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleMusic}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {volume > 0 ? (
              <Volume2 className="w-4 h-4 text-white flex-shrink-0" />
            ) : (
              <VolumeX className="w-4 h-4 text-white flex-shrink-0" />
            )}
            <Slider
              value={[volume * 100]}
              onValueChange={(value) => onVolumeChange(value[0] / 100)}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
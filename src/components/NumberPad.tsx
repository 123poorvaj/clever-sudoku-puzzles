
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumberPadProps {
  onNumberSelect: (number: number) => void;
  onClear: () => void;
  selectedNumber: number | null;
  disabled: boolean;
}

const NumberPad: React.FC<NumberPadProps> = ({
  onNumberSelect,
  onClear,
  selectedNumber,
  disabled
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 animate-fade-in">
      <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center">Number Pad</h3>
      
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <Button
            key={number}
            className={cn(
              "h-10 sm:h-12 text-base sm:text-lg font-bold transition-all duration-200 touch-manipulation",
              selectedNumber === number
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-white/20 hover:bg-white/30 active:bg-white/40 text-white border border-white/30"
            )}
            onClick={() => onNumberSelect(number)}
            disabled={disabled}
          >
            {number}
          </Button>
        ))}
      </div>
      
      <Button
        className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold py-2 sm:py-3 text-sm sm:text-base transition-all duration-200 touch-manipulation"
        onClick={onClear}
        disabled={disabled}
      >
        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        Clear Cell
      </Button>
    </div>
  );
};

export default NumberPad;

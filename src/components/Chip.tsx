// src/components/Chip.tsx
import React from 'react';
import { cn } from '../utils/classname';

interface ChipProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, isActive = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium border',
        isActive
          ? 'bg-red-500 text-white border-red-500'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      )}
    >
      {label}
    </button>
  );
};

export default Chip;

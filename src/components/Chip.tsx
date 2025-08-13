// src/components/Chip.tsx
import React from 'react';
import { cn } from '../utils/classname';

interface ChipProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Chip: React.FC<ChipProps> = ({
  label,
  isActive = false,
  onClick,
  disabled = false,
  className,
}) => {
  const interactive = !!onClick && !disabled;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center h-10 px-4 rounded-full text-sm transition-colors select-none',
        isActive
          ? 'bg-red-500 text-white'
          : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200',
        interactive ? 'cursor-pointer' : 'cursor-default',
        className
      )}
    >
      {label}
    </button>
  );
};

export default Chip;

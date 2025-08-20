// src/components/Chip.tsx
import React from "react";
import { cn } from "../utils/classname";

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
        "inline-flex items-center py-2.5 px-5 rounded-full transition-colors select-none",
        isActive
          ? "bg-[#D32F2F] text-white"
          : "bg-gray-100 text-zinc-900 hover:bg-gray-200",
        interactive ? "cursor-pointer" : "cursor-default",
        className
      )}
    >
      {label}
    </button>
  );
};

export default Chip;

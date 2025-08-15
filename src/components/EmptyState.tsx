// src/components/EmptyState.tsx
import React from "react";
import { cn } from "../utils/classname";
import emptyImage from "../assets/images/human.png";
interface EmptyStateProps {
  text?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ text, className }) => {
  return (
    <div className={cn("w-full flex flex-col items-center", className)}>
      {/* 제목/설명 */}
      <p className="text-[1.25rem] mb-12 font-normal text-zinc-500">{text}</p>
      {/* 중앙 이미지 */}
      <div className="flex justify-center">
        <img src={emptyImage} alt="empty image" className="max-w-full h-auto" />
      </div>
    </div>
  );
};

export default EmptyState;

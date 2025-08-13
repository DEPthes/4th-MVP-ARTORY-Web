// src/components/EmptyState.tsx
import React from 'react';
import { cn } from '../utils/classname';

interface EmptyStateProps {
  className?: string;
  title?: string;
  description?: string;
  imageSrc: string; // human.png 경로
}

const EmptyState: React.FC<EmptyStateProps> = ({
  className,
  title = '첫 번째 컬렉션을 만들어보세요.',
  description = '여러분의 작품을 소개할 수 있어요.',
  imageSrc,
}) => {
  if (!imageSrc) {
    console.error('EmptyState: imageSrc is undefined');
    return null;
  }

  return (
    <section
      role="status"
      aria-live="polite"
      className={cn('w-full text-zinc-600', className)}
    >
      {/* 위 여백 */}
      <div className="h-[3rem]" />

      {/* 제목/설명 */}
      <div className="text-center">
        <p className="text-[1.375rem] leading-[2rem] font-medium">{title}</p>
        <p className="text-[1.125rem] leading-[1.75rem] mt-[0.25rem]">
          {description}
        </p>
      </div>

      {/* 안내 문구 아래 여백 */}
      <div className="h-[3rem]" />

      {/* 중앙 이미지 */}
      <div className="flex justify-center">
        <img
          src={imageSrc}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          draggable={false}
          className="max-w-full h-auto"
        />
      </div>
    </section>
  );
};

export default EmptyState;

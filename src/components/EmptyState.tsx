// src/components/EmptyState.tsx
import React from 'react';
import { cn } from '../utils/classname';

type SvgComp = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface EmptyStateProps {
  className?: string;
  title?: string;
  description?: string;
  PersonSvg: SvgComp;
  Frame1Svg: SvgComp;
  Frame2Svg: SvgComp;
  Frame3Svg: SvgComp; // left.svg
}

const EmptyState: React.FC<EmptyStateProps> = ({
  className,
  title = '첫 번째 컬렉션을 만들어보세요.',
  description = '여러분의 작품을 소개할 수 있어요.',
  PersonSvg,
  Frame1Svg,
  Frame2Svg,
  Frame3Svg,
}) => {
  // 런타임 안전가드: SVG 컴포넌트 누락 시 렌더 중단(원인 로그)
  if (!PersonSvg || !Frame1Svg || !Frame2Svg || !Frame3Svg) {
    console.error('EmptyState: one or more SVG components are undefined', {
      PersonSvg,
      Frame1Svg,
      Frame2Svg,
      Frame3Svg,
    });
    return null;
  }

  return (
    <section
      role="status"
      aria-live="polite"
      className={cn('w-full text-zinc-600', className)}
    >
      {/* 칩 아래 64px은 상위에서, 여기서 48px 여백 */}
      <div className="h-[3rem]" />

      <div className="text-center">
        <p className="text-[1.375rem] leading-[2rem] font-medium">{title}</p>
        <p className="text-[1.125rem] leading-[1.75rem] mt-[0.25rem]">
          {description}
        </p>
      </div>

      {/* 안내 문구 아래 48px */}
      <div className="h-[3rem]" />

      <div className="flex items-end justify-center">
        {/* 사람 + left.svg(깨진 상자) 묶음: left.svg가 사람 위로 덮이도록 */}
        <div className="relative flex items-end">
          <PersonSvg
            className="w-[11.5rem] h-[15.5rem] z-10 translate-y-[3.5rem]"
            aria-hidden
          />
          <Frame3Svg
            className="w-[10.9375rem] h-[14.5625rem] -ml-[4rem] z-20 pointer-events-none"
            aria-hidden
          />
        </div>

        {/* 나머지 두 프레임: 40px 간격, 그룹과 40px 간격 */}
        <div className="flex items-end gap-[2.5rem] ml-[2.5rem]">
          <Frame1Svg className="w-[10.9375rem] h-[14.5625rem]" aria-hidden />
          <Frame2Svg className="w-[10.9375rem] h-[14.5625rem]" aria-hidden />
        </div>
      </div>
    </section>
  );
};

export default EmptyState;

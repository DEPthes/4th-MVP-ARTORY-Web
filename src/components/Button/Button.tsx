import React from "react";
import { cn } from "../../utils/classname";

// 버튼 종류가 크게 완료버튼이랑 등록버튼이 있는데,
// w 값과 round 값만 바꾸면 둘 다 쓸 수 있을 것 같아서,
// 버튼 종류를 하나의 컴포넌트로 사용할 수 있게 하고, 버튼 종류를 파라미터로 받아서 처리하는 방식으로 구현하기
// size로 받으면 될듯(완료 버튼은 base, 등록 버튼은 sm.

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "base" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "base",
  disabled = false,
  loading = false,
  onClick,
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none active:scale-95";

  const variantClasses = {
    primary: "bg-zinc-900 text-white hover:bg-black disabled:bg-zinc-700",
    secondary:
      "bg-stone-300 text-white hover:bg-stone-400 disabled:bg-stone-200",
    tertiary: "bg-zinc-500 text-white hover:bg-zinc-600 disabled:bg-zinc-400",
  };

  const sizeClasses = {
    sm: "px-2 py-4 text-xl rounded-full",
    base: "p-6 text-xl rounded-lg",
    lg: "px-2 py-8 text-2xl rounded-lg",
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled || loading ? "cursor-not-allowed" : "cursor-pointer",
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;

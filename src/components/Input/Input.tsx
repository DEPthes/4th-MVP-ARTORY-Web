import React from "react";
import { cn } from "../../utils/classname";

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "date" | "url";
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  multiline?: boolean;
  rows?: number;
  className?: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  maxLength,
  multiline = false,
  rows = 3,
  className = "",
  error,
  helperText,
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr] gap-5 items-center py-4 px-10",
        className
      )}
    >
      <div className="text-lg w-18 font-semibold text-zinc-900 whitespace-nowrap">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </div>
      <div className="w-full relative">
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-3 font-light placeholder:text-zinc-500 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 resize-none ${
              error ? "border-red-600" : ""
            }`}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={rows}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-3 font-light placeholder:text-zinc-500 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 ${
              error ? "border-red-600" : ""
            }`}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        )}
        {error && (
          <p className="absolute left-0 text-xs font-light px-2 text-red-500 mt-1.5">
            *{error}
          </p>
        )}
        {!error && helperText && (
          <p className="absolute left-0 text-xs font-light px-2 text-zinc-500 mt-1.5">
            *{helperText}
          </p>
        )}
      </div>
    </div>
  );
};

export default Input;

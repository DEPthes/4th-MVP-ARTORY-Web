import React from "react";
import { cn } from "../../utils/classname";

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  className?: string;
  error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
  rows = 4,
  className = "",
  error,
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr] gap-5 items-start py-4 px-10",
        className
      )}
    >
      <div className="text-lg font-semibold text-zinc-900 whitespace-nowrap pt-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </div>
      <div className="w-full">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 resize-none ${
            error ? "border-red-600" : ""
          }`}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
        />
        {maxLength && (
          <p className="text-sm text-gray-500 mt-1">
            {value.length}/{maxLength}
          </p>
        )}
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default TextArea;

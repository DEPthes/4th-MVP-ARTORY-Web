import React from "react";
import { cn } from "../../utils/classname";
import DatePicker from "../DatePicker/DatePicker";

interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "date" | "url";
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  multiline?: boolean;
  rows?: number;
  className?: string;
  labelWidth?: string;
  error?: string;
  helperText?: string;
  showCounter?: boolean;
  useCustomDatePicker?: boolean;
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
  labelWidth = "w-18",
  error,
  helperText,
  showCounter = false,
  useCustomDatePicker = false,
}) => {
  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 7)
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(
      7,
      11
    )}`;
  };

  // 전화번호 입력 처리
  const handlePhoneChange = (inputValue: string) => {
    const cleaned = inputValue.replace(/\D/g, "");
    onChange(cleaned);
  };

  // 일반 입력 처리
  const handleInputChange = (inputValue: string) => {
    if (type === "tel") {
      handlePhoneChange(inputValue);
    } else {
      onChange(inputValue);
    }
  };

  // 표시값 결정
  const displayValue = type === "tel" ? formatPhoneNumber(value) : value;

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr] gap-5 py-4 px-10",
        multiline ? "items-start" : "items-center",
        className
      )}
    >
      <div
        className={cn(
          "text-lg font-semibold text-zinc-900 whitespace-nowrap",
          multiline ? "pt-3" : "",
          labelWidth
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </div>
      <div className="w-full relative">
        {multiline ? (
          <div className="relative">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full px-4 py-3 font-light placeholder:text-zinc-500 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 resize-none ${
                error ? "border-red-600" : ""
              } ${showCounter ? "pb-8" : ""}`}
              placeholder={placeholder}
              maxLength={maxLength}
              rows={rows}
            />
            {showCounter && maxLength && (
              <div className="absolute bottom-3 right-3 text-xs text-zinc-400">
                {value.length}/{maxLength}
              </div>
            )}
          </div>
        ) : type === "date" && useCustomDatePicker ? (
          <DatePicker
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            error={error}
          />
        ) : (
          <input
            type={type === "tel" ? "text" : type}
            value={displayValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className={`w-full px-4 py-3 font-light placeholder:text-zinc-500 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 ${
              error ? "border-red-600" : ""
            }`}
            placeholder={placeholder}
            maxLength={type === "tel" ? 13 : maxLength}
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

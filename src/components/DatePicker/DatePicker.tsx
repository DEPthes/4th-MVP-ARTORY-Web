import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/classname";

interface DropdownProps {
  value: number;
  onChange: (value: number) => void;
  options: { value: number; label: string }[];
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  options,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border focus:border-red-500"
      >
        <span>{selectedOption?.label || placeholder}</span>
        <svg
          className="size-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors",
                value === option.value
                  ? "bg-red-50 text-red-600"
                  : "text-gray-700"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
  error,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // 년도 목록 생성 (1950년부터 현재년도까지)
  const years = Array.from(
    { length: new Date().getFullYear() - 1900 },
    (_, i) => ({
      value: new Date().getFullYear() - i,
      label: `${new Date().getFullYear() - i}년`,
    })
  );

  // 월 목록
  const months = [
    { value: 0, label: "1월" },
    { value: 1, label: "2월" },
    { value: 2, label: "3월" },
    { value: 3, label: "4월" },
    { value: 4, label: "5월" },
    { value: 5, label: "6월" },
    { value: 6, label: "7월" },
    { value: 7, label: "8월" },
    { value: 8, label: "9월" },
    { value: 9, label: "10월" },
    { value: 10, label: "11월" },
    { value: 11, label: "12월" },
  ];

  // 날짜 포맷팅 함수 (실시간 입력용)
  const formatDateInput = (input: string) => {
    // 숫자만 추출
    const cleaned = input.replace(/\D/g, "");

    // 길이에 따라 포맷팅
    if (cleaned.length <= 4) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    } else {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(
        6,
        8
      )}`;
    }
  };

  // 달력 날짜 생성
  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // 이전 달의 빈 칸들
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // 날짜 선택
  const handleDateSelect = (day: number) => {
    const formattedDate = `${selectedYear}-${String(selectedMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    onChange(formattedDate);
    setInputValue(formattedDate);
    setIsOpen(false);
  };

  // 입력값 변경
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatDateInput(input);
    setInputValue(formatted);

    // 완전한 날짜 형식인지 확인 (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(formatted)) {
      const date = new Date(formatted);
      if (!isNaN(date.getTime())) {
        onChange(formatted);
        setSelectedYear(date.getFullYear());
        setSelectedMonth(date.getMonth());
      }
    }
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // value가 변경될 때 inputValue 업데이트
  useEffect(() => {
    setInputValue(value);
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedYear(date.getFullYear());
        setSelectedMonth(date.getMonth());
      }
    }
  }, [value]);

  const days = getDaysInMonth(selectedYear, selectedMonth);
  const today = new Date();
  const isToday = (day: number) => {
    return (
      selectedYear === today.getFullYear() &&
      selectedMonth === today.getMonth() &&
      day === today.getDate()
    );
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const selectedDate = new Date(value);
    return (
      selectedYear === selectedDate.getFullYear() &&
      selectedMonth === selectedDate.getMonth() &&
      day === selectedDate.getDate()
    );
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 font-light placeholder:text-zinc-500 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 ${
          error ? "border-red-600" : ""
        }`}
        placeholder={placeholder}
      />

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 w-80">
          {/* Year and Month Selectors */}
          <div className="flex gap-4 mb-4">
            <Dropdown
              value={selectedYear}
              onChange={setSelectedYear}
              options={years}
              placeholder="년도 선택"
            />

            <Dropdown
              value={selectedMonth}
              onChange={setSelectedMonth}
              options={months}
              placeholder="월 선택"
            />
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {/* Day Headers */}
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div
                key={index}
                className={`py-2 font-medium ${
                  index === 0 ? "text-red-500" : "text-gray-600"
                }`}
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {days.map((day, index) => (
              <div key={index} className="py-1">
                {day && (
                  <button
                    onClick={() => handleDateSelect(day)}
                    className={cn(
                      "w-8 h-8 rounded-full text-sm transition-colors",
                      isSelected(day)
                        ? "bg-red-600 text-white"
                        : isToday(day)
                        ? "bg-red-100 text-red-600"
                        : "hover:bg-gray-100 text-gray-700"
                    )}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 확인 버튼 */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 pb-2 pt-4 cursor-pointer text-sm text-gray-600 border-t w-full border-neutral-200"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;

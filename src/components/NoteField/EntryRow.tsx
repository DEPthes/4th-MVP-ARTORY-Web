import React from "react";
import DeleteIcon from "../../assets/delete.svg?react";

interface EntryRowProps {
  year: string;
  text: string;
  onYearChange: (year: string) => void;
  onTextChange: (text: string) => void;
  onRegister: () => void;
  onDelete: () => void;
  isRegistered: boolean;
  placeholder?: string;
}

const years = Array.from({ length: 20 }, (_, i) => (2025 - i).toString());

const EntryRow: React.FC<EntryRowProps> = ({
  year,
  text,
  onYearChange,
  onTextChange,
  onRegister,
  onDelete,
  isRegistered,
  placeholder = "내용을 입력하세요",
}) => {
  const selectTextColorClass = year ? "text-zinc-900" : "text-zinc-500";
  const inputTextColorClass = text ? "text-zinc-900" : "text-zinc-500";

  return (
    <div className="flex items-center space-x-3">
      <select
        value={year}
        onChange={(e) => onYearChange(e.target.value)}
        className={`w-23.5 h-13.5 font-asta font-medium rounded-md px-7 py-4 bg-[#EAEBED] ${selectTextColorClass} appearance-none cursor-pointer focus:outline-none`}
      >
        <option value="" disabled>
          yyyy
        </option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={placeholder}
        className={`font-asta font-thin w-206.5 h-13.5 bg-[#F4F5F6] rounded-md px-5.5 py-4 ${inputTextColorClass} cursor-pointer focus:outline-none`}
      />
      {isRegistered ? (
        <button
          onClick={onDelete}
          className="flex justify-center items-center w-19 h-13.5 p-2 cursor-pointer"
        >
          <DeleteIcon />
        </button>
      ) : (
        <button
          onClick={onRegister}
          disabled={!year || !text}
          className={`font-asta font-medium flex justify-center items-center w-19 h-13.5 px-6 py-4 rounded-md cursor-pointer ${
            year && text
              ? "bg-[#1D1E20] text-white"
              : "bg-[#909193] text-white cursor-not-allowed"
          }`}
        >
          등록
        </button>
      )}
    </div>
  );
};

export default EntryRow;

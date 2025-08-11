import React from "react";
import { cn } from "../../utils/classname";

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  className = "",
}) => {
  const handleChange = () => {
    onChange(!checked);
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="sr-only"
        />
        <div
          className={cn(
            "rounded-[0.3rem] border-2 flex items-center justify-center transition-all cursor-pointer",
            checked
              ? "bg-red-600 border-red-600"
              : "bg-neutral-200 border-neutral-200",
            className || "size-6"
          )}
          onClick={handleChange}
        >
          {checked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
            >
              <path
                d="M2 10.1004L8.15833 16.1004L18 4.90039"
                stroke="white"
                strokeWidth="1.8"
              />
            </svg>
          )}
        </div>
      </div>
      {label && (
        <label
          className="text-nowrap font-light text-zinc-900"
          onClick={handleChange}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;

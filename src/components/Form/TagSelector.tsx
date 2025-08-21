import Chip from "../Chip";

interface TagSelectorProps {
  label?: string;
  options: string[];
  value: string[]; // 현재 선택된 태그들
  onChange: (next: string[]) => void; // 선택 변경
  required?: boolean;
  selectMode?: "multi" | "single";
  className?: string;
}

export default function TagSelector({
  label = "작품 태그",
  options,
  value,
  onChange,
  required = true,
  selectMode = "single",
  className,
}: TagSelectorProps) {
  const toggle = (opt: string) => {
    if (selectMode === "single") {
      onChange(value.includes(opt) ? [] : [opt]);
    } else {
      const set = new Set(value);
      set.has(opt) ? set.delete(opt) : set.add(opt);
      onChange(Array.from(set));
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center">
        <label className="block mr-6 font-asta text-xl font-semibold">
          {label}
          {required && <span className="text-red-600">*</span>}
        </label>
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              isActive={value.includes(opt)}
              onClick={() => toggle(opt)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

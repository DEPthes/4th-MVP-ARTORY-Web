export default function TextInput({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block font-asta text-xl font-semibold">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      <input
        className="w-full mt-3.5 rounded-md bg-gray-100 px-5.5 py-4 outline-none font-light text-zinc-900 "
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

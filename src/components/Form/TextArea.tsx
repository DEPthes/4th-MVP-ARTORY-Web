export default function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block font-asta text-xl font-semibold">{label}</label>
      <textarea
        className="w-full min-h-184 mt-3.5 rounded-md bg-gray-100 px-5.5 py-4 outline-none font-light text-zinc-900 resize-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

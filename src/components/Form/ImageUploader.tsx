import { useRef } from "react";
import type { UploadedImage } from "../../types/post";
import ImgPlusIcon from "../../assets/imgPlus.svg?react";

export default function ImageUploader({
  value,
  onChange,
  max,
}: {
  value: UploadedImage[];
  onChange: (v: UploadedImage[]) => void;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next = [...value];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      next.push({
        id: crypto.randomUUID(),
        file,
        url,
        isCover: next.length === 0,
      });
    });
    onChange(next);
  };

  const setCover = (id: string) =>
    onChange(value.map((v) => ({ ...v, isCover: v.id === id })));

  const remove = (id: string) => {
    const target = value.find((v) => v.id === id);
    if (!target) return;
    if (target.isCover) return; // 대표는 삭제 금지
    onChange(value.filter((v) => v.id !== id));
  };

  return (
    <div>
      <label className="block mb-3.5 font-asta text-xl font-semibold">
        작품 이미지/링크<span className="text-red-600">*</span>
      </label>
      <div className="grid grid-cols-4 gap-5">
        {value.map((img) => (
          <div
            key={img.id}
            className={`relative w-56 h-70.5 overflow-hidden ${
              img.isCover ? "border-[2px] border-[#D32F2F]" : "border-none"
            }`}
          >
            <img src={img.url} className="h-full w-full object-cover" />
            {img.isCover && (
              <span className="absolute left-0 top-0 bg-[#D32F2F] px-4 py-2 text-md text-white">
                대표
              </span>
            )}
            {!img.isCover && (
              <button
                type="button"
                className="absolute left-1 bottom-1 rounded bg-black/40 px-2 py-0.5 text-xs text-white"
                onClick={() => setCover(img.id)}
              >
                대표로
              </button>
            )}
            {!img.isCover && (
              <button
                type="button"
                className="absolute right-1 top-1 rounded bg-black/40 px-2 py-0.5 text-xs text-white"
                onClick={() => remove(img.id)}
              >
                삭제
              </button>
            )}
          </div>
        ))}
        {(!max || value.length < max) && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-56 h-70.5 items-center justify-center bg-gray-200"
          >
            <ImgPlusIcon />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />
    </div>
  );
}

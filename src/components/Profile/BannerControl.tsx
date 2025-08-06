import React, { useRef, useState } from "react";
import { cn } from "../../utils/classname";
import BannerEditIcon from "../../assets/bannerEdit.svg?react";
import ResetIcon from "../../assets/bannerReset.svg?react";
import DefaultBanner from "../../assets/images/Banner.png";

const BannerControl: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>(DefaultBanner);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      // 필요하면 여기서 서버 업로드 로직 등 추가
    }
  };

  const handleResetClick = () => {
    setImageUrl(DefaultBanner);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const buttonBaseClasses =
    "flex items-center justify-center h-11 rounded-md font-asta font-bold bg-[#242121]/60 text-white border border-zinc-400 cursor-pointer";

  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt="배너 사진"
        className="w-full h-60 object-cover"
      />

      <div className="absolute bottom-10 right-9 flex gap-4">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          className={cn(buttonBaseClasses, "px-4 py-2.5")}
          onClick={handleEditClick}
          type="button"
        >
          <BannerEditIcon className="mr-1.5 size-4.5" />
          배너 사진 편집
        </button>

        <button
          className={cn(buttonBaseClasses, "px-4 py-2.5")}
          onClick={handleResetClick}
          type="button"
        >
          <ResetIcon className="size-4.5" />
        </button>
      </div>
    </div>
  );
};

export default BannerControl;

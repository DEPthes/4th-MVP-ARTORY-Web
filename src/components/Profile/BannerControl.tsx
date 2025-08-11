import React, { useRef, useState, useEffect } from "react";
import { cn } from "../../utils/classname";
import BannerEditIcon from "../../assets/bannerEdit.svg?react";
import ResetIcon from "../../assets/bannerReset.svg?react";
import DefaultBanner from "../../assets/images/Banner.png";

interface BannerControlProps {
  isMyProfile: boolean;
  initialBannerUrl?: string; // 사용자가 원래 설정한 배너 URL (선택적 prop)
  className?: string;
}

const BannerControl: React.FC<BannerControlProps> = ({
  isMyProfile,
  initialBannerUrl,
}) => {
  // 현재 표시될 이미지 URL 상태 (초기값은 initialBannerUrl 또는 DefaultBanner)
  const [imageUrl, setImageUrl] = useState<string>(
    initialBannerUrl || DefaultBanner
  );
  // 사용자가 임시로 선택한 파일이 있는지 여부를 추적 (object-fit 로직 위함)
  const [hasUserSelectedFile, setHasUserSelectedFile] = useState(false);

  // initialBannerUrl이 외부에서 변경될 때 imageUrl을 초기화
  useEffect(() => {
    setImageUrl(initialBannerUrl || DefaultBanner);
    setHasUserSelectedFile(false); // 외부 URL 변경 시 사용자 선택 파일 플래그 초기화
  }, [initialBannerUrl]); // initialBannerUrl이 바뀔 때마다 실행

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setHasUserSelectedFile(true);
      // 필요하면 여기서 서버 업로드 로직 등 추가
    }
  };

  const handleResetClick = () => {
    setImageUrl(DefaultBanner);
    setHasUserSelectedFile(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const buttonBaseClasses =
    "flex items-center justify-center h-11 rounded-md font-asta font-bold bg-[#242121]/60 text-white border border-zinc-400 cursor-pointer";

  const objectFitClass = hasUserSelectedFile ? "object-fill" : "object-cover";

  return (
    <div className="relative overflow-hidden">
      <img
        src={imageUrl}
        alt="배너 사진"
        className={cn("w-full h-60", objectFitClass)}
      />

      {/* isMyProfile이 true일 때만 편집/리셋 버튼을 감싸는 div 렌더링 */}
      {isMyProfile && (
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
      )}
    </div>
  );
};

export default BannerControl;

import React, { useRef, useState, useEffect } from "react";
import { cn } from "../../utils/classname";
import BannerEditIcon from "../../assets/bannerEdit.svg?react";
import ResetIcon from "../../assets/bannerReset.svg?react";
import DefaultBanner from "../../assets/images/Banner.png";
import { changeCover } from "../../apis/user";

interface BannerControlProps {
  isMyProfile: boolean;
  initialBannerUrl?: string; // 사용자가 원래 설정한 배너 URL (선택적 prop)
  className?: string;
  viewerGoogleID?: string; // 현재 로그인한 사용자의 Google ID
  onCoverChange?: () => void; // 커버 변경 후 호출할 콜백
}

const BannerControl: React.FC<BannerControlProps> = ({
  isMyProfile,
  initialBannerUrl,
  viewerGoogleID,
  onCoverChange,
}) => {
  // 현재 표시될 이미지 URL 상태 (초기값은 initialBannerUrl 또는 DefaultBanner)
  const [imageUrl, setImageUrl] = useState<string>(
    initialBannerUrl || DefaultBanner
  );
  // API 호출 중인지 추적
  const [isUpdating, setIsUpdating] = useState(false);
  // 원래 배너 URL 저장 (되돌리기용)
  const [originalBannerUrl, setOriginalBannerUrl] = useState<string>(
    initialBannerUrl || DefaultBanner
  );

  // initialBannerUrl이 외부에서 변경될 때 imageUrl을 초기화
  useEffect(() => {
    const newUrl = initialBannerUrl || DefaultBanner;
    setImageUrl(newUrl);
    setOriginalBannerUrl(newUrl);
  }, [initialBannerUrl]); // initialBannerUrl이 바뀔 때마다 실행

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      // 파일 유효성 검사
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB 제한
        alert("파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      // 로컬 미리보기 설정
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageUrl(result);
      };
      reader.readAsDataURL(file);

      // 커버 이미지 변경 API 호출
      if (viewerGoogleID && isMyProfile) {
        try {
          setIsUpdating(true);

          // File 객체를 직접 전달
          await changeCover(viewerGoogleID, file);
          console.log("커버 이미지 변경 성공");

          // 성공 시 원래 URL 업데이트 (로컬 미리보기 URL 사용)
          const localUrl = URL.createObjectURL(file);
          setOriginalBannerUrl(localUrl);

          // 부모 컴포넌트에 변경 알림
          if (onCoverChange) {
            onCoverChange();
          }
        } catch (error) {
          console.error("커버 이미지 변경 실패:", error);
          alert("커버 이미지 변경에 실패했습니다.");
          // 실패 시 이전 상태로 되돌리기
          setImageUrl(originalBannerUrl);
        } finally {
          setIsUpdating(false);
        }
      }
    }
  };

  const handleResetClick = async () => {
    if (!isMyProfile) return;

    // API 호출 없이, 로컬에서 기본 배너로 되돌리기
    setImageUrl(DefaultBanner);
    setOriginalBannerUrl(DefaultBanner);

    // 파일 입력값 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const buttonBaseClasses =
    "flex items-center justify-center h-11 rounded-md font-asta font-bold bg-[#242121]/60 text-white border border-zinc-400 cursor-pointer";

  const objectFitClass = "object-cover";

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
            className={cn(
              buttonBaseClasses,
              "px-4 py-2.5",
              isUpdating && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleEditClick}
            type="button"
            disabled={isUpdating}
          >
            <BannerEditIcon className="mr-1.5 size-4.5" />
            {isUpdating ? "업로드 중..." : "배너 사진 편집"}
          </button>

          <button
            className={cn(
              buttonBaseClasses,
              "px-4 py-2.5",
              isUpdating && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleResetClick}
            type="button"
            disabled={isUpdating}
          >
            <ResetIcon className="size-4.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BannerControl;

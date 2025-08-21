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
  // 실패 롤백용 현재 표시 중인 배너 URL 스냅샷
  const [originalBannerUrl, setOriginalBannerUrl] = useState<string>(
    initialBannerUrl || DefaultBanner
  );
  // 되돌리기 대상: 최초(또는 부모 변경 반영 후) 배너 URL 보관
  const initialUrlRef = useRef<string>(initialBannerUrl || DefaultBanner);
  // 세션 내 업로드 파일 히스토리 (직전 파일 보관)
  const lastUploadedFileRef = useRef<File | null>(null);
  const prevUploadedFileRef = useRef<File | null>(null);

  // initialBannerUrl이 외부에서 변경될 때 imageUrl과 참조 초기화
  useEffect(() => {
    const newUrl = initialBannerUrl || DefaultBanner;
    setImageUrl(newUrl);
    setOriginalBannerUrl(newUrl);
    initialUrlRef.current = newUrl;
    // 초기화 시 파일 히스토리도 리셋
    lastUploadedFileRef.current = null;
    prevUploadedFileRef.current = null;
  }, [initialBannerUrl]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  // URL을 File로 변환 (동일 출처 자원에만 사용)
  const urlToFile = async (
    url: string,
    fallbackName = "banner.jpg"
  ): Promise<File> => {
    // 개발 환경에서 S3 CORS 우회: 절대 URL은 가져오지 않음 (세션 파일 또는 기본 배너만 사용)
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    const fileName = (() => {
      try {
        const u = new URL(url);
        const last = u.pathname.split("/").pop() || fallbackName;
        return last.includes(".") ? last : fallbackName;
      } catch {
        return fallbackName;
      }
    })();
    const type = blob.type || "image/jpeg";
    return new File([blob], fileName, { type });
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

          // 서버 업로드 전, 이전 파일 스냅샷 저장
          prevUploadedFileRef.current = lastUploadedFileRef.current;
          lastUploadedFileRef.current = file;

          // File 객체를 직접 전달
          await changeCover(viewerGoogleID, file);
          console.log("커버 이미지 변경 성공");

          // 실패 롤백 기준은 현재 표시 중인 최신 URL로 갱신
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
          // 업로드 실패 시 파일 히스토리 롤백
          lastUploadedFileRef.current = prevUploadedFileRef.current;
        } finally {
          setIsUpdating(false);
        }
      }
    }
  };

  const handleResetClick = async () => {
    if (!viewerGoogleID || !isMyProfile) return;

    try {
      setIsUpdating(true);
      let fileToUpload: File | null = null;

      // 1) 세션 내 직전 업로드 파일이 있으면 그걸 사용
      if (prevUploadedFileRef.current) {
        fileToUpload = prevUploadedFileRef.current;
      } else {
        // 2) 없으면 기본 배너를 파일로 변환해 업로드 (동일 출처라 fetch 가능)
        fileToUpload = await urlToFile(DefaultBanner);
      }

      await changeCover(viewerGoogleID, fileToUpload);

      // 화면과 기준 URL 갱신
      const localUrl = URL.createObjectURL(fileToUpload);
      setImageUrl(localUrl);
      setOriginalBannerUrl(localUrl);

      // 파일 입력값 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // 업로드 이후, 최신 파일 상태 갱신 (되돌리기 한 번만 지원)
      lastUploadedFileRef.current = fileToUpload;
      prevUploadedFileRef.current = null;

      // 부모 컴포넌트에 변경 알림
      if (onCoverChange) {
        onCoverChange();
      }
    } catch (error) {
      console.error("커버 이미지 되돌리기 실패:", error);
      alert("커버 이미지를 되돌리는 중 오류가 발생했습니다.");
    } finally {
      setIsUpdating(false);
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

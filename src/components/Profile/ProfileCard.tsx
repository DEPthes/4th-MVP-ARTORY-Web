import { cn } from "../../utils/classname";
import UserActionButton from "../Profile/UserActionButton";
import BaseProfileImage from "../../assets/images/BaseProfileImage.png";
import { useState, useRef } from "react";
import EditIcon from "../../assets/editIcon.svg";

interface ProfileCardProps {
  role: string;
  nickName: string;
  image?: string;
  followers?: number;
  following?: number;
  introduction?: string;
  birthdate?: string;
  education?: string;
  phoneNumber: string;
  email?: string;
  className?: string;
  isHorizontal?: boolean;
  onImageChange?: (file: File) => void;
  onClick?: () => void;
  isMyProfile: boolean;
  onEditClick?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  role,
  nickName,
  image,
  followers,
  following,
  introduction,
  birthdate,
  education,
  phoneNumber,
  email,
  className,
  isHorizontal = false,
  onImageChange,
  onClick,
  isMyProfile,
  onEditClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지가 없거나 빈 문자열이거나 로딩 실패 시 기본 이미지 사용
  const profileImage =
    localImage ||
    (image && image.trim() !== "" && !imageError ? image : BaseProfileImage);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLocalImage(result);
        if (onImageChange) {
          onImageChange(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  // 팔로우 상태 예시 (실제론 API 연동 필요)
  const [isFollowing, setIsFollowing] = useState(false);

  // 팔로우/팔로잉 토글 함수
  const toggleFollow = () => {
    setIsFollowing((prev) => !prev);
    // 서버 로직 추가
  };

  // 가로 모드일 때의 레이아웃
  if (isHorizontal) {
    return (
      <div
        className={cn(
          "flex flex-col w-full border-t-2 py-8 border-red-600 hover:bg-red-50",
          onClick && "cursor-pointer",
          className
        )}
        onClick={onClick}
      >
        {/* 빨간 줄 */}

        <div className="flex relative items-start gap-7">
          {/* 왼쪽 프로필 이미지 */}
          <div className="relative">
            <img
              src={profileImage}
              alt={nickName}
              className="size-37.5 rounded-full flex-shrink-0"
              onError={handleImageError}
            />
            {/* 수정 버튼 */}
            {isMyProfile && (
              <button
                onClick={handleEditClick}
                className="absolute bottom-2 right-2 bg-red-500 rounded-full p-2 cursor-pointer"
              >
                <img src={EditIcon} alt="edit" className="size-4 text-white" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* 오른쪽 정보 */}
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center text-lg  gap-2">
              <div className="text-zinc-500">{role}</div>
              <div className="font-semibold text-zinc-900">{nickName}</div>
            </div>

            <div className="flex flex-col gap-1 text-xs font-light text-zinc-900">
              <div>{phoneNumber}</div>
              <div>{email}</div>
            </div>

            <div className="text-sm font-light text-zinc-900 break-words pr-8">
              {introduction}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 세로 모드 (기존 레이아웃)
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-56",
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col gap-6 items-center w-full pb-12">
        <div className="relative">
          <img
            src={profileImage}
            alt={nickName}
            className="size-40 rounded-full"
            onError={handleImageError}
          />
          {/* 수정 버튼 */}
          {isMyProfile && (
            <button
              onClick={handleEditClick}
              className="absolute bottom-2 right-2 bg-[#D32F2F] rounded-full p-2 cursor-pointer"
            >
              <img src={EditIcon} alt="edit" className="size-fit" />
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <div className="flex flex-col gap-2 items-center text-center">
          <div className="text-lg text-zinc-500">{role}</div>
          <div className="text-xl font-semibold text-zinc-900">{nickName}</div>
        </div>
        <div className="flex items-center gap-5 font-light text-zinc-500">
          <div>
            팔로워{" "}
            <span className="font-medium text-zinc-900">{followers}</span>
          </div>
          <div>
            팔로잉{" "}
            <span className="font-medium text-zinc-900">{following}</span>
          </div>
        </div>
        {/* 내 프로필이면 편집 버튼, 아니면 팔로우/팔로잉 버튼 */}
        {isMyProfile ? (
          <UserActionButton
            type="edit"
            className="w-full"
            onClick={onEditClick}
          />
        ) : (
          <UserActionButton
            type={isFollowing ? "following" : "follow"}
            className="w-full"
            onClick={toggleFollow}
          />
        )}
        <div className="font-light text-zinc-900 text-center break-words px-3">
          {introduction}
        </div>
      </div>

      <div className="flex flex-col text-left gap-4 font-light w-full pt-2 pb-12 border-t border-zinc-400">
        <div className="text-zinc-400 text-xs">INFORMATION</div>
        <div className="flex flex-col gap-2 px-3 items-start">
          <div className="text-zinc-900 text-center break-words">
            {birthdate}
          </div>
          <div className="text-zinc-900 text-center break-words">
            {education}
          </div>
        </div>
      </div>
      <div className="flex flex-col text-left gap-4 font-light w-full pt-2 pb-12 border-t border-zinc-400">
        <div className="text-zinc-400 text-xs">CONTACT</div>
        <div className="flex flex-col gap-2 px-3 items-start">
          <div className="text-zinc-900 text-center break-words">
            {phoneNumber}
          </div>
          <div className="text-zinc-900 text-center break-words">{email}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

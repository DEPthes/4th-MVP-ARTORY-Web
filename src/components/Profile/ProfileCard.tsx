import { cn } from "../../utils/classname";
import UserActionButton from "../Button/UserActionButton";
import BaseProfileImage from "../../assets/images/BaseProfileImage.png";
import { useState } from "react";

interface ProfileCardProps {
  role: string;
  nickName: string;
  image?: string;
  followers: number;
  following: number;
  introduction: string;
  birthdate: string;
  education: string;
  phoneNumber: string;
  email: string;
  className?: string;
  isHorizontal?: boolean;
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
}) => {
  const [imageError, setImageError] = useState(false);

  // 이미지가 없거나 빈 문자열이거나 로딩 실패 시 기본 이미지 사용
  const profileImage =
    image && image.trim() !== "" && !imageError ? image : BaseProfileImage;

  const handleImageError = () => {
    setImageError(true);
  };

  // 가로 모드일 때의 레이아웃
  if (isHorizontal) {
    return (
      <div
        className={cn(
          "flex flex-col w-full border-t-2 py-8 border-red-600",
          className
        )}
      >
        {/* 빨간 줄 */}

        <div className="flex items-start gap-7">
          {/* 왼쪽 프로필 이미지 */}
          <img
            src={profileImage}
            alt={nickName}
            className="size-37.5 rounded-full flex-shrink-0"
            onError={handleImageError}
          />

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
        className
      )}
    >
      <div className="flex flex-col gap-6 items-center w-full pb-12">
        <img
          src={profileImage}
          alt={nickName}
          className="size-40 rounded-full"
          onError={handleImageError}
        />

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
        <UserActionButton className="w-full" />
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

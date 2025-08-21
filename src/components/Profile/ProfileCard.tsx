import { cn } from "../../utils/classname";
import UserActionButton from "../Profile/UserActionButton";
import BaseProfileImage from "../../assets/images/BaseProfileImage.png";
import { useState, useRef, useEffect } from "react";
import EditIcon from "../../assets/editIcon.svg";
import { changeProfile } from "../../apis/user";
import { useQuery } from "@tanstack/react-query";
import {
  getFollowers,
  getFollowing,
  type FollowUserSummary,
} from "../../apis/follow";

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
  initialIsFollowed?: boolean;
  viewerGoogleID?: string; // 추가: 현재 로그인한 사용자의 Google ID
  userIdForFollowList?: string; // 팔로워/팔로잉 조회 대상 ID
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
  initialIsFollowed,
  viewerGoogleID, // 추가
  userIdForFollowList,
}) => {
  const [imageError, setImageError] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지가 없거나 빈 문자열이거나 로딩 실패 시 기본 이미지 사용
  const profileImage =
    localImage ||
    (image && image.trim() !== "" && !imageError ? image : BaseProfileImage);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLocalImage(result);
    };
    reader.readAsDataURL(file);

    if (viewerGoogleID && isMyProfile) {
      try {
        setIsUpdating(true);
        await changeProfile(viewerGoogleID, file);
        if (onImageChange) onImageChange(file);
      } catch (error) {
        console.error("프로필 이미지 변경 실패:", error);
        alert("프로필 이미지 변경에 실패했습니다.");
        setLocalImage(null);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleEditClick = () => {
    if (!viewerGoogleID) {
      alert("로그인이 필요합니다.");
      return;
    }
    fileInputRef.current?.click();
  };

  const [isFollowing, setIsFollowing] = useState<boolean>(
    initialIsFollowed ?? false
  );
  useEffect(() => {
    setIsFollowing(initialIsFollowed ?? false);
  }, [initialIsFollowed]);

  const toggleFollow = () => {
    setIsFollowing((prev) => !prev);
    // TODO: 서버 연동 추가
  };

  const targetUserId = userIdForFollowList;
  const { data: followersList, isLoading: isFollowersLoading } = useQuery<
    FollowUserSummary[]
  >({
    queryKey: ["followers", targetUserId],
    queryFn: () => getFollowers(viewerGoogleID!, targetUserId!),
    enabled: !!viewerGoogleID && !!targetUserId,
  });
  const { data: followingList, isLoading: isFollowingLoading } = useQuery<
    FollowUserSummary[]
  >({
    queryKey: ["following", targetUserId],
    queryFn: () => getFollowing(viewerGoogleID!, targetUserId!),
    enabled: !!viewerGoogleID && !!targetUserId,
  });

  const [hovered, setHovered] = useState<null | "followers" | "following">(
    null
  );
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openPopover = (type: "followers" | "following") => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setHovered(type);
  };
  const closePopoverDelayed = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setHovered(null), 150);
  };
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

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
        <div className="flex relative items-start gap-7">
          <div className="relative">
            <img
              src={profileImage}
              alt={nickName}
              className="size-37.5 rounded-full flex-shrink-0 object-cover"
              onError={handleImageError}
            />
            {isMyProfile && (
              <button
                onClick={handleEditClick}
                disabled={isUpdating}
                className="absolute bottom-2 right-2 bg-red-500 rounded-full p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center text-lg gap-2">
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
            className="size-40 rounded-full object-cover"
            onError={handleImageError}
          />
          {isMyProfile && (
            <button
              onClick={handleEditClick}
              disabled={isUpdating}
              className="absolute bottom-2 right-2 bg-[#D32F2F] rounded-full p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div
            className="relative"
            onMouseEnter={() => openPopover("followers")}
            onMouseLeave={closePopoverDelayed}
          >
            팔로워{" "}
            <span className="font-medium text-zinc-900">{followers}</span>
            {hovered === "followers" && (
              <div
                className="absolute -left-9 mt-2 w-30 bg-gray-100 border border-stone-300 rounded-md shadow-lg z-20"
                onMouseEnter={() => openPopover("followers")}
                onMouseLeave={closePopoverDelayed}
              >
                {isFollowersLoading ? (
                  <div className="px-3 py-2 text-sm text-zinc-500">
                    불러오는 중...
                  </div>
                ) : followersList && followersList.length > 0 ? (
                  <ul className="max-h-48 overflow-auto">
                    {followersList.map((u) => (
                      <li
                        key={u.id}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50"
                      >
                        <img
                          src={u.profileImageUrl || BaseProfileImage}
                          alt={u.name}
                          className="w-6 h-6 rounded-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              BaseProfileImage;
                          }}
                        />
                        <span className="text-sm text-zinc-800">{u.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-3 py-2 text-sm text-zinc-500">
                    팔로워 없음
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => openPopover("following")}
            onMouseLeave={closePopoverDelayed}
          >
            팔로잉{" "}
            <span className="font-medium text-zinc-900">{following}</span>
            {hovered === "following" && (
              <div
                className="absolute -left-5 mt-2 w-30 bg-gray-100 border border-stone-300 rounded-md shadow-lg z-20"
                onMouseEnter={() => openPopover("following")}
                onMouseLeave={closePopoverDelayed}
              >
                {isFollowingLoading ? (
                  <div className="px-3 py-2 text-sm text-zinc-500">
                    불러오는 중...
                  </div>
                ) : followingList && followingList.length > 0 ? (
                  <ul className="max-h-48 overflow-auto">
                    {followingList.map((u) => (
                      <li
                        key={u.id}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50"
                      >
                        <img
                          src={u.profileImageUrl || BaseProfileImage}
                          alt={u.name}
                          className="w-6 h-6 rounded-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              BaseProfileImage;
                          }}
                        />
                        <span className="text-sm text-zinc-800">{u.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-3 py-2 text-sm text-zinc-500">
                    팔로잉 없음
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

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
          {education ? (
            <div className="text-zinc-900 text-center break-words">
              {education}
            </div>
          ) : null}
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

import { cn } from "../../utils/classname";
import UserActionButton from "../Profile/UserActionButton";
import BaseProfileImage from "../../assets/images/BaseProfileImage.png";
import { useState, useRef, useEffect } from "react";
import EditIcon from "../../assets/editIcon.svg";
import { changeProfile } from "../../apis/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFollowers,
  getFollowing,
  followUser,
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
  showEditControls?: boolean; // 편집 UI 노출 여부 (디폴트 true)
  useNoneAction?: boolean; // 액션 버튼을 none으로 강제 (디폴트 false)
  galleryLocation?: string; // 추가: 갤러리 위치 (갤러리 사용자일 때만 사용)
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
  userIdForFollowList, // 팔로워/팔로잉 조회 대상 ID
  showEditControls = true,
  useNoneAction = false,
  galleryLocation, // 추가
}) => {
  const [imageError, setImageError] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지가 없거나 빈 문자열이거나 로딩 실패 시 기본 이미지 사용
  const profileImage =
    localImage ||
    (image && image.trim() !== "" && !imageError ? image : BaseProfileImage);

  // 디버깅을 위한 로그
  useEffect(() => {
    if (image) {
      console.log("🖼️ ProfileCard 이미지 설정:", {
        image,
        imageTrimmed: image.trim(),
        imageError,
        finalProfileImage: profileImage,
      });
    }
  }, [image, imageError, profileImage]);

  const handleImageError = () => {
    console.error("🖼️ 이미지 로드 실패:", image);
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

        // 이미지 업로드 성공 후 부모 컴포넌트에 알림
        if (onImageChange) onImageChange(file);

        // 추가적인 캐시 무효화를 위해 부모 컴포넌트의 핸들러 호출
        console.log("✅ 프로필 이미지 업로드 성공 - 캐시 무효화 필요");
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
    if (!viewerGoogleID || !showEditControls) {
      return;
    }
    // 이미지 편집 버튼은 항상 이미지 변경만 수행
    fileInputRef.current?.click();
  };

  const [isFollowing, setIsFollowing] = useState<boolean>(
    initialIsFollowed ?? false
  );
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [localFollowers, setLocalFollowers] = useState<number | undefined>(
    followers
  );
  const [localFollowing, setLocalFollowing] = useState<number | undefined>(
    following
  );
  const queryClient = useQueryClient();

  // 팔로우 상태는 초기에 false로 시작하고, 팔로우/언팔로우 API 응답으로 업데이트

  // 초기 팔로우 상태 설정 (initialIsFollowed prop 사용)
  useEffect(() => {
    console.log("🔍 ProfileCard 초기 팔로우 상태 설정:", {
      artistId: userIdForFollowList,
      isMyProfile,
      initialIsFollowed,
      finalState: initialIsFollowed ?? false,
      willShowFollowButton: !isMyProfile && !(initialIsFollowed ?? false),
      willShowFollowingButton: !isMyProfile && (initialIsFollowed ?? false),
    });
    setIsFollowing(initialIsFollowed ?? false);
  }, [initialIsFollowed, userIdForFollowList, isMyProfile]);

  // followers/following props가 변경될 때 localFollowers/localFollowing 업데이트
  useEffect(() => {
    setLocalFollowers(followers);
  }, [followers]);

  useEffect(() => {
    setLocalFollowing(following);
  }, [following]);

  const toggleFollow = async () => {
    if (!viewerGoogleID || !userIdForFollowList || isMyProfile) return;

    try {
      setIsFollowLoading(true);
      // 팔로우/언팔로우는 같은 엔드포인트로 POST 요청
      const response = await followUser(viewerGoogleID, userIdForFollowList);

      // API 응답의 following 필드로 상태 업데이트
      setIsFollowing(response.following);

      // 팔로우 상태만 업데이트, 숫자는 서버에서 관리

      // 팔로우/언팔로우 후 관련된 모든 쿼리 무효화
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            // 팔로워/팔로잉 관련 쿼리들
            (Array.isArray(queryKey) && queryKey[0] === "followers") ||
            (Array.isArray(queryKey) && queryKey[0] === "following") ||
            // 사용자 프로필 관련 쿼리들
            (Array.isArray(queryKey) && queryKey[0] === "userProfile") ||
            // 사이드바 프로필 관련 쿼리들
            (Array.isArray(queryKey) && queryKey[0] === "sidebarProfile")
          );
        },
      });

      // 팔로워 수만 즉시 업데이트 (대상 사용자의 팔로워 수)
      if (localFollowers !== undefined) {
        const newFollowerCount = response.following
          ? (localFollowers || 0) + 1
          : (localFollowers || 0) - 1;
        setLocalFollowers(newFollowerCount);
      }

      // 팔로잉 수는 변경하지 않음 (현재 사용자의 팔로잉 수는 별도 관리)
      // 팔로잉 수는 부모 컴포넌트에서 관리하거나 별도 API로 조회

      console.log("🔄 팔로우 상태 변경:", {
        targetUserId: response.targetUserId,
        following: response.following,
        followerCount: response.targetFollowerCount,
        cacheInvalidated: true,
      });
    } catch (error) {
      console.error("팔로우 토글 실패:", error);
      alert("팔로우 상태 변경에 실패했습니다.");
    } finally {
      setIsFollowLoading(false);
    }
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
            {showEditControls && isMyProfile && !isHorizontal && (
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
          {showEditControls && isMyProfile && (
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
            <span className="font-medium text-zinc-900">{localFollowers}</span>
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
            <span className="font-medium text-zinc-900">{localFollowing}</span>
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

        {(() => {
          // useNoneAction이 true면 none 버튼, 아니면 기존 로직
          if (useNoneAction) {
            return (
              <UserActionButton
                type="none"
                className="w-full"
                disabled={true}
              />
            );
          }

          return isMyProfile ? (
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
              isLoading={isFollowLoading}
            />
          );
        })()}

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
          {/* 갤러리 사용자일 때만 갤러리 위치 표시 */}
          {role === "갤러리" && galleryLocation && (
            <div className="text-zinc-900 text-center break-words">
              📍 {galleryLocation}
            </div>
          )}
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

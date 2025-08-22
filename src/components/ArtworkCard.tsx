import React, { useState, useEffect } from "react";
import { cn } from "../utils/classname";
import LikeIcon from "../assets/like.svg?react";

export interface ArtworkCardProps {
  imageUrl: string;
  title: string;
  author?: string;
  likes?: number;
  liked?: boolean;
  isArchived?: boolean;
  onToggleLike?: () => void;
  onToggleArchive?: () => void;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
  showArchiveToggle?: boolean; // 더 이상 사용하지 않음
  isDetailPage?: boolean; // 상세페이지 여부를 나타내는 prop 추가
}

const variantClasses = {
  primary: "bg-white",
  secondary: "bg-gray-100",
};

const ArtworkCard: React.FC<ArtworkCardProps> = ({
  imageUrl,
  title,
  author,
  likes = 0,
  liked,
  isArchived = false,
  onToggleLike,
  onToggleArchive,
  onClick,
  className,
  variant = "secondary",
  isDetailPage = false, // 기본값은 false (바깥 카드)
}) => {
  // props의 상태를 기반으로 초기값 설정
  const [localLiked, setLocalLiked] = useState(liked ?? isArchived);

  // props가 변경될 때마다 로컬 상태 동기화
  useEffect(() => {
    setLocalLiked(liked ?? isArchived);
  }, [liked, isArchived]);

  // 하트 클릭 시 아카이브 토글 (하트 = 아카이브) - 상세페이지에서만 동작
  const handleLikeClick = () => {
    // 상세페이지가 아닌 경우 토글 불가
    if (!isDetailPage) {
      return;
    }

    // 현재 상태의 반대값으로 토글
    const newLikedState = !localLiked;

    // 로컬 상태 즉시 업데이트
    setLocalLiked(newLikedState);

    // 하트 토글 콜백 호출
    if (onToggleLike) {
      onToggleLike();
    }

    // 아카이브 토글 콜백도 호출 (하트와 아카이브가 동기화되어야 함)
    if (onToggleArchive) {
      onToggleArchive();
    }
  };

  // 아카이브 개수에 따른 색상 결정: 0일 때는 색 없고, 1 이상일 때는 빨간색
  const archiveColor =
    likes > 0 ? "text-red-500 fill-red-500" : "text-gray-400 fill-gray-400";

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col relative items-start w-76 h-124.5 aspect-[302/500] bg-gray-100 rounded-lg cursor-pointer hover:shadow-sm overflow-hidden transition-all duration-300",
        className,
        variantClasses[variant]
      )}
    >
      {/* 상단 이미지 */}
      <div className="flex justify-center w-full items-center pt-3 sm:pt-4 md:pt-5 px-3 sm:px-4 md:px-5 pb-2">
        <div className="w-full h-84 bg-gray-200 rounded overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 작품명 */}
      <div className="flex w-full items-center py-1 sm:pt-2 px-4 sm:px-5 md:px-6">
        <p className="font-semibold text-2xl text-zinc-900 truncate">{title}</p>
      </div>

      {/* 작가명 */}
      {author && (
        <div className="flex items-center py-1 sm:py-2 px-4 sm:px-5 md:px-6">
          <p className="text-lg text-zinc-900">{author}</p>
        </div>
      )}

      {/* 좋아요 (하트) - 아카이브와 동기화 */}
      <div
        className={cn(
          "absolute bottom-3 sm:bottom-4 right-4 sm:right-5 md:right-6 flex items-center gap-1 transition-transform",
          isDetailPage ? "cursor-pointer hover:scale-110" : "cursor-default"
        )}
        onClick={(e) => {
          e.stopPropagation();
          handleLikeClick();
        }}
      >
        <LikeIcon
          className={cn(
            "w-3 h-3 sm:w-4 sm:h-4 transition-colors",
            archiveColor
          )}
        />
        <span className="text-xs sm:text-sm md:text-base text-zinc-900">
          {likes}
        </span>
      </div>
    </div>
  );
};

export default ArtworkCard;

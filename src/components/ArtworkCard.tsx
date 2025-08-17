import React, { useState } from "react";
import { cn } from "../utils/classname";
import LikeIcon from "../assets/like.svg?react";

export interface ArtworkCardProps {
  imageUrl: string;
  title: string;
  author?: string;
  likes?: number;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
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
  onClick,
  className,
  variant = "secondary",
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    console.log("좋아요 클릭");
    setIsLiked(!isLiked);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col relative items-start w-76 h-124.5 aspect-[302/500] bg-gray-100 rounded-lg cursor-pointer hover:shadow-sm transition-all duration-300",
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
      <div className="flex items-center py-1 sm:py-2 px-4 sm:px-5 md:px-6">
        <p className="font-semibold text-2xl text-zinc-900 truncate">{title}</p>
      </div>

      {/* 작가명 */}
      {author && (
        <div className="flex items-center py-1 sm:py-2 px-4 sm:px-5 md:px-6">
          <p className="text-lg text-zinc-900 truncate">{author}</p>
        </div>
      )}

      {/* 좋아요 */}
      <div
        className="absolute bottom-3 sm:bottom-4 right-4 sm:right-5 md:right-6 flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform"
        onClick={(e) => {
          e.stopPropagation();
          handleLikeClick();
        }}
      >
        <LikeIcon
          className={cn(
            "w-3 h-3 sm:w-4 sm:h-4 transition-colors",
            isLiked ? "text-red-500 fill-red-500" : "text-red-500"
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

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
        "flex flex-col relative items-start w-[18.875rem] h-[31.25rem] bg-gray-100 rounded-lg cursor-pointer hover:shadow-sm transition-all duration-300",
        className,
        variantClasses[variant]
      )}
    >
      {/* 상단 이미지 */}
      <div className="flex justify-center items-center pt-5 px-5 pb-2 ">
        <img
          src={imageUrl}
          alt={title}
          className="max-w-65.5 h-[21rem] object-cover bg-gray-200"
        />
      </div>

      {/* 작품명 */}
      <div className="flex items-center py-2 px-6">
        <p className="font-semibold text-2xl text-zinc-900">{title}</p>
      </div>

      {/* 작가명 */}
      {author && (
        <div className="flex items-center py-2 px-6">
          <p className="text-lg text-zinc-900">{author}</p>
        </div>
      )}

      {/* 좋아요 */}
      <div
        className="absolute bottom-4 right-6 flex items-center gap-1 cursor-pointer hover:scale-120 transition-transform"
        onClick={(e) => {
          e.stopPropagation();
          handleLikeClick();
        }}
      >
        <LikeIcon
          className={cn(
            "size-4 transition-colors",
            isLiked ? "text-red-500 fill-red-500" : "text-red-500"
          )}
        />
        <span className="text-zinc-900">{likes}</span>
      </div>
    </div>
  );
};

export default ArtworkCard;

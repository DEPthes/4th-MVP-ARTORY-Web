import React from 'react';
import { cn } from '../utils/classname';
import LikeIcon from '../assets/like.svg?react';

export interface ArtworkCardProps {
  imageUrl: string;
  title: string;
  author?: string;
  likes?: number;
  onClick?: () => void;
  className?: string;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({
  imageUrl,
  title,
  author,
  likes = 0,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex flex-col items-start w-[302px] h-[500px] bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow',
        className
      )}
    >
      {/* 상단 이미지 */}
      <div className="flex justify-center items-center bg-white pt-5 pr-5 pb-2 pl-5 gap-[10px]">
        <img
          src={imageUrl}
          alt={title}
          className="w-[262px] h-[336px] object-cover bg-gray-200"
        />
      </div>

      {/* 작품명 */}
      <div className="flex items-center pt-2 pb-2 pl-6 pr-6">
        <p className="font-semibold text-2xl leading-[30px] text-zinc-900">
          {title}
        </p>
      </div>

      {/* 작가명 */}
      {author && (
        <div className="flex items-center pt-2 pb-2 pl-6 pr-6">
          <p className="text-[18px] leading-6 font-normal text-zinc-900">
            {author}
          </p>
        </div>
      )}

      {/* 좋아요 */}
      <div className="flex justify-end items-center w-full pt-4 pb-4 pl-6 pr-6 space-x-1">
        <LikeIcon className="w-4 h-4 text-red-500" />
        <span className="text-[16px] leading-[22px] text-zinc-900">
          {likes}
        </span>
      </div>
    </div>
  );
};

export default ArtworkCard;

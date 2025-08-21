import React from "react";
import { cn } from "../../utils/classname";
import FollowingIcon from "../../assets/following.svg?react";
import FollowIcon from "../../assets/follow.svg?react";
import ProfileEditIcon from "../../assets/profileEdit.svg?react";

interface UserActionButtonProps {
  type: "following" | "follow" | "edit" | "none";
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const UserActionButton: React.FC<UserActionButtonProps> = ({
  type,
  onClick,
  className = "",
  isLoading = false,
  disabled = false,
}) => {
  const handleClick = () => {
    if (onClick && !isLoading && !disabled) onClick();
  };

  const renderContent = () => {
    const iconClass = "mr-1.5 text-current";

    if (isLoading) {
      return (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1.5"></div>
          처리중...
        </div>
      );
    }

    switch (type) {
      case "follow":
        return (
          <>
            <FollowIcon className={iconClass} />
            팔로우
          </>
        );
      case "following":
        return (
          <>
            <FollowingIcon className={iconClass} />
            팔로잉
          </>
        );
      case "edit":
        return (
          <>
            <ProfileEditIcon className={iconClass} />
            프로필 편집
          </>
        );
      case "none":
        return <p>X</p>;
      default:
        return null;
    }
  };

  // 버튼 공통 스타일
  const baseClasses =
    "flex font-asta font-medium items-center justify-center w-55.5 h-12.5 border-2 border-[#D32F2F] rounded-full cursor-pointer";

  const variantClasses = {
    following: "text-[#1D1E20] bg-[#D32F2F]/10",
    follow: "bg-[#D32F2F] text-white",
    edit: "text-[#1D1E20] bg-[#D32F2F]/10",
    none: "bg-transparent bg-[#D32F2F]/10 disabled",
  };

  return (
    <button
      type="button"
      className={cn(baseClasses, variantClasses[type], className)}
      onClick={handleClick}
      disabled={isLoading || disabled}
    >
      {renderContent()}
    </button>
  );
};

export default UserActionButton;

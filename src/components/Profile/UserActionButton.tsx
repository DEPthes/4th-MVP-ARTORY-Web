import React, { useState } from "react";
import { cn } from "../../utils/classname";
import FollowingIcon from "../../assets/following.svg?react";
import FollowIcon from "../../assets/follow.svg?react";
import ProfileEditIcon from "../../assets/profileEdit.svg?react";

interface UserActionButtonProps {
  initialType?: "following" | "follow" | "edit";
  onClick?: () => void;
  className?: string;
}

const UserActionButton: React.FC<UserActionButtonProps> = ({
  initialType = "follow",
  onClick,
  className = "",
}) => {
  const [type, setType] = useState<"following" | "follow" | "edit">(
    initialType
  );

  const handleClick = () => {
    if (type === "following") setType("follow");
    else if (type === "follow") setType("following");
    if (onClick) onClick();
  };

  const renderContent = () => {
    const iconClass = "mr-1.5 text-current";
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
  };

  return (
    <button
      type="button"
      className={cn(baseClasses, variantClasses[type], className)}
      onClick={handleClick}
    >
      {renderContent()}
    </button>
  );
};

export default UserActionButton;

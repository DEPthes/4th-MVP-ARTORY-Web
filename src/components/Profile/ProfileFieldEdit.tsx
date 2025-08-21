import React from "react";
import { cn } from "../../utils/classname";
import FieldEditIcon from "../../assets/fieldEdit.svg?react";
import FieldPlusIcon from "../../assets/fieldPlus.svg?react";
import FieldCheckIcon from "../../assets/fieldCheck.svg?react";

interface ProfileFieldEditProps {
  variant: "edit" | "register" | "complete";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const iconMap = {
  edit: FieldEditIcon,
  complete: FieldCheckIcon,
  register: FieldPlusIcon,
};

const textMap = {
  edit: "편집",
  complete: "완료",
  register: "등록",
};

const ProfileFieldEdit: React.FC<ProfileFieldEditProps> = ({
  variant,
  onClick,
  className = "",
  disabled = false,
}) => {
  const Icon = iconMap[variant];
  const text = textMap[variant];

  const baseClasses =
    "flex font-asta font-normal items-center justify-center w-20.5 h-10.5 rounded-md bg-white text-[#1D1E20] border border-neutral-400 cursor-pointer";

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed bg-gray-100"
    : "hover:bg-gray-50";

  return (
    <button
      type="button"
      className={cn(baseClasses, disabledClasses, className)}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="mr-1.5 size-4.5" />
      {disabled && variant === "complete" ? "저장 중..." : text}
    </button>
  );
};

export default ProfileFieldEdit;

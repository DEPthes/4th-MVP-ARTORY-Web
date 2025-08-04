import React, { useState } from "react";
import { cn } from "../../utils/classname";
import FieldEditIcon from "../../assets/fieldEdit.svg?react";
import FieldPlusIcon from "../../assets/fieldPlus.svg?react";
import FieldCheckIcon from "../../assets/fieldCheck.svg?react";

interface ProfileFieldEditProps {
  variant: "edit" | "register" | "complete";
  onClick?: () => void;
  className?: string;
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
}) => {
  const Icon = iconMap[variant];
  const text = textMap[variant];

  const baseClasses =
    "flex font-asta font-normal items-center justify-center w-[83px] h-[43px] rounded-md bg-white text-[#1D1E20] border border-[#909193]";

  return (
    <button
      type="button"
      className={cn(baseClasses, className)}
      onClick={onClick}
    >
      <Icon className="mr-[6px] w-[18px] h-[18px]" />
      {text}
    </button>
  );
};

export default ProfileFieldEdit;

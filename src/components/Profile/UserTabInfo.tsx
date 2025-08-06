import React from "react";
import ProfileFieldEdit from "./ProfileFieldEdit";

interface UserTabInfoProps {
  nickname: string;
  currentTabLabel: string;
  counts?: { [key: string]: number };
  isMyProfile: boolean;
  onEditClick?: () => void;
  onCompleteClick?: () => void;
  onRegisterClick?: () => void;
  isEditing?: boolean;
}

const UserTabInfo: React.FC<UserTabInfoProps> = ({
  nickname,
  currentTabLabel,
  counts = {},
  isMyProfile,
  onEditClick,
  onCompleteClick,
  onRegisterClick,
  isEditing = false,
}) => {
  // 작가노트 외 탭일 때 (nn) 표시
  const showCount =
    currentTabLabel !== "작가노트" &&
    ["작업", "전시", "공모전", "아카이브"].includes(currentTabLabel);

  // 현재 탭에 해당하는 개수 가져오기 (없으면 0)
  const currentCount = counts[currentTabLabel] ?? 0;

  const isArtistNoteTab = currentTabLabel === "작가노트";
  const isArchiveTab = currentTabLabel === "아카이브";

  return (
    <div className="flex justify-between items-center w-286 h-17 px-10 py-3 bg-[#C7C7C9] text-[#1D1E20] font-normal">
      <div className="flex items-center gap-1">
        <div className="font-semibold">{nickname}</div>님의 {currentTabLabel}
        {showCount && <span className="text-[#D32F2F]">({currentCount})</span>}
      </div>

      {isMyProfile && (
        <div>
          {isArtistNoteTab ? (
            isEditing ? (
              <ProfileFieldEdit variant="complete" onClick={onCompleteClick} />
            ) : (
              <ProfileFieldEdit variant="edit" onClick={onEditClick} />
            )
          ) : (
            !isArchiveTab && (
              <ProfileFieldEdit variant="register" onClick={onRegisterClick} />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default UserTabInfo;

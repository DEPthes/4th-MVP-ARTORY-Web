import React from "react";

interface TagFilterBarProps {
  tags: string[]; // 유저가 등록한 추가 태그들
  selectedTag: string | null; // 현재 선택된 태그 (null이면 '전체' 선택 상태)
  onTagSelect: (tag: string | null) => void; // 태그 선택 시 부모 콜백 호출
  isLoading?: boolean; // 태그 로딩 상태
}

const TagFilterBar: React.FC<TagFilterBarProps> = ({
  tags,
  selectedTag,
  onTagSelect,
  isLoading = false,
}) => {
  return (
    <div className="flex gap-4 pt-2 py-6">
      {/* 전체 버튼 */}
      <button
        className={`p-2 font-normal cursor-pointer ${
          selectedTag === null ? "text-[#1D1E20]" : "text-[#A5A6A9]"
        }`}
        onClick={() => onTagSelect(null)}
        type="button"
      >
        전체
      </button>

      {/* 로딩 중일 때 스켈레톤 UI */}
      {isLoading ? (
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-16 h-8 bg-gray-200 animate-pulse rounded"
            />
          ))}
        </div>
      ) : (
        /* 추가 태그들 */
        tags.length > 0 &&
        tags.map((tag) => (
          <button
            key={tag}
            className={`p-2 font-normal cursor-pointer ${
              selectedTag === tag ? "text-[#1D1E20]" : "text-[#A5A6A9]"
            }`}
            onClick={() => onTagSelect(tag)}
            type="button"
          >
            {tag}
          </button>
        ))
      )}
    </div>
  );
};

export default TagFilterBar;

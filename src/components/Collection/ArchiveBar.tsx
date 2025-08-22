// src/components/Collection/ArchiveBar.tsx
import { useState, useEffect } from "react";
import Chip from "../Chip";
import type { DetailArtwork } from "../../types/detail";
import { useToggleArchive } from "../../hooks/useArchive";
import Like from "../../assets/like.svg?react";

type Props = {
  artwork: DetailArtwork;
  onArchiveToggle?: () => void;
};

const ArchiveBar = ({ artwork, onArchiveToggle }: Props) => {
  // props의 상태를 기반으로 초기값 설정
  const [localLiked, setLocalLiked] = useState(artwork.isArchived || false);
  const [archiveCount, setArchiveCount] = useState(artwork.archived || 0);
  const toggleArchive = useToggleArchive();

  // artwork 데이터가 변경될 때마다 상태 동기화
  useEffect(() => {
    setLocalLiked(artwork.isArchived || false);
    setArchiveCount(artwork.archived || 0);
  }, [artwork.isArchived, artwork.archived]);

  const handleArchiveToggle = async () => {
    const googleID = localStorage.getItem("googleID");
    if (!googleID) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      // 현재 상태의 반대값으로 토글
      const newLikedState = !localLiked;
      const newArchiveCount = newLikedState
        ? archiveCount + 1
        : archiveCount - 1;

      // 로컬 상태 즉시 업데이트
      setLocalLiked(newLikedState);
      setArchiveCount(newArchiveCount);

      // API 호출
      await toggleArchive.mutateAsync({
        postId: String(artwork.id),
        googleID,
      });

      // 성공 시 콜백 호출
      if (onArchiveToggle) {
        onArchiveToggle();
      }
    } catch (error) {
      // 실패 시 롤백
      setLocalLiked(artwork.isArchived || false);
      setArchiveCount(artwork.archived || 0);
      console.error("아카이브 토글 실패:", error);
      alert("아카이브 상태 변경에 실패했습니다.");
    }
  };

  // 아카이브 개수에 따른 색상 결정: 0일 때는 색 없고, 1 이상일 때는 빨간색
  const archiveColor = archiveCount > 0 ? "#ef4444" : "#9ca3af";

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="flex flex-wrap gap-2">
        {/* 동적 태그들만 표시 */}
        {artwork.tags &&
          artwork.tags.length > 0 &&
          artwork.tags.map((tag) => (
            <Chip
              key={tag.id}
              label={`# ${tag.name}`}
              className="text-xl px-6 py-4"
              isActive={false}
            />
          ))}
      </div>

      {/* 하트 버튼 (아카이브) */}
      <button
        onClick={handleArchiveToggle}
        type="button"
        disabled={toggleArchive.isPending}
        className={`inline-flex items-center gap-2 rounded-md border py-5 px-6 text-zinc-900 hover:bg-red-50 cursor-pointer transition-colors ${
          localLiked
            ? "bg-red-50 border-red-200 text-red-700"
            : "bg-white border-neutral-200 hover:border-red-200"
        } ${toggleArchive.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-pressed={localLiked}
        aria-label="아카이브"
      >
        <Like className="w-6 h-6" fill={archiveColor} />
        <span className="text-xl">아카이브</span>
        <div className="w-0.5 h-5 mx-1 bg-neutral-200" />
        <span className="text-xl tabular-nums">
          {String(archiveCount).padStart(2, "0")}
        </span>
      </button>
    </div>
  );
};

export default ArchiveBar;

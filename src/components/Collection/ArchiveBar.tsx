// src/components/Collection/ArchiveBar.tsx
import { useMemo, useState } from "react";
import Chip from "../Chip";
import type { DetailArtwork } from "../../types/detail";

import Like from "../../assets/like.svg?react";

type Props = { artwork: DetailArtwork };

const ArchiveBar = ({ artwork }: Props) => {
  const [liked, setLiked] = useState(false);
  const baseLikes = artwork.likes ?? 0;

  const displayedLikes = useMemo(
    () => baseLikes + (liked ? 1 : 0),
    [baseLikes, liked]
  );

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

      <button
        onClick={() => setLiked((v) => !v)}
        type="button"
        className={`inline-flex items-center gap-2 rounded-md border py-5 px-6 text-zinc-900 hover:bg-red-50  cursor-pointer ${
          liked ? "bg-red-50 border-red-50" : "bg-white border-neutral-200"
        }`}
        aria-pressed={liked}
        aria-label="아카이브"
      >
        <Like className="w-6 h-6" fill={liked ? "#ef4444" : "#fff"} />
        <span className="text-xl">아카이브</span>
        <div className="w-0.5 h-5 mx-1 bg-neutral-200" />
        <span className="text-xl tabular-nums">
          {String(displayedLikes).padStart(2, "0")}
        </span>
      </button>
    </div>
  );
};

export default ArchiveBar;

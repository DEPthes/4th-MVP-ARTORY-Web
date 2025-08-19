// src/components/Collection/ArtworkMeta.tsx
import type { DetailArtwork } from "../../types/detail";

type Props = { artwork: DetailArtwork };

const ArtworkMeta = ({ artwork }: Props) => {
  return (
    <div className="flex-1 flex flex-col min-h-128 pt-2">
      <div>
        {/* 제목 */}
        <h1 className="text-2xl text-zinc-900 font-semibold">
          {artwork.title}
        </h1>

        {/* 작가/업로더 닉네임 */}
        {artwork.author && (
          <span className="mt-4 inline-flex items-center font-light text-xl text-zinc-900">
            {artwork.author}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              className="ml-2"
            >
              <path
                d="M4.66675 1.83331L11.3334 8.49998L4.66675 15.1666"
                stroke="#717478"
              />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
};

export default ArtworkMeta;

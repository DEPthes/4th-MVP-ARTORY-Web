// src/components/Collection/ArtworkGallery.tsx
import type { DetailArtwork } from "../../types/detail";

type Props = { artwork: DetailArtwork };

const ArtworkGallery = ({ artwork }: Props) => {
  // 이미지가 없거나 배열이 아닌 경우 null 반환
  if (!Array.isArray(artwork.images) || artwork.images.length === 0)
    return null;

  return (
    <div className="mt-6 grid grid-cols-1 gap-10">
      {artwork.images.map((imageSrc, index) => {
        const trimmedSrc = imageSrc?.trim();
        if (!trimmedSrc) return null;

        return (
          <div
            key={index}
            className="mx-auto size-full flex justify-center rounded-md"
          >
            <img
              src={trimmedSrc}
              alt={`${artwork.title} 이미지 ${index + 1}`}
              className="object-fit"
            />
          </div>
        );
      })}
    </div>
  );
};

export default ArtworkGallery;

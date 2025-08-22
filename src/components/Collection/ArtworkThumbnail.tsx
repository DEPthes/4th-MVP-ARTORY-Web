// src/components/Collection/ArtworkThumbnail.tsx
import type { DetailArtwork } from "../../types/detail";

type Props = {
  artwork: DetailArtwork;
};

const ArtworkThumbnail = ({ artwork }: Props) => {
  const thumbSrc =
    (artwork.images && artwork.images[0]?.trim()) ||
    artwork.imageUrl?.trim() ||
    "";

  return (
    <div className="flex items-center bg-gray-200 w-100 h-128 overflow-hidden">
      {thumbSrc && (
        <img
          src={thumbSrc}
          alt={`${artwork.title} 썸네일`}
          className="object-fit p-5"
        />
      )}
    </div>
  );
};

export default ArtworkThumbnail;

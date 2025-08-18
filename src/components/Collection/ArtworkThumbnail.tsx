// src/components/Collection/ArtworkThumbnail.tsx
type Artwork = {
  imageUrl: string;
  images?: string[];
  title: string;
  author?: string;
  likes: number;
  category: string;
};

type Props = { artwork: Artwork };

const ArtworkThumbnail = ({ artwork }: Props) => {
  const thumbSrc =
    (artwork.images && artwork.images[0]?.trim()) ||
    artwork.imageUrl?.trim() ||
    '';

  return (
    <div className="bg-gray-200 w-100 h-128 overflow-hidden">
      {thumbSrc && (
        <img
          src={thumbSrc}
          alt={`${artwork.title} 썸네일`}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default ArtworkThumbnail;

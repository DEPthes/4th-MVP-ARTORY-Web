// src/components/Collection/ArtworkGallery.tsx
type Artwork = {
  imageUrl: string;
  images?: string[];
  title: string;
  author?: string;
  likes: number;
  category: string;
};

type Props = { artwork: Artwork };

const ArtworkGallery = ({ artwork }: Props) => {
  const hasWide = Array.isArray(artwork.images) && artwork.images.length >= 2;
  const hasTall = Array.isArray(artwork.images) && artwork.images.length >= 3;

  const wideSrc = hasWide ? artwork.images![1]?.trim() || '' : '';
  const tallSrc = hasTall ? artwork.images![2]?.trim() || '' : '';

  if (!hasWide && !hasTall) return null;

  return (
    <div className="mt-6 space-y-10">
      {hasWide && (
        <div className="mx-auto w-full max-w-3xl bg-gray-200 rounded-md overflow-hidden aspect-video">
          {wideSrc && (
            <img
              src={wideSrc}
              alt={`${artwork.title} 추가 이미지 1`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}

      {hasTall && (
        <div className="mx-auto w-full max-w-lg bg-gray-200 rounded-md overflow-hidden aspect-[3/4]">
          {tallSrc && (
            <img
              src={tallSrc}
              alt={`${artwork.title} 추가 이미지 2`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ArtworkGallery;

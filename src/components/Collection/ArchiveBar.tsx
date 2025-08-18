// src/components/Collection/ArchiveBar.tsx
import { Heart } from 'lucide-react';
import { useMemo, useState } from 'react';
import Chip from '../Chip';

type Artwork = {
  imageUrl: string;
  images?: string[];
  title: string;
  author?: string;
  likes: number;
  category: string;
};

type Props = { artwork: Artwork };

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
        <Chip label={`# ${artwork.category}`} isActive={false} />
      </div>

      <button
        onClick={() => setLiked((v) => !v)}
        type="button"
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-gray-700 hover:border-gray-300 cursor-pointer ${
          liked
            ? 'bg-rose-50 text-rose-600 border-rose-200'
            : 'bg-white border-gray-200'
        }`}
        aria-pressed={liked}
        aria-label="아카이브"
      >
        <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
        <span className="text-sm">아카이브</span>
        <span className="text-sm tabular-nums">
          {String(displayedLikes).padStart(2, '0')}
        </span>
      </button>
    </div>
  );
};

export default ArchiveBar;

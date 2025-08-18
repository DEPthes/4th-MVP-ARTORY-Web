// src/components/Collection/ArtworkMeta.tsx
import { ChevronRight } from 'lucide-react';

// 로컬 타입 (공용 타입 파일 없이)
type Artwork = {
  imageUrl: string;
  images?: string[];
  title: string;
  author?: string; // 업로드한 사용자 닉네임
  likes: number;
  category: string;
};

type Props = { artwork: Artwork };

const ArtworkMeta = ({ artwork }: Props) => {
  return (
    <div className="flex-1 flex flex-col min-h-128">
      <div>
        {/* 제목 */}
        <h1 className="text-2xl font-bold leading-tight">{artwork.title}</h1>

        {/* 작가/업로더 닉네임 */}
        {artwork.author && (
          <span className="mt-1.5 inline-flex items-center text-sm text-gray-500">
            {artwork.author}
            <ChevronRight className="ml-1 w-4 h-4 text-gray-400" />
          </span>
        )}
      </div>
      {/* 아래부턴 전부 제거: 링크 복사/좋아요/분야/자세히 보기 등 */}
    </div>
  );
};

export default ArtworkMeta;

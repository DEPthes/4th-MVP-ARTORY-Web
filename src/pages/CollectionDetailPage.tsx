// src/pages/CollectionDetailPage.tsx
import { useParams } from 'react-router-dom';
import Header from '../components/Layouts/Header';
import BackNavigate from '../components/Layouts/BackNavigate';

import ArtworkThumbnail from '../components/Collection/ArtworkThumbnail';
import ArtworkMeta from '../components/Collection/ArtworkMeta';
import ArtworkGallery from '../components/Collection/ArtworkGallery';
import DescriptionCard from '../components/Collection/DescriptionCard';
import ArchiveBar from '../components/Collection/ArchiveBar';

// ✅ CollectionPage.tsx와 동일한 카테고리/타입/데이터 정의
const Category = [
  '전체',
  '회화',
  '조각',
  '공예',
  '건축',
  '사진',
  '미디어아트',
  '인테리어',
  '기타',
] as const;
type Category = (typeof Category)[number];

type Artwork = {
  imageUrl: string;
  images?: string[]; // 갤러리 재사용 대비(옵션)
  title: string;
  author?: string;
  likes: number;
  category: Category;
};

// ⬇️ CollectionPage의 예시 데이터 그대로
const artworks: Artwork[] = [
  {
    imageUrl: '',
    title: '봄의 정원',
    author: '홍길동',
    likes: 10,
    category: '회화',
  },
  {
    imageUrl: '',
    title: '빛의 단면',
    author: '김작가',
    likes: 3,
    category: '사진',
  },
  {
    imageUrl: '',
    title: '공간의 기억',
    author: '이아티스트',
    likes: 8,
    category: '조각',
  },
  {
    imageUrl: '',
    title: '목질의 온도',
    author: '최공예',
    likes: 6,
    category: '공예',
  },
  {
    imageUrl: '',
    title: '도시의 결',
    author: '정디자이너',
    likes: 5,
    category: '건축',
  },
];

const CollectionDetailPage = () => {
  const { id } = useParams();

  // 1-based index
  const idx = Number(id) - 1;
  const artwork =
    Number.isInteger(idx) && idx >= 0 && idx < artworks.length
      ? artworks[idx]
      : undefined;

  if (!artwork) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-300 mx-auto px-6 py-10 text-gray-600">
          작품을 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비 */}
      <Header />

      {/* 뒤로가기 배너 */}
      <BackNavigate
        pathname="/collection"
        text="COLLECTION"
        variant="secondary"
      />

      {/* 본문 */}
      <div className="max-w-300 mx-auto px-6 mt-6 pb-12">
        {/* ✅ h-12 대신 pb-12 */}
        {/* 상단: 좌(썸네일) / 우(제목·작가) */}
        <div className="flex gap-10">
          <div>
            <ArtworkThumbnail artwork={artwork} />
          </div>
          <ArtworkMeta artwork={artwork} />
        </div>

        {/* 수평선 */}
        <hr className="my-6 border-gray-200" />

        {/* 갤러리 (이미지 없으면 내부에서 렌더 X) */}
        <ArtworkGallery artwork={artwork} />

        {/* 설명 카드 */}
        <DescriptionCard
          description={`이 섹션은 API 연동 후 서버에서 내려올 설명을 표시하는 영역입니다.
현재는 예시 데이터로 렌더링됩니다.

• 작품명: ${artwork.title}
• 작가: ${artwork.author ?? '정보 없음'}`}
        />
        {/* 태그 + 아카이브 */}
        <ArchiveBar artwork={artwork} />
      </div>
    </div>
  );
};

export default CollectionDetailPage;

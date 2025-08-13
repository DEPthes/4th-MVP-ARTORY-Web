// src/pages/CollectionPage.tsx
import React, { useMemo, useState } from 'react';
import ArtworkCard from '../components/ArtworkCard';
import Chip from '../components/Chip';
import Header from '../components/Layouts/Header';
import BannerControl from '../components/Profile/BannerControl';
import EmptyState from '../components/EmptyState';

// 빈 상태 이미지
import humanImg from '../assets/images/human.png';

const categories = [
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
type Category = (typeof categories)[number];

type Artwork = {
  imageUrl: string;
  title: string;
  author?: string;
  likes: number;
  category: Category;
};

// ⬇️ 작품 예시 데이터 (4~5개)
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
  // 빈 상태 테스트: const artworks: Artwork[] = [];
];

const CollectionPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('전체');

  const filteredArtworks = useMemo(() => {
    return selectedCategory === '전체'
      ? artworks
      : artworks.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 + 상단 배너 */}
      <Header />
      <BannerControl isMyProfile={false} />

      {/* 카테고리 탭바 */}
      <div className="bg-gray-50 mt-[2.5rem]">
        <div className="h-16 max-w-[59.625rem] w-full mx-auto px-4 flex items-center justify-center gap-4">
          {categories.map((c) => (
            <Chip
              key={c}
              label={c}
              isActive={selectedCategory === c}
              onClick={() => setSelectedCategory(c)}
            />
          ))}
        </div>
      </div>

      {/* 본문 */}
      <main className="max-w-[59.625rem] w-full mx-auto px-4 pt-16 pb-40">
        {filteredArtworks.length === 0 ? (
          <EmptyState
            className="mt-1 mb-10 text-[#717478]"
            imageSrc={humanImg}
            title="첫 번째 컬렉션을 만들어보세요. 여러분의 작품을 소개할 수 있어요."
            description="" // 기본 문구 숨김
          />
        ) : (
          <div className="grid grid-cols-3 gap-x-6 gap-y-8 justify-items-center">
            {filteredArtworks.map((a, i) => (
              <div key={i} className="w-[17.1875rem]">
                <ArtworkCard
                  imageUrl={a.imageUrl}
                  title={a.title}
                  author={a.author}
                  likes={a.likes}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CollectionPage;

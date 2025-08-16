// src/pages/ExhibitionPage.tsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ArtworkCard from '../components/ArtworkCard';
import Chip from '../components/Chip';
import Header from '../components/Layouts/Header';
import BannerControl from '../components/Profile/BannerControl';
import EmptyState from '../components/EmptyState';

// 빈 상태 이미지

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

type Exhibition = {
  imageUrl: string;
  exhibitionName: string; //추가함
  likes: number;
  category: Category;
};

// ⬇️ 전시 예시 데이터 (4~5개)
const exhibitions: Exhibition[] = [
  { imageUrl: '', exhibitionName: '봄, 색의 변주', likes: 7, category: '회화' },
  {
    imageUrl: '',
    exhibitionName: '빛과 공간의 대화',
    likes: 11,
    category: '건축',
  },
  { imageUrl: '', exhibitionName: '시간의 조각', likes: 4, category: '조각' },
  { imageUrl: '', exhibitionName: '사소한 물성', likes: 2, category: '공예' },
  { imageUrl: '', exhibitionName: '프레임 너머', likes: 9, category: '사진' },
  // 빈 상태 테스트: const exhibitions: Exhibition[] = [];
];

const ExhibitionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category>('전체');

  const filtered = useMemo(() => {
    return selectedCategory === '전체'
      ? exhibitions
      : exhibitions.filter((e) => e.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BannerControl isMyProfile={false} />

      {/* 카테고리 탭바 */}
      <div className="mt-10 w-full mx-auto px-4 flex items-center justify-center gap-4">
        {categories.map((c) => (
          <Chip
            key={c}
            label={c}
            isActive={selectedCategory === c}
            onClick={() => setSelectedCategory(c)}
          />
        ))}
      </div>

      {/* 본문 */}
      <main className="max-w-[59.625rem] w-full mx-auto pb-40">
        {filtered.length === 0 ? (
          <EmptyState
            className="mt-24"
            text="전시를 준비 중입니다. 곧 새로운 전시 소식을 전해드릴게요!"
          />
        ) : (
          <div className="grid grid-cols-3 gap-x-6 gap-y-8 justify-items-center mt-16">
            {filtered.map((e, i) => (
              <div key={i} className="w-[17.1875rem]">
                <ArtworkCard
                  imageUrl={e.imageUrl}
                  title={e.exhibitionName}
                  likes={e.likes}
                  onClick={() => {
                    const originalIndex = exhibitions.indexOf(e);
                    navigate(`/exhibition/${originalIndex + 1}`);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExhibitionPage;

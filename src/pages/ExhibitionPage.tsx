import React, { useMemo, useState } from 'react';
import ArtworkCard from '../components/ArtworkCard'; // 카드 UI 그대로 사용
import Chip from '../components/Chip';
import Header from '../components/Layouts/Header';
import BannerControl from '../components/Profile/BannerControl';
import EmptyState from '../components/EmptyState';

import PersonSvg from '../assets/human.svg?react';
import FrameSvg from '../assets/middle.svg?react';
import RightFrameSvg from '../assets/left.svg?react';

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
];

// ⬇️ 전시용 목데이터 (title → exhibitionName)
const exhibitions = Array.from({ length: 9 }, () => ({
  imageUrl: '',
  exhibitionName: '전시명',
  likes: 0,
}));

const ExhibitionPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filtered = useMemo(() => {
    // 카테고리 필터가 붙으면 여기서 처리
    return exhibitions;
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BannerControl />

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

      <main className="max-w-[59.625rem] w-full mx-auto px-4 pt-16 pb-40">
        {filtered.length === 0 ? (
          <EmptyState
            className="mt-[7.5rem] mb-[10rem]"
            title="전시를 준비 중이거나, 새로운 전시를 만들어보세요."
            description="전시를 생성하고 작품을 소개해 보세요."
            PersonSvg={PersonSvg}
            Frame1Svg={FrameSvg}
            Frame2Svg={FrameSvg}
            Frame3Svg={RightFrameSvg}
          />
        ) : (
          <div className="grid grid-cols-3 gap-x-6 gap-y-8 justify-items-center">
            {filtered.map((e, i) => (
              <div key={i} className="w-[17.1875rem]">
                <ArtworkCard
                  imageUrl={e.imageUrl}
                  title={e.exhibitionName} // ⬅️ 전시명으로 교체
                  author={undefined} // 필요없다면 숨기거나 카드에서 조건부 렌더
                  likes={e.likes}
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

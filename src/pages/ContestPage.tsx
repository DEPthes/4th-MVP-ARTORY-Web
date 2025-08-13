import React, { useMemo, useState } from 'react';
import ArtworkCard from '../components/ArtworkCard';
import Chip from '../components/Chip';
import Header from '../components/Layouts/Header';
import BannerControl from '../components/Profile/BannerControl';
import EmptyState from '../components/EmptyState';

// SVGs (svgr)
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

// ⬇️ 공모전용 목데이터 (카드의 메인 텍스트를 공모전명으로)
const contests = Array.from({ length: 9 }, () => ({
  imageUrl: '',
  contestName: '공모전명',
  likes: 0,
  // category: '회화',
}));

const ContestPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filteredContests = useMemo(() => {
    // 카테고리 필터가 생기면 아래 로직 주석 해제
    // return contests.filter(c => selectedCategory === '전체' || c.category === selectedCategory);
    return contests;
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 + 상단 배너 */}
      <Header />
      <BannerControl />

      {/* 카테고리 탭바 (배너와 칩 사이 40px) */}
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
        {filteredContests.length === 0 ? (
          <EmptyState
            className="mt-[7.5rem] mb-[10rem]"
            title="다음 공모전을 준비 중입니다."
            description="새로운 기회를 곧 알려드릴게요!"
            PersonSvg={PersonSvg}
            Frame1Svg={FrameSvg}
            Frame2Svg={FrameSvg}
            Frame3Svg={RightFrameSvg}
          />
        ) : (
          <div className="grid grid-cols-3 gap-x-6 gap-y-8 justify-items-center">
            {filteredContests.map((c, i) => (
              <div key={i} className="w-[17.1875rem]">
                <ArtworkCard
                  imageUrl={c.imageUrl}
                  title={c.contestName} // ⬅️ 카드 타이틀을 공모전명으로
                  author="" // 공모전은 작가명 없으니 빈 값 전달
                  likes={c.likes}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ContestPage;

// src/pages/CollectionPage.tsx
import React, { useMemo, useState } from "react";
import ArtworkCard from "../components/ArtworkCard";
import Chip from "../components/Chip";
import Header from "../components/Layouts/Header";
import BannerControl from "../components/Profile/BannerControl";
import EmptyState from "../components/EmptyState";

// 🔽 SVG를 React 컴포넌트로 임포트 (vite-plugin-svgr 필요)
import PersonSvg from "../assets/human.svg?react";
import FrameSvg from "../assets/middle.svg?react";
import RightFrameSvg from "../assets/left.svg?react";

const categories = [
  "전체",
  "회화",
  "조각",
  "공예",
  "건축",
  "사진",
  "미디어아트",
  "인테리어",
  "기타",
];

// 테스트 데이터
const artworks = Array.from({ length: 0 }, () => ({
  imageUrl: "",
  title: "작품명",
  author: "작가명",
  likes: 0,
  // category: '회화',
}));

const CollectionPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filteredArtworks = useMemo(() => {
    // return artworks.filter(a => selectedCategory === '전체' || a.category === selectedCategory);
    return artworks;
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 + 상단 배너 */}
      <Header />
      <BannerControl isMyProfile={false} />

      {/* 카테고리 탭바 */}
      {/* 배너와 칩 사이 간격 40px = 2.5rem */}
      <div className="bg-gray-50 mt-[2.5rem]">
        {" "}
        {/* CHANGED: 40px 간격 추가 */}
        <div className="h-16 max-w-[59.625rem] w-full mx-auto px-4 flex items-center justify-center gap-4 ">
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

      {/* 본문 컨테이너 */}
      <main className="max-w-[59.625rem] w-full mx-auto px-4 pt-16 pb-40">
        {" "}
        {/* CHANGED: 칩→그리드 간격 64px = 4rem */}
        {filteredArtworks.length === 0 ? (
          <EmptyState
            className="mt-[7.5rem] mb-[10rem]" // 120px=7.5rem, 160px=10rem
            PersonSvg={PersonSvg}
            Frame1Svg={FrameSvg}
            Frame2Svg={FrameSvg}
            Frame3Svg={RightFrameSvg}
          />
        ) : (
          <div className="grid grid-cols-3 gap-x-6 gap-y-8 justify-items-center">
            {filteredArtworks.map((a, i) => (
              <div key={i} className="w-[17.1875rem]">
                {" "}
                {/* CHANGED: 카드 폭 275px = 17.1875rem */}
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

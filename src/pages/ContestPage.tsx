// src/pages/ContestPage.tsx
import React, { useMemo, useState } from "react";
import ArtworkCard from "../components/ArtworkCard";
import Chip from "../components/Chip";
import Header from "../components/Layouts/Header";
import BannerControl from "../components/Profile/BannerControl";
import EmptyState from "../components/EmptyState";
import { useTagList } from "../hooks/useTag";

// 빈 상태 이미지

type Category = "전체" | string;

type Contest = {
  imageUrl: string;
  contestName: string;
  likes: number;
  category: Category;
};

// ⬇️ 공모전 예시 데이터 (4~5개)
const contests: Contest[] = [
  {
    imageUrl: "",
    contestName: "뉴미디어 아트 공모전",
    likes: 12,
    category: "미디어아트",
  },
  { imageUrl: "", contestName: "청년 사진 공모전", likes: 5, category: "사진" },
  { imageUrl: "", contestName: "도시 공간 디자인", likes: 8, category: "건축" },
  {
    imageUrl: "",
    contestName: "현대 회화 기획전 공모",
    likes: 3,
    category: "회화",
  },
  { imageUrl: "", contestName: "공예 리빙 디자인", likes: 2, category: "공예" },
  // 빈 상태 테스트: const contests: Contest[] = [];
];

const ContestPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");

  // 태그 리스트 조회
  const { data: tagResponse } = useTagList();

  // 동적으로 가져온 태그를 포함한 카테고리 목록 생성
  const categories = useMemo(() => {
    if (!tagResponse?.data) {
      return ["전체"]; // 태그 로딩 중이거나 실패한 경우 기본값
    }
    return ["전체", ...tagResponse.data.map((tag) => tag.name)];
  }, [tagResponse]);

  const filteredContests = useMemo(() => {
    return selectedCategory === "전체"
      ? contests
      : contests.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 + 상단 배너 */}
      <Header />
      <BannerControl isMyProfile={false} />

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
        {filteredContests.length === 0 ? (
          <EmptyState
            className="mt-24"
            text="다음 공모전을 준비 중입니다. 새로운 기회가 곧 열릴 예정이에요!"
          />
        ) : (
          <div className="grid grid-cols-3 gap-x-6 gap-y-8 justify-items-center mt-16">
            {filteredContests.map((c, i) => (
              <div key={i} className="w-[17.1875rem]">
                <ArtworkCard
                  imageUrl={c.imageUrl}
                  title={c.contestName}
                  author={undefined} // 공모전은 작가명 없음
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

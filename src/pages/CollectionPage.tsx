// src/pages/CollectionPage.tsx
import React, { useMemo, useState } from "react";
import ArtworkCard from "../components/ArtworkCard";
import Chip from "../components/Chip";
import Header from "../components/Layouts/Header";
import BannerControl from "../components/Profile/BannerControl";
import EmptyState from "../components/EmptyState";
import { useTagList } from "../hooks/useTag";

// 빈 상태 이미지

type Category = "전체" | string;

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
    imageUrl: "",
    title: "봄의 정원",
    author: "홍길동",
    likes: 10,
    category: "회화",
  },
  {
    imageUrl: "",
    title: "빛의 단면",
    author: "김작가",
    likes: 3,
    category: "사진",
  },
  {
    imageUrl: "",
    title: "공간의 기억",
    author: "이아티스트",
    likes: 8,
    category: "조각",
  },
  {
    imageUrl: "",
    title: "목질의 온도",
    author: "최공예",
    likes: 6,
    category: "공예",
  },
  {
    imageUrl: "",
    title: "도시의 결",
    author: "정디자이너",
    likes: 5,
    category: "건축",
  },
  // 빈 상태 테스트: const artworks: Artwork[] = [];
];

const CollectionPage: React.FC = () => {
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

  const filteredArtworks = useMemo(() => {
    return selectedCategory === "전체"
      ? artworks
      : artworks.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 + 상단 배너 */}
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
        {filteredArtworks.length === 0 ? (
          <EmptyState
            className="mt-24"
            text="첫 번째 컬렉션을 만들어보세요. 여러분의 작품을 소개할 수 있어요."
          />
        ) : (
          <div className="grid grid-cols-3 gap-x-6 gap-y-8 justify-items-center mt-16">
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

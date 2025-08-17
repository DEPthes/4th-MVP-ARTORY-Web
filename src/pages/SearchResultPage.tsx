import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Header } from "../components";
import TabMenu from "../components/Profile/TabMenu";
import ArtworkCard from "../components/ArtworkCard";
import Chip from "../components/Chip";

// 탭별 카테고리 정의
const categories = {
  artworkCollection: [
    "전체",
    "회화",
    "조각",
    "공예",
    "건축",
    "사진",
    "미디어아트",
    "인테리어",
    "기타",
  ],
  exhibition: [
    "전체",
    "회화",
    "조각",
    "공예",
    "건축",
    "사진",
    "미디어아트",
    "인테리어",
    "기타",
  ],
  contest: [
    "전체",
    "회화",
    "조각",
    "공예",
    "건축",
    "사진",
    "미디어아트",
    "인테리어",
    "기타",
  ],
} as const;

type TabId = keyof typeof categories;
type Category = string;

// 타입 정의
interface ArtworkItem {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  likes: number;
  category: string;
}

interface ExhibitionItem {
  id: string;
  title: string;
  category: string;
}

interface ContestItem {
  id: string;
  title: string;
  category: string;
}

type DataItem = ArtworkItem | ExhibitionItem | ContestItem;

// Mock 데이터 (실제로는 API에서 가져올 데이터)
const mockArtworkData: ArtworkItem[] = [
  {
    id: "1",
    title: "작품1",
    author: "작가1",
    imageUrl: "test",
    likes: 20,
    category: "회화",
  },
  {
    id: "2",
    title: "작품2",
    author: "작가2",
    imageUrl: "test",
    likes: 15,
    category: "조각",
  },
  {
    id: "3",
    title: "작품3",
    author: "작가3",
    imageUrl: "test",
    likes: 30,
    category: "사진",
  },
];

const SearchResultPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");
  const [submittedSearchText, setSubmittedSearchText] = useState(""); // 실제 검색된 텍스트
  const [selectedTabId, setSelectedTabId] =
    useState<TabId>("artworkCollection");
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");

  // URL 파라미터에서 검색어 가져오기
  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setSearchText(query);
      setSubmittedSearchText(query); // 검색 실행된 것으로 처리
      // 여기서 실제 검색 API 호출하면 됩니다
      console.log("검색어:", query);
    }
  }, [searchParams]);

  // 탭 변경시 카테고리 초기화
  useEffect(() => {
    setSelectedCategory("전체");
  }, [selectedTabId]);

  const handleSearch = () => {
    if (searchText.trim()) {
      setSearchParams({ query: searchText.trim() });
      setSubmittedSearchText(searchText.trim()); // 검색 실행시에만 업데이트
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // 현재 탭의 카테고리 목록
  const currentCategories = categories[selectedTabId];

  // 선택된 탭과 카테고리에 따라 데이터 필터링
  const getFilteredData = (): DataItem[] => {
    let data: DataItem[] = [];

    // 탭별로 다른 데이터 반환 (실제로는 API에서 가져옴)
    switch (selectedTabId) {
      case "artworkCollection":
        data = mockArtworkData;
        break;
      case "exhibition":
        data = []; // 전시 데이터 (현재 빈 배열)
        break;
      case "contest":
        data = []; // 공모전 데이터 (현재 빈 배열)
        break;
      default:
        data = [];
    }

    // 카테고리별 필터링
    if (selectedCategory === "전체") {
      return data;
    }

    return data.filter((item) => item.category === selectedCategory);
  };

  const filteredData = getFilteredData();

  const renderContent = () => {
    if (filteredData.length === 0) {
      return (
        <div className="col-span-3 text-center mt-24 text-gray-500 text-lg">
          {submittedSearchText
            ? `"${submittedSearchText}"와 일치하는 검색 결과가 없습니다.`
            : "검색 결과가 없습니다."}
        </div>
      );
    }

    // 탭별로 다른 컴포넌트 렌더링
    switch (selectedTabId) {
      case "artworkCollection":
        return filteredData.map((item) => {
          const artworkItem = item as ArtworkItem;
          return (
            <ArtworkCard
              key={artworkItem.id}
              title={artworkItem.title}
              author={artworkItem.author}
              imageUrl={artworkItem.imageUrl}
              likes={artworkItem.likes}
            />
          );
        });
      case "exhibition":
        // 전시 카드 컴포넌트 (향후 구현)
        return <div>전시 컴포넌트 (향후 구현)</div>;
      case "contest":
        // 공모전 카드 컴포넌트 (향후 구현)
        return <div>공모전 컴포넌트 (향후 구현)</div>;
      default:
        return null;
    }
  };

  const handleTabChange = (tabId: string) => {
    setSelectedTabId(tabId as TabId);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="w-full flex flex-col justify-center items-center bg-gray-100 pt-20">
        <div className="flex items-center mb-8 gap-16">
          <p className="text-xl font-semibold">통합검색</p>
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="검색어를 입력하세요."
              className="w-120 px-4 py-3 font-light text-zinc-900 placeholder:text-zinc-500 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <Button
              variant="primary"
              size="base"
              className="px-4 py-2.5 rounded-md text-lg font-normal"
            >
              검색
            </Button>
          </form>
        </div>
        {/* 검색이 실행되었을 때만 결과 메시지 표시 */}
        {submittedSearchText && (
          <p className="text-zinc-900 mb-16">
            "{submittedSearchText}"와 일치하는 결과{" "}
            <span className="text-red-600">({filteredData.length})</span>
          </p>
        )}
        <TabMenu
          tabs={[
            { id: "artworkCollection", label: "작품 컬렉션" },
            { id: "exhibition", label: "전시" },
            { id: "contest", label: "공모전" },
          ]}
          selectedTabId={selectedTabId}
          onTabChange={handleTabChange}
        />
      </div>
      <div className="flex flex-col items-center py-10">
        {/* 카테고리 칩 */}
        <div className="mb-8 w-full mx-auto px-4 flex items-center justify-center gap-4">
          {currentCategories.map((category) => (
            <Chip
              key={category}
              label={category}
              isActive={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>
        {/* 검색 결과 */}
        <div className="p-6 grid grid-cols-3 gap-6 w-full max-w-6xl">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;

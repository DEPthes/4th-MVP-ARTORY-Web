import { useState, useEffect, useMemo } from "react";
import type { AxiosError } from "axios";
import { useSearchParams } from "react-router-dom";
import { Button, Header } from "../components";
import TabMenu from "../components/Profile/TabMenu";
import ArtworkCard from "../components/ArtworkCard";
import Chip from "../components/Chip";
import { useTagList } from "../hooks/useTag";
import { useSearchPosts } from "../hooks/useSearch";
import type { SearchItem, PostType } from "../apis/search";

// 탭별 카테고리 정의 (동적으로 생성됨)

type TabId = "artworkCollection" | "exhibition" | "contest";
type Category = string;

// 타입 정의 (백엔드 응답에 맞게 수정)
interface ArtworkItem {
  postId: string;
  postType: "ART" | "EXHIBITION" | "CONTEST";
  title: string;
  imageUrls: string[];
  userName: string;
  archived: number;
  isMine: boolean;
  isArchived: boolean;
}

// API 결과를 보관할 상태는 Tanstack Query로 대체

const SearchResultPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");
  const [submittedSearchText, setSubmittedSearchText] = useState(""); // 실제 검색된 텍스트
  const [selectedTabId, setSelectedTabId] =
    useState<TabId>("artworkCollection");
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");

  // 태그 리스트 조회
  const { data: tagResponse } = useTagList();

  // 검색 결과 조회 훅
  const {
    data: searchResults = [],
    isFetching,
    isError,
    error,
  } = useSearchPosts({
    text: submittedSearchText,
    postType:
      selectedTabId === "artworkCollection"
        ? ("ART" as PostType)
        : selectedTabId === "exhibition"
        ? ("EXHIBITION" as PostType)
        : ("CONTEST" as PostType),
    tagName: selectedCategory === "전체" ? "ALL" : selectedCategory,
    page: 0,
    size: 30,
  });

  // 좋아요(아카이브) 토글

  // 검색 API 실패(예: 401) 시에도 페이지는 유지되며 빈 결과로 처리

  // 동적으로 가져온 태그를 포함한 카테고리 목록 생성
  const categories = useMemo(() => {
    const defaultCategories = ["전체"];
    if (!tagResponse?.data) {
      return {
        artworkCollection: defaultCategories,
        exhibition: defaultCategories,
        contest: defaultCategories,
      };
    }
    const dynamicCategories = [
      "전체",
      ...tagResponse.data.map((tag) => tag.name),
    ];
    return {
      artworkCollection: dynamicCategories,
      exhibition: dynamicCategories,
      contest: dynamicCategories,
    };
  }, [tagResponse]);

  // URL 파라미터에서 검색어 가져오기
  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setSearchText(query);
      setSubmittedSearchText(query); // 검색 실행된 것으로 처리
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

  // 서버에서 이미 탭/태그로 필터링된 결과를 받는다고 가정
  const filteredData: SearchItem[] = Array.isArray(searchResults)
    ? searchResults
    : [];

  const renderContent = () => {
    if (isFetching) {
      return (
        <div className="col-span-3 text-center mt-24 text-gray-500 text-lg">
          로딩 중...
        </div>
      );
    }

    if (isError) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      if (status === 401) {
        return (
          <div className="col-span-3 text-center mt-24 text-gray-500 text-lg">
            검색 결과를 보려면 로그인이 필요합니다.
            <div className="mt-6 flex justify-center">
              <Button
                variant="primary"
                size="base"
                className="px-4 py-2.5 rounded-md text-lg font-normal"
                onClick={() => (window.location.href = "/login")}
              >
                로그인 하러 가기
              </Button>
            </div>
          </div>
        );
      }

      return (
        <div className="col-span-3 text-center mt-24 text-gray-500 text-lg">
          오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </div>
      );
    }

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
        return (filteredData || []).map((item) => {
          const artworkItem = item as ArtworkItem;
          return (
            <ArtworkCard
              key={artworkItem.postId}
              title={artworkItem.title}
              author={artworkItem.userName}
              imageUrl={artworkItem.imageUrls?.[0] || ""}
              likes={artworkItem.archived}
              liked={artworkItem.isArchived}
              isArchived={artworkItem.isArchived}
            />
          );
        });
      case "exhibition":
        return (filteredData || []).map((item) => {
          const exhibitionItem = item as ArtworkItem;
          return (
            <ArtworkCard
              key={exhibitionItem.postId}
              title={exhibitionItem.title}
              author={exhibitionItem.userName}
              imageUrl={exhibitionItem.imageUrls?.[0] || ""}
              likes={exhibitionItem.archived}
              liked={exhibitionItem.isArchived}
              isArchived={exhibitionItem.isArchived}
              variant="secondary"
            />
          );
        });
      case "contest":
        return (filteredData || []).map((item) => {
          const contestItem = item as ArtworkItem;
          return (
            <ArtworkCard
              key={contestItem.postId}
              title={contestItem.title}
              author={contestItem.userName}
              imageUrl={contestItem.imageUrls?.[0] || ""}
              likes={contestItem.archived}
              liked={contestItem.isArchived}
              isArchived={contestItem.isArchived}
              variant="secondary"
            />
          );
        });
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

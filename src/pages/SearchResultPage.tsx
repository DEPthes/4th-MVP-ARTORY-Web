import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Header } from "../components";
import TabMenu from "../components/Profile/TabMenu";
import ArtworkCard from "../components/ArtworkCard";

const SearchResultPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");
  const [submittedSearchText, setSubmittedSearchText] = useState(""); // 실제 검색된 텍스트
  const [searchResultCount] = useState(0);
  const [selectedTabId, setSelectedTabId] = useState("artworkCollection");

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
            <span className="text-red-600">({searchResultCount})</span>
          </p>
        )}
        <TabMenu
          tabs={[
            { id: "artworkCollection", label: "작품 컬렉션" },
            { id: "exhibition", label: "전시" },
            { id: "contest", label: "공모전" },
          ]}
          selectedTabId={selectedTabId}
          onTabChange={setSelectedTabId}
        />
      </div>
      <div className="flex flex-col items-center py-10">
        <div>chip</div>
        <div className="p-6 grid grid-cols-3 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <ArtworkCard
              key={index}
              title="test"
              author="test"
              imageUrl="test"
              likes={20}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;

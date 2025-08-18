import { useState, useMemo } from "react";
import { Header } from "../components";
import Chip from "../components/Chip";
import BannerControl from "../components/Profile/BannerControl";
import ProfileCard from "../components/Profile/ProfileCard";
import { useNavigate } from "react-router-dom";
import { useArtistNoteList } from "../hooks/useArtistNote";
import { useTagList } from "../hooks/useTag";
import type { ArtistNote } from "../types/artistNote";

type Category = "전체" | string;

const ArtistNotePage = () => {
  const navigate = useNavigate();

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`);
  };

  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");

  // 현재 로그인한 사용자의 googleID 가져오기
  const googleID = localStorage.getItem("googleID") || "";

  // 태그 리스트 조회
  const { data: tagResponse } = useTagList();

  // 작가 노트 리스트 조회
  const {
    data: artistNoteResponse,
    isLoading,
    error,
  } = useArtistNoteList({
    googleID,
    page: 0,
    size: 100, // 모든 데이터를 가져오기 위해 큰 수로 설정
  });

  // 동적으로 가져온 태그를 포함한 카테고리 목록 생성
  const categories = useMemo(() => {
    if (!tagResponse?.data) {
      return ["전체"]; // 태그 로딩 중이거나 실패한 경우 기본값
    }
    return ["전체", ...tagResponse.data.map((tag) => tag.name)];
  }, [tagResponse]);

  // API 데이터를 기존 mockData 형식으로 변환하고 카테고리 필터링
  const filteredData = useMemo(() => {
    if (!artistNoteResponse?.data?.content) {
      return [];
    }

    // API 데이터를 기존 mockData 형식으로 변환
    const transformedData = artistNoteResponse.data.content.map(
      (artist: ArtistNote) => ({
        id: artist.id.toString(),
        role: "작가" as const,
        nickName: artist.name,
        phoneNumber: artist.contact,
        email: artist.email,
        introduction: artist.introduction,
        isMyProfile: artist.isMine,
        category: "전체" as Category, // API에서 카테고리 정보가 없으므로 기본값 설정
      })
    );

    // 선택된 카테고리에 따라 필터링 (현재는 카테고리 정보가 없으므로 모든 데이터 반환)
    if (selectedCategory === "전체") {
      return transformedData;
    }

    // 실제 카테고리 필드가 API에 추가되면 다음과 같이 필터링
    // return transformedData.filter((artist) => artist.category === selectedCategory);
    return transformedData;
  }, [artistNoteResponse, selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BannerControl isMyProfile={false} />
      <div className="flex flex-col items-center py-10">
        <div className="mb-16 w-full mx-auto px-4 flex items-center justify-center gap-4">
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              isActive={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              className="text-nowrap"
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-20">
          {isLoading ? (
            <div className="col-span-2 text-center mt-24 text-gray-500 text-lg">
              작가 노트를 불러오는 중...
            </div>
          ) : error ? (
            <div className="col-span-2 text-center mt-24 text-red-500 text-lg">
              작가 노트를 불러오는데 실패했습니다.
              <br />
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                다시 시도
              </button>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="col-span-2 text-center mt-24 text-gray-500 text-lg">
              아직 업로드된 작가 포트폴리오가 없습니다.
            </div>
          ) : (
            filteredData.map((data) => (
              <ProfileCard
                key={data.id}
                role={data.role}
                nickName={data.nickName}
                phoneNumber={data.phoneNumber}
                email={data.email}
                introduction={data.introduction}
                isMyProfile={false}
                isHorizontal
                className="w-110"
                onClick={() => handleArtistClick(data.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistNotePage;

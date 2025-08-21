import { useMemo } from "react";
import { Header } from "../components";
import BannerControl from "../components/Profile/BannerControl";
import ProfileCard from "../components/Profile/ProfileCard";
import { useNavigate } from "react-router-dom";
import { useArtistNoteList } from "../hooks/useArtistNote";
import type { ArtistNote } from "../types/artistNote";

const ArtistNotePage = () => {
  const navigate = useNavigate();

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`);
  };

  // 현재 로그인한 사용자의 googleID 가져오기
  const googleID = localStorage.getItem("googleID") || "";

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

  // API 데이터를 기존 mockData 형식으로 변환
  const filteredData = useMemo(() => {
    if (!artistNoteResponse?.data?.content) {
      return [];
    }

    console.log("📋 작가노트 리스트 API 응답:", artistNoteResponse.data);
    console.log("🎭 작가노트 content 배열:", artistNoteResponse.data.content);

    // API 데이터를 기존 mockData 형식으로 변환
    const transformedData = artistNoteResponse.data.content.map(
      (artist: ArtistNote) => {
        console.log("👤 개별 작가 데이터:", artist);
        console.log("👤 개별 작가 데이터:", artist);
        // profileImageURL 처리: JSON 배열이거나 직접 URL일 수 있음
        let profileImage = null;
        if (artist.profileImageURL) {
          try {
            // 먼저 JSON 파싱 시도 (배열 형태인 경우)
            const imageArray = JSON.parse(artist.profileImageURL);
            if (Array.isArray(imageArray) && imageArray.length > 0) {
              profileImage = imageArray[0];
            }
          } catch {
            // JSON 파싱 실패 시 직접 URL로 처리
            console.log("🖼️ 직접 URL로 처리:", artist.profileImageURL);
            profileImage = artist.profileImageURL;
          }
        }

        return {
          id: artist.id.toString(),
          role: "작가" as const,
          nickName: artist.name,
          phoneNumber: artist.contact,
          email: artist.email,
          introduction: artist.introduction,
          isMyProfile: artist.isMine,
          category: "전체", // API에서 카테고리 정보가 없으므로 기본값 설정
          profileImage: profileImage,
        };
      }
    );

    console.log("🔄 변환된 데이터:", transformedData);
    return transformedData;
  }, [artistNoteResponse]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BannerControl isMyProfile={false} />
      <div className="flex flex-col items-center py-10">
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
            filteredData.map((artistData) => {
              return (
                <ProfileCard
                  key={artistData.id}
                  role={artistData.role}
                  nickName={artistData.nickName}
                  phoneNumber={artistData.phoneNumber}
                  email={artistData.email}
                  introduction={artistData.introduction}
                  isMyProfile={artistData.isMyProfile}
                  isHorizontal
                  className="w-110"
                  image={artistData.profileImage || undefined}
                  viewerGoogleID={googleID}
                  userIdForFollowList={artistData.id}
                  useNoneAction={artistData.isMyProfile}
                  onClick={() => {
                    console.log("🖱️ 작가 클릭:", artistData.id);
                    handleArtistClick(artistData.id);
                  }}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistNotePage;

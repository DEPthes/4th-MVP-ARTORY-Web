import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "../components";
import BannerControl from "../components/Profile/BannerControl";
import ProfileCard from "../components/Profile/ProfileCard";
import TabMenu from "../components/Profile/TabMenu";
import UserTabInfo from "../components/Profile/UserTabInfo";
import DisplayEntry from "../components/Profile/DisplayEntry";
import ArtworkCard from "../components/ArtworkCard";
import TagFilterBar from "../components/Profile/TagFilterBar";
import { useParams } from "react-router-dom";
import BackNavigate from "../components/Layouts/BackNavigate";
import { getUserProfile } from "../apis/user";

const artistTabs = [
  { id: "artistNote", label: "작가노트" },
  { id: "works", label: "작업" },
  { id: "exhibition", label: "전시" },
  { id: "contest", label: "공모전" },
  { id: "archive", label: "아카이브" },
];

interface ArtworkItem {
  id: number;
  imageUrl: string;
  title: string;
  author?: string;
  likes: number;
  tags?: string[];
}

// 각 탭별 아카이브 데이터 Mock (API 나오면 실제 데이터로 대체)
const artworkDataMock: Record<string, ArtworkItem[]> = {
  works: [
    {
      id: 1,
      imageUrl: "//",
      title: "새벽의 풍경",
      author: "김작가",
      likes: 10,
      tags: ["회화", "공예"],
    },
    {
      id: 2,
      imageUrl: "//",
      title: "고요한 사색",
      author: "박작가",
      likes: 5,
      tags: ["사진"],
    },
    {
      id: 3,
      imageUrl: "//",
      title: "도시의 밤",
      author: "이작가",
      likes: 3,
      tags: ["인테리어"],
    },
  ],
  exhibition: [
    {
      id: 1,
      imageUrl: "//",
      title: "시간의 조각",
      author: undefined,
      likes: 20,
      tags: ["공예"],
    },
    {
      id: 2,
      imageUrl: "//",
      title: "어울림전",
      author: undefined,
      likes: 7,
      tags: ["미디어아트"],
    },
  ],
  contest: [],
  archive: [
    {
      id: 1,
      imageUrl: "//",
      title: "아카이브 작품1",
      author: undefined,
      likes: 8,
      tags: ["조각", "회화"],
    },
    {
      id: 2,
      imageUrl: "//",
      title: "아카이브 전시1",
      author: undefined,
      likes: 4,
      tags: ["기타"],
    },
  ],
};

const dynamicCounts = {
  작업: artworkDataMock.works.length,
  전시: artworkDataMock.exhibition.length,
  공모전: artworkDataMock.contest.length,
  아카이브: artworkDataMock.archive.length,
};

const noContentMessages = {
  otherProfile: {
    works: "아직 등록된 작품이 없습니다.",
    exhibition: "아직 등록된 전시가 없습니다.",
    contest: "아직 등록된 공모전이 없습니다.",
    archive: "아직 등록된 아카이브가 없습니다.",
  },
};

const ArtistDetailPage: React.FC = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const viewerGoogleID = localStorage.getItem("googleID");

  console.log("🔍 ArtistDetailPage 렌더링:", {
    artistId,
    viewerGoogleID,
    localStorage_keys: Object.keys(localStorage),
    googleID_value: localStorage.getItem("googleID"),
  });

  // API로 작가 프로필 정보 조회
  const {
    data: artistProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["artistProfile", artistId],
    queryFn: () => getUserProfile(viewerGoogleID!, artistId!),
    enabled: !!viewerGoogleID && !!artistId,
  });

  // API로 작가노트 조회 (기존 훅 사용)
  const {
    data: artistNotes,
    isLoading: isArtistNoteLoading,
    error: artistNoteError,
  } = useQuery({
    queryKey: ["artistNote", artistId],
    queryFn: () => {
      // 기존 useArtistNote 훅과 동일한 API 호출
      return fetch(
        `/api/artist_note?googleID=${viewerGoogleID}&userID=${artistId}`
      )
        .then((res) => res.json())
        .then((data) => data.data);
    },
    enabled: !!viewerGoogleID && !!artistId,
  });

  const [selectedTabId, setSelectedTabId] = useState(artistTabs[0].id);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 현재 사용자와 다른 프로필이므로 항상 false
  const isMyProfile = false;

  // 작가노트 데이터를 섹션별로 분류
  const registeredEntries = React.useMemo(() => {
    if (!artistNotes) {
      return {
        achievement: [],
        groupExhibition: [],
        soloExhibition: [],
      };
    }

    const achievement = artistNotes
      .filter((item) => item.artistNoteType === "HISTORY")
      .map((item) => ({
        id: item.id,
        year: item.year,
        text: item.description,
      }));

    const groupExhibition = artistNotes
      .filter((item) => item.artistNoteType === "TEAM_EVENT")
      .map((item) => ({
        id: item.id,
        year: item.year,
        text: item.description,
      }));

    const soloExhibition = artistNotes
      .filter((item) => item.artistNoteType === "PERSONAL_EVENT")
      .map((item) => ({
        id: item.id,
        year: item.year,
        text: item.description,
      }));

    return { achievement, groupExhibition, soloExhibition };
  }, [artistNotes]);

  // 현재 탭의 작품 리스트(필터 태그 적용 전)
  let data =
    artworkDataMock[selectedTabId as keyof typeof artworkDataMock] || [];

  // currentItems에 있는 모든 태그들을 중복 없이 뽑아내기
  const tagsSet = new Set<string>();
  data.forEach((item) => {
    item.tags?.forEach((tag) => tagsSet.add(tag));
  });
  const currentTags = Array.from(tagsSet);

  // 현재 선택된 탭과 태그에 따라 필터링된 데이터를 반환하는 헬퍼 함수
  const getFilteredData = () => {
    if (selectedTag) {
      data = data.filter(
        (item) => Array.isArray(item.tags) && item.tags.includes(selectedTag)
      );
    }
    return data;
  };

  // 탭 변경 핸들러
  const handleTabChange = (tabId: string) => {
    setSelectedTabId(tabId);
    setSelectedTag(null); // 탭이 바뀌면 태그 필터도 초기화
  };

  // 로딩 상태 처리
  if (isProfileLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">작가 정보를 불러오는 중...</div>
        </div>
      </>
    );
  }

  // 에러 상태 처리
  if (profileError || artistNoteError) {
    const errorMessage = profileError
      ? "작가 프로필을 불러오는데 실패했습니다."
      : "작가노트를 불러오는데 실패했습니다.";

    const errorDetails = profileError?.message || artistNoteError?.message;

    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg text-red-500 text-center">
            <div>{errorMessage}</div>
            {errorDetails && (
              <div className="text-sm text-gray-600 mt-2">
                오류 상세: {errorDetails}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              다시 시도
            </button>
          </div>
        </div>
      </>
    );
  }

  // 프로필 데이터가 없는 경우
  if (!artistProfile) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg text-gray-500">
            작가 정보를 찾을 수 없습니다.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="relative mx-auto w-full">
        <BackNavigate
          pathname="/note"
          text="작가노트"
          variant="primary"
          className="absolute z-10"
        />
        <BannerControl
          isMyProfile={isMyProfile}
          initialBannerUrl={artistProfile?.coverImageUrl || undefined}
        />
        <div className="flex">
          <div className="-mt-24 z-10 pl-60 xl:pl-40 md:pl-20 sm:pl-5">
            <div className="sticky top-24">
              <ProfileCard
                role="작가"
                nickName={artistProfile.name}
                followers={artistProfile.followersCount}
                following={artistProfile.followingCount}
                introduction={artistProfile.description}
                birthdate={artistProfile.birth}
                education={
                  !isMyProfile && !artistProfile.disclosureStatus
                    ? ""
                    : artistProfile.educationBackground
                }
                phoneNumber={artistProfile.contact}
                email={artistProfile.email}
                isMyProfile={artistProfile.isMe}
                viewerGoogleID={viewerGoogleID || undefined}
                userIdForFollowList={artistId}
                showEditControls={false}
                useNoneAction={artistProfile.isMe}
                initialIsFollowed={artistProfile.isFollowed}
                image={artistProfile.profileImageUrl || undefined}
              />
            </div>
          </div>
          <div className="flex flex-col w-full mt-7 pl-15 pr-60 xl:pr-40 md:pr-20 sm:pr-5">
            <TabMenu
              tabs={artistTabs}
              selectedTabId={selectedTabId}
              onTabChange={handleTabChange}
            />
            <UserTabInfo
              nickname={artistProfile.name}
              currentTabLabel={
                artistTabs.find((t) => t.id === selectedTabId)?.label || ""
              }
              isMyProfile={isMyProfile}
              isEditing={false}
              onEditClick={() => {}}
              onCompleteClick={() => {}}
              onRegisterClick={() => {}}
              counts={dynamicCounts}
            />
            <div className="flex flex-col px-10 py-4 min-h-132.5 bg-[#F4F5F6]">
              {selectedTabId === "artistNote" && (
                <>
                  <div className="w-full h-13.5 py-4 font-semibold text-[#1D1E20]">
                    이력 및 수상 경력
                  </div>
                  <div className="flex flex-col gap-4 w-full min-h-15.5 px-6 py-5 bg-white">
                    {isArtistNoteLoading ? (
                      <div className="text-center py-4 text-gray-500">
                        작가노트를 불러오는 중...
                      </div>
                    ) : registeredEntries.achievement.length > 0 ? (
                      registeredEntries.achievement.map(
                        ({ year, text, id }) => (
                          <DisplayEntry key={id} year={year} text={text} />
                        )
                      )
                    ) : (
                      <div className="text-[#717478] text-center py-4">
                        등록된 이력이 없습니다.
                      </div>
                    )}
                  </div>
                  <div className="w-full h-13.5 mt-4 py-4 font-semibold text-[#1D1E20]">
                    단체전
                  </div>
                  <div className="flex flex-col w-full gap-4 min-h-15.5 px-6 py-5 bg-white">
                    {isArtistNoteLoading ? (
                      <div className="text-center py-4 text-gray-500">
                        작가노트를 불러오는 중...
                      </div>
                    ) : registeredEntries.groupExhibition.length > 0 ? (
                      registeredEntries.groupExhibition.map(
                        ({ year, text, id }) => (
                          <DisplayEntry key={id} year={year} text={text} />
                        )
                      )
                    ) : (
                      <div className="text-[#717478] text-center py-4">
                        등록된 단체전이 없습니다.
                      </div>
                    )}
                  </div>
                  <div className="w-full h-13.5 mt-4 py-4 font-semibold text-[#1D1E20]">
                    개인전
                  </div>
                  <div className="flex flex-col w-full gap-4 min-h-15.5 px-6 py-5 bg-white">
                    {isArtistNoteLoading ? (
                      <div className="text-center py-4 text-gray-500">
                        작가노트를 불러오는 중...
                      </div>
                    ) : registeredEntries.soloExhibition.length > 0 ? (
                      registeredEntries.soloExhibition.map(
                        ({ year, text, id }) => (
                          <DisplayEntry key={id} year={year} text={text} />
                        )
                      )
                    ) : (
                      <div className="text-[#717478] text-center py-4">
                        등록된 개인전이 없습니다.
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* 작업, 전시, 공모전, 아카이브 탭 콘텐츠 */}
              {(selectedTabId === "works" ||
                selectedTabId === "exhibition" ||
                selectedTabId === "contest" ||
                selectedTabId === "archive") && (
                <>
                  {/* 태그 필터 바 */}
                  <TagFilterBar
                    tags={currentTags}
                    selectedTag={selectedTag}
                    onTagSelect={(tag) => setSelectedTag(tag)}
                  />

                  {/* ArtworkCard 그리드 */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 px-13.5">
                    {getFilteredData().length > 0 ? (
                      getFilteredData().map((item) => (
                        <ArtworkCard
                          key={item.id}
                          imageUrl={item.imageUrl}
                          title={item.title}
                          author={item.author}
                          likes={item.likes}
                          variant="primary"
                          onClick={() => {
                            console.log(
                              `${selectedTabId}의 ${item.title} 상세페이지`
                            );
                          }}
                        />
                      ))
                    ) : (
                      <div
                        className="col-span-3 mt-30 flex flex-col justify-center items-center pb-10 text-[#717478] font-normal whitespace-pre-line text-center px-6"
                        style={{ minHeight: "150px" }}
                      >
                        {
                          noContentMessages.otherProfile[
                            selectedTabId as keyof typeof noContentMessages.otherProfile
                          ]
                        }
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArtistDetailPage;

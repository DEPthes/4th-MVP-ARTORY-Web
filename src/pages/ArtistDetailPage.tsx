import React, { useState } from "react";
import { Header } from "../components";
import BannerControl from "../components/Profile/BannerControl";
import ProfileCard from "../components/Profile/ProfileCard";
import TabMenu from "../components/Profile/TabMenu";
import UserTabInfo from "../components/Profile/UserTabInfo";
import DisplayEntry from "../components/Profile/DisplayEntry";
import ArtworkCard from "../components/ArtworkCard";
import TagFilterBar from "../components/Profile/TagFilterBar";
import { useParams } from "react-router-dom";

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

// Mock 작가 데이터 (실제로는 API에서 가져와야 함)
const mockArtistData: Record<string, any> = {
  "1": {
    role: "작가",
    nickName: "김아티스트",
    phoneNumber: "010-1234-5678",
    email: "artist1@test.com",
    introduction:
      "전통 수묵의 깊이와 현대미술의 자유로움이 만나, 새로운 숨결을 그려냅니다.",
    birthdate: "1985.03.15",
    education: "홍익대학교 미술대학 졸업",
    followers: 234,
    following: 67,
  },
  "2": {
    role: "작가",
    nickName: "박크리에이터",
    phoneNumber: "010-2345-6789",
    email: "artist2@test.com",
    introduction: "자연과 인간의 조화를 담은 작품을 만듭니다.",
    birthdate: "1990.07.22",
    education: "서울대학교 미술대학 졸업",
    followers: 156,
    following: 43,
  },
};

const ArtistDetailPage: React.FC = () => {
  const { artistId } = useParams<{ artistId: string }>();

  // 작가 정보 가져오기 (Mock 데이터 사용)
  const artistData = mockArtistData[artistId || "1"] || mockArtistData["1"];

  const [selectedTabId, setSelectedTabId] = useState(artistTabs[0].id);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 현재 사용자와 다른 프로필이므로 항상 false
  const isMyProfile = false;

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

  // 작가노트 등록된 데이터 (Mock - 실제로는 API에서 가져와야 함)
  const registeredEntries = {
    achievement: [
      { id: 1, year: "2023", text: "한국미술대상 우수상 수상" },
      { id: 2, year: "2022", text: "개인전 '새로운 시작' 성공적 개최" },
    ],
    groupExhibition: [
      { id: 1, year: "2023", text: "서울현대미술관 단체전 참여" },
      { id: 2, year: "2022", text: "부산비엔날레 참여" },
    ],
    soloExhibition: [
      { id: 1, year: "2023", text: "갤러리 현대 개인전 '내면의 풍경'" },
    ],
  };

  return (
    <>
      <Header />
      <div className="relative">
        <BannerControl isMyProfile={isMyProfile} />
        <ProfileCard
          role={artistData.role}
          nickName={artistData.nickName}
          followers={artistData.followers}
          following={artistData.following}
          introduction={artistData.introduction}
          birthdate={artistData.birthdate}
          education={artistData.education}
          phoneNumber={artistData.phoneNumber}
          email={artistData.email}
          isMyProfile={isMyProfile}
          className="absolute top-40 left-60"
        />
      </div>
      <div className="flex flex-col ml-133.5 mt-7">
        <TabMenu
          tabs={artistTabs}
          selectedTabId={selectedTabId}
          onTabChange={handleTabChange}
        />
        <UserTabInfo
          nickname={artistData.nickName}
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
        <div className="flex flex-col px-10 py-4 w-286 min-h-132.5 bg-[#F4F5F6]">
          {selectedTabId === "artistNote" && (
            <>
              <div className="w-full h-13.5 py-4 font-semibold text-[#1D1E20]">
                이력 및 수상 경력
              </div>
              <div className="flex flex-col gap-4 w-full min-h-15.5 px-6 py-5 bg-white">
                {registeredEntries.achievement.length > 0 ? (
                  registeredEntries.achievement.map(({ year, text }) => (
                    <DisplayEntry key={year + text} year={year} text={text} />
                  ))
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
                {registeredEntries.groupExhibition.length > 0 ? (
                  registeredEntries.groupExhibition.map(({ year, text }) => (
                    <DisplayEntry key={year + text} year={year} text={text} />
                  ))
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
                {registeredEntries.soloExhibition.length > 0 ? (
                  registeredEntries.soloExhibition.map(({ year, text }) => (
                    <DisplayEntry key={year + text} year={year} text={text} />
                  ))
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
              <div className="grid grid-cols-3 gap-6 px-13.5">
                {getFilteredData().length > 0 ? (
                  getFilteredData().map((item) => (
                    <ArtworkCard
                      key={item.id}
                      imageUrl={item.imageUrl}
                      title={item.title}
                      author={item.author}
                      likes={item.likes}
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
    </>
  );
};

export default ArtistDetailPage;

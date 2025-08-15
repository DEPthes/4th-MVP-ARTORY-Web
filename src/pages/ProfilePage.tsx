import React, { useState } from "react";
import { Header } from "../components";
import BannerControl from "../components/Profile/BannerControl";
import ProfileCard from "../components/Profile/ProfileCard";
import TabMenu from "../components/Profile/TabMenu";
import UserTabInfo from "../components/Profile/UserTabInfo";
import DisplayEntry from "../components/Profile/DisplayEntry";
import EntryList from "../components/NoteField/EntryList";
import type { Entry } from "../components/NoteField/EntryList";
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

const galleryTabs = [
  { id: "exhibition", label: "전시" },
  { id: "contest", label: "공모전" },
  { id: "archive", label: "아카이브" },
];

const collectorTabs = [{ id: "archive", label: "아카이브" }];

interface ArtworkItem {
  id: number;
  imageUrl: string;
  title: string;
  author?: string; // optional
  likes: number;
  tags?: string[]; // optional
}

const tagsMock = [
  "회화",
  "조각",
  "공예",
  "건축",
  "사진",
  "미디어아트",
  "인테리어",
  "기타",
];

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
    // ... 추가 작품
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
    // ... 추가 전시
  ],
  contest: [],
  archive: [
    // 아카이브 탭은 '좋아요' 한 작품/전시/공모전을 포함할 수도 있음. 여기서는 모든 타입의 아이템을 아카이브로 묶음.
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
    // ... 추가 아카이브
  ],
};

const dynamicCounts = {
  작업: artworkDataMock.works.length,
  전시: artworkDataMock.exhibition.length,
  공모전: artworkDataMock.contest.length,
  아카이브: artworkDataMock.archive.length,
};

const noContentMessages = {
  myProfile: {
    works:
      "아직 등록된 작품이 없습니다.\n지금 작품을 올리고 당신의 이야기를 시작해보세요.",
    exhibition:
      "아직 등록된 전시가 없습니다.\n진행중이거나 예정된 전시를 소개해주세요.",
    contest:
      "아직 등록된 공모전이 없습니다.\n진행중이거나 예정된 공모전을 소개해주세요.",
    archive:
      "아직 저장된 아카이브가 없습니다.\n마음에 드는 작품이나 전시를 모아보세요.",
  },
  otherProfile: {
    works: "아직 등록된 작품이 없습니다.",
    exhibition: "아직 등록된 전시가 없습니다.",
    contest: "아직 등록된 공모전이 없습니다.",
    archive: "아직 등록된 아카이브가 없습니다.",
  },
};

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  const [userRole, setUserRole] = useState<"artist" | "gallery" | "collector">(
    "artist" // 이 부분에서 역할 바꾸면서 테스트
  );

  // userRole에 따라 Tab 배열을 선택
  let currentTabs = artistTabs; // 기본값은 artistTabs
  if (userRole === "gallery") {
    currentTabs = galleryTabs;
  } else if (userRole === "collector") {
    currentTabs = collectorTabs;
  }

  const [selectedTabId, setSelectedTabId] = useState(currentTabs[0].id);

  // 임시 유저 정보 (API 전용)
  const nickname = "고은";
  const currentUserId = "current-user-id"; // 실제로는 auth context에서 가져와야 함
  const isMyProfile = true; // URL의 userId와 현재 사용자 ID 비교
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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

  // 탭 변경 핸들러 --
  const handleTabChange = (tabId: string) => {
    setSelectedTabId(tabId);
    setIsEditing(false); // 탭 바뀌면 편집 모드 해제
    setSelectedTag(null); // 탭이 바뀌면 태그 필터도 초기화
  };

  // 편집, 등록 버튼 핸들러 (임시)
  const handleEditClick = () => setIsEditing(true);

  const handleRegisterClick = () => alert("등록 페이지로 이동");

  // 작가노트 각 섹션별 상태
  const [temporaryEntries, setTemporaryEntries] = useState<{
    achievement: Entry[];
    groupExhibition: Entry[];
    soloExhibition: Entry[];
  }>({
    achievement: [{ id: Date.now(), year: "", text: "", registered: false }],
    groupExhibition: [
      { id: Date.now() + 1, year: "", text: "", registered: false },
    ],
    soloExhibition: [
      { id: Date.now() + 2, year: "", text: "", registered: false },
    ],
  });

  const [registeredEntries, setRegisteredEntries] = useState<{
    achievement: Entry[];
    groupExhibition: Entry[];
    soloExhibition: Entry[];
  }>({
    achievement: [],
    groupExhibition: [],
    soloExhibition: [],
  });

  const updateTemporaryEntries = (
    section: keyof typeof temporaryEntries,
    entries: Entry[]
  ) => {
    setTemporaryEntries((prev) => ({ ...prev, [section]: entries }));
  };

  // handleChange 핸들러 (EntryList에서 호출)
  const handleAchievementChange = (newEntries: Entry[]) => {
    updateTemporaryEntries("achievement", newEntries);
  };
  const handleGroupExhibitionChange = (newEntries: Entry[]) => {
    updateTemporaryEntries("groupExhibition", newEntries);
  };
  const handleSoloExhibitionChange = (newEntries: Entry[]) => {
    updateTemporaryEntries("soloExhibition", newEntries);
  };

  // 완료 버튼 핸들러 로직
  const handleCompleteClick = () => {
    const filterAndValidateEntries = (entries: Entry[]) =>
      entries.filter(
        (entry) =>
          entry.registered &&
          (entry.year.trim() !== "" || entry.text.trim() !== "")
      );

    // 각 섹션의 임시 데이터를 'registered: true' 상태인 것만 추출
    const finalAchievementEntries = filterAndValidateEntries(
      temporaryEntries.achievement
    );
    const finalGroupExhibitionEntries = filterAndValidateEntries(
      temporaryEntries.groupExhibition
    );
    const finalSoloExhibitionEntries = filterAndValidateEntries(
      temporaryEntries.soloExhibition
    );

    // 만약 모든 섹션에 등록된(registered: true) 내용이 하나도 없으면
    if (
      finalAchievementEntries.length === 0 &&
      finalGroupExhibitionEntries.length === 0 &&
      finalSoloExhibitionEntries.length === 0
    ) {
      // registeredEntries를 비운 상태로 만들고 편집 모드 해제 -> 빈 화면 유지
      setRegisteredEntries({
        achievement: [],
        groupExhibition: [],
        soloExhibition: [],
      });
      setIsEditing(false);
      return;
    }

    // 등록된 내용이 하나라도 있으면 registeredEntries에 저장
    setRegisteredEntries({
      achievement: finalAchievementEntries,
      groupExhibition: finalGroupExhibitionEntries,
      soloExhibition: finalSoloExhibitionEntries,
    });

    setIsEditing(false);
  };

  return (
    <>
      <Header />
      <div className="relative mx-auto w-full">
        <BannerControl isMyProfile={isMyProfile} />
        <div className="flex">
          <div className="-mt-24 z-10 pl-60 xl:pl-40 md:pl-20 sm:pl-5">
            <div className="sticky top-24">
              <ProfileCard
                role={
                  userRole === "artist"
                    ? "작가"
                    : userRole === "gallery"
                    ? "갤러리"
                    : userRole === "collector"
                    ? "아트 컬렉터"
                    : "" // 기본값
                }
                nickName={nickname}
                followers={123}
                following={45}
                introduction="안녕하세요, 고은입니다."
                birthdate="2003.10.17"
                education="명지대학교 졸업"
                phoneNumber="010-9999-8888"
                email="goeun@example.com"
                isMyProfile={isMyProfile}
              />
            </div>
          </div>

          <div className="flex flex-col w-full mt-7 pl-15 pr-60 xl:pr-40 md:pr-20 sm:pr-5">
            <TabMenu
              tabs={currentTabs}
              selectedTabId={selectedTabId}
              onTabChange={handleTabChange}
            />
            <UserTabInfo
              nickname={nickname}
              currentTabLabel={
                artistTabs.find((t) => t.id === selectedTabId)?.label || ""
              }
              isMyProfile={isMyProfile}
              isEditing={isEditing}
              onEditClick={handleEditClick}
              onCompleteClick={handleCompleteClick}
              onRegisterClick={handleRegisterClick}
              counts={dynamicCounts}
            />
            <div className="flex flex-col px-10 py-4 min-h-132.5 bg-[#F4F5F6]">
              {selectedTabId === "artistNote" && (
                <>
                  <div className="w-full h-13.5 py-4 font-semibold text-[#1D1E20]">
                    이력 및 수상 경력
                  </div>
                  <div className="flex flex-col gap-4 w-full min-h-15.5 px-6 py-5 bg-white">
                    {/* 편집모드면 EntryList 렌더, 아니면 등록된 결과 렌더 */}
                    {isEditing ? (
                      <>
                        <EntryList
                          entries={temporaryEntries.achievement} // 이력 및 수상 경력 임시 상태
                          onChange={handleAchievementChange}
                          placeholder="이력 및 수상 경력을 기재해주세요."
                        />
                      </>
                    ) : (
                      <>
                        {/* 등록 상태 보여주기 (빈 배열이면 아무것도 안보이게 처리) */}
                        {registeredEntries.achievement.length > 0 &&
                          registeredEntries.achievement.map(
                            ({ year, text }) => (
                              <DisplayEntry
                                key={year + text}
                                year={year}
                                text={text}
                              />
                            )
                          )}
                      </>
                    )}
                  </div>
                  <div className="w-full h-13.5 mt-4 py-4 font-semibold text-[#1D1E20]">
                    단체전
                  </div>
                  <div className="flex flex-col gap-4 w-full min-h-15.5 px-6 py-5 bg-white">
                    {isEditing ? (
                      <>
                        <EntryList
                          entries={temporaryEntries.groupExhibition} // 단체전 임시 상태
                          onChange={handleGroupExhibitionChange}
                          placeholder="전시 이력을 기재해주세요."
                        />
                      </>
                    ) : (
                      <>
                        {registeredEntries.groupExhibition.length > 0 &&
                          registeredEntries.groupExhibition.map(
                            ({ year, text }) => (
                              <DisplayEntry
                                key={year + text}
                                year={year}
                                text={text}
                              />
                            )
                          )}
                      </>
                    )}
                  </div>
                  <div className="w-full h-13.5 mt-4 py-4 font-semibold text-[#1D1E20]">
                    개인전
                  </div>
                  <div className="flex flex-col gap-4 w-full min-h-15.5 px-6 py-5 bg-white">
                    {isEditing ? (
                      <>
                        <EntryList
                          entries={temporaryEntries.soloExhibition} // 개인전 임시 상태
                          onChange={handleSoloExhibitionChange}
                          placeholder="전시 이력을 기재해주세요."
                        />
                      </>
                    ) : (
                      <>
                        {registeredEntries.soloExhibition.length > 0 &&
                          registeredEntries.soloExhibition.map(
                            ({ year, text }) => (
                              <DisplayEntry
                                key={year + text}
                                year={year}
                                text={text}
                              />
                            )
                          )}
                      </>
                    )}
                  </div>
                </>
              )}

              {/* 작업, 전시, 공모전, 아카이브 탭 콘텐츠 추가 */}
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
                      variant="primary"
                      onClick={() => {
                        console.log(
                          `${selectedTabId}의 ${item.title} 상세페이지`
                        );
                        // 상세 페이지 이동 로직 (예: navigate('/artwork/${item.id}'))
                      }}
                    />
                  ))
                ) : (
                  <div
                    className="col-span-3 mt-30 flex flex-col justify-center items-center pb-10 text-[#717478] font-normal whitespace-pre-line text-center px-6"
                    style={{ minHeight: "150px" }}
                  >
                    {/* isMyProfile에 따라 다른 메시지 출력 */}
                    {isMyProfile
                      ? noContentMessages.myProfile[
                          selectedTabId as keyof typeof noContentMessages.myProfile
                        ]
                      : noContentMessages.otherProfile[
                          selectedTabId as keyof typeof noContentMessages.otherProfile
                        ]}
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

export default ProfilePage;

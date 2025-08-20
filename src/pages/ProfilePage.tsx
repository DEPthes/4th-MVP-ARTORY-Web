import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import ProfileFieldEdit from "../components/Profile/ProfileFieldEdit";
import { useParams } from "react-router-dom";

type EditorType = "work" | "exhibition" | "contest";

const tabLabelToType: Partial<Record<string, EditorType>> = {
  작업: "work",
  전시: "exhibition",
  공모전: "contest",
};

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
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 로그인한 사용자 정보
  const [currentUserInfo, setCurrentUserInfo] = useState({
    name: "",
    email: "",
    role: "작가",
    introduction: "",
    contact: "",
    birthdate: "2003.10.17",
    education: "명지대학교 졸업",
  });

  // 내 프로필인지 확인
  const [isMyProfile, setIsMyProfile] = useState(false);

  // 프로필 편집 모드 상태 추가
  const [isProfileEditing, setIsProfileEditing] = useState(false);

  // 팔로우 상태 관리 - ProfileCard 내부 버튼 사용으로 상태 제거

  // 편집 중인 프로필 정보 (임시 상태)
  const [editingProfileInfo, setEditingProfileInfo] = useState({
    name: "",
    email: "",
    role: "",
    introduction: "",
    contact: "",
    birthdate: "",
    education: "",
  });

  useEffect(() => {
    const googleID = localStorage.getItem("googleID");
    const isMeRoute = location.pathname.startsWith("/profile/me");
    const selectedJob = localStorage.getItem("selectedJob");

    // 내 프로필인지 확인 (userId가 'me'이거나 현재 사용자 ID와 같은 경우)
    const checkIsMyProfile = isMeRoute || (!!userId && userId === googleID);
    setIsMyProfile(checkIsMyProfile);
    // 마이 페이지(`/profile/me`)에서는 기본 진입 시 프로필 편집 모드로 시작
    setIsProfileEditing(userId === "me");

    if (checkIsMyProfile) {
      // 내 프로필인 경우 localStorage에서 정보 가져오기
      const profileInfo = {
        name: "박기현", // 회원가입 시 입력했던 이름
        email: "test@test.com", // 회원가입 시 입력했던 이메일
        role:
          selectedJob === "Young Artist"
            ? "작가"
            : selectedJob === "Art Collector"
            ? "아트 컬렉터"
            : "갤러리",
        introduction: "테스트 소개글", // 회원가입 시 입력했던 소개
        contact: "01090828490", // 회원가입 시 입력했던 연락처
        birthdate: "2003.10.17",
        education: "명지대학교 졸업",
      };

      setCurrentUserInfo(profileInfo);
      setEditingProfileInfo(profileInfo);
    } else {
      // 다른 사용자 프로필인 경우 (실제로는 API에서 가져와야 함)
      const otherUserInfo = {
        name: "김작가",
        email: "artist@example.com",
        role: "작가",
        introduction: "다른 작가의 소개글입니다.",
        contact: "010-1234-5678",
        birthdate: "1990.05.15",
        education: "홍익대학교 졸업",
      };

      setCurrentUserInfo(otherUserInfo);
      setEditingProfileInfo(otherUserInfo);
    }
  }, [userId]);

  const [userRole] = useState<"artist" | "gallery" | "collector">(
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
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const currentTabLabel = useMemo(
    () => currentTabs.find((t) => t.id === selectedTabId)?.label || "",
    [currentTabs, selectedTabId]
  );

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
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleRegisterClick = useCallback(() => {
    const type = tabLabelToType[currentTabLabel];
    if (!type) {
      console.warn("등록 대상 탭이 아님:", currentTabLabel);
      return;
    }
    navigate(`/editor/${type}/new`, {
      state: { from: location.pathname }, // 돌아올 곳 저장(선택)
    });
  }, [currentTabLabel, navigate, location.pathname]);

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

  // 프로필 편집 관련 핸들러들
  const handleProfileEditClick = () => setIsProfileEditing(true);

  const handleProfileEditCancel = () => {
    setEditingProfileInfo(currentUserInfo);
    setIsProfileEditing(false);
  };

  const handleProfileEditSave = () => {
    setCurrentUserInfo(editingProfileInfo);
    setIsProfileEditing(false);
    // TODO: API 호출하여 서버에 저장
    console.log("프로필 정보 저장:", editingProfileInfo);
  };

  const handleProfileFieldChange = (field: string, value: string) => {
    setEditingProfileInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
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
                role={currentUserInfo.role}
                nickName={currentUserInfo.name}
                followers={123}
                following={45}
                introduction={currentUserInfo.introduction}
                birthdate={currentUserInfo.birthdate}
                education={currentUserInfo.education}
                phoneNumber={currentUserInfo.contact}
                email={currentUserInfo.email}
                isMyProfile={isMyProfile}
                onEditClick={handleProfileEditClick}
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
              nickname={currentUserInfo.name}
              currentTabLabel={currentTabLabel}
              isMyProfile={isMyProfile}
              isEditing={isEditing}
              onEditClick={handleEditClick}
              onCompleteClick={handleCompleteClick}
              onRegisterClick={handleRegisterClick}
              counts={dynamicCounts}
            />
            <div className="flex flex-col px-10 py-4 min-h-132.5 bg-[#F4F5F6]">
              {/* 프로필 편집 모드일 때 편집 가능한 필드들 */}
              {isProfileEditing && isMyProfile && (
                <div className="mb-6 p-6 bg-white rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-[#1D1E20]">
                    프로필 편집
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이름
                      </label>
                      <input
                        type="text"
                        value={editingProfileInfo.name}
                        onChange={(e) =>
                          handleProfileFieldChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이메일
                      </label>
                      <input
                        type="email"
                        value={editingProfileInfo.email}
                        onChange={(e) =>
                          handleProfileFieldChange("email", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        역할
                      </label>
                      <select
                        value={editingProfileInfo.role}
                        onChange={(e) =>
                          handleProfileFieldChange("role", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="작가">작가</option>
                        <option value="갤러리">갤러리</option>
                        <option value="아트 컬렉터">아트 컬렉터</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        연락처
                      </label>
                      <input
                        type="text"
                        value={editingProfileInfo.contact}
                        onChange={(e) =>
                          handleProfileFieldChange("contact", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        생년월일
                      </label>
                      <input
                        type="text"
                        value={editingProfileInfo.birthdate}
                        onChange={(e) =>
                          handleProfileFieldChange("birthdate", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="YYYY.MM.DD"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        학력
                      </label>
                      <input
                        type="text"
                        value={editingProfileInfo.education}
                        onChange={(e) =>
                          handleProfileFieldChange("education", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        소개
                      </label>
                      <textarea
                        value={editingProfileInfo.introduction}
                        onChange={(e) =>
                          handleProfileFieldChange(
                            "introduction",
                            e.target.value
                          )
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <ProfileFieldEdit
                      variant="complete"
                      onClick={handleProfileEditSave}
                      className="flex-1"
                    />
                    <button
                      onClick={handleProfileEditCancel}
                      className="flex-1 h-10.5 px-4 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}

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
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

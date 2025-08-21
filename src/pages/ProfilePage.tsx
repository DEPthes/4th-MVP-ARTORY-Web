import React, { useEffect, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";

// 컴포넌트
import React, { useEffect, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";

// 컴포넌트
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

// API 및 타입
import {
  getUserPosts,
  getUserProfile,
  type PaginatedPostsResponse,
  type Post,
} from "../apis/user";
import {
  type ArtistNoteItem,
  type ArtistNotePayload,
  type ArtistNoteType,
  createArtistNote,
  deleteArtistNote,
  getArtistNote,
  updateArtistNote,
} from "../apis/artistNote";

// Hooks
import { useSidebarProfile } from "../hooks/useUser";

// 상수

// API 및 타입
import {
  getUserPosts,
  getUserProfile,
  type PaginatedPostsResponse,
  type Post,
} from "../apis/user";
import {
  type ArtistNoteItem,
  type ArtistNotePayload,
  type ArtistNoteType,
  createArtistNote,
  deleteArtistNote,
  getArtistNote,
  updateArtistNote,
} from "../apis/artistNote";

// Hooks
import { useSidebarProfile } from "../hooks/useUser";

// 상수
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
const noContentMessages = {
  myProfile: {
    works:
      "아직 등록된 작품이 없습니다.\n진행중이거나 예정된 작품을 소개해주세요.",
      "아직 등록된 작품이 없습니다.\n진행중이거나 예정된 작품을 소개해주세요.",
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

interface UserProfile {
  name: string;
  userType: "ARTIST" | "GALLERY" | "COLLECTOR";
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  followersCount: number;
  followingCount: number;
  description: string;
  birth: string;
  educationBackground: string;
  contact: string;
  email: string;
  isMe: boolean;
  isFollowed: boolean;
  disclosureStatus: boolean;
  artistID: number;
}

interface UserProfile {
  name: string;
  userType: "ARTIST" | "GALLERY" | "COLLECTOR";
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  followersCount: number;
  followingCount: number;
  description: string;
  birth: string;
  educationBackground: string;
  contact: string;
  email: string;
  isMe: boolean;
  isFollowed: boolean;
  disclosureStatus: boolean;
  artistID: number;
}

const ProfilePage: React.FC = () => {
  const queryClient = useQueryClient();
  const { googleID } = useParams<{ googleID: string }>();
  const queryClient = useQueryClient();
  const { googleID } = useParams<{ googleID: string }>();
  const navigate = useNavigate();

  const { data: viewedSidebar } = useSidebarProfile(googleID || null);
  const viewerGoogleID = localStorage.getItem("googleID");

  console.log("--- 🕵️‍♂️ API 요청 전 ID 값 확인 ---");
  console.log("URL에서 가져온 googleID:", googleID);
  console.log("useSidebarProfile 결과 (viewedSidebar):", viewedSidebar);

  // follow API는 내부 userId 필요. sidebar의 id 사용, 없으면 URL 파라미터 폴백
  const userId = viewedSidebar?.id ? String(viewedSidebar.id) : googleID;

  console.log("최종적으로 API에 전달될 userId:", userId);
  console.log("로그인 유저 ID (viewerGoogleID):", viewerGoogleID);
  console.log("------------------------------------");

  // --- 1. 데이터 조회 ---
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    isError,
    error,
  } = useQuery<UserProfile, Error>({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(viewerGoogleID!, userId!),
    enabled: !!viewerGoogleID && !!userId,
  });

  const { isLoading: isArtistNoteLoading, data: artistNotes } = useQuery<
    ArtistNoteItem[],
    Error
  >({
    queryKey: ["artistNote", userId],
    queryFn: () => getArtistNote(viewerGoogleID!, userId!),
    enabled: !!userId && userProfile?.userType === "ARTIST",
  });

  // --- 2. 상태 관리 ---
  const [selectedTabId, setSelectedTabId] = useState("artistNote");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 작가노트 데이터를 위한 상태 타입 정의
  type EntryWithArtistNote = Entry & {
    artistNoteType?: ArtistNoteType;
    description?: string;
  };

  type RegisteredEntriesType = {
    achievement: EntryWithArtistNote[];
    groupExhibition: EntryWithArtistNote[];
    soloExhibition: EntryWithArtistNote[];
  // 작가노트 데이터를 위한 상태 타입 정의
  type EntryWithArtistNote = Entry & {
    artistNoteType?: ArtistNoteType;
    description?: string;
  };

  type RegisteredEntriesType = {
    achievement: EntryWithArtistNote[];
    groupExhibition: EntryWithArtistNote[];
    soloExhibition: EntryWithArtistNote[];
  };

  // 고정된 ID 값들 (컴포넌트 마운트 시 한 번만 생성)
  const [entryIds] = useState(() => ({
    achievement: [1, 2, 3],
    groupExhibition: [4, 5, 6],
    soloExhibition: [7, 8, 9],
  }));

  const [temporaryEntries, setTemporaryEntries] =
    useState<RegisteredEntriesType>({
      achievement: [
        { id: entryIds.achievement[0], year: "", text: "", registered: false },
      ],
      groupExhibition: [
        {
          id: entryIds.groupExhibition[0],
          year: "",
          text: "",
          registered: false,
        },
      ],
      soloExhibition: [
        {
          id: entryIds.soloExhibition[0],
          year: "",
          text: "",
          registered: false,
        },
      ],
    });
  const [registeredEntries, setRegisteredEntries] =
    useState<RegisteredEntriesType>({
      achievement: [],
      groupExhibition: [],
      soloExhibition: [],
    });
  // 고정된 ID 값들 (컴포넌트 마운트 시 한 번만 생성)
  const [entryIds] = useState(() => ({
    achievement: [1, 2, 3],
    groupExhibition: [4, 5, 6],
    soloExhibition: [7, 8, 9],
  }));

  const [temporaryEntries, setTemporaryEntries] =
    useState<RegisteredEntriesType>({
      achievement: [
        { id: entryIds.achievement[0], year: "", text: "", registered: false },
      ],
      groupExhibition: [
        {
          id: entryIds.groupExhibition[0],
          year: "",
          text: "",
          registered: false,
        },
      ],
      soloExhibition: [
        {
          id: entryIds.soloExhibition[0],
          year: "",
          text: "",
          registered: false,
        },
      ],
    });
  const [registeredEntries, setRegisteredEntries] =
    useState<RegisteredEntriesType>({
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

  const handleAchievementChange = (newEntries: Entry[]) =>
  const handleAchievementChange = (newEntries: Entry[]) =>
    updateTemporaryEntries("achievement", newEntries);
  const handleGroupExhibitionChange = (newEntries: Entry[]) =>
  const handleGroupExhibitionChange = (newEntries: Entry[]) =>
    updateTemporaryEntries("groupExhibition", newEntries);
  const handleSoloExhibitionChange = (newEntries: Entry[]) =>
  const handleSoloExhibitionChange = (newEntries: Entry[]) =>
    updateTemporaryEntries("soloExhibition", newEntries);

  // 삭제 버튼 클릭 시 즉시 서버 삭제 처리 핸들러들
  const handleDeleteAchievement = (id: number) => {
    const target = registeredEntries.achievement.find((e) => e.id === id);
    if (target) {
      deleteNoteMutation.mutate({ id });
      setRegisteredEntries((prev) => ({
        ...prev,
        achievement: prev.achievement.filter((e) => e.id !== id),
      }));
    }
  };
  const handleDeleteGroupExhibition = (id: number) => {
    const target = registeredEntries.groupExhibition.find((e) => e.id === id);
    if (target) {
      deleteNoteMutation.mutate({ id });
      setRegisteredEntries((prev) => ({
        ...prev,
        groupExhibition: prev.groupExhibition.filter((e) => e.id !== id),
      }));
    }
  };
  const handleDeleteSoloExhibition = (id: number) => {
    const target = registeredEntries.soloExhibition.find((e) => e.id === id);
    if (target) {
      deleteNoteMutation.mutate({ id });
      setRegisteredEntries((prev) => ({
        ...prev,
        soloExhibition: prev.soloExhibition.filter((e) => e.id !== id),
      }));
    }
  };

  const handleCompleteClick = () => {
    console.log("🎨 작가노트 저장 시작");
    console.log("📝 현재 임시 데이터:", temporaryEntries);
    console.log("📝 기존 등록된 데이터:", registeredEntries);

    const processSection = (
      original: Entry[],
      temp: Entry[],
      type: ArtistNoteType
    ) => {
      console.log(`🔍 ${type} 섹션 처리 시작:`, { original, temp });

      const tempMap = new Map(temp.map((item) => [item.id, item]));
      const originalMap = new Map(original.map((item) => [item.id, item]));

      // 삭제할 항목들 처리
      originalMap.forEach((origItem) => {
        if (!tempMap.has(origItem.id)) {
          console.log(`🗑️ 삭제할 항목:`, origItem);
          deleteNoteMutation.mutate({ id: origItem.id });
        }
      });

      // 생성/수정할 항목들 처리
      tempMap.forEach((tempItem) => {
        if (!tempItem.year && !tempItem.text) {
          console.log(`⏭️ 빈 항목 건너뛰기:`, tempItem);
          return;
        }

        const payload = {
          artistNoteType: type,
          year: tempItem.year,
          description: tempItem.text,
        };

        console.log(`📝 처리할 항목:`, { tempItem, payload });

        const origItem = originalMap.get(tempItem.id);
        if (origItem) {
          // 기존 항목 수정
          if (
            origItem.year !== tempItem.year ||
            origItem.text !== tempItem.text
          ) {
            console.log(`✏️ 항목 수정:`, { id: tempItem.id, payload });
            updateNoteMutation.mutate({ id: tempItem.id, payload });
          } else {
            console.log(`⏭️ 변경사항 없음, 수정 건너뛰기:`, tempItem);
          }
        } else {
          // 새 항목 생성
          console.log(`➕ 새 항목 생성:`, payload);
          createNoteMutation.mutate({ payload });
        }
      });
    };

    processSection(
      registeredEntries.achievement,
      temporaryEntries.achievement,
      "HISTORY"
    );
    processSection(
      registeredEntries.groupExhibition,
      temporaryEntries.groupExhibition,
      "TEAM_EVENT"
    );
    processSection(
      registeredEntries.soloExhibition,
      temporaryEntries.soloExhibition,
      "PERSONAL_EVENT"
    );

    console.log("🎨 작가노트 저장 완료");
    setIsEditing(false);
  };

  // 작가노트 데이터가 로드되면 상태를 업데이트
  useEffect(() => {
    if (!userProfile?.artistID || userProfile.userType !== "ARTIST") return;

    if (artistNotes && artistNotes.length > 0) {
      const achievement = artistNotes
        .filter((item) => item.artistNoteType === "HISTORY")
        .map((d) => ({ ...d, text: d.description, registered: true }));
      const groupExhibition = artistNotes
        .filter((item) => item.artistNoteType === "TEAM_EVENT")
        .map((d) => ({ ...d, text: d.description, registered: true }));
      const soloExhibition = artistNotes
        .filter((item) => item.artistNoteType === "PERSONAL_EVENT")
        .map((d) => ({ ...d, text: d.description, registered: true }));
      const structuredData = { achievement, groupExhibition, soloExhibition };
      setRegisteredEntries(structuredData);
      setTemporaryEntries(structuredData);
    } else if (artistNotes && artistNotes.length === 0) {
      // 서버가 빈 배열을 반환한 경우
      const defaultData = {
        achievement: [],
        groupExhibition: [],
        soloExhibition: [],
      };
      setRegisteredEntries(defaultData);
      setTemporaryEntries({
        achievement: [
          {
            id: entryIds.achievement[0],
            year: "",
            text: "",
            registered: false,
          },
        ],
        groupExhibition: [
          {
            id: entryIds.groupExhibition[0],
            year: "",
            text: "",
            registered: false,
          },
        ],
        soloExhibition: [
          {
            id: entryIds.soloExhibition[0],
            year: "",
            text: "",
            registered: false,
          },
        ],
      });
    }
  }, [artistNotes, userProfile?.artistID, userProfile?.userType]);

  // --- 3. 파생 상태 및 사이드 이펙트 ---
  const userRole = userProfile?.userType || "ARTIST";
  const currentTabs =
    userRole === "GALLERY"
      ? galleryTabs
      : userRole === "COLLECTOR"
      ? collectorTabs
      : artistTabs;
  const isMyProfile = userProfile?.isMe ?? false;

  const getPostType = (tabId: string): string | null => {
    const map: Record<string, string> = {
      works: "ART",
      exhibition: "EXHIBITION",
      contest: "CONTEST",
      archive: "ARCHIVED_POSTS",
    };
    return map[tabId] || null;
  };
  const postType = getPostType(selectedTabId);

  useEffect(() => {
    if (!viewerGoogleID) navigate("/login");
  }, [viewerGoogleID, navigate]);

  useEffect(() => {
    if (userProfile && !currentTabs.some((tab) => tab.id === selectedTabId)) {
      setSelectedTabId(currentTabs[0].id);
    }
  }, [userProfile, currentTabs, selectedTabId]);

  // --- 4. 탭 콘텐츠 데이터 조회 ---
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isLoading: isPostsLoading,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedPostsResponse, Error>({
    queryKey: ["userPosts", userProfile?.artistID, postType, selectedTag],
    queryFn: ({ pageParam = 0 }) =>
      getUserPosts({
        pageParam: pageParam as number,
        viewerGoogleID: viewerGoogleID!,
        userID: userProfile!.artistID,
        postType: postType!,
        tagName: selectedTag,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.pageable.pageNumber + 1,
    initialPageParam: 0,
    enabled: !!userProfile?.artistID && !!postType,
  });
  const allPosts: Post[] =
    postsData?.pages.flatMap((page) => page.content) ?? [];
  const currentTags = Array.from(
    new Set(
      allPosts.flatMap(
        (post) => (post as Post & { tags?: string[] }).tags || []
      )
    )
  );

  // --- 5. 이벤트 핸들러 ---
  const handleTabChange = (tabId: string) => {
    setSelectedTabId(tabId);
    setSelectedTag(null);
    setIsEditing(false);
  };
  const handleProfileImageChange = (file: File) => {
    console.log("업로드할 이미지 파일:", file);

    // 프로필 이미지 변경 후 관련 쿼리 캐시 갱신
    if (userProfile?.artistID) {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", userProfile.artistID.toString()],
      });
    }

    // 사이드바 프로필 정보도 갱신
    if (viewerGoogleID) {
      queryClient.invalidateQueries({
        queryKey: ["sidebarProfile", viewerGoogleID],
      });
    }
  };
  const handleEditClick = () => setIsEditing(true);
  const handleRegisterClick = () => alert("등록 페이지로 이동");

  // --- 6. 작가노트 로직 ---
  const invalidateArtistNoteQuery = () => {
    queryClient.invalidateQueries({
      queryKey: ["artistNote", userId],
    });
  };

  const createNoteMutation = useMutation({
    mutationFn: (variables: { payload: ArtistNotePayload }) =>
      createArtistNote(viewerGoogleID!, variables.payload),
    onSuccess: (data) => {
      console.log("✅ 작가노트 생성 성공:", data);
      invalidateArtistNoteQuery();
    },
    onError: (error) => {
      console.error("❌ 작가노트 생성 실패:", error);
      alert("작가노트 생성에 실패했습니다.");
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: (variables: { id: number; payload: ArtistNotePayload }) =>
      updateArtistNote(viewerGoogleID!, variables.id, variables.payload),
    onSuccess: (data) => {
      console.log("✅ 작가노트 수정 성공:", data);
      invalidateArtistNoteQuery();
    },
    onError: (error) => {
      console.error("❌ 작가노트 수정 실패:", error);
      alert("작가노트 수정에 실패했습니다.");
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (variables: { id: number }) => deleteArtistNote(variables.id),
    onSuccess: (data) => {
      console.log("✅ 작가노트 삭제 성공:", data);
      invalidateArtistNoteQuery();
    },
    onError: (error) => {
      console.error("❌ 작가노트 삭제 실패:", error);
      alert("작가노트 삭제에 실패했습니다.");
    },
  });

  // --- 7. 렌더링 ---
  if (isProfileLoading) {
    return (
      <>
        {" "}
        <Header />{" "}
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">프로필을 불러오는 중...</div>
        </div>{" "}
      </>
    );
  }
  if (isError) {
    return (
      <>
        {" "}
        <Header />{" "}
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg text-red-500">
            프로필을 불러오는데 실패했습니다: {error.message}
          </div>
        </div>{" "}
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="relative mx-auto w-full">
        {userProfile && (
          <>
            <BannerControl
              isMyProfile={isMyProfile}
              initialBannerUrl={userProfile.coverImageUrl || undefined}
              viewerGoogleID={viewerGoogleID || undefined}
              onCoverChange={() => {
                // 커버 변경 후 프로필 캐시 갱신
                if (userProfile?.artistID) {
                  queryClient.invalidateQueries({
                    queryKey: ["userProfile", userProfile.artistID.toString()],
                  });
                }
              }}
            />
            <div className="flex">
              <div className="-mt-24 z-10 pl-60 xl:pl-40 md:pl-20 sm:pl-5">
                <div className="sticky top-24">
                  <ProfileCard
                    isMyProfile={isMyProfile}
                    viewerGoogleID={viewerGoogleID || undefined}
                    userIdForFollowList={
                      viewedSidebar?.id ? String(viewedSidebar.id) : undefined
                    }
                    role={
                      userProfile.userType === "ARTIST"
                        ? "작가"
                        : userProfile.userType === "GALLERY"
                        ? "갤러리"
                        : "아트 컬렉터"
                    }
                    nickName={userProfile.name}
                    image={userProfile.profileImageUrl || undefined}
                    followers={userProfile.followersCount}
                    following={userProfile.followingCount}
                    introduction={userProfile.description}
                    birthdate={userProfile.birth}
                    education={
                      !isMyProfile && !userProfile.disclosureStatus
                        ? ""
                        : userProfile.educationBackground
                    }
                    phoneNumber={userProfile.contact}
                    email={userProfile.email}
                    initialIsFollowed={userProfile.isFollowed}
                    onEditClick={() => navigate("/profile/edit")}
                    onImageChange={handleProfileImageChange}
                  />
                </div>
              </div>
              <div className="flex flex-col w-full mt-7 pl-15 pr-60 xl:pr-40 md:pr-20 sm:pr-5 pb-20">
                <TabMenu
                  tabs={currentTabs}
                  selectedTabId={selectedTabId}
                  onTabChange={handleTabChange}
                />
                <UserTabInfo
                  nickname={userProfile.name}
                  currentTabLabel={
                    currentTabs.find((t) => t.id === selectedTabId)?.label || ""
                  }
                  isMyProfile={isMyProfile}
                  isEditing={isEditing}
                  onEditClick={handleEditClick}
                  onCompleteClick={handleCompleteClick}
                  onRegisterClick={handleRegisterClick}
                  isSaving={
                    createNoteMutation.isPending ||
                    updateNoteMutation.isPending ||
                    deleteNoteMutation.isPending
                  }
                  counts={{
                    [currentTabs.find((t) => t.id === selectedTabId)?.label ||
                    ""]: postsData?.pages[0]?.totalElements ?? 0,
                  }}
                />
                <div className="flex flex-col px-10 py-4 min-h-132.5 bg-[#F4F5F6]">
                  {selectedTabId === "artistNote" ? (
                    <>
                      <div className="w-full h-13.5 py-4 font-semibold text-[#1D1E20]">
                        이력 및 수상 경력
                      </div>
                      <div className="flex flex-col gap-4 w-full min-h-15.5 px-6 py-5 bg-white">
                        {isArtistNoteLoading ? (
                          <div className="text-center py-4 text-gray-500">
                            작가노트를 불러오는 중...
                          </div>
                        ) : isEditing ? (
                          <EntryList
                            entries={temporaryEntries.achievement}
                            onChange={handleAchievementChange}
                            placeholder="이력 및 수상 경력을 기재해주세요."
                            onDeleteRegistered={handleDeleteAchievement}
                          />
                        ) : registeredEntries.achievement.length > 0 ? (
                          registeredEntries.achievement.map(
                            ({ year, text, id }) => (
                              <DisplayEntry key={id} year={year} text={text} />
                            )
                          )
                        ) : (
                          <div className="text-gray-500">
                            등록된 이력 및 수상 경력이 없습니다.
                          </div>
                        )}
                      </div>
                      <div className="w-full h-13.5 mt-4 py-4 font-semibold text-[#1D1E20]">
                        단체전
                      </div>
                      <div className="flex flex-col gap-4 w-full min-h-15.5 px-6 py-5 bg-white">
                        {isArtistNoteLoading ? (
                          <div className="text-center py-4 text-gray-500">
                            작가노트를 불러오는 중...
                          </div>
                        ) : isEditing ? (
                          <EntryList
                            entries={temporaryEntries.groupExhibition}
                            onChange={handleGroupExhibitionChange}
                            placeholder="전시 이력을 기재해주세요."
                            onDeleteRegistered={handleDeleteGroupExhibition}
                          />
                        ) : registeredEntries.groupExhibition.length > 0 ? (
                          registeredEntries.groupExhibition.map(
                            ({ year, text, id }) => (
                              <DisplayEntry key={id} year={year} text={text} />
                            )
                          )
                        ) : (
                          <div className="text-gray-500">
                            등록된 단체전 정보가 없습니다.
                          </div>
                        )}
                      </div>
                      <div className="w-full h-13.5 mt-4 py-4 font-semibold text-[#1D1E20]">
                        개인전
                      </div>
                      <div className="flex flex-col gap-4 w-full min-h-15.5 px-6 py-5 bg-white">
                        {isArtistNoteLoading ? (
                          <div className="text-center py-4 text-gray-500">
                            작가노트를 불러오는 중...
                          </div>
                        ) : isEditing ? (
                          <EntryList
                            entries={temporaryEntries.soloExhibition}
                            onChange={handleSoloExhibitionChange}
                            placeholder="전시 이력을 기재해주세요."
                            onDeleteRegistered={handleDeleteSoloExhibition}
                          />
                        ) : registeredEntries.soloExhibition.length > 0 ? (
                          registeredEntries.soloExhibition.map(
                            ({ year, text, id }) => (
                              <DisplayEntry key={id} year={year} text={text} />
                            )
                          )
                        ) : (
                          <div className="text-gray-500">
                            등록된 개인전 정보가 없습니다.
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <TagFilterBar
                        tags={currentTags}
                        selectedTag={selectedTag}
                        onTagSelect={setSelectedTag}
                      />
                      {isPostsLoading ? (
                        <div className="text-center py-10">
                          게시물을 불러오는 중...
                        </div>
                      ) : allPosts.length > 0 ? (
                        <>
                          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 px-13.5">
                            {allPosts.map((post) => (
                              <ArtworkCard
                                key={post.postId}
                                imageUrl={post.imageUrls[0]}
                                title={post.title}
                                author={post.userName}
                                likes={post.archived}
                                variant="primary"
                                onClick={() =>
                                  navigate(`/posts/${post.postId}`)
                                }
                              />
                            ))}
                          </div>
                          <div className="flex justify-center mt-8">
                            {hasNextPage && (
                              <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:bg-gray-400"
                              >
                                {" "}
                                {isFetchingNextPage
                                  ? "불러오는 중..."
                                  : "더 보기"}{" "}
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        <div
                          className="col-span-3 mt-30 flex flex-col justify-center items-center pb-10 text-[#717478] font-normal whitespace-pre-line text-center px-6"
                          style={{ minHeight: "150px" }}
                        >
                          {isMyProfile
                            ? noContentMessages.myProfile[
                                selectedTabId as keyof typeof noContentMessages.myProfile
                              ]
                            : noContentMessages.otherProfile[
                                selectedTabId as keyof typeof noContentMessages.otherProfile
                              ]}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
                            ({ year, text, id }) => (
                              <DisplayEntry key={id} year={year} text={text} />
                            )
                          )
                        ) : (
                          <div className="text-gray-500">
                            등록된 개인전 정보가 없습니다.
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <TagFilterBar
                        tags={currentTags}
                        selectedTag={selectedTag}
                        onTagSelect={setSelectedTag}
                      />
                      {isPostsLoading ? (
                        <div className="text-center py-10">
                          게시물을 불러오는 중...
                        </div>
                      ) : allPosts.length > 0 ? (
                        <>
                          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 px-13.5">
                            {allPosts.map((post) => (
                              <ArtworkCard
                                key={post.postId}
                                imageUrl={post.imageUrls[0]}
                                title={post.title}
                                author={post.userName}
                                likes={post.archived}
                                variant="primary"
                                onClick={() =>
                                  navigate(`/posts/${post.postId}`)
                                }
                              />
                            ))}
                          </div>
                          <div className="flex justify-center mt-8">
                            {hasNextPage && (
                              <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:bg-gray-400"
                              >
                                {" "}
                                {isFetchingNextPage
                                  ? "불러오는 중..."
                                  : "더 보기"}{" "}
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        <div
                          className="col-span-3 mt-30 flex flex-col justify-center items-center pb-10 text-[#717478] font-normal whitespace-pre-line text-center px-6"
                          style={{ minHeight: "150px" }}
                        >
                          {isMyProfile
                            ? noContentMessages.myProfile[
                                selectedTabId as keyof typeof noContentMessages.myProfile
                              ]
                            : noContentMessages.otherProfile[
                                selectedTabId as keyof typeof noContentMessages.otherProfile
                              ]}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProfilePage;

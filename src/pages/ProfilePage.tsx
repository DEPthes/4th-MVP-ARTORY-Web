import React, { useEffect, useState, useMemo, useCallback } from "react";
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
import { getUserProfile, type UserProfile } from "../apis/user";
import {
  type ArtistNoteItem,
  type ArtistNotePayload,
  type ArtistNoteType,
  createArtistNote,
  deleteArtistNote,
  getArtistNote,
  updateArtistNote,
} from "../apis/artistNote";
import { fetchProfilePosts, type ProfilePostsParams } from "../apis/userPosts";
import { normalizeTagName, type PostType } from "../utils/postType";
import type { ProfilePostsPage, ProfilePost } from "../types/post-list";
import { getUserTags } from "../apis/userTags";
import { archiveApi } from "../apis/archive";

// Hooks
import { useSidebarProfile } from "../hooks/useUser";

type EditorTypeSlug = "work" | "exhibition" | "contest";
const tabIdToEditorType = (tabId: string): EditorTypeSlug | null => {
  const map: Record<string, EditorTypeSlug> = {
    works: "work",
    exhibition: "exhibition",
    contest: "contest",
  };
  return map[tabId] ?? null; // artistNote, archive 등은 null
};

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

  // 타입별 태그 캐시/선택값(탭 전환해도 기억)
  const [tagsByType, setTagsByType] = useState<Record<PostType, string[]>>({
    ART: [],
    EXHIBITION: [],
    CONTEST: [],
  });
  const [selectedTagByType, setSelectedTagByType] = useState<
    Record<PostType, string | null>
  >({
    ART: null,
    EXHIBITION: null,
    CONTEST: null,
  });

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

  const updateTemporaryEntries = (
    section: keyof typeof temporaryEntries,
    entries: Entry[]
  ) => {
    setTemporaryEntries((prev) => ({ ...prev, [section]: entries }));
  };

  const handleAchievementChange = (newEntries: Entry[]) =>
    updateTemporaryEntries("achievement", newEntries);
  const handleGroupExhibitionChange = (newEntries: Entry[]) =>
    updateTemporaryEntries("groupExhibition", newEntries);
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

  // 게시글/태그 조회용 대상 userID 숫자 보정
  const targetUserId = useMemo<number | undefined>(() => {
    if (typeof viewedSidebar?.id === "number") return viewedSidebar.id;
    if (typeof userProfile?.artistID === "number") return userProfile.artistID;
    return undefined;
  }, [viewedSidebar?.id, userProfile?.artistID]);

  const getPostType = (tabId: string): string | null => {
    const map: Record<string, string> = {
      works: "ART",
      exhibition: "EXHIBITION",
      contest: "CONTEST",
      archive: "ARCHIVED_POSTS",
    };
    return map[tabId] || null;
  };
  const postType = getPostType(selectedTabId) as PostType | null;

  // 현재 타입의 서버 태그/선택 태그 파생
  const serverTags = postType ? tagsByType[postType] ?? [] : [];
  const currentSelectedTag = postType
    ? selectedTagByType[postType] ?? null
    : null;

  // --- 4. 탭 콘텐츠 데이터 조회 ---
  const pageSize = 10;

  // 탭 변경 시 불필요한 쿼리 실행 방지를 위한 메모이제이션
  const memoizedQueryKey = useMemo(() => {
    const key = [
      "userPosts",
      targetUserId ?? 0,
      postType ?? "NONE",
      normalizeTagName(currentSelectedTag ?? selectedTag),
      pageSize,
    ];
    console.log(`🔑 쿼리 키 생성:`, key);
    return key;
  }, [targetUserId, postType, currentSelectedTag, selectedTag, pageSize]);

  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isLoading: isPostsLoading,
    isFetchingNextPage,
  } = useInfiniteQuery<ProfilePostsPage, Error>({
    queryKey: memoizedQueryKey,
    queryFn: ({ pageParam = 0 }) => {
      console.log(
        `🚀 API 호출 시작: postType=${postType}, page=${pageParam}, tabId=${selectedTabId}`
      );
      const params = {
        page: Number(pageParam),
        size: pageSize,
        googleID: viewerGoogleID!,
        userID: targetUserId!,
        postType: postType!,
        tagName: normalizeTagName(currentSelectedTag ?? selectedTag),
      } satisfies ProfilePostsParams;
      return fetchProfilePosts(params);
    },
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : (lastPage.pageable?.pageNumber ?? 0) + 1,
    initialPageParam: 0,
    enabled:
      !!viewerGoogleID &&
      !!targetUserId &&
      !!postType &&
      selectedTabId !== "archive" &&
      selectedTabId !== "artistNote" &&
      (selectedTabId === "works" ||
        selectedTabId === "exhibition" ||
        selectedTabId === "contest"), // 명시적으로 허용된 탭만 활성화
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 신선하게 유지
    gcTime: 10 * 60 * 1000, // 10분간 가비지 컬렉션 방지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 재요청 방지
    refetchOnMount: false, // 컴포넌트 마운트 시 자동 재요청 방지
    refetchOnReconnect: false, // 네트워크 재연결 시 자동 재요청 방지
  });

  // 쿼리 상태 모니터링
  useEffect(() => {
    if (
      postType &&
      selectedTabId !== "archive" &&
      selectedTabId !== "artistNote"
    ) {
      console.log(`📊 ${selectedTabId} 탭 쿼리 상태:`, {
        isLoading: isPostsLoading,
        isFetchingNextPage,
        hasNextPage,
        dataLength: postsData?.pages?.length || 0,
        totalPosts: postsData?.pages?.[0]?.totalElements || 0,
      });
    }
  }, [
    selectedTabId,
    postType,
    isPostsLoading,
    isFetchingNextPage,
    hasNextPage,
    postsData,
  ]);

  // 탭 변경 핸들러 최적화
  const handleTabChange = useCallback(
    (tabId: string) => {
      console.log(`🔄 탭 변경: ${selectedTabId} → ${tabId}`);
      setSelectedTabId(tabId);
      setIsEditing(false);
      const nextType = getPostType(tabId) as PostType | null;
      if (nextType) {
        setSelectedTag(selectedTagByType[nextType] ?? null);
        console.log(`📊 ${tabId} 탭의 postType: ${nextType}`);
      } else {
        setSelectedTag(null);
        console.log(`📊 ${tabId} 탭은 postType이 없음`);
      }
    },
    [selectedTabId, selectedTagByType]
  );

  // 태그 선택 핸들러 최적화
  const handleTagSelect = useCallback(
    (tag: string | null) => {
      console.log(`🏷️ 태그 선택: ${tag}`);
      setSelectedTag(tag);
      if (postType) {
        setSelectedTagByType((s) => ({ ...s, [postType]: tag }));
      }
    },
    [postType]
  );

  useEffect(() => {
    if (!viewerGoogleID) navigate("/login");
  }, [viewerGoogleID, navigate]);

  useEffect(() => {
    if (userProfile && !currentTabs.some((tab) => tab.id === selectedTabId)) {
      setSelectedTabId(currentTabs[0].id);
    }
  }, [userProfile, currentTabs, selectedTabId]);

  // 태그 데이터를 React Query로 관리하여 캐싱과 중복 요청 방지
  const { data: tagsData, isLoading: isTagsLoading } = useQuery({
    queryKey: ["userTags", targetUserId, postType],
    queryFn: async () => {
      if (!targetUserId || !postType) return [];
      console.log(
        `🏷️ 태그 API 호출: postType=${postType}, userID=${targetUserId}`
      );
      try {
        const names = await getUserTags({
          userID: targetUserId,
          postType,
        });
        console.log(`✅ 태그 로드 완료: ${postType}`, names);
        return names;
      } catch (e) {
        console.error("태그 조회 실패", e);
        return [];
      }
    },
    enabled: !!targetUserId && !!postType && selectedTabId !== "artistNote",
    staleTime: 10 * 60 * 1000, // 10분간 태그 데이터를 신선하게 유지
    gcTime: 30 * 60 * 1000, // 30분간 가비지 컬렉션 방지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1, // 재시도 횟수 제한
    retryDelay: 1000, // 재시도 간격 1초
  });

  // 태그 데이터를 상태에 동기화 (중복 설정 방지)
  useEffect(() => {
    if (tagsData && postType && !tagsByType[postType]?.length) {
      console.log(`🔄 태그 상태 동기화: ${postType}`, tagsData);
      setTagsByType((s) => ({ ...s, [postType]: tagsData }));
    }
  }, [tagsData, postType, tagsByType]);

  // 태그 API 호출 모니터링
  useEffect(() => {
    if (postType && selectedTabId !== "artistNote") {
      console.log(`📊 태그 상태: ${selectedTabId} 탭`, {
        postType,
        tagsData: tagsData?.length || 0,
        isTagsLoading,
        currentTags: tagsByType[postType]?.length || 0,
      });
    }
  }, [selectedTabId, postType, tagsData, isTagsLoading, tagsByType]);

  // 아카이브 탭용 별도 API 쿼리
  const { data: archiveData, isLoading: isArchiveLoading } = useQuery({
    queryKey: ["userArchive", targetUserId, selectedTag],
    queryFn: () =>
      archiveApi.getUserArchivedPosts({
        googleID: viewerGoogleID!,
        userID: targetUserId!,
        postType: "ART", // 아카이브는 ART 타입으로 조회
        page: 0,
        size: pageSize,
      }),
    enabled: !!viewerGoogleID && !!targetUserId && selectedTabId === "archive",
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 신선하게 유지
    gcTime: 10 * 60 * 1000, // 10분간 가비지 컬렉션 방지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 재요청 방지
    refetchOnMount: false, // 컴포넌트 마운트 시 자동 재요청 방지
    refetchOnReconnect: false, // 네트워크 재연결 시 자동 재요청 방지
  });

  // 현재 로드된 데이터로 카드/태그 도출
  const allPosts: ProfilePost[] =
    postsData?.pages.flatMap((page) => (page?.content ?? []).filter(Boolean)) ??
    [];

  // ProfilePost에 isArchived 속성 추가 (기본값: false)
  const allPostsWithArchiveStatus: ProfilePost[] = allPosts.map((post) => ({
    ...post,
    isArchived: false, // 일반 게시물은 기본적으로 아카이브되지 않음
  }));

  const archivePosts = archiveData?.content ?? [];

  // 아카이브 게시물에 isArchived 속성 추가 (기본값: true)
  const archivePostsWithArchiveStatus = archivePosts.map((post) => ({
    ...post,
    isArchived: true, // 아카이브 탭의 게시물은 모두 아카이브된 상태
  }));

  // 현재 탭의 작품 리스트(필터 태그 적용 전)
  let data: ProfilePost[] | typeof archivePostsWithArchiveStatus = [];

  if (selectedTabId === "archive") {
    data = archivePostsWithArchiveStatus;
  } else if (postType) {
    data = allPostsWithArchiveStatus;
  }

  // --- 5. 이벤트 핸들러 ---
  const handleEditClick = () => setIsEditing(true);

  const handleProfileImageChange = useCallback(
    (file: File) => {
      console.log("🔄 프로필 이미지 변경 시작:", file.name);

      // 즉시 UI 업데이트를 위한 낙관적 업데이트
      if (viewerGoogleID) {
        // 사이드바 프로필에 낙관적 업데이트 적용
        const currentSidebarProfile = queryClient.getQueryData([
          "sidebarProfile",
          viewerGoogleID,
        ]);

        if (currentSidebarProfile) {
          // File을 base64로 변환하여 즉시 표시
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageUrl = e.target?.result as string;

            // 사이드바 프로필 데이터를 낙관적으로 업데이트
            queryClient.setQueryData(["sidebarProfile", viewerGoogleID], {
              ...currentSidebarProfile,
              profileImageURL: imageUrl,
            });

            console.log("🔄 사이드바 프로필 낙관적 업데이트 완료");
          };
          reader.readAsDataURL(file);
        }
      }

      // 프로필 이미지 변경 후 관련 쿼리 캐시 갱신
      if (userProfile?.artistID) {
        queryClient.invalidateQueries({
          queryKey: ["userProfile", userProfile.artistID.toString()],
        });
      }

      // 사이드바 프로필 정보도 갱신 - 더 포괄적인 무효화
      if (viewerGoogleID) {
        console.log("🔄 사이드바 프로필 캐시 무효화 시작");

        // 사이드바 프로필 관련 모든 쿼리 무효화
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey;
            return (
              // 사이드바 프로필 관련 쿼리들
              (Array.isArray(queryKey) && queryKey[0] === "sidebarProfile") ||
              // 사용자 프로필 관련 쿼리들
              (Array.isArray(queryKey) && queryKey[0] === "userProfile") ||
              // 사용자 관련 모든 쿼리들
              (Array.isArray(queryKey) && queryKey[0] === "user")
            );
          },
        });

        // 사이드바 프로필 캐시를 완전히 제거하여 즉시 새로운 데이터 가져오기
        queryClient.removeQueries({
          queryKey: ["sidebarProfile", viewerGoogleID],
        });

        // 강제로 사이드바 프로필 쿼리 재실행
        queryClient.refetchQueries({
          queryKey: ["sidebarProfile", viewerGoogleID],
        });

        console.log("✅ 프로필 이미지 변경으로 인한 캐시 무효화 완료");
      }
    },
    [viewerGoogleID, userProfile?.artistID, queryClient]
  );

  const handleRegisterClick = () => {
    const editorType = tabIdToEditorType(selectedTabId);
    if (!editorType) {
      console.warn("등록 대상이 아닌 탭:", selectedTabId);
      return;
    }
    navigate(`/editor/${editorType}/new`);
  };

  const currentTotal = postsData?.pages?.[0]?.totalElements ?? 0;

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
                    useNoneAction={false}
                    initialIsFollowed={userProfile.isFollowed}
                    onEditClick={() => navigate("/profile/edit")}
                    onImageChange={handleProfileImageChange}
                    galleryLocation={
                      userProfile.userType === "GALLERY"
                        ? userProfile.location
                        : undefined
                    }
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
                    ""]: currentTotal,
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
                        tags={serverTags}
                        selectedTag={currentSelectedTag ?? selectedTag}
                        onTagSelect={handleTagSelect}
                        isLoading={isTagsLoading}
                      />
                      {isPostsLoading ||
                      (selectedTabId === "archive" && isArchiveLoading) ? (
                        <div className="text-center py-10">
                          {selectedTabId === "archive"
                            ? "아카이브를 불러오는 중..."
                            : "게시물을 불러오는 중..."}
                        </div>
                      ) : data.length > 0 ? (
                        <>
                          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 px-13.5">
                            {data.map((post: any) => (
                              <ArtworkCard
                                key={post.postId}
                                imageUrl={post.imageUrls?.[0] ?? ""}
                                title={post.title ?? ""}
                                author={post.userName ?? ""}
                                likes={post.archived ?? 0}
                                liked={post.isArchived} // 아카이브 상태와 하트 상태를 동기화
                                isArchived={post.isArchived}
                                isDetailPage={selectedTabId === "archive"} // 아카이브 탭에서는 토글 가능
                                onToggleLike={
                                  selectedTabId === "archive"
                                    ? () => {
                                        // 아카이브 탭에서는 아카이브 제거
                                        if (post.postId) {
                                          // 아카이브 제거 API 호출
                                          console.log(
                                            "아카이브 제거:",
                                            post.postId
                                          );
                                        }
                                      }
                                    : undefined
                                }
                                onToggleArchive={
                                  selectedTabId === "archive"
                                    ? () => {
                                        // 아카이브 탭에서는 아카이브 제거
                                        if (post.postId) {
                                          // 아카이브 제거 API 호출
                                          console.log(
                                            "아카이브 제거:",
                                            post.postId
                                          );
                                        }
                                      }
                                    : undefined
                                }
                                variant="primary"
                                onClick={() => {
                                  // 아카이브 탭의 게시물을 상세페이지로 이동
                                  if (selectedTabId === "archive") {
                                    if (post.postType === "ART") {
                                      navigate(`/collection/${post.postId}`);
                                    } else if (post.postType === "EXHIBITION") {
                                      navigate(`/exhibition/${post.postId}`);
                                    } else if (post.postType === "CONTEST") {
                                      navigate(`/contest/${post.postId}`);
                                    }
                                  } else {
                                    navigate(`/posts/${post.postId}`);
                                  }
                                }}
                              />
                            ))}
                          </div>
                          {/* 더 보기 버튼 (아카이브가 아닌 경우에만) */}
                          {selectedTabId !== "archive" && hasNextPage && (
                            <div className="flex justify-center mt-8">
                              <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:bg-gray-400"
                              >
                                {isFetchingNextPage
                                  ? "불러오는 중..."
                                  : "더 보기"}
                              </button>
                            </div>
                          )}
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

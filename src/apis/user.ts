import axios from "axios";

// 사용자 관련 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  job?: string;
  nickname?: string;
  bio?: string;
  experience?: string;
  interests?: string[];
  website?: string;
  instagram?: string;
  profileCompleted?: boolean;
}

// 백엔드 실제 응답 타입
export interface BackendLoginResponse {
  googleID: string;
  isMember: boolean; // true: 기존회원, false: 신규회원
  userID: string | null;
}

// 프론트엔드에서 사용할 LoginResponse 타입 (기존 유지)
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  isNewUser?: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

// 작가 회원가입 데이터 타입
export interface ArtistRegistrationData {
  name: string;
  googleID: string;
  email: string;
  introduction: string;
  contact: string;
  birth: string;
  educationBackground: string;
  disclosureStatus: boolean;
}

// 컬렉터 회원가입 데이터 타입 (작가와 동일한 구조)
export interface CollectorRegistrationData {
  name: string;
  googleID: string;
  email: string;
  introduction: string;
  contact: string;
  birth: string;
  educationBackground: string;
  disclosureStatus: boolean;
}

// 갤러리 회원가입 데이터 타입
export interface GalleryRegistrationData {
  userName: string;
  googleID: string;
  email: string;
  introduction: string;
  contact: string;
  galleryName: string;
  location: string;
  registrationNumber: string;
}

// 사이드바 프로필 응답 타입
export interface SidebarProfileResponse {
  id: number; // 실제 사용자 ID
  username: string;
  profileImageURL: string;
  userType: "ARTIST" | "GALLERY" | "COLLECTOR";
}

// User API 객체
export const userApi = {
  // Google 로그인 (실제 제공된 API)
  async googleLogin(code: string): Promise<BackendLoginResponse> {
    try {
      console.log("🚀 Google 로그인 요청 시작, code:", code);

      // 프록시를 통한 API 호출 (Mixed Content 에러 방지)
      console.log("🔗 프록시를 통한 백엔드 API 호출");
      const response = await axios.post<{
        code: number;
        status: string;
        message: string;
        data: BackendLoginResponse;
      }>(
        "/api/auth/login",
        {
          code,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      console.log("📦 백엔드 원본 응답:", response.data);
      console.log("📋 실제 로그인 데이터:", response.data.data);

      return response.data.data; // 백엔드 응답 그대로 반환
    } catch (error: unknown) {
      console.error("💥 Google 로그인 API 에러:", error);

      if (error instanceof Error && "response" in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: unknown;
            headers?: Record<string, string>;
          };
        };
        console.error("📋 에러 상태코드:", axiosError.response?.status);
        console.error("📋 에러 응답 데이터:", axiosError.response?.data);
        console.error("📋 에러 헤더:", axiosError.response?.headers);
      }

      throw error; // 원래 에러를 다시 던짐
    }
  },

  // 작가 회원가입 (실제 제공된 API)
  async registerArtist(data: ArtistRegistrationData): Promise<ApiResponse> {
    // 프록시를 통한 API 호출
    const response = await axios.post<{
      code: number;
      status: string;
      message: string;
      data: boolean | Record<string, unknown>;
    }>("/api/user/register/artist", data, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    console.log("📦 작가 회원가입 백엔드 원본 응답:", response.data);

    // 백엔드 응답을 프론트엔드 형식으로 변환
    // HTTP 표준: 성공 시 code 200과 status "OK"
    return {
      success: response.data.code === 200 && response.data.status === "OK",
      data: response.data.data,
      message: response.data.message,
    };
  },

  // 컬렉터 회원가입 (실제 제공된 API)
  async registerCollector(
    data: CollectorRegistrationData
  ): Promise<ApiResponse> {
    // 프록시를 통한 API 호출
    const response = await axios.post<{
      code: number;
      status: string;
      message: string;
      data: boolean | Record<string, unknown>;
    }>("/api/user/register/collector", data, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    console.log("📦 컬렉터 회원가입 백엔드 원본 응답:", response.data);

    // 백엔드 응답을 프론트엔드 형식으로 변환
    // HTTP 표준: 성공 시 code 200과 status "OK"
    return {
      success: response.data.code === 200 && response.data.status === "OK",
      data: response.data.data,
      message: response.data.message,
    };
  },

  // 갤러리 회원가입 (실제 제공된 API)
  async registerGallery(data: GalleryRegistrationData): Promise<ApiResponse> {
    try {
      console.log("🏛️ 갤러리 회원가입 API 호출 시작");
      console.log(
        "📤 갤러리 회원가입 요청 데이터:",
        JSON.stringify(data, null, 2)
      );

      // 프록시를 통한 API 호출
      console.log("🌐 프록시를 통한 갤러리 회원가입 요청");

      const response = await axios.post<{
        code: number;
        status: string;
        message: string;
        data: boolean | Record<string, unknown>;
      }>("/api/user/register/gallery", data, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      });

      console.log("📦 갤러리 회원가입 백엔드 원본 응답:", response.data);

      // 백엔드 응답을 프론트엔드 형식으로 변환
      // HTTP 표준: 성공 시 code 200과 status "OK"
      return {
        success: response.data.code === 200 && response.data.status === "OK",
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: unknown) {
      console.error("💥 갤러리 회원가입 에러:", error);

      if (error instanceof Error && "response" in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: { message?: string };
            headers?: Record<string, string>;
          };
        };
        console.error("📋 에러 상태코드:", axiosError.response?.status);
        console.error("📋 에러 응답 데이터:", axiosError.response?.data);
        console.error("📋 에러 헤더:", axiosError.response?.headers);

        return {
          success: false,
          message:
            axiosError.response?.data?.message ||
            "갤러리 회원가입에 실패했습니다.",
        };
      }

      return {
        success: false,
        message: "갤러리 회원가입에 실패했습니다.",
      };
    }
  },

  // 로그아웃 (로컬 스토리지만 정리 - googleID 기반 시스템)
  async logout(): Promise<void> {
    localStorage.removeItem("googleID");
    localStorage.removeItem("tempGoogleID");
    localStorage.removeItem("selectedJob");
    localStorage.removeItem("accessToken"); // legacy
    localStorage.removeItem("refreshToken"); // legacy
    localStorage.removeItem("userInfo");
    console.log("🚪 로그아웃: googleID 및 관련 정보 제거 완료");
  },

  // 사이드바 프로필 정보 조회
  async getSidebarProfile(googleId: string): Promise<SidebarProfileResponse> {
    console.log("📋 사이드바 프로필 정보 조회 시작, googleId:", googleId);

    // 프록시를 통한 API 호출
    console.log("🔗 프록시를 통한 사이드바 프로필 API 호출");
    const response = await axios.get<{
      code: number;
      status: string;
      message: string;
      data: SidebarProfileResponse;
    }>(`/api/user/side/profile?google_id=${encodeURIComponent(googleId)}`, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    console.log("📦 사이드바 프로필 백엔드 응답:", response.data);
    console.log("📋 사이드바 프로필 데이터:", response.data.data);

    return response.data.data;
  },
};

// =================================================================
// 1. API 응답 데이터 타입 정의 (Interfaces)
// =================================================================

/** 프로필 정보 API (/api/user/profile) 응답 데이터 타입 */
export interface UserProfile {
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
  // 백엔드에서 counts 객체를 보내준다고 가정
  counts?: {
    works?: number;
    exhibition?: number;
    contest?: number;
    archive?: number;
  };
}

/** 단일 게시물 데이터 타입 */
export interface Post {
  postId: string;
  postType: "ART" | "EXHIBITION" | "CONTEST";
  title: string;
  imageUrls: string[];
  userName: string;
  archived: number; // '좋아요' 또는 '아카이브' 수
  isMine: boolean;
  isArchived: boolean;
}

/** 페이지네이션 정보가 포함된 게시물 목록 API 응답 데이터 타입 */
export interface PaginatedPostsResponse {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  number: number; // 현재 페이지 번호
  numberOfElements: number;
  content: Post[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  empty: boolean;
}

// =================================================================
// 2. API 요청 함수 정의
// =================================================================

/**
 * 특정 유저의 프로필 정보를 조회합니다.
 * @param viewerGoogleID - 현재 접속한 유저(보는 사람)의 googleID
 * @param userId - 프로필 주인의 ID
 * @returns {Promise<UserProfile>} 유저 프로필 정보
 */
export const getUserProfile = async (
  viewerGoogleID: string,
  userId: string
): Promise<UserProfile> => {
  // 실제 API 응답은 { code, status, message, data: UserProfile } 형태이므로,
  // axios 응답 타입의 data 프로퍼티를 해당 구조로 지정해줍니다.
  const response = await axios.get<{ data: UserProfile }>("/api/user/profile", {
    params: {
      googleID: viewerGoogleID,
      userId: userId,
    },
  });
  return response.data.data;
};

/** getUserPosts 함수에 전달될 파라미터 객체의 타입 */
interface GetUserPostsParams {
  pageParam?: number; // useInfiniteQuery가 자동으로 관리
  viewerGoogleID: string;
  userID: number;
  postType: string;
  tagName?: string | null;
  size?: number;
}

/**
 * 특정 유저의 게시물 목록을 페이지네이션으로 조회합니다.
 * @param params - 조회에 필요한 파라미터 객체
 * @returns {Promise<PaginatedPostsResponse>} 페이지네이션된 게시물 목록
 */
export const getUserPosts = async ({
  pageParam = 0,
  viewerGoogleID,
  userID,
  postType,
  tagName = null,
  size = 9,
}: GetUserPostsParams): Promise<PaginatedPostsResponse> => {
  const params: Record<string, string | number | null> = {
    page: pageParam,
    size,
    googleID: viewerGoogleID,
    userID,
    postType,
    tagName,
  };

  // tagName이 null이거나 비어있으면 파라미터에서 제외
  if (!tagName) {
    delete params.tagName;
  }

  const response = await axios.get<{ data: PaginatedPostsResponse }>(
    "/api/posts",
    {
      params,
    }
  );
  return response.data.data;
};

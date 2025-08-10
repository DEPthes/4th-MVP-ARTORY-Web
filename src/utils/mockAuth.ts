// Mock 데이터를 위한 개발 모드 인증 서비스

export interface MockUser {
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

// 개발 모드 확인 (환경변수나 조건으로 설정 가능)
export const isDevelopmentMode = () => {
  return (
    import.meta.env.MODE === "development" ||
    localStorage.getItem("mockMode") === "true"
  );
};

// Mock 사용자 데이터 저장/조회
const MOCK_USER_KEY = "mockUser";
const MOCK_TOKEN_KEY = "mockAccessToken";

export const mockAuth = {
  // Mock 로그인 (새 사용자 시뮬레이션)
  async mockGoogleLogin(isNewUser: boolean = true): Promise<any> {
    const mockUser: MockUser = {
      id: "mock_user_" + Date.now(),
      email: "test@artory.com",
      name: "테스트 사용자",
      picture: "https://via.placeholder.com/150",
      ...(isNewUser
        ? {}
        : {
            job: "artist",
            nickname: "아트테스터",
            bio: "테스트용 아티스트입니다.",
            experience: "테스트 경험 3년",
            interests: ["회화", "조각", "현대미술"],
            website: "https://test.artory.com",
            instagram: "testartist",
            profileCompleted: true,
          }),
    };

    // Mock 토큰과 사용자 정보 저장
    localStorage.setItem(MOCK_TOKEN_KEY, "mock_jwt_token_" + Date.now());
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));

    return {
      success: true,
      data: {
        accessToken: "mock_jwt_token",
        refreshToken: "mock_refresh_token",
        user: mockUser,
        isNewUser: isNewUser,
      },
    };
  },

  // Mock 현재 사용자 정보 조회
  async getCurrentUser(): Promise<MockUser | null> {
    const userStr = localStorage.getItem(MOCK_USER_KEY);
    if (!userStr) return null;

    return JSON.parse(userStr);
  },

  // Mock 프로필 완료
  async completeProfile(profileData: any): Promise<any> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error("사용자 정보가 없습니다.");

    const updatedUser: MockUser = {
      ...currentUser,
      ...profileData,
      profileCompleted: true,
    };

    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(updatedUser));

    return {
      data: {
        success: true,
        message: "프로필이 완료되었습니다.",
      },
    };
  },

  // Mock 로그아웃
  logout(): void {
    localStorage.removeItem(MOCK_USER_KEY);
    localStorage.removeItem(MOCK_TOKEN_KEY);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  // Mock 로그인 상태 확인
  isLoggedIn(): boolean {
    return !!localStorage.getItem(MOCK_TOKEN_KEY);
  },

  // Mock 모드 토글
  enableMockMode(): void {
    localStorage.setItem("mockMode", "true");
    console.log("🎭 Mock 모드가 활성화되었습니다!");
  },

  disableMockMode(): void {
    localStorage.removeItem("mockMode");
    this.logout();
    console.log("🎭 Mock 모드가 비활성화되었습니다!");
  },
};

// 전역에서 Mock 모드 제어할 수 있도록 추가
if (typeof window !== "undefined") {
  (window as any).mockAuth = mockAuth;
}

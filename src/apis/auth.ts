import apiClient from "./client";

export interface GoogleAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
  isNewUser?: boolean; // 최초 가입자인지 여부
}

export interface LoginResponse {
  success: boolean;
  data?: GoogleAuthResponse;
  message?: string;
}

class AuthService {
  // 구글 로그인 처리
  async googleLogin(accessToken: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<GoogleAuthResponse>(
        "/api/auth/google",
        {
          accessToken,
        }
      );

      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error("Google login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "로그인에 실패했습니다.",
      };
    }
  }

  // 로그아웃
  logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  }

  // 현재 사용자 정보 가져오기
  async getCurrentUser() {
    try {
      const response = await apiClient.get("/api/auth/me");
      return response.data;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  // 토큰 갱신
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return false;

      const response = await apiClient.post("/api/auth/refresh", {
        refreshToken,
      });

      localStorage.setItem("accessToken", response.data.accessToken);
      return true;
    } catch (error) {
      console.error("Token refresh error:", error);
      this.logout();
      return false;
    }
  }

  // 로그인 상태 확인
  isLoggedIn(): boolean {
    return !!localStorage.getItem("accessToken");
  }

  // 프로필 완료 여부 확인
  async isProfileComplete(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user?.job ? true : false;
    } catch (error) {
      console.error("Profile completion check error:", error);
      return false;
    }
  }
}

export const authService = new AuthService();
export default authService;

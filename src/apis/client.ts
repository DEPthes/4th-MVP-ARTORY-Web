import axios from "axios";
import { isDevelopmentMode, mockAuth } from "../utils/mockAuth";

// API 기본 설정
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock API 응답 시뮬레이션
const mockApiResponse = (url: string, method: string, data?: any) => {
  console.log(`🎭 Mock API: ${method.toUpperCase()} ${url}`, data);

  // /api/auth/complete-profile POST 요청 시뮬레이션
  if (url.includes("/api/auth/complete-profile") && method === "post") {
    return mockAuth.completeProfile(data);
  }

  // 기본 성공 응답
  return Promise.resolve({
    data: {
      success: true,
      message: "Mock API 응답",
    },
  });
};

// 요청 인터셉터 - 토큰 자동 추가 및 Mock 모드 처리
apiClient.interceptors.request.use(
  async (config) => {
    // Mock 모드인 경우 실제 API 호출 대신 Mock 응답 반환
    if (isDevelopmentMode()) {
      const mockResponse = await mockApiResponse(
        config.url || "",
        config.method || "get",
        config.data
      );

      // 실제 요청을 취소하고 Mock 응답을 반환
      config.adapter = () =>
        Promise.resolve({
          data: mockResponse.data,
          status: 200,
          statusText: "OK",
          headers: {},
          config,
        });
    }

    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("mockAccessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Mock 모드가 아닐 때만 에러 처리
    if (!isDevelopmentMode() && error.response?.status === 401) {
      // 토큰이 만료되었을 때 로그인 페이지로 리다이렉트
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;

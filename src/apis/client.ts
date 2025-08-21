import axios from "axios";

// API 기본 설정 - 항상 프록시 사용 (Mixed Content 에러 방지)
const API_BASE_URL = "";

console.log("🔧 API 설정 정보:");
console.log("- DEV 모드:", import.meta.env.DEV);
console.log("- VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
console.log("- 최종 API_BASE_URL:", API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30초 타임아웃으로 증가
});

// 요청 인터셉터 - 토큰 자동 추가
apiClient.interceptors.request.use(
  async (config) => {
    console.log(
      `🚀 API 요청: ${config.method?.toUpperCase()} ${config.baseURL}${
        config.url
      }`
    );

    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("📤 요청 인터셉터 에러:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `✅ API 응답: ${
        response.status
      } ${response.config.method?.toUpperCase()} ${response.config.url}`
    );
    return response;
  },
  (error) => {
    console.error("💥 API 에러 상세 정보:");
    console.error("- 메시지:", error.message);
    console.error("- 코드:", error.code);
    console.error("- 상태:", error.response?.status);
    console.error("- 응답 데이터:", error.response?.data);
    console.error("- 요청 URL:", error.config?.url);
    console.error("- 전체 에러:", error);

    if (error.response?.status === 401) {
      const requestUrl: string = error.config?.url || "";
      const isSearchEndpoint = requestUrl.includes("/api/post/search");

      if (!isSearchEndpoint) {
        // 검색은 비보호 처리: 리다이렉트하지 않음
        console.warn("🔒 인증 토큰 만료 - 로그인 페이지로 이동");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      } else {
        console.warn(
          "🔎 검색 엔드포인트 401 - 리다이렉트하지 않고 에러만 전달"
        );
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

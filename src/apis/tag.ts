import axios from "axios";
import type { TagListApiResponse } from "../types/tag";

// 태그 API 객체
export const tagApi = {
  // 태그 리스트 조회 API
  async getTagList(): Promise<TagListApiResponse> {
    console.log("🏷️ 태그 리스트 조회 시작");

    // 인터셉터를 우회하여 직접 axios 사용
    const baseURL = import.meta.env.DEV
      ? "http://localhost:5173" // 개발환경에서는 프록시 사용
      : import.meta.env.VITE_API_BASE_URL || "http://13.209.252.181:8080";

    console.log("🔗 태그 리스트 API 호출");
    const response = await axios.get<TagListApiResponse>(
      `${baseURL}/api/tag/list`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    console.log("📦 태그 리스트 백엔드 응답:", response.data);
    console.log("📋 태그 리스트 데이터:", response.data.data);

    return response.data;
  },
};

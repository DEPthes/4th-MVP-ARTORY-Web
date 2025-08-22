import axios from "axios";
import type { TagListApiResponse } from "../types/tag";

// 태그 API 객체
export const tagApi = {
  // 태그 리스트 조회 API
  async getTagList(): Promise<TagListApiResponse> {
    console.log("🏷️ 태그 리스트 조회 시작");

    console.log("🔗 태그 리스트 API 호출");
    const response = await axios.get<TagListApiResponse>(`/api/tag/list`, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    console.log("📦 태그 리스트 백엔드 응답:", response.data);
    console.log("📋 태그 리스트 데이터:", response.data.data);

    return response.data;
  },
};

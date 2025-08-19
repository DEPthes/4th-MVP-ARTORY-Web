import axios from "axios";
import type {
  ArtistNoteListParams,
  ArtistNoteApiResponse,
} from "../types/artistNote";

// 작가 노트 API 객체
export const artistNoteApi = {
  // 작가 노트 리스트 조회 API
  async getArtistNoteList(
    params: ArtistNoteListParams
  ): Promise<ArtistNoteApiResponse> {
    console.log("🎨 작가 노트 리스트 조회 시작:", params);

    // 인터셉터를 우회하여 직접 axios 사용
    const baseURL = import.meta.env.DEV
      ? "http://localhost:5173" // 개발환경에서는 프록시 사용
      : import.meta.env.VITE_API_BASE_URL || "http://13.209.252.181:8080";

    // 쿼리 파라미터 구성
    const queryParams = new URLSearchParams({
      googleID: params.googleID,
      page: (params.page ?? 0).toString(),
      size: (params.size ?? 10).toString(),
    });

    console.log("🔗 작가 노트 리스트 API 호출");
    const response = await axios.get<ArtistNoteApiResponse>(
      `${baseURL}/api/artist_note/main?${queryParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    console.log("📦 작가 노트 리스트 백엔드 응답:", response.data);
    console.log("📋 작가 노트 리스트 데이터:", response.data.data);
    console.log("🎭 실제 content 배열:", response.data.data.content);

    return response.data;
  },
};

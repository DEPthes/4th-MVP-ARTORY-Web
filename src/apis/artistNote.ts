import axios from "axios";
import type {
  ArtistNoteListParams,
  ArtistNoteApiResponse,
} from "../types/artistNote";

export type ArtistNoteType = "HISTORY" | "TEAM_EVENT" | "PERSONAL_EVENT";

export interface ArtistNoteItem {
  id: number;
  artistNoteType: ArtistNoteType;
  year: string;
  description: string;
}

// 💡 ADDED: 작가노트 생성/수정을 위한 Request Body 타입
export interface ArtistNotePayload {
  artistNoteType: ArtistNoteType;
  year: string;
  description: string;
}

// --- 작가노트 API 함수들 ---

/** 특정 유저의 작가노트 전체를 조회합니다. */
export const getArtistNote = async (
  viewerGoogleID: string,
  userID: string
): Promise<ArtistNoteItem[]> => {
  console.log("🎨 작가노트 조회 API 호출:", { viewerGoogleID, userID });

  try {
    // 임시로 작동하는 /api/artist_note/main 사용
    const response = await axios.get<{
      data: { content: Record<string, unknown>[] };
    }>("/api/artist_note/main", {
      params: {
        googleID: viewerGoogleID,
        page: 0,
        size: 100,
      },
    });

    console.log("✅ 작가노트 API 응답:", response.data);

    // 현재 API가 사용자 프로필 목록을 반환하므로,
    // userID에 해당하는 사용자를 찾아서 임시 작가노트 데이터 생성
    const userProfile = response.data.data.content.find(
      (user: Record<string, unknown>) => user.id?.toString() === userID
    );

    if (userProfile) {
      console.log("👤 사용자 프로필 찾음:", userProfile);
      // 임시 작가노트 데이터 생성 (실제로는 백엔드에서 제공해야 함)
      const mockArtistNotes: ArtistNoteItem[] = [
        {
          id: 1,
          artistNoteType: "HISTORY",
          year: "2023",
          description: "샘플 이력 데이터",
        },
        {
          id: 2,
          artistNoteType: "TEAM_EVENT",
          year: "2022",
          description: "샘플 단체전 데이터",
        },
      ];

      console.log("📝 임시 작가노트 데이터 생성:", mockArtistNotes);
      return mockArtistNotes;
    } else {
      console.log("❌ 사용자 프로필을 찾을 수 없음");
      return [];
    }
  } catch (error) {
    console.error("❌ 작가노트 API 오류:", error);
    throw error;
  }
};

/** 새로운 작가노트를 생성합니다. (POST /api/artist_note) */
export const createArtistNote = async (
  googleID: string,
  payload: ArtistNotePayload
): Promise<ArtistNoteItem> => {
  console.log("🎨 작가노트 생성 API 호출:", { googleID, payload });

  try {
    const response = await axios.post("/api/artist_note/save", payload, {
      params: { googleID },
    });

    console.log("✅ 작가노트 생성 API 응답:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("❌ 작가노트 생성 API 오류:", error);
    throw error;
  }
};

/** 기존 작가노트를 수정합니다. (PUT /api/artist_note/change) */
export const updateArtistNote = async (
  googleID: string,
  artistNoteID: number,
  payload: ArtistNotePayload
): Promise<void> => {
  console.log("🎨 작가노트 수정 API 호출:", {
    googleID,
    artistNoteID,
    payload,
  });

  try {
    // `PUT`이 아닌 `POST` 메소드를 사용하도록 수정
    const response = await axios.post(`/api/artist_note/change`, payload, {
      params: { googleID, artistNoteID },
    });

    console.log("✅ 작가노트 수정 API 응답:", response.data);
  } catch (error) {
    console.error("❌ 작가노트 수정 API 오류:", error);
    throw error;
  }
};

/** 작가노트를 삭제합니다. (DELETE /api/artist_note/{id}) */
export const deleteArtistNote = async (
  googleID: string,
  artistNoteID: number
): Promise<void> => {
  console.log("🎨 작가노트 삭제 API 호출:", { googleID, artistNoteID });

  try {
    const response = await axios.delete(`/api/artist_note/${artistNoteID}`, {
      params: { googleID },
    });

    console.log("✅ 작가노트 삭제 API 응답:", response.data);
  } catch (error) {
    console.error("❌ 작가노트 삭제 API 오류:", error);
    throw error;
  }
};

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

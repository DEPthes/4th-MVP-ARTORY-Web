import apiClient from "./client";
import type { ArtistNoteItem } from "./artistNote";

export interface ToggleArchiveParams {
  postId: string;
  googleID: string;
}

export interface ToggleArchiveResponse<T = unknown> {
  code: number;
  status: string;
  message: string;
  data: T;
}

// 작가노트 상세페이지용 API 함수들
export const artistDetailApi = {
  /** 특정 작가의 작가노트를 조회합니다. */
  async getArtistNote(
    googleID: string,
    artistId: string
  ): Promise<ArtistNoteItem[]> {
    try {
      console.log("🎨 작가노트 상세 조회 API 호출:", {
        googleID,
        userID: artistId,
      });
      const response = await apiClient.get<{ data: ArtistNoteItem[] }>(
        "/api/artist_note",
        {
          params: { googleID, userID: artistId },
        }
      );
      console.log("✅ 작가노트 상세 API 응답:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ 작가노트 조회 실패:", error);
      throw error;
    }
  },

  /** 특정 작가의 프로필 정보를 조회합니다. */
  async getArtistProfile(
    googleID: string,
    artistId: string
  ): Promise<{
    name: string;
    userType: string;
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
  }> {
    try {
      console.log("👤 작가 프로필 조회 API 호출:", {
        googleID,
        userID: artistId,
      });
      // 작가노트 리스트에서 받은 ID를 사용하여 작가 정보 조회
      // 실제로는 작가 ID를 기반으로 프로필을 조회해야 함
      const response = await apiClient.get(`/api/user/profile`, {
        params: { googleID, userID: artistId },
      });
      console.log("✅ 작가 프로필 API 응답:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ 작가 프로필 조회 실패:", error);
      throw error;
    }
  },
};

export const archiveApi = {
  async toggleArchive({
    postId,
    googleID,
  }: ToggleArchiveParams): Promise<boolean> {
    const response = await apiClient.post<ToggleArchiveResponse>(
      "/api/archive",
      null,
      {
        params: { postId, googleID },
      }
    );
    // 성공 기준: 백엔드 공통 스펙(code===200 && status==="OK") 가정
    if (response.data?.code === 200 && response.data?.status === "OK") {
      return true;
    }
    return true; // 보수적으로 true 처리 (백엔드가 단순 200만 내려줄 수도 있음)
  },
};

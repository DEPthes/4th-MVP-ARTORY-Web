import apiClient from "./client";

export type PostType = "ART" | "EXHIBITION" | "CONTEST";

export interface SearchParams {
  text: string;
  postType: PostType;
  tagName?: string; // 기본값 ALL
  page?: number; // 기본값 0
  size?: number; // 기본값 10
  googleID?: string; // 정밀도 손실 방지 위해 문자열로 전달
}

// 백엔드 응답 구조에 맞게 수정
export interface SearchResponse {
  code: number;
  status: string;
  message: string;
  data: {
    totalPages: number;
    totalElements: number;
    pageable: {
      pageNumber: number;
      pageSize: number;
      offset: number;
      sort: {
        sorted: boolean;
        empty: boolean;
        unsorted: boolean;
      };
      paged: boolean;
      unpaged: boolean;
    };
    first: boolean;
    last: boolean;
    size: number;
    content: SearchItem[];
    number: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
  };
}

export interface SearchItem {
  postId: string;
  postType: "ART" | "EXHIBITION" | "CONTEST";
  title: string;
  imageUrls: string[];
  userName: string;
  archived: number;
  isMine: boolean;
  isArchived: boolean;
}

export const searchApi = {
  async searchPosts(params: SearchParams): Promise<SearchItem[]> {
    console.log("🔍 검색 API 호출 시작:", params);
    const storedGoogleId = localStorage.getItem("googleID") || undefined;

    try {
      const response = await apiClient.get<SearchResponse>("/api/post/search", {
        params: {
          page: params.page ?? 0,
          size: params.size ?? 10,
          googleID: params.googleID ?? storedGoogleId,
          tagName: params.tagName ?? "ALL",
          postType: params.postType,
          text: params.text,
        },
      });

      // content 배열에서 데이터 추출
      if (
        response.data?.data?.content &&
        Array.isArray(response.data.data.content)
      ) {
        console.log("📦 검색 백엔드 응답:", response.data);
        console.log("📋 검색 데이터:", response.data.data.content);
        return response.data.data.content;
      } else {
        console.warn(
          "⚠️ 검색 API 응답 데이터가 올바르지 않습니다. 빈 배열을 반환합니다.",
          response.data
        );
        return [];
      }
    } catch (error) {
      console.error("❌ 검색 API 호출 실패:", error);
      throw error;
    }
  },
};

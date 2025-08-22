// apis/postDetail.ts
import axios from "axios";

// 게시물 상세 조회 파라미터 타입
export interface PostDetailParams {
  postID: number;
  googleID: string;
}

// 게시물 날짜 정보 타입
export interface PostDate {
  id: number;
  createdAt: string;
  modifiedAt: string | null;
}

// 태그 정보 타입
export interface Tag {
  id: number;
  name: string;
}

// 게시물 상세 데이터 타입 (swagger 응답 구조 그대로)
export interface PostDetailData {
  id: number;
  userId: number;
  name: string;
  imageURL: string[];
  exhibitionURL: string[];
  description: string;
  postType: "ART" | "EXHIBITION" | "CONTEST";
  userType: "ARTIST" | "GALLERY" | "COLLECTOR";
  postDate: PostDate;
  archived: number;
  tags: Tag[];
  isMine: boolean;
  isArchived: boolean;
}

// 게시물 상세 API 응답 타입
export interface PostDetailApiResponse {
  code: number;
  status: string;
  message: string;
  data: PostDetailData;
}

// 게시물 상세 API 객체
export const postDetailApi = {
  // 게시물 상세 조회 API
  async getPostDetail(
    params: PostDetailParams
  ): Promise<PostDetailApiResponse> {
    console.log("📄 게시물 상세 조회 시작:", params);

    // 쿼리 파라미터 구성
    const queryParams = new URLSearchParams({
      postID: params.postID.toString(),
      googleID: params.googleID,
    });

    console.log("🔗 게시물 상세 API 호출");
    const response = await axios.get<PostDetailApiResponse>(
      `/api/post/detail?${queryParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    console.log("📦 게시물 상세 백엔드 응답:", response.data);
    console.log("📋 게시물 상세 데이터:", response.data.data);

    return response.data;
  },
};

// 헬퍼 함수들
export const postDetailHelpers = {
  // 성공 여부 확인
  isSuccess: (response: PostDetailApiResponse): boolean => {
    return response.code === 200 && response.status === "OK";
  },

  // 소유자인지 확인
  isMine: (response: PostDetailApiResponse): boolean => {
    return response.data.isMine;
  },

  // 아카이브 상태 확인
  isArchived: (response: PostDetailApiResponse): boolean => {
    return response.data.isArchived;
  },

  // 이미지 URL 배열 반환
  getImageUrls: (response: PostDetailApiResponse): string[] => {
    return response.data.imageURL;
  },

  // 전시 URL 배열 반환
  getExhibitionUrls: (response: PostDetailApiResponse): string[] => {
    return response.data.exhibitionURL;
  },

  // 태그 이름 배열 반환
  getTagNames: (response: PostDetailApiResponse): string[] => {
    return response.data.tags.map((tag) => tag.name);
  },

  // 생성일 포맷팅
  getFormattedCreatedAt: (response: PostDetailApiResponse): string => {
    return new Date(response.data.postDate.createdAt).toLocaleDateString(
      "ko-KR"
    );
  },

  // 수정일 포맷팅 (수정된 경우만)
  getFormattedModifiedAt: (response: PostDetailApiResponse): string | null => {
    const modifiedAt = response.data.postDate.modifiedAt;
    return modifiedAt ? new Date(modifiedAt).toLocaleDateString("ko-KR") : null;
  },
};

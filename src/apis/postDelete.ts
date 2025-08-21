// apis/postDelete.ts
import axios from "axios";

// 게시물 삭제 파라미터 타입
export interface PostDeleteParams {
  postID: number;
  googleID: string;
}

// 게시물 삭제 API 응답 타입
export interface PostDeleteApiResponse {
  code: number;
  status: string;
  message: string;
  data?: string;
}

// 게시물 삭제 API 객체
export const postDeleteApi = {
  // 게시물 삭제 API
  async deletePost(params: PostDeleteParams): Promise<PostDeleteApiResponse> {
    console.log("🗑️ 게시물 삭제 시작:", params);

    // 개발환경에서는 프록시 사용, 프로덕션에서는 직접 요청
    const baseURL = import.meta.env.DEV
      ? "" // 프록시 사용 (상대 경로)
      : import.meta.env.VITE_API_BASE_URL || "http://13.209.252.181:8080";

    // 쿼리 파라미터 구성
    const queryParams = new URLSearchParams({
      postID: params.postID.toString(),
      googleID: params.googleID,
    });

    console.log("🔗 게시물 삭제 API 호출");
    const response = await axios.delete<PostDeleteApiResponse>(
      `${baseURL}/api/post/delete?${queryParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    console.log("📦 게시물 삭제 백엔드 응답:", response.data);
    return response.data;
  },
};

// 헬퍼 함수들
export const postDeleteHelpers = {
  // 성공 여부 확인
  isSuccess: (response: PostDeleteApiResponse): boolean => {
    return response.code === 200 && response.status === "OK";
  },
};

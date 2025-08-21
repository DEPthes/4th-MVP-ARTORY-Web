// apis/postChange.ts
import axios from "axios";
import type { EditorType, UploadedImage } from "../types/post";

// 게시물 수정 파라미터 타입
export interface PostChangeParams {
  postID: number;
  googleID: string;
}

// 게시물 수정 요청 데이터 타입
export interface PostChangeRequest {
  type: EditorType;
  title: string;
  description: string;
  url: string;
  images: UploadedImage[];
  tagIds: number[];
}

// 게시물 수정 API 응답 타입
export interface PostChangeApiResponse {
  code: number;
  status: string;
  message: string;
  data?: any;
}

// 게시물 수정 API 객체
export const postChangeApi = {
  // 게시물 수정 API
  async changePost(
    params: PostChangeParams,
    requestData: PostChangeRequest
  ): Promise<PostChangeApiResponse> {
    console.log("📝 게시물 수정 시작:", params);
    console.log("📦 수정 데이터:", requestData);

    // 개발환경에서는 프록시 사용, 프로덕션에서는 직접 요청
    const baseURL = import.meta.env.DEV
      ? "" // 프록시 사용 (상대 경로)
      : import.meta.env.VITE_API_BASE_URL || "http://13.209.252.181:8080";

    // 쿼리 파라미터 구성
    const queryParams = new URLSearchParams({
      postID: params.postID.toString(),
      googleID: params.googleID,
    });

    // FormData 구성 (파일 업로드를 위해)
    const formData = new FormData();
    formData.append("type", requestData.type);
    formData.append("title", requestData.title);
    formData.append("description", requestData.description);
    formData.append("url", requestData.url);

    // 이미지 파일들 추가
    requestData.images.forEach((image, index) => {
      if (image.file) {
        formData.append("images", image.file);
      }
    });

    // 태그 ID들 추가
    requestData.tagIds.forEach((tagId) => {
      formData.append("tagIds", tagId.toString());
    });

    console.log("🔗 게시물 수정 API 호출");
    const response = await axios.post<PostChangeApiResponse>(
      `${baseURL}/api/post/change?${queryParams.toString()}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      }
    );

    console.log("📦 게시물 수정 백엔드 응답:", response.data);
    return response.data;
  },
};

// 헬퍼 함수들
export const postChangeHelpers = {
  // 성공 여부 확인
  isSuccess: (response: PostChangeApiResponse): boolean => {
    return response.code === 200 && response.status === "OK";
  },
};

// apis/mainPost.ts
import axios from "axios";
import type {
  MainPostListParams,
  MainPostApiResponse,
} from "../types/mainPost";

// 메인 게시물 API 객체
export const mainPostApi = {
  // 메인 게시물 리스트 조회 API
  async getMainPostList(
    params: MainPostListParams
  ): Promise<MainPostApiResponse> {
    console.log("📋 메인 게시물 리스트 조회 시작:", params);

    // 쿼리 파라미터 구성
    const queryParams = new URLSearchParams({
      googleID: params.googleID,
      postType: params.postType,
      page: (params.page ?? 0).toString(),
      size: (params.size ?? 10).toString(),
    });

    // tagName이 있으면 추가 (선택적 파라미터)
    if (params.tagName) {
      queryParams.append("tagName", params.tagName);
      console.log("🏷️ 태그명 추가됨:", params.tagName);
    } else {
      console.log("🏷️ 태그명 없음 - 전체 카테고리 조회");
    }

    const finalUrl = `/api/post/main?${queryParams.toString()}`;
    console.log("🔗 최종 API URL:", finalUrl);
    console.log("🔗 메인 게시물 리스트 API 호출");

    const response = await axios.get<MainPostApiResponse>(finalUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    console.log("📦 메인 게시물 리스트 백엔드 응답:", response.data);
    console.log("📋 메인 게시물 리스트 데이터:", response.data.data);
    console.log("🎭 실제 content 배열:", response.data.data.content);
    console.log(
      "🏷️ 응답된 게시물 수:",
      response.data.data.content?.length || 0
    );

    return response.data;
  },
};

// 헬퍼 함수들
export const mainPostHelpers = {
  // 성공 여부 확인
  isSuccess: (response: MainPostApiResponse): boolean => {
    return response.code === 200 && response.status === "OK";
  },

  // 빈 결과인지 확인
  isEmpty: (response: MainPostApiResponse): boolean => {
    return response.data.empty || response.data.content.length === 0;
  },

  // 마지막 페이지인지 확인
  isLastPage: (response: MainPostApiResponse): boolean => {
    return response.data.last;
  },

  // 첫 번째 페이지인지 확인
  isFirstPage: (response: MainPostApiResponse): boolean => {
    return response.data.first;
  },

  // 총 페이지 수 반환
  getTotalPages: (response: MainPostApiResponse): number => {
    return response.data.totalPages;
  },

  // 총 요소 수 반환
  getTotalElements: (response: MainPostApiResponse): number => {
    return response.data.totalElements;
  },

  // 현재 페이지 번호 반환
  getCurrentPage: (response: MainPostApiResponse): number => {
    return response.data.number;
  },

  // 페이지 크기 반환
  getPageSize: (response: MainPostApiResponse): number => {
    return response.data.size;
  },
};

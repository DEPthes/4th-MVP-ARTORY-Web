// hooks/usePostDetail.ts
import { useQuery } from '@tanstack/react-query';
import { postDetailApi } from '../apis/postDetail';
import type {
  PostDetailParams,
  PostDetailApiResponse,
} from '../apis/postDetail';

// Query Keys 정의
export const postDetailKeys = {
  all: ['postDetail'] as const,
  detail: (params: PostDetailParams) =>
    [...postDetailKeys.all, 'detail', params.postID, params.googleID] as const,
};

// 게시물 상세 조회 훅
export const usePostDetail = (params: PostDetailParams) => {
  return useQuery<PostDetailApiResponse>({
    queryKey: postDetailKeys.detail(params),
    queryFn: () => postDetailApi.getPostDetail(params),
    enabled: !!params.postID && !!params.googleID, // postID와 googleID가 있을 때만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 가비지 컬렉션 방지
    retry: 2, // 실패 시 2회 재시도
    refetchOnWindowFocus: false, // 창 포커스 시 재호출 방지
  });
};

// 게시물 ID만으로 상세 조회하는 편의 훅 (googleID는 localStorage에서 가져오기)
export const usePostDetailById = (postID: number) => {
  const googleID = localStorage.getItem('googleID') || '';

  return usePostDetail({
    postID,
    googleID,
  });
};

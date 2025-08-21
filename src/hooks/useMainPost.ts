// hooks/useMainPost.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { mainPostApi } from '../apis/mainPost';
import type {
  MainPostListParams,
  MainPostApiResponse,
} from '../types/mainPost';

// Query Keys 정의
export const mainPostKeys = {
  all: ['mainPost'] as const,
  lists: () => [...mainPostKeys.all, 'list'] as const,
  list: (params: MainPostListParams) =>
    [...mainPostKeys.lists(), params] as const,
  // 특정 게시물 타입별 키
  byType: (postType: string) =>
    [...mainPostKeys.all, 'type', postType] as const,
  // 특정 태그별 키
  byTag: (tagName: string) => [...mainPostKeys.all, 'tag', tagName] as const,
};

// 메인 게시물 리스트 조회 훅
export const useMainPostList = (params: MainPostListParams) => {
  return useQuery<MainPostApiResponse>({
    queryKey: mainPostKeys.list(params),
    queryFn: () => mainPostApi.getMainPostList(params),
    enabled: !!params.googleID && !!params.postType, // googleID와 postType이 있을 때만 쿼리 실행
    staleTime: 3 * 60 * 1000, // 3분간 fresh 상태 유지 (게시물은 자주 변경될 수 있음)
    gcTime: 10 * 60 * 1000, // 10분간 가비지 컬렉션 방지
    retry: 2, // 실패 시 2회 재시도
    refetchOnWindowFocus: false, // 창 포커스 시 재호출 방지
  });
};

// 무한 스크롤을 위한 useInfiniteQuery 버전
export const useInfiniteMainPostList = (
  baseParams: Omit<MainPostListParams, 'page'>
) => {
  return useInfiniteQuery({
    queryKey: [...mainPostKeys.lists(), 'infinite', baseParams],
    queryFn: ({ pageParam = 0 }) =>
      mainPostApi.getMainPostList({
        ...baseParams,
        page: pageParam,
      }),
    enabled: !!baseParams.googleID && !!baseParams.postType,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // 마지막 페이지가 아니면 다음 페이지 번호 반환
      if (!lastPage.data.last) {
        return lastPage.data.number + 1;
      }
      return undefined;
    },
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// 특정 게시물 타입의 데이터만 조회하는 훅
export const useMainPostListByType = (
  googleID: string,
  postType: MainPostListParams['postType'],
  options?: {
    page?: number;
    size?: number;
    tagName?: string;
  }
) => {
  const params: MainPostListParams = {
    googleID,
    postType,
    page: options?.page ?? 0,
    size: options?.size ?? 10,
    tagName: options?.tagName,
  };

  return useMainPostList(params);
};

// 여러 게시물 타입을 동시에 조회하는 훅
export const useMultipleMainPostTypes = (
  googleID: string,
  postTypes: MainPostListParams['postType'][],
  options?: {
    page?: number;
    size?: number;
    tagName?: string;
  }
) => {
  // React Hooks의 규칙에 따라 각 타입별로 개별 훅 호출
  const artQuery = useMainPostList({
    googleID,
    postType: 'ART',
    page: options?.page ?? 0,
    size: options?.size ?? 10,
    tagName: options?.tagName,
  });

  const exhibitionQuery = useMainPostList({
    googleID,
    postType: 'EXHIBITION',
    page: options?.page ?? 0,
    size: options?.size ?? 10,
    tagName: options?.tagName,
  });

  const contestQuery = useMainPostList({
    googleID,
    postType: 'CONTEST',
    page: options?.page ?? 0,
    size: options?.size ?? 10,
    tagName: options?.tagName,
  });

  // postTypes 배열 순서에 맞게 쿼리 결과 매핑
  const queries = postTypes.map((postType) => {
    switch (postType) {
      case 'ART':
        return artQuery;
      case 'EXHIBITION':
        return exhibitionQuery;
      case 'CONTEST':
        return contestQuery;
      default:
        throw new Error(`Unsupported post type: ${postType}`);
    }
  });

  return {
    queries,
    // 모든 쿼리의 로딩 상태
    isLoading: queries.some((query) => query.isLoading),
    // 모든 쿼리의 에러 상태
    isError: queries.some((query) => query.isError),
    // 모든 쿼리가 성공했는지
    isSuccess: queries.every((query) => query.isSuccess),
    // 모든 데이터
    data: queries.map((query) => query.data),
    // 모든 에러
    errors: queries.map((query) => query.error),
  };
};

// hooks/useDetail.ts
import { useQuery } from '@tanstack/react-query';
import { postDetailApi } from '../apis/postDetail';
import type { DetailArtwork } from '../types/detail';
import { mapPostDetailToArtwork } from '../types/detail';

type Params = { id: string };

// 공통 게시물 상세 조회 훅 (실제 API 사용)
const usePostDetailQuery = ({ id }: Params) => {
  const googleID = localStorage.getItem('googleID') || '';

  return useQuery({
    queryKey: ['postDetail', id, googleID],
    queryFn: async (): Promise<DetailArtwork> => {
      console.log('🎯 게시물 상세 API 호출:', { id, googleID });

      const response = await postDetailApi.getPostDetail({
        postID: parseInt(id),
        googleID,
      });

      console.log('✅ 게시물 상세 API 응답:', response);

      // API 응답을 DetailArtwork 형태로 변환
      return mapPostDetailToArtwork(response.data);
    },
    enabled: !!id && !!googleID && !isNaN(parseInt(id)), // id가 유효한 숫자이고 googleID가 있을 때만
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 가비지 컬렉션 방지
    retry: 2, // 실패 시 2회 재시도
    refetchOnWindowFocus: false, // 창 포커스 시 재호출 방지
  });
};

// Collection 상세 조회 (실제 API 사용)
export const useCollectionDetail = ({ id }: Params) => {
  return usePostDetailQuery({ id });
};

// Exhibition 상세 조회 (실제 API 사용)
export const useExhibitionDetail = ({ id }: Params) => {
  return usePostDetailQuery({ id });
};

// Contest 상세 조회 (실제 API 사용)
export const useContestDetail = ({ id }: Params) => {
  return usePostDetailQuery({ id });
};

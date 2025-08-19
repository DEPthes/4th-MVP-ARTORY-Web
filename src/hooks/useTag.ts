import { useQuery } from "@tanstack/react-query";
import { tagApi } from "../apis/tag";
import type { TagListApiResponse } from "../types/tag";

// Query Keys 정의
export const tagKeys = {
  all: ["tag"] as const,
  lists: () => [...tagKeys.all, "list"] as const,
};

// 태그 리스트 조회 훅
export const useTagList = () => {
  return useQuery<TagListApiResponse>({
    queryKey: tagKeys.lists(),
    queryFn: () => tagApi.getTagList(),
    staleTime: 30 * 60 * 1000, // 30분간 fresh 상태 유지 (태그는 자주 변경되지 않음)
    gcTime: 60 * 60 * 1000, // 1시간간 가비지 컬렉션 방지
    retry: 2, // 실패 시 2회 재시도
    refetchOnWindowFocus: false, // 창 포커스 시 재호출 방지
  });
};

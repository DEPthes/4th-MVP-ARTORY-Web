import { useQuery } from "@tanstack/react-query";
import { artistNoteApi } from "../apis/artistNote";
import type {
  ArtistNoteListParams,
  ArtistNoteApiResponse,
} from "../types/artistNote";

// Query Keys 정의
export const artistNoteKeys = {
  all: ["artistNote"] as const,
  lists: () => [...artistNoteKeys.all, "list"] as const,
  list: (params: ArtistNoteListParams) =>
    [...artistNoteKeys.lists(), params] as const,
};

// 작가 노트 리스트 조회 훅
export const useArtistNoteList = (params: ArtistNoteListParams) => {
  return useQuery<ArtistNoteApiResponse>({
    queryKey: artistNoteKeys.list(params),
    queryFn: () => artistNoteApi.getArtistNoteList(params),
    enabled: !!params.googleID, // googleID가 있을 때만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 가비지 컬렉션 방지
    retry: 2, // 실패 시 2회 재시도
    refetchOnWindowFocus: false, // 창 포커스 시 재호출 방지
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveApi, type ToggleArchiveParams } from "../apis/archive";

export const useToggleArchive = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, unknown, ToggleArchiveParams>({
    mutationFn: (params: ToggleArchiveParams) =>
      archiveApi.toggleArchive(params),
    onSuccess: () => {
      // 아카이브 상태 변경 후 관련된 모든 쿼리 무효화
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            // 사용자 게시물 관련 쿼리들
            (Array.isArray(queryKey) && queryKey[0] === "userPosts") ||
            // 메인 게시물 목록 관련 쿼리들
            (Array.isArray(queryKey) && queryKey[0] === "mainPost") ||
            // 검색 결과 관련 쿼리들
            (Array.isArray(queryKey) && queryKey[0] === "search") ||
            // 아카이브 관련 쿼리들
            (Array.isArray(queryKey) && queryKey[0] === "userArchive") ||
            // 컬렉션 상세 관련 쿼리들
            (Array.isArray(queryKey) && queryKey[0] === "collectionDetail") ||
            // 컬렉션 목록 관련 쿼리들
            (Array.isArray(queryKey) && queryKey[0] === "collection") ||
            // 사용자 프로필 관련 쿼리들
            (Array.isArray(queryKey) && queryKey[0] === "userProfile") ||
            // 사이드바 프로필 관련 쿼리들
            (Array.isArray(queryKey) && queryKey[0] === "sidebarProfile") ||
            // 모든 아카이브 관련 쿼리들 (더 포괄적으로)
            (Array.isArray(queryKey) &&
              queryKey.some(
                (key) => typeof key === "string" && key.includes("archive")
              )) ||
            // 모든 게시물 관련 쿼리들 (더 포괄적으로)
            (Array.isArray(queryKey) &&
              queryKey.some(
                (key) =>
                  typeof key === "string" &&
                  (key.includes("post") || key.includes("Post"))
              ))
          );
        },
      });

      // 추가적으로 모든 관련 쿼리를 강제로 무효화
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["mainPost"] });
      queryClient.invalidateQueries({ queryKey: ["userArchive"] });
      queryClient.invalidateQueries({ queryKey: ["collectionDetail"] });
      queryClient.invalidateQueries({ queryKey: ["collection"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
    },
  });
};

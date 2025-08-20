import { useQuery } from "@tanstack/react-query";
import { searchApi } from "../apis/search";
import type { SearchParams, SearchItem, PostType } from "../apis/search";

export const searchKeys = {
  all: ["search"] as const,
  list: (
    params: Required<Pick<SearchParams, "text">> & Partial<SearchParams>
  ) => [...searchKeys.all, params] as const,
};

export const useSearchPosts = (params: {
  text: string;
  postType: PostType;
  tagName?: string;
  page?: number;
  size?: number;
  googleID?: string;
}) => {
  const enabled = Boolean(params.text && params.text.trim().length > 0);

  return useQuery<SearchItem[]>({
    queryKey: searchKeys.list(
      params as Required<Pick<SearchParams, "text">> & Partial<SearchParams>
    ),
    queryFn: () => searchApi.searchPosts(params),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

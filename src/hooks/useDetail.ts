// src/hooks/useDetail.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../apis";
import type { DetailArtwork } from "../types/detail";
import {
  mapCollectionToDetail,
  mapExhibitionToDetail,
  mapContestToDetail,
} from "../utils/detailMappers";

type Params = { id: string };

export const useCollectionDetail = ({ id }: Params) => {
  return useQuery({
    queryKey: ["collection", "detail", id],
    queryFn: async (): Promise<DetailArtwork> => {
      // Replace with real API
      const { data } = await apiClient.get(`/api/collection/${id}`);
      return mapCollectionToDetail(data);
    },
  });
};

export const useExhibitionDetail = ({ id }: Params) => {
  return useQuery({
    queryKey: ["exhibition", "detail", id],
    queryFn: async (): Promise<DetailArtwork> => {
      const { data } = await apiClient.get(`/api/exhibition/${id}`);
      return mapExhibitionToDetail(data);
    },
  });
};

export const useContestDetail = ({ id }: Params) => {
  return useQuery({
    queryKey: ["contest", "detail", id],
    queryFn: async (): Promise<DetailArtwork> => {
      const { data } = await apiClient.get(`/api/contest/${id}`);
      return mapContestToDetail(data);
    },
  });
};

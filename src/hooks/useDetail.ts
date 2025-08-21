// src/hooks/useDetail.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { DetailArtwork } from '../types/detail';
import { mapPostDetailToArtwork } from '../types/detail';
import type { PostDetailData } from '../apis/postDetail';

type UseDetailParams = { id: string };

async function fetchDetail(
  id: string,
  googleID: string
): Promise<DetailArtwork> {
  const res = await axios.get<{
    code: number;
    status: string;
    message: string;
    data: PostDetailData;
  }>('/api/post/detail', {
    params: { postID: Number(id), googleID },
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
  });
  return mapPostDetailToArtwork(res.data.data);
}

export const usePostDetail = ({ id }: UseDetailParams) => {
  const googleID = localStorage.getItem('googleID') || '';
  return useQuery<DetailArtwork>({
    queryKey: ['postDetail', id, googleID],
    enabled: Boolean(id) && Boolean(googleID),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    queryFn: () => fetchDetail(String(id), googleID),
  });
};

export const useCollectionDetail = (p: UseDetailParams) => usePostDetail(p);
export const useExhibitionDetail = (p: UseDetailParams) => usePostDetail(p);
export const useContestDetail = (p: UseDetailParams) => usePostDetail(p);

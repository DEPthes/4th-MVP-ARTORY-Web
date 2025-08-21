// src/utils/detailMappers.ts
import type { DetailArtwork } from '../types/detail';

/** 상세 UI에서 실제로 쓰는 경량 형태만 매핑 */
type DetailLight = Pick<
  DetailArtwork,
  'imageUrl' | 'images' | 'title' | 'author' | 'likes' | 'category'
>;

// 도메인 엔티티들(목록 카드 등)
export type CollectionEntity = {
  imageUrl: string;
  images?: string[];
  title: string;
  author?: string;
  likes: number;
  category: string;
};

export type ExhibitionEntity = {
  imageUrl: string;
  images?: string[];
  exhibitionName: string;
  curator?: string;
  likes: number;
  category: string;
};

export type ContestEntity = {
  imageUrl: string;
  contestName: string;
  likes: number;
  category: string;
};

// ✅ DetailLight 로 반환 (DetailArtwork 전체를 요구하지 않음)
export const mapCollectionToDetail = (item: CollectionEntity): DetailLight => ({
  imageUrl: item.imageUrl,
  images: item.images,
  title: item.title,
  author: item.author,
  likes: item.likes,
  category: item.category,
});

export const mapExhibitionToDetail = (item: ExhibitionEntity): DetailLight => ({
  imageUrl: item.imageUrl,
  images: item.images,
  title: item.exhibitionName,
  author: item.curator,
  likes: item.likes,
  category: item.category,
});

export const mapContestToDetail = (item: ContestEntity): DetailLight => ({
  imageUrl: item.imageUrl,
  images: undefined,
  title: item.contestName,
  author: undefined,
  likes: item.likes,
  category: item.category,
});

// src/utils/detailMappers.ts
import { DetailArtwork } from "../types/detail";

// Adapters to map various domain entities to DetailArtwork used by shared UI

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

export const mapCollectionToDetail = (
  item: CollectionEntity
): DetailArtwork => ({
  imageUrl: item.imageUrl,
  images: item.images,
  title: item.title,
  author: item.author,
  likes: item.likes,
  category: item.category,
});

export const mapExhibitionToDetail = (
  item: ExhibitionEntity
): DetailArtwork => ({
  imageUrl: item.imageUrl,
  images: item.images,
  title: item.exhibitionName,
  author: item.curator,
  likes: item.likes,
  category: item.category,
});

export const mapContestToDetail = (item: ContestEntity): DetailArtwork => ({
  imageUrl: item.imageUrl,
  images: undefined,
  title: item.contestName,
  author: undefined,
  likes: item.likes,
  category: item.category,
});

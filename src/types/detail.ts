// src/types/detail.ts
import type { PostDetailData } from '../apis/postDetail';

export interface DetailArtwork {
  imageUrl: string;
  images?: string[];
  title: string; // = data.name
  author?: string; // 목록에서 넘긴 userName으로 채움
  likes: number;
  category: string;

  id: number;
  userId: number;
  name: string;
  imageURL: string[];
  exhibitionURL: string[];
  description: string;
  postType: 'ART' | 'EXHIBITION' | 'CONTEST';
  userType: 'ARTIST' | 'GALLERY' | 'COLLECTOR';
  postDate: { id: number; createdAt: string; modifiedAt: string | null };
  archived: number;
  tags: Array<{ id: number; name: string }>;
  isMine: boolean;
  isArchived: boolean;
}

export const mapPostDetailToArtwork = (
  data: PostDetailData
): DetailArtwork => ({
  imageUrl: data.imageURL?.[0] || '',
  images: data.imageURL ?? [],
  title: data.name,
  author: undefined, // 🔥 제목과 구분. 작가명은 목록에서 전달받아 채움
  likes: data.archived ?? 0,
  category: '전체',

  id: data.id,
  userId: data.userId,
  name: data.name,
  imageURL: data.imageURL,
  exhibitionURL: data.exhibitionURL,
  description: data.description,
  postType: data.postType,
  userType: data.userType,
  postDate: data.postDate,
  archived: data.archived,
  tags: data.tags,
  isMine: data.isMine,
  isArchived: data.isArchived,
});

// src/types/detail.ts
import type { PostDetailData } from '../apis/postDetail';

// 컴포넌트에서 사용하는 DetailArtwork 타입 (API 응답 호환)
export interface DetailArtwork {
  // 컴포넌트 공용 필드
  imageUrl: string;
  images?: string[];
  title: string; // = API data.name
  author?: string; // ✅ 작가 이름 (userId로 별도 조회해서 채움)
  likes: number;
  category: string;

  // API 원본 필드들
  id: number;
  userId: number;
  name: string;
  imageURL: string[];
  exhibitionURL: string[];
  description: string;
  postType: 'ART' | 'EXHIBITION' | 'CONTEST';
  userType: 'ARTIST' | 'GALLERY' | 'COLLECTOR';
  postDate: {
    id: number;
    createdAt: string;
    modifiedAt: string | null;
  };
  archived: number;
  tags: Array<{ id: number; name: string }>;
  isMine: boolean;
  isArchived: boolean;
}

// API 응답을 DetailArtwork로 변환하는 함수
export const mapPostDetailToArtwork = (data: PostDetailData): DetailArtwork => {
  return {
    // 컴포넌트 공용 필드
    imageUrl: data.imageURL?.[0] || '',
    images: data.imageURL ?? [],
    title: data.name,
    author: undefined, // ✅ 제목과 분리. 작가 이름은 별도 쿼리로 채움
    likes: data.archived ?? 0,
    category: '전체', // API에 카테고리가 없으므로 기본값

    // API 원본 데이터
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
  };
};

// 유용한 헬퍼 함수들
export const detailHelpers = {
  // 메인 이미지 URL 가져오기
  getMainImageUrl: (artwork: DetailArtwork): string => {
    return artwork.imageUrl || artwork.imageURL?.[0] || '';
  },

  // 모든 이미지 URL 가져오기
  getAllImageUrls: (artwork: DetailArtwork): string[] => {
    return artwork.imageURL || artwork.images || [];
  },

  // 태그 이름 배열 가져오기
  getTagNames: (artwork: DetailArtwork): string[] => {
    return artwork.tags?.map((tag) => tag.name) || [];
  },

  // 날짜 포맷팅
  getFormattedCreatedAt: (artwork: DetailArtwork): string => {
    return new Date(artwork.postDate.createdAt).toLocaleDateString('ko-KR');
  },

  // 게시물 타입 라벨
  getPostTypeLabel: (postType: string): string => {
    switch (postType) {
      case 'ART':
        return '작품';
      case 'EXHIBITION':
        return '전시';
      case 'CONTEST':
        return '공모전';
      default:
        return '';
    }
  },

  // 사용자 타입 라벨
  getUserTypeLabel: (userType: string): string => {
    switch (userType) {
      case 'ARTIST':
        return '작가';
      case 'GALLERY':
        return '갤러리';
      case 'COLLECTOR':
        return '컬렉터';
      default:
        return '';
    }
  },
};

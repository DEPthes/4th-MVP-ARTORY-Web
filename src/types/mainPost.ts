// types/mainPost.ts

// 게시물 타입 enum
export type PostType = 'ART' | 'EXHIBITION' | 'CONTEST';

// 개별 게시물 아이템 타입
export interface MainPostItem {
  postId: string;
  postType: PostType;
  title: string;
  imageUrls: string[];
  userName: string;
  archived: number;
  isMine: boolean;
  isArchived: boolean;
}

// 정렬 정보 타입
export interface Sort {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

// 페이지네이션 정보 타입
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: Sort;
  paged: boolean;
  unpaged: boolean;
}

// 메인 게시물 응답 데이터 타입
export interface MainPostData {
  totalPages: number;
  totalElements: number;
  pageable: Pageable;
  first: boolean;
  last: boolean;
  size: number;
  content: MainPostItem[];
  number: number;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}

// 메인 게시물 API 응답 타입
export interface MainPostApiResponse {
  code: number;
  status: string;
  message: string;
  data: MainPostData;
}

// 메인 게시물 조회 파라미터 타입
export interface MainPostListParams {
  page?: number;
  size?: number;
  googleID: string;
  tagName?: string;
  postType: PostType;
}

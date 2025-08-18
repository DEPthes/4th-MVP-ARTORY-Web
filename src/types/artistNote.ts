// 작가 노트 관련 타입 정의

export interface ArtistNote {
  id: number;
  name: string;
  contact: string;
  introduction: string;
  email: string;
  profileImageURL: string;
  isMine: boolean;
}

export interface Sort {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: Sort;
  paged: boolean;
  unpaged: boolean;
}

export interface ArtistNoteListResponse {
  totalPages: number;
  totalElements: number;
  pageable: Pageable;
  first: boolean;
  last: boolean;
  size: number;
  content: ArtistNote[];
  number: number;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}

export interface ArtistNoteApiResponse {
  code: number;
  status: string;
  message: string;
  data: ArtistNoteListResponse;
}

export interface ArtistNoteListParams {
  page?: number;
  size?: number;
  googleID: string;
}

// API 클라이언트
export { default as apiClient } from "./client";

// 사용자 관련 API (TanStack Query)
export {
  userApi,
  type User,
  type LoginResponse as UserLoginResponse,
  type ApiResponse,
  type ArtistRegistrationData,
  type CollectorRegistrationData,
  type GalleryRegistrationData,
} from "./user";

// 작가 노트 관련 API
export { artistNoteApi } from "./artistNote";

// 태그 관련 API
export { tagApi } from "./tag";

// 상세 페이지 관련 API
export type { DetailArtwork } from "../types/detail";

// 게시물 수정/삭제 관련 API
export { postChangeApi } from "./postChange";
export { postDeleteApi } from "./postDelete";

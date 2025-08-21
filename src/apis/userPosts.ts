import type { ProfilePostsPage } from "../types/post-list";
import type { PostType } from "../utils/postType";

export interface ProfilePostsParams {
  page: number;
  size: number;
  googleID: string; // 호출자 googleID
  userID: number; // 조회 대상 userID(숫자)
  postType: PostType; // "ART" | "EXHIBITION" | "CONTEST"
  tagName: string; // "ALL" 또는 태그명
}

const API_BASE =
  import.meta.env.MODE === "development"
    ? ""
    : import.meta.env.VITE_API_BASE_URL ?? "";

export async function fetchProfilePosts(
  params: ProfilePostsParams
): Promise<ProfilePostsPage> {
  const qs = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
    googleID: params.googleID,
    userID: String(params.userID),
    postType: params.postType,
    tagName: params.tagName || "ALL",
  });

  const res = await fetch(`${API_BASE}/api/post/user?${qs.toString()}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `게시글 조회 실패(${res.status})`);
  }
  const json = await res.json();
  // 랩퍼 언랩: { code, status, message, data }
  return json?.data ?? json;
}

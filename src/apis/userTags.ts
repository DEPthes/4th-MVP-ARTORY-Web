import type { PostType } from "../utils/postType";

// 응답 예: { code, status, message, data: [{ id, name }] }
export async function getUserTags(params: {
  userID: number;
  postType: PostType;
}): Promise<string[]> {
  const qs = new URLSearchParams({
    userID: String(params.userID),
    postType: params.postType,
  });

  const res = await fetch(`/api/tag/user?${qs.toString()}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `태그 조회 실패(${res.status})`);
  }
  const json = await res.json();
  // data가 배열 [{ id, name }] 형태라고 가정. 다르면 콘솔로 구조 보고 맞추면 됨.
  const list = Array.isArray(json?.data) ? json.data : [];
  return list.map((t: { name: string }) => t.name).filter(Boolean);
}

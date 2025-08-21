import axios from "axios";

export interface FollowUserSummary {
  id: string;
  name: string;
  profileImageUrl?: string | null;
}

type RawFollowItem = {
  userId: number | string;
  nickname: string;
  profileImageUrl?: unknown;
};

// 백엔드 응답 정규화 (프로필 이미지가 문자열/배열/JSON 문자열인 경우 모두 대응)
const normalizeFollowList = (items: unknown): FollowUserSummary[] => {
  if (!Array.isArray(items)) return [];
  return (items as RawFollowItem[]).map((it) => {
    let imageUrl: string | null | undefined = null;
    const raw = it.profileImageUrl;

    if (typeof raw === "string") {
      // JSON 문자열 형태의 배열일 수 있음
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          imageUrl = typeof parsed[0] === "string" ? parsed[0] : null;
        } else {
          imageUrl = raw; // 단일 URL 문자열인 경우
        }
      } catch {
        imageUrl = raw; // 순수 문자열
      }
    } else if (Array.isArray(raw) && raw.length > 0) {
      imageUrl = typeof raw[0] === "string" ? raw[0] : null;
    } else if (raw == null) {
      imageUrl = null;
    }

    return {
      id: String(it.userId),
      name: it.nickname,
      profileImageUrl: imageUrl ?? null,
    };
  });
};

export const getFollowers = async (
  googleID: string,
  userId: string
): Promise<FollowUserSummary[]> => {
  const response = await axios.get(`/api/follow/${userId}/followers`, {
    params: { googleId: googleID },
  });
  return normalizeFollowList(response.data?.data ?? response.data);
};

export const getFollowing = async (
  googleID: string,
  userId: string
): Promise<FollowUserSummary[]> => {
  const response = await axios.get(`/api/follow/${userId}/following`, {
    params: { googleId: googleID },
  });
  return normalizeFollowList(response.data?.data ?? response.data);
};

// 팔로우/언팔로우 API 추가 (실제 API 엔드포인트에 맞춤)
export const followUser = async (
  googleID: string,
  targetUserId: string
): Promise<{
  targetUserId: number;
  following: boolean;
  targetFollowerCount: number;
}> => {
  const response = await axios.post(`/api/follow/${targetUserId}`, null, {
    params: { googleId: googleID },
  });
  return response.data;
};

export const unfollowUser = async (
  googleID: string,
  targetUserId: string
): Promise<{
  targetUserId: number;
  following: boolean;
  targetFollowerCount: number;
}> => {
  // 언팔로우도 같은 엔드포인트로 POST 요청
  const response = await axios.post(`/api/follow/${targetUserId}`, null, {
    params: { googleId: googleID },
  });
  return response.data;
};

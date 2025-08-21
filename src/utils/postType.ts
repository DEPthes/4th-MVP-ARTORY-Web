export type TabId =
  | "artistNote"
  | "works"
  | "exhibition"
  | "contest"
  | "archive";
export type PostType = "ART" | "EXHIBITION" | "CONTEST";

export const tabIdToPostType = (tabId: TabId): PostType | null => {
  switch (tabId) {
    case "works":
      return "ART";
    case "exhibition":
      return "EXHIBITION";
    case "contest":
      return "CONTEST";
    default:
      return null;
  }
};

// 태그 파라미터 정규화(null → "ALL")
export const normalizeTagName = (tag: string | null | undefined) =>
  tag ?? "ALL";

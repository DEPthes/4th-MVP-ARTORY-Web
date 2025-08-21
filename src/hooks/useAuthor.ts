// src/hooks/useAuthor.ts
import { useLocation, useSearchParams } from 'react-router-dom';

/** 목록→상세 state, URL query, artwork.author 순으로 작가명 선택 */
export function useResolvedAuthor(artworkAuthor?: string) {
  const location = useLocation();
  const state = (location.state as { authorFromList?: string } | null) ?? null;

  const [searchParams] = useSearchParams();
  const queryAuthor = searchParams.get('author') || undefined;

  const finalAuthor =
    state?.authorFromList?.trim() ||
    queryAuthor?.trim() ||
    artworkAuthor?.trim() ||
    undefined;

  return finalAuthor;
}

/** author가 있으면 artwork에 덮어쓰기 */
export function attachAuthor<T extends { author?: string }>(
  artwork: T,
  author?: string
): T {
  if (author && author.trim()) {
    return { ...artwork, author: author.trim() } as T;
  }
  return artwork;
}

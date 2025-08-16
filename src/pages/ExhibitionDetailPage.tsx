// src/pages/ExhibitionDetailPage.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ChevronRight } from 'lucide-react';
import Header from '../components/Layouts/Header';
import Chip from '../components/Chip';

// Vite + SVGR
import ArrowSvg from '../assets/arrow.svg?react';
import LinkSvg from '../assets/link.svg?react';

// ExhibitionPage와 동일 카테고리
const Category = [
  '전체',
  '회화',
  '조각',
  '공예',
  '건축',
  '사진',
  '미디어아트',
  '인테리어',
  '기타',
] as const;
type Category = (typeof Category)[number];

// ✅ ExhibitionPage 데이터 키와 동일(필요 시 images는 선택)
type Exhibition = {
  imageUrl: string; // 상단 썸네일(레거시)
  images?: string[]; // 여러 장: [썸네일, 16:9, 3:4, ...] (옵션)
  exhibitionName: string;
  curator?: string; // 작가/큐레이터 표기(옵션)
  likes: number;
  category: Category;
};

// ⛳️ 예시 데이터: ExhibitionPage와 동일한 5개 + (옵션)일부 다중이미지
const exhibitions: Exhibition[] = [
  {
    imageUrl: '',
    images: ['', '', ''],
    exhibitionName: '봄, 색의 변주',
    likes: 7,
    category: '회화',
    curator: '홍길동',
  },
  {
    imageUrl: '',
    images: ['', ''],
    exhibitionName: '빛과 공간의 대화',
    likes: 11,
    category: '건축',
    curator: '김건축',
  },
  {
    imageUrl: '',
    exhibitionName: '시간의 조각',
    likes: 4,
    category: '조각',
    curator: '이조각',
  },
  {
    imageUrl: '',
    images: ['', '', ''],
    exhibitionName: '사소한 물성',
    likes: 2,
    category: '공예',
    curator: '최공예',
  },
  {
    imageUrl: '',
    exhibitionName: '프레임 너머',
    likes: 9,
    category: '사진',
    curator: '정사진',
  },
];

const ExhibitionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1-based index (ExhibitionPage에서 /exhibition/:id 로 진입)
  const idx = Number(id) - 1;
  const exhibit =
    Number.isInteger(idx) && idx >= 0 && idx < exhibitions.length
      ? exhibitions[idx]
      : undefined;

  // 상태
  const [liked, setLiked] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>(
    'idle'
  );

  if (!exhibit) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-300 mx-auto px-6 py-10 text-gray-600">
          전시를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  // 이미지 소스 (CollectionDetailPage와 동일 로직)
  const thumbSrc =
    (exhibit.images && exhibit.images[0])?.trim() ||
    exhibit.imageUrl?.trim() ||
    '';

  const hasWide = Array.isArray(exhibit.images) && exhibit.images.length >= 2;
  const hasTall = Array.isArray(exhibit.images) && exhibit.images.length >= 3;

  const wideSrc = hasWide ? exhibit.images![1]?.trim() || '' : '';
  const tallSrc = hasTall ? exhibit.images![2]?.trim() || '' : '';

  // 좋아요 계산식
  const baseLikes = exhibit.likes ?? 0;
  const displayedLikes = baseLikes + (liked ? 1 : 0);

  const onToggleLike = () => setLiked((v) => !v);

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 1200);
    } catch {
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비 */}
      <Header />

      {/* 회색 배너 */}
      <div className="bg-gray-100">
        <div className="w-full pl-8 pr-6 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
            aria-label="뒤로가기"
          >
            <ArrowSvg className="w-4 h-4 text-gray-600" />
            <span className="text-left">EXHIBITION</span>
          </button>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-300 mx-auto px-6 mt-6">
        {/* 상단: 좌(썸네일 400×512) / 우(제목·작가) */}
        <div className="flex gap-10">
          {/* 왼쪽 썸네일 */}
          <div>
            <div className="bg-gray-200 w-100 h-128 rounded-md overflow-hidden">
              {thumbSrc ? (
                <img
                  src={thumbSrc}
                  alt={`${exhibit.exhibitionName} 썸네일`}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
          </div>

          {/* 오른쪽 정보 */}
          <div className="flex-1 flex flex-col min-h-128">
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                {exhibit.exhibitionName}
              </h1>
              {exhibit.curator && (
                <span className="mt-1.5 inline-flex items-center text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                  {exhibit.curator}
                  <ChevronRight className="ml-1 w-4 h-4 text-gray-400" />
                </span>
              )}
            </div>

            <div className="mt-auto">
              <button
                onClick={onCopyLink}
                className="inline-grid place-items-center w-7 h-7 rounded-full border border-gray-300 bg-white hover:bg-gray-50 cursor-pointer"
                aria-label="링크 복사"
                title={
                  copyState === 'copied'
                    ? '복사됨'
                    : copyState === 'error'
                    ? '복사 오류'
                    : '링크 복사'
                }
              >
                <LinkSvg className="w-4.5 h-4.5 text-rose-400" />
              </button>
              <span className="ml-2 align-middle text-xs text-gray-500">
                {copyState === 'copied'
                  ? '복사됨'
                  : copyState === 'error'
                  ? '복사 오류'
                  : ''}
              </span>
            </div>
          </div>
        </div>

        {/* 수평선 */}
        <hr className="my-6 border-gray-200" />

        {/* 하단 갤러리: 1) 가로형 → 2) 세로형 */}
        {(hasWide || hasTall) && (
          <div className="mt-6 space-y-10">
            {/* 가로형(두 번째) */}
            {hasWide && (
              <div
                className="mx-auto w-full bg-gray-200 rounded-md overflow-hidden"
                style={{ maxWidth: '720px', aspectRatio: '16 / 9' }}
              >
                {wideSrc ? (
                  <img
                    src={wideSrc}
                    alt={`${exhibit.exhibitionName} 추가 이미지 1`}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
            )}

            {/* 세로형(세 번째) */}
            {hasTall && (
              <div
                className="mx-auto w-full bg-gray-200 rounded-md overflow-hidden"
                style={{ maxWidth: '480px', aspectRatio: '3 / 4' }}
              >
                {tallSrc ? (
                  <img
                    src={tallSrc}
                    alt={`${exhibit.exhibitionName} 추가 이미지 2`}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* 설명 카드(임시 카피 동일) */}
        <div className="min-h-130 px-10 py-9 rounded-lg bg-gray-100 flex flex-col gap-2 mt-6">
          <p className="mx-auto max-w-160 text-center text-xs text-gray-600 leading-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.{' '}
            <br />
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>
          <div className="mt-4 h-75 rounded-lg bg-gray-100" />
        </div>

        {/* 태그 + 아카이브 */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Chip label={`# ${exhibit.category}`} isActive={false} />
          </div>

          <button
            onClick={onToggleLike}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-gray-700 hover:border-gray-300 cursor-pointer ${
              liked
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-white border-gray-200'
            }`}
            aria-pressed={liked}
            aria-label="아카이브"
            type="button"
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span className="text-sm">아카이브</span>
            <span className="text-sm tabular-nums">
              {String(displayedLikes).padStart(2, '0')}
            </span>
          </button>
        </div>

        <div className="h-12" />
      </div>
    </div>
  );
};

export default ExhibitionDetailPage;

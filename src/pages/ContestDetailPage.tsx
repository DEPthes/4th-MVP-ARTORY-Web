import { useParams } from 'react-router-dom';
import Header from '../components/Layouts/Header';
import BackNavigate from '../components/Layouts/BackNavigate';

import ArtworkThumbnail from '../components/Collection/ArtworkThumbnail';
import ArtworkMeta from '../components/Collection/ArtworkMeta';
import ArtworkGallery from '../components/Collection/ArtworkGallery';
import DescriptionCard from '../components/Collection/DescriptionCard';
import ArchiveBar from '../components/Collection/ArchiveBar';

/** Contest 전용 로컬 타입/데이터 (ContestPage.tsx와 동일 카테고리/목록 개념) */
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

type Contest = {
  imageUrl: string;
  contestName: string;
  likes: number;
  category: Category;
};

// ⛳️ ContestPage.tsx의 예시 데이터와 **순서/내용 동일**하게 유지 (index 매칭)
const contests: Contest[] = [
  {
    imageUrl: '',
    contestName: '뉴미디어 아트 공모전',
    likes: 12,
    category: '미디어아트',
  },
  { imageUrl: '', contestName: '청년 사진 공모전', likes: 5, category: '사진' },
  { imageUrl: '', contestName: '도시 공간 디자인', likes: 8, category: '건축' },
  {
    imageUrl: '',
    contestName: '현대 회화 기획전 공모',
    likes: 3,
    category: '회화',
  },
  { imageUrl: '', contestName: '공예 리빙 디자인', likes: 2, category: '공예' },
];

const ContestDetailPage = () => {
  const { id } = useParams();

  // 1-based index
  const idx = Number(id) - 1;
  const contest =
    Number.isInteger(idx) && idx >= 0 && idx < contests.length
      ? contests[idx]
      : undefined;

  if (!contest) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-300 mx-auto px-6 py-10 text-gray-600">
          공모전을 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  // UI 컴포넌트가 기대하는 구조(Artwork 형태)로 맞춰 전달
  const asArtwork = {
    imageUrl: contest.imageUrl,
    images: undefined, // 현재 예시엔 보조 이미지 없음
    title: contest.contestName,
    author: undefined, // 주최자 정보 없으면 비움
    likes: contest.likes,
    category: contest.category,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비 */}
      <Header />

      {/* 뒤로가기 배너 */}
      <BackNavigate pathname="/contest" text="CONTEST" variant="secondary" />

      {/* 본문 */}
      <div className="max-w-300 mx-auto px-6 mt-6 pb-12">
        {/* 상단: 좌(썸네일) / 우(제목) */}
        <div className="flex gap-10">
          <div>
            <ArtworkThumbnail artwork={asArtwork} />
          </div>
          <ArtworkMeta artwork={asArtwork} />
        </div>

        {/* 수평선 */}
        <hr className="my-6 border-gray-200" />

        {/* 갤러리 (images 없으면 내부에서 렌더 X) */}
        <ArtworkGallery artwork={asArtwork} />

        {/* 설명 카드 */}
        <DescriptionCard
          description={`이 섹션은 API 연동 후 서버에서 내려올 설명을 표시하는 영역입니다.
현재는 예시 데이터로 렌더링됩니다.

• 작품명: ${asArtwork.title}
• 작가: ${asArtwork.author ?? '정보 없음'}`}
        />

        {/* 태그 + 아카이브 */}
        <ArchiveBar artwork={asArtwork} />
      </div>
    </div>
  );
};

export default ContestDetailPage;

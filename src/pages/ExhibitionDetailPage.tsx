import { useParams } from 'react-router-dom';
import Header from '../components/Layouts/Header';
import BackNavigate from '../components/Layouts/BackNavigate';

import ArtworkThumbnail from '../components/Collection/ArtworkThumbnail';
import ArtworkMeta from '../components/Collection/ArtworkMeta';
import ArtworkGallery from '../components/Collection/ArtworkGallery';
import DescriptionCard from '../components/Collection/DescriptionCard';
import ArchiveBar from '../components/Collection/ArchiveBar';

/** Exhibition 전용 로컬 타입/데이터 (공용 타입 파일 없이 사용) */
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

type Exhibition = {
  imageUrl: string;
  images?: string[]; // [thumb, 16:9, 3:4]
  exhibitionName: string;
  curator?: string;
  likes: number;
  category: Category;
};

// ⛳️ 예시 데이터 (목록 페이지와 동일 컨셉, 상세는 1-based index로 진입)
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

  // 1-based index
  const idx = Number(id) - 1;
  const exhibit =
    Number.isInteger(idx) && idx >= 0 && idx < exhibitions.length
      ? exhibitions[idx]
      : undefined;

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

  // UI 컴포넌트가 기대하는 구조(Artwork 형태)로 맞춰 전달
  const artworkLikeObject = {
    imageUrl: exhibit.imageUrl,
    images: exhibit.images,
    title: exhibit.exhibitionName,
    author: exhibit.curator,
    likes: exhibit.likes,
    category: exhibit.category,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비 */}
      <Header />

      {/* 뒤로가기 배너 */}
      <BackNavigate
        pathname="/exhibition"
        text="EXHIBITION"
        variant="secondary"
      />

      {/* 본문 */}
      <div className="max-w-300 mx-auto px-6 mt-6 pb-12">
        {/* 상단: 좌(썸네일) / 우(제목·큐레이터) */}
        <div className="flex gap-10">
          <div>
            <ArtworkThumbnail artwork={artworkLikeObject} />
          </div>
          <ArtworkMeta artwork={artworkLikeObject} />
        </div>

        {/* 수평선 */}
        <hr className="my-6 border-gray-200" />

        {/* 갤러리 */}
        <ArtworkGallery artwork={artworkLikeObject} />

        {/* 설명 카드 */}
        <DescriptionCard
          description={`이 섹션은 API 연동 후 서버에서 내려올 설명을 표시하는 영역입니다.
현재는 예시 데이터로 렌더링됩니다.

• 작품명: ${artworkLikeObject.title}
• 작가: ${artworkLikeObject.author ?? '정보 없음'}`}
        />

        {/* 태그 + 아카이브 */}
        <ArchiveBar artwork={artworkLikeObject} />
      </div>
    </div>
  );
};

export default ExhibitionDetailPage;

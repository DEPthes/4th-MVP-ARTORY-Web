import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Layouts/Header';
import BackNavigate from '../components/Layouts/BackNavigate';

import ArtworkThumbnail from '../components/Collection/ArtworkThumbnail';
import ArtworkMeta from '../components/Collection/ArtworkMeta';
import ArtworkGallery from '../components/Collection/ArtworkGallery';
import DescriptionCard from '../components/Collection/DescriptionCard';
import ArchiveBar from '../components/Collection/ArchiveBar';
import ConfirmModal from '../components/Modals/ConfirmModal';
import OwnerActions from '../components/Detail/OwnerActions';

/** Exhibition 전용 로컬 타입/데이터 */
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
  ownerId?: string;
};

const exhibitions: Exhibition[] = [
  {
    imageUrl: '',
    images: ['', '', ''],
    exhibitionName: '봄, 색의 변주',
    likes: 7,
    category: '회화',
    curator: '홍길동',
    ownerId: 'u-1',
  },
  {
    imageUrl: '',
    images: ['', ''],
    exhibitionName: '빛과 공간의 대화',
    likes: 11,
    category: '건축',
    curator: '김건축',
    ownerId: 'u-2',
  },
  {
    imageUrl: '',
    exhibitionName: '시간의 조각',
    likes: 4,
    category: '조각',
    curator: '이조각',
    ownerId: 'u-2',
  },
  {
    imageUrl: '',
    images: ['', '', ''],
    exhibitionName: '사소한 물성',
    likes: 2,
    category: '공예',
    curator: '최공예',
    ownerId: 'u-1',
  },
  {
    imageUrl: '',
    exhibitionName: '프레임 너머',
    likes: 9,
    category: '사진',
    curator: '정사진',
    ownerId: 'u-1',
  },
];

const ExhibitionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1-based → 0-based
  const idx = Number(id) - 1;
  const exhibit =
    Number.isInteger(idx) && idx >= 0 && idx < exhibitions.length
      ? exhibitions[idx]
      : undefined;

  // 로그인 유저(예시)
  const currentUserId = 'u-1';
  const isOwner = exhibit?.ownerId === currentUserId;

  const [openDelete, setOpenDelete] = useState(false);

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

  // 공용 UI가 기대하는 구조로 맞춰 전달
  const artwork = {
    imageUrl: exhibit.imageUrl,
    images: exhibit.images,
    title: exhibit.exhibitionName,
    author: exhibit.curator,
    likes: exhibit.likes,
    category: exhibit.category,
  };

  const handleEdit = () => navigate(`/exhibition/${id}/edit`);
  const handleDelete = () => setOpenDelete(true);
  const confirmDelete = () => {
    setOpenDelete(false);
    navigate('/exhibition');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BackNavigate
        pathname="/exhibition"
        text="EXHIBITION"
        variant="secondary"
      />

      <div className="max-w-300 mx-auto px-6 mt-6 pb-12">
        {isOwner && (
          <OwnerActions
            onEdit={handleEdit}
            onDelete={handleDelete}
            className="mb-2"
          />
        )}

        <div className="flex gap-10">
          <div>
            <ArtworkThumbnail artwork={artwork} />
          </div>
          <ArtworkMeta artwork={artwork} />
        </div>

        <hr className="my-6 border-gray-200" />

        <ArtworkGallery artwork={artwork} />

        <DescriptionCard
          description={`이 영역은 API 연동 후 서버에서 내려올 설명을 보여줍니다.
현재는 '${artwork.title}' 예시 텍스트입니다.`}
        />

        <ArchiveBar artwork={artwork} />
      </div>

      <ConfirmModal
        open={openDelete}
        title="해당 게시글을 삭제하시겠어요?"
        cancelText="취소"
        confirmText="삭제"
        destructive
        onClose={() => setOpenDelete(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ExhibitionDetailPage;

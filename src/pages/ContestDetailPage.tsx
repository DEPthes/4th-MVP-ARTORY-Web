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

/** Contest 전용 로컬 타입/데이터 */
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
  ownerId?: string;
};

// ContestPage와 동일 순서/내용 유지(인덱스 매칭)
const contests: Contest[] = [
  {
    imageUrl: '',
    contestName: '뉴미디어 아트 공모전',
    likes: 12,
    category: '미디어아트',
    ownerId: 'u-1',
  },
  {
    imageUrl: '',
    contestName: '청년 사진 공모전',
    likes: 5,
    category: '사진',
    ownerId: 'u-2',
  },
  {
    imageUrl: '',
    contestName: '도시 공간 디자인',
    likes: 8,
    category: '건축',
    ownerId: 'u-1',
  },
  {
    imageUrl: '',
    contestName: '현대 회화 기획전 공모',
    likes: 3,
    category: '회화',
    ownerId: 'u-2',
  },
  {
    imageUrl: '',
    contestName: '공예 리빙 디자인',
    likes: 2,
    category: '공예',
    ownerId: 'u-1',
  },
];

const ContestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1-based → 0-based
  const idx = Number(id) - 1;
  const contest =
    Number.isInteger(idx) && idx >= 0 && idx < contests.length
      ? contests[idx]
      : undefined;

  // 로그인 유저(예시)
  const currentUserId = 'u-1';
  const isOwner = contest?.ownerId === currentUserId;

  const [openDelete, setOpenDelete] = useState(false);

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

  // 공용 UI가 기대하는 구조로 맞춰 전달
  const artwork = {
    imageUrl: contest.imageUrl,
    images: undefined,
    title: contest.contestName,
    author: undefined,
    likes: contest.likes,
    category: contest.category,
  };

  const handleEdit = () => navigate(`/contest/${id}/edit`);
  const handleDelete = () => setOpenDelete(true);
  const confirmDelete = () => {
    setOpenDelete(false);
    navigate('/contest');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BackNavigate pathname="/contest" text="CONTEST" variant="secondary" />

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

export default ContestDetailPage;

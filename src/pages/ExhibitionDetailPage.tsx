// pages/ExhibitionDetailPage.tsx
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
import { useExhibitionDetail } from '../hooks/useDetail';

const ExhibitionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 실제 API 사용
  const {
    data: artwork,
    isLoading,
    error,
  } = useExhibitionDetail({
    id: String(id),
  });

  const [openDelete, setOpenDelete] = useState(false);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-300 mx-auto px-6 py-10 text-gray-600 text-center">
          로딩 중...
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    console.error('💥 전시 상세 조회 에러:', error);
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-300 mx-auto px-6 py-10 text-gray-600 text-center">
          전시를 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!artwork) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-300 mx-auto px-6 py-10 text-gray-600 text-center">
          전시를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  // 소유자 여부 확인 (API에서 제공하는 isMine 사용)
  const isOwner = artwork.isMine;

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

      <div className="max-w-300 mx-auto px-6 mt-6 pb-40">
        {/* 소유자 전용 액션 */}
        {isOwner && (
          <OwnerActions
            onEdit={handleEdit}
            onDelete={handleDelete}
            className="mb-2"
          />
        )}

        {/* 상단: 좌(썸네일) / 우(제목·작가) */}
        <div className="flex gap-10 mt-20">
          <div>
            <ArtworkThumbnail artwork={artwork} />
          </div>
          <ArtworkMeta artwork={artwork} />
        </div>

        {/* 구분선 */}
        <div className="my-8 mx-6 h-0.5 bg-neutral-200" />

        {/* 갤러리 (이미지 없으면 내부에서 렌더 X) */}
        <ArtworkGallery artwork={artwork} />

        {/* 설명 카드 */}
        <DescriptionCard description={artwork.description || ''} />

        {/* 태그 + 아카이브 */}
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

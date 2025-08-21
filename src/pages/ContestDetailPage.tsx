// src/pages/CollectionDetailPage.tsx
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
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
import { useCollectionDetail } from '../hooks/useDetail';

type RouteState = { authorFromList?: string } | null;

const CollectionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: artwork,
    isLoading,
    error,
  } = useCollectionDetail({ id: String(id) });
  const [openDelete, setOpenDelete] = useState(false);

  // 목록 -> 상세로 넘겨준 작가명(state / query) 받기
  const location = useLocation();
  const stateAuthor =
    (location.state as RouteState)?.authorFromList ?? undefined;

  const [searchParams] = useSearchParams();
  const queryAuthor = searchParams.get('author') || undefined;

  // 최종 작가명 (state 우선, 없으면 query)
  const finalAuthor = stateAuthor ?? queryAuthor ?? undefined;

  // ArtworkMeta로 넘길 데이터 (제목은 artwork.title, 아래는 author)
  const artworkForMeta = artwork
    ? { ...artwork, author: finalAuthor }
    : undefined;

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

  if (error) {
    console.error('💥 작품 상세 조회 에러:', error);
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-300 mx-auto px-6 py-10 text-gray-600 text-center">
          작품을 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  if (!artworkForMeta) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-300 mx-auto px-6 py-10 text-gray-600 text-center">
          작품을 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const isOwner = artworkForMeta.isMine;
  const handleEdit = () => navigate(`/collection/${id}/edit`);
  const handleDelete = () => setOpenDelete(true);
  const confirmDelete = () => {
    setOpenDelete(false);
    navigate('/collection');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BackNavigate
        pathname="/collection"
        text="COLLECTION"
        variant="secondary"
      />

      <div className="max-w-300 mx-auto px-6 mt-6 pb-40">
        {isOwner && (
          <OwnerActions
            onEdit={handleEdit}
            onDelete={handleDelete}
            className="mb-2"
          />
        )}

        <div className="flex gap-10 mt-20">
          <div>
            <ArtworkThumbnail artwork={artworkForMeta} />
          </div>
          {/* 제목 아래에 author 표시 */}
          <ArtworkMeta artwork={artworkForMeta} />
        </div>

        <div className="my-8 mx-6 h-0.5 bg-neutral-200" />
        <ArtworkGallery artwork={artworkForMeta} />
        <DescriptionCard description={artworkForMeta.description || ''} />
        <ArchiveBar artwork={artworkForMeta} />
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

export default CollectionDetailPage;

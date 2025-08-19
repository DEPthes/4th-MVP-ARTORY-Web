// src/pages/CollectionDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Layouts/Header";
import BackNavigate from "../components/Layouts/BackNavigate";

import ArtworkThumbnail from "../components/Collection/ArtworkThumbnail";
import ArtworkMeta from "../components/Collection/ArtworkMeta";
import ArtworkGallery from "../components/Collection/ArtworkGallery";
import DescriptionCard from "../components/Collection/DescriptionCard";
import ArchiveBar from "../components/Collection/ArchiveBar";
import ConfirmModal from "../components/Modals/ConfirmModal";
import OwnerActions from "../components/Detail/OwnerActions";
import { useCollectionDetail } from "../hooks/useDetail";

/* ---------- 예시 타입/데이터 (CollectionPage와 동일) ---------- */
const Category = [
  "전체",
  "회화",
  "조각",
  "공예",
  "건축",
  "사진",
  "미디어아트",
  "인테리어",
  "기타",
] as const;
type Category = (typeof Category)[number];

type Artwork = {
  imageUrl: string;
  images?: string[]; // 갤러리 재사용 대비
  title: string;
  author?: string;
  likes: number;
  category: Category;
  ownerId?: string; // 소유자 판별
};

const artworks: Artwork[] = [
  {
    imageUrl: "",
    title: "봄의 정원",
    author: "홍길동",
    likes: 10,
    category: "회화",
    ownerId: "u-1",
  },
  {
    imageUrl: "",
    title: "빛의 단면",
    author: "김작가",
    likes: 3,
    category: "사진",
    ownerId: "u-2",
  },
  {
    imageUrl: "",
    title: "공간의 기억",
    author: "이아티스트",
    likes: 8,
    category: "조각",
    ownerId: "u-2",
  },
  {
    imageUrl: "",
    title: "목질의 온도",
    author: "최공예",
    likes: 6,
    category: "공예",
    ownerId: "u-1",
  },
  {
    imageUrl: "",
    title: "도시의 결",
    author: "정디자이너",
    likes: 5,
    category: "건축",
    ownerId: "u-1",
  },
];

const CollectionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: fetchedArtwork } = useCollectionDetail({ id: String(id) });

  // 1-based → 0-based
  const idx = Number(id) - 1;
  const localItem =
    Number.isInteger(idx) && idx >= 0 && idx < artworks.length
      ? artworks[idx]
      : undefined;
  const artwork = fetchedArtwork ?? localItem;

  // 로그인 유저(예시)
  const currentUserId = "u-1";
  const isOwner = (localItem?.ownerId ?? undefined) === currentUserId;

  const [openDelete, setOpenDelete] = useState(false);

  if (!artwork) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-300 mx-auto px-6 py-10 text-gray-600">
          작품을 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const handleEdit = () => navigate(`/collection/${id}/edit`);
  const handleDelete = () => setOpenDelete(true);
  const confirmDelete = () => {
    setOpenDelete(false);
    navigate("/collection");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비 */}
      <Header />
      <BackNavigate
        pathname="/collection"
        text="COLLECTION"
        variant="secondary"
      />

      {/* 본문 */}
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

        {/* 설명 카드 (예시) */}
        <DescriptionCard
          description={`이 영역은 API 연동 후 서버에서 내려온 설명을 보여줍니다.\n현재는 '${artwork.title}' 예시 텍스트입니다.`}
        />

        {/* 태그 + 아카이브 */}
        <ArchiveBar artwork={artwork} />
      </div>

      {/* 삭제 확인 모달 */}
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

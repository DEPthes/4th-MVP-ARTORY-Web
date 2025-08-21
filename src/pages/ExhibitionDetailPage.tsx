// pages/ExhibitionDetailPage.tsx
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
import { useExhibitionDetail } from "../hooks/useDetail";
import { useResolvedAuthor, attachAuthor } from "../hooks/useAuthor";

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

  // 목록 state / URL ?author / artwork.author 순으로 작가명 해석 (hooks는 항상 최상위에서 호출)
  const finalAuthor = useResolvedAuthor(artwork?.author);
  const artworkForMeta = artwork
    ? attachAuthor(artwork, finalAuthor)
    : undefined;

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
    console.error("💥 전시 상세 조회 에러:", error);
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

  if (!artworkForMeta) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-300 mx-auto px-6 py-10 text-gray-600 text-center">
          전시 데이터를 처리할 수 없습니다.
        </div>
      </div>
    );
  }

  // 소유자 여부 확인 (API에서 제공하는 isMine 사용)
  const isOwner = artwork.isMine;

  const handleEdit = () => {
    // 수정 페이지로 이동하면서 기존 데이터 전달
    navigate(`/editor/exhibition/${artwork.id}/edit`, {
      state: {
        images:
          artwork.images?.map((url, index) => ({
            id: index.toString(),
            url: url,
            file: undefined,
            isCover: index === 0, // 첫 번째 이미지를 대표 이미지로 설정
          })) || [],
        title: artwork.title,
        description: artwork.description,
        url: "",
        tags: artwork.tags?.map((tag) => tag.name) || [],
      },
    });
  };

  const handleDelete = () => setOpenDelete(true);
  const confirmDelete = async () => {
    try {
      const myGoogleId = localStorage.getItem("googleID") || "";
      if (!myGoogleId) {
        alert("로그인이 필요합니다.");
        return;
      }

      // 삭제 API 호출
      const { postDeleteApi } = await import("../apis/postDelete");
      await postDeleteApi.deletePost({
        postID: artwork.id,
        googleID: myGoogleId,
      });

      setOpenDelete(false);
      navigate("/exhibition");
    } catch (error: unknown) {
      console.error("삭제 실패:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "게시물 삭제 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
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
            <ArtworkThumbnail artwork={artworkForMeta} />
          </div>
          <ArtworkMeta artwork={artworkForMeta} />
        </div>

        {/* 구분선 */}
        <div className="my-8 mx-6 h-0.5 bg-neutral-200" />

        {/* 갤러리 (이미지 없으면 내부에서 렌더 X) */}
        <ArtworkGallery artwork={artworkForMeta} />

        {/* 설명 카드 */}
        <DescriptionCard description={artworkForMeta.description || ""} />

        {/* 태그 + 아카이브 */}
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

export default ExhibitionDetailPage;

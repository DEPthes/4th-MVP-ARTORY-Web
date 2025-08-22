// src/pages/CollectionDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

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
import { useResolvedAuthor, attachAuthor } from "../hooks/useAuthor";

const CollectionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: artwork,
    isLoading,
    error,
  } = useCollectionDetail({ id: String(id) });
  const [openDelete, setOpenDelete] = useState(false);

  // 목록 state / URL ?author / artwork.author 순으로 작가명 해석
  const finalAuthor = useResolvedAuthor(artwork?.author);
  const artworkForMeta = artwork
    ? attachAuthor(artwork, finalAuthor)
    : undefined;

  // ArchiveBar 제거로 인해 handleArchiveToggle 함수도 제거

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
    console.error("💥 작품 상세 조회 에러:", error);
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
  const handleEdit = () => {
    // 수정 페이지로 이동하면서 기존 데이터 전달
    navigate(`/editor/work/${artworkForMeta.id}/edit`, {
      state: {
        images:
          artworkForMeta.images?.map((url, index) => ({
            id: index.toString(),
            url: url,
            file: undefined,
            isCover: index === 0, // 첫 번째 이미지를 대표 이미지로 설정
          })) || [],
        title: artworkForMeta.title,
        description: artworkForMeta.description,
        url: "",
        tags: artworkForMeta.tags?.map((tag) => tag.name) || [],
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
        postID: artworkForMeta.id,
        googleID: myGoogleId,
      });

      // 삭제 성공 후 관련된 모든 쿼리 무효화
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            // 사용자 게시물 관련 쿼리들
            (Array.isArray(queryKey) && queryKey[0] === "userPosts") ||
            // 메인 게시물 목록 관련 쿼리들
            (Array.isArray(queryKey) && queryKey[0] === "mainPost") ||
            // 검색 결과 관련 쿼리들
            (Array.isArray(queryKey) && queryKey[0] === "search") ||
            // 아카이브 관련 쿼리들
            (Array.isArray(queryKey) && queryKey[0] === "userArchive") ||
            // 컬렉션 목록 관련 쿼리들
            (Array.isArray(queryKey) && queryKey[0] === "collection")
          );
        },
      });

      setOpenDelete(false);
      navigate("/collection");
    } catch (error: any) {
      console.error("삭제 실패:", error);
      alert(error?.message || "게시물 삭제 중 오류가 발생했습니다.");
    }
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
          {/* 제목 아래 author 표시 (없으면 ArtworkMeta에서 자동 숨김) */}
          <ArtworkMeta artwork={artworkForMeta} />
        </div>

        <div className="my-8 mx-6 h-0.5 bg-neutral-200" />
        <ArtworkGallery artwork={artworkForMeta} />
        <DescriptionCard description={artworkForMeta.description || ""} />
        <ArchiveBar
          artwork={artworkForMeta}
          onArchiveToggle={() => {
            // 아카이브 상태 변경 후 관련된 모든 쿼리 무효화
            queryClient.invalidateQueries({
              predicate: (query) => {
                const queryKey = query.queryKey;
                return (
                  // 사용자 게시물 관련 쿼리들
                  (Array.isArray(queryKey) && queryKey[0] === "userPosts") ||
                  // 메인 게시물 목록 관련 쿼리들
                  (Array.isArray(queryKey) && queryKey[0] === "mainPost") ||
                  // 검색 결과 관련 쿼리들
                  (Array.isArray(queryKey) && queryKey[0] === "search") ||
                  // 아카이브 관련 쿼리들
                  (Array.isArray(queryKey) && queryKey[0] === "userArchive") ||
                  // 컬렉션 상세 관련 쿼리들
                  (Array.isArray(queryKey) &&
                    queryKey[0] === "collectionDetail") ||
                  // 컬렉션 목록 관련 쿼리들
                  (Array.isArray(queryKey) && queryKey[0] === "collection")
                );
              },
            });
          }}
        />
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

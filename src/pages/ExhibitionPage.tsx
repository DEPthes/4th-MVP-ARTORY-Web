// src/pages/ExhibitionPage.tsx
import React, { useMemo, useState } from 'react';
import ArtworkCard from '../components/ArtworkCard';
import Chip from '../components/Chip';
import Header from '../components/Layouts/Header';
import BannerControl from '../components/Profile/BannerControl';
import EmptyState from '../components/EmptyState';
import { useTagList } from '../hooks/useTag';
import { useMainPostListByType } from '../hooks/useMainPost';
import { useNavigate } from 'react-router-dom';

type Category = '전체' | string;

const ExhibitionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category>('전체');

  // 현재 로그인한 사용자의 googleID 가져오기
  const googleID = localStorage.getItem('googleID') || '';

  // 태그 리스트 조회
  const { data: tagResponse } = useTagList();

  // 메인 게시물 조회 - EXHIBITION 타입만
  const {
    data: mainPostResponse,
    isLoading,
    error,
  } = useMainPostListByType(
    googleID,
    'EXHIBITION', // EXHIBITION 타입 게시물만 조회
    {
      page: 0,
      size: 50, // 충분한 데이터를 가져와서 클라이언트에서 필터링
      tagName: selectedCategory === '전체' ? undefined : selectedCategory,
    }
  );

  // 동적으로 가져온 태그를 포함한 카테고리 목록 생성
  const categories = useMemo(() => {
    if (!tagResponse?.data) {
      return ['전체']; // 태그 로딩 중이거나 실패한 경우 기본값
    }
    return ['전체', ...tagResponse.data.map((tag) => tag.name)];
  }, [tagResponse]);

  // API 데이터를 컴포넌트에서 사용할 형식으로 변환
  const exhibitions = useMemo(() => {
    if (!mainPostResponse?.data?.content) {
      return [];
    }

    return mainPostResponse.data.content.map((post) => ({
      id: post.postId,
      imageUrl: post.imageUrls[0] || '', // 첫 번째 이미지를 썸네일로 사용
      exhibitionName: post.title,
      likes: post.archived, // archived를 likes로 매핑 (API 스펙에 따라 조정 필요)
      category: '전체' as Category, // API에 카테고리 정보가 없으므로 기본값
      author: post.userName,
      postType: post.postType,
      isMine: post.isMine,
      isArchived: post.isArchived,
    }));
  }, [mainPostResponse]);

  // 선택된 카테고리에 따라 필터링
  const filteredExhibitions = useMemo(() => {
    if (selectedCategory === '전체') {
      return exhibitions;
    }
    return exhibitions.filter(
      (exhibition) => exhibition.category === selectedCategory
    );
  }, [exhibitions, selectedCategory]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <BannerControl isMyProfile={false} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-600">전시 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <BannerControl isMyProfile={false} />
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-red-500 text-lg mb-4">
            전시 정보를 불러오는데 실패했습니다.
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BannerControl isMyProfile={false} />

      {/* 카테고리 탭바 */}
      <div className="mt-10 w-full mx-auto px-4 flex items-center justify-center gap-4">
        {categories.map((c) => (
          <Chip
            key={c}
            label={c}
            isActive={selectedCategory === c}
            onClick={() => setSelectedCategory(c)}
          />
        ))}
      </div>

      {/* 본문 */}
      <main className="max-w-[59.625rem] w-full mx-auto pb-40">
        {filteredExhibitions.length === 0 ? (
          <EmptyState
            className="mt-24"
            text="전시를 준비 중입니다. 곧 새로운 전시 소식을 전해드릴게요!"
          />
        ) : (
          <div className="grid grid-cols-3 gap-x-6 gap-y-8 justify-items-center mt-16">
            {filteredExhibitions.map((exhibition) => (
              <div key={exhibition.id} className="w-[17.1875rem]">
                <ArtworkCard
                  imageUrl={exhibition.imageUrl}
                  title={exhibition.exhibitionName}
                  author={exhibition.author}
                  likes={exhibition.likes}
                  onClick={() => {
                    navigate(`/exhibition/${exhibition.id}`);
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 정보 표시 (선택사항) */}
        {mainPostResponse && (
          <div className="text-center mt-8 text-gray-500 text-sm">
            전체 {mainPostResponse.data.totalElements}개의 전시 중{' '}
            {mainPostResponse.data.numberOfElements}개 표시
          </div>
        )}
      </main>
    </div>
  );
};

export default ExhibitionPage;

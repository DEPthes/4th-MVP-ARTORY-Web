import { useState, useEffect } from "react";
import Header from "../components/Layouts/Header";
import { authService } from "../apis";
import InfoCard from "../components/InfoCard";
import { UserJob } from "../types/user";
import { isDevelopmentMode } from "../utils/mockAuth";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // 개발 모드에서는 인증 체크 우회
        if (isDevelopmentMode()) {
          console.log("🎭 개발 모드: 인증 체크 우회");
          setIsLoading(false);
          return;
        }

        // 로그인 상태 확인
        if (!authService.isLoggedIn()) {
          window.location.href = "/login";
          return;
        }

        // 사용자 정보 가져오기
        const user = await authService.getCurrentUser();
        if (!user) {
          window.location.href = "/login";
          return;
        }

        // 프로필 완료 여부 확인
        if (!user.job) {
          // 직업이 설정되지 않은 경우 직업 선택 페이지로
          window.location.href = "/signup/job";
          return;
        }

        // 추가 프로필 정보 확인 (확장된 프로필이 구현된 경우)
        if (!user.nickname || !user.bio) {
          // 기본 프로필 정보가 없는 경우 프로필 작성 페이지로
          localStorage.setItem("selectedJob", user.job);
          window.location.href = "/signup/profile";
          return;
        }
      } catch (error) {
        console.error("User status check error:", error);
        window.location.href = "/login";
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="relative z-10 min-h-[calc(100vh-5rem)] py-30 flex flex-col items-center">
        <div className="text-lg font-light text-zinc-900">
          청년 작가의 꿈과 컬렉터의 감각이 만나는 곳
        </div>
        <div className="bg-zinc-400 w-28 h-0.5 my-16"></div>
        <div className="text-[2rem] font-bold text-red-600 mb-12">ARTORY</div>
        <div className="text-xl font-light leading-10 text-zinc-900 text-center mb-30">
          <span className="font-bold">아토리(ARTORY)</span>는 예술(ART)과
          이야기(STORY)의 합성어로,
          <br />
          청년 작가와 MZ세대를 연결해, 누구나 예술을 사고 즐기고 나누는 참여형
          예술 플랫폼입니다.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4">
          <InfoCard
            job={UserJob.YOUNG_ARTIST}
            description1="작가 포트폴리오"
            description2="전시 홍보"
          />
          <InfoCard
            job={UserJob.ART_COLLECTOR}
            description1="청년 작가 탐색"
            description2="작품 아카이빙"
          />
          <InfoCard
            job={UserJob.GALLERY}
            description1="청년 작가 발굴"
            description2="전시 및 공모전 홍보"
          />
        </div>
        <div className="flex flex-col items-center mt-30">
          <p className="text-xl font-light text-zinc-900">
            청년 작가를 위한 포트폴리오, 아트컬렉터를 위한 작품 추천, 갤러리를
            위한 작가 발굴
          </p>
          <div className="bg-stone-300 w-0.5 h-5 my-10" />
          <p className="text-xl font-light text-zinc-900">
            모두를 연결하는 아트 플랫폼
          </p>
          <div className="bg-zinc-400 w-28 h-0.5 my-16"></div>
          <p className="text-2xl font-semibold text-zinc-900">
            작품 그 너머의 이야기까지, 아토리에서 작가와 직접 나눠보세요
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

import { useState, useEffect } from "react";
import Button from "../components/Button/Button";
import Header from "../components/Layouts/Header";
import { authService } from "../apis";
import type { GoogleAuthResponse } from "../apis/auth";

const HomePage = () => {
  const [userInfo, setUserInfo] = useState<GoogleAuthResponse["user"] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
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

        setUserInfo(user);
      } catch (error) {
        console.error("User status check error:", error);
        window.location.href = "/login";
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/login";
  };

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
      <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            환영합니다, {userInfo?.name}님!
          </h1>
          <p className="text-gray-600">ARTORY에 성공적으로 로그인되었습니다.</p>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <Button size="lg" variant="primary">
            작품 둘러보기
          </Button>
          <Button size="lg" variant="secondary">
            내 프로필 보기
          </Button>
          <Button size="sm" variant="tertiary" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>

        {/* 개발용 테스트 버튼들 (나중에 제거 가능) */}
        <div className="flex gap-2 mt-10 opacity-50">
          <Button size="sm">Test 버튼</Button>
          <Button variant="secondary">Second</Button>
          <Button loading>로딩하는 버튼</Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

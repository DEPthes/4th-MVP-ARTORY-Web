import { useState } from "react";
import Button from "../components/Button/Button";
import { openGoogleAuthPopup } from "../utils/googleAuth";
import { authService } from "../apis";
import { Header } from "../components";
import loginBackground from "../assets/images/BackGround.png";
import googleLogo from "../assets/google.svg";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      // 구글 OAuth 팝업 열기
      const accessToken = await openGoogleAuthPopup();

      // 백엔드 서버로 토큰 전송
      const result = await authService.googleLogin(accessToken);

      if (result.success && result.data) {
        // 최초 가입자인지 확인
        if (result.data.isNewUser) {
          // 최초 가입자: 직업설정 페이지로 이동
          window.location.href = "/signup/job";
        } else {
          // 기존 사용자: 홈페이지로 이동
          window.location.href = "/";
        }
      } else {
        alert(result.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert(error instanceof Error ? error.message : "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      <Header />
      <div className="relative z-10 min-h-[calc(100vh-5rem)] py-40 flex flex-col items-center">
        <div className="text-lg font-light text-zinc-900">
          청년 작가의 꿈과 컬렉터의 감각이 만나는 곳
        </div>
        <div className="bg-zinc-400 w-28 h-0.5 my-16"></div>
        <div className="text-[2rem] font-bold text-red-600 mb-12">ARTORY</div>
        <div className="text-xl font-light leading-10 text-zinc-900 text-center mb-40">
          <span className="font-bold">아토리(ARTORY)</span>는 예술(ART)과
          이야기(STORY)의 합성어로,
          <br />
          청년 작가와 MZ세대를 연결해, 누구나 예술을 사고 즐기고 나누는 참여형
          예술 플랫폼입니다.
        </div>
        <div className="text-zinc-900 font-semibold text-xl mb-10">
          로그인하고 아토리를 시작해보세요!
        </div>
        <div className="rounded-lg z-10 w-full max-w-md">
          <Button
            className="w-full bg-white border p-6 border-stone-300 hover:bg-gray-50 flex items-center justify-center gap-4"
            onClick={handleGoogleLogin}
            loading={isLoading}
            disabled={isLoading}
          >
            <img src={googleLogo} alt="Google Logo" className="size-8" />
            <span className="font-semibold text-zinc-900 text-xl">
              Google 계정으로 로그인
            </span>
          </Button>
        </div>
      </div>
      <img
        src={loginBackground}
        className="absolute bottom-0 left-0 w-full z-0"
      />
    </div>
  );
};

export default LoginPage;

import { useState, useEffect } from "react";
import Button from "../components/Button/Button";
import { openGoogleAuthPopup } from "../utils/googleAuth";
import { useGoogleLogin, useIsLoggedIn } from "../hooks/useUser";
import { Header } from "../components";
import loginBackground from "../assets/images/BackGround.png";
import googleLogo from "../assets/google.svg";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const googleLoginMutation = useGoogleLogin();
  const { isLoggedIn } = useIsLoggedIn();

  // 이미 로그인된 상태면 홈페이지로 리다이렉트
  useEffect(() => {
    if (isLoggedIn) {
      console.log("🏠 이미 로그인된 상태 - 홈페이지로 이동");
      window.location.href = "/";
    }
  }, [isLoggedIn]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      console.log("🔑 Google 로그인 시작");
      console.log(
        "🌐 현재 redirect URI:",
        `${window.location.origin}/auth/google/callback`
      );

      // 구글 OAuth 팝업 열기
      const code = await openGoogleAuthPopup();
      console.log(
        "✅ Authorization code 받음:",
        code?.substring(0, 20) + "..."
      );

      // 백엔드 서버로 코드 전송
      console.log("🚀 백엔드 서버로 코드 전송 중...");
      const result = await googleLoginMutation.mutateAsync(code);
      console.log("📋 백엔드 응답:", result);

      // 회원 여부 확인 (isMember 직접 사용)
      console.log("🔍 isMember 값:", result.isMember);
      console.log("📝 googleID:", result.googleID);
      console.log("🆔 userID:", result.userID);

      if (!result.isMember) {
        // 신규 사용자: 직업설정 페이지로 이동
        console.log(
          "👤 신규 사용자 (isMember: false) - 직업설정 페이지로 이동"
        );

        // Google ID를 임시 저장 (회원가입 과정에서만 사용)
        localStorage.setItem("tempGoogleID", result.googleID);
        console.log("💾 임시 Google ID 저장 완료:", result.googleID);

        window.location.href = "/signup/job";
      } else {
        // 기존 사용자: 홈페이지로 이동
        console.log("🏠 기존 사용자 (isMember: true) - 홈페이지로 이동");

        // Google ID 저장 (로그인 상태 유지용)
        localStorage.setItem("googleID", result.googleID);

        window.location.href = "/";
      }
    } catch (error) {
      console.error("💥 Google login error:", error);

      // 에러 타입에 따른 구체적인 메시지
      if (error instanceof Error) {
        if (error.message.includes("timeout")) {
          alert("서버 응답 시간이 초과되었습니다. 백엔드 서버를 확인해주세요.");
        } else if (error.message.includes("Network Error")) {
          alert(
            "네트워크 연결에 실패했습니다. 백엔드 서버가 실행 중인지 확인해주세요."
          );
        } else {
          alert(`로그인 실패: ${error.message}`);
        }
      } else {
        alert("로그인에 실패했습니다.");
      }
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

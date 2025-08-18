import { useEffect } from "react";
import {
  getAuthorizationCode,
  validateState,
} from "../utils/googleAuth";
import { useGoogleLogin } from "../hooks/useUser";

const GoogleAuthCallback = () => {
  const googleLoginMutation = useGoogleLogin();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL에서 authorization code와 state 추출
        const { code, state } = getAuthorizationCode();
        const error = new URLSearchParams(window.location.search).get("error");

        console.log("🔍 OAuth 콜백 디버깅:");
        console.log("- URL:", window.location.href);
        console.log("- Code:", code ? code.substring(0, 20) + "..." : "없음");
        console.log("- State (받은값):", state);
        console.log("- Error:", error);

        // 에러가 있는 경우
        if (error) {
          console.error("OAuth 에러:", error);
          alert(`OAuth 인증 실패: ${error}`);
          window.location.href = "/login";
          return;
        }

        // Authorization code가 없는 경우
        if (!code) {
          console.error("Authorization code가 없습니다.");
          alert("인증 코드를 찾을 수 없습니다.");
          window.location.href = "/login";
          return;
        }

        // State 검증 전 디버깅
        const storedState = localStorage.getItem("oauth_state");
        console.log("🔍 State 검증:");
        console.log("- 저장된 state:", storedState);
        console.log("- 받은 state:", state);
        console.log("- 동일한가?", storedState === state);

        // CSRF 보호: state 검증
        if (!validateState(state)) {
          console.error("State 검증 실패");
          console.error("- 저장된 state:", storedState);
          console.error("- 받은 state:", state);

          alert("보안 검증에 실패했습니다. 다시 시도해주세요.");
          window.location.href = "/login";
          return;
        }

        console.log("✅ OAuth 콜백 성공:", {
          code: code.substring(0, 20) + "...",
          stateValid: true,
        });

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
        console.error("💥 OAuth 콜백 처리 중 에러:", error);
        
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
        
        window.location.href = "/login";
      }
    };

    handleAuthCallback();
  }, [googleLoginMutation]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          로그인 처리 중...
        </h2>
        <p className="text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;

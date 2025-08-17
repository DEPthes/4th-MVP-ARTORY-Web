import { useEffect } from "react";
import {
  sendAuthMessage,
  getAuthorizationCode,
  validateState,
} from "../utils/googleAuth";

const GoogleAuthCallback = () => {
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
          sendAuthMessage("GOOGLE_AUTH_ERROR", {
            error: `OAuth 인증 실패: ${error}`,
          });
          return;
        }

        // Authorization code가 없는 경우
        if (!code) {
          console.error("Authorization code가 없습니다.");
          sendAuthMessage("GOOGLE_AUTH_ERROR", {
            error: "인증 코드를 찾을 수 없습니다.",
          });
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

          sendAuthMessage("GOOGLE_AUTH_ERROR", {
            error: "보안 검증에 실패했습니다. 다시 시도해주세요.",
          });
          return;
        }

        console.log("✅ OAuth 콜백 성공:", {
          code: code.substring(0, 20) + "...",
          stateValid: true,
        });

        // 성공 메시지를 부모 창으로 전송
        sendAuthMessage("GOOGLE_AUTH_SUCCESS", {
          code: code,
        });
      } catch (error) {
        console.error("OAuth 콜백 처리 중 에러:", error);
        sendAuthMessage("GOOGLE_AUTH_ERROR", {
          error:
            error instanceof Error
              ? error.message
              : "인증 처리 중 오류가 발생했습니다.",
        });
      }
    };

    handleAuthCallback();
  }, []);

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

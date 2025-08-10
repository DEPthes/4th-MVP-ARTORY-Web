import { useEffect } from "react";
import { sendAuthMessage, getAuthorizationCode } from "../utils/googleAuth";

const GoogleAuthCallback = () => {
  useEffect(() => {
    const handleAuthCallback = async () => {
      const code = getAuthorizationCode();

      if (code) {
        try {
          // authorization code를 access token으로 교환
          const tokenResponse = await fetch(
            "https://oauth2.googleapis.com/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                code,
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
                redirect_uri:
                  import.meta.env.VITE_GOOGLE_REDIRECT_URI ||
                  window.location.origin + "/login",
                grant_type: "authorization_code",
              }),
            }
          );

          if (!tokenResponse.ok) {
            throw new Error("토큰 교환에 실패했습니다.");
          }

          const tokenData = await tokenResponse.json();

          // 성공 메시지 전송
          sendAuthMessage("GOOGLE_AUTH_SUCCESS", {
            accessToken: tokenData.access_token,
          });
        } catch (error) {
          console.error("Google auth callback error:", error);
          sendAuthMessage("GOOGLE_AUTH_ERROR", {
            error:
              error instanceof Error ? error.message : "인증에 실패했습니다.",
          });
        }
      } else {
        sendAuthMessage("GOOGLE_AUTH_ERROR", {
          error: "인증 코드를 찾을 수 없습니다.",
        });
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">구글 인증을 처리하고 있습니다...</p>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;

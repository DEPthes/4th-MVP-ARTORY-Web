// Google OAuth 설정
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI =
  import.meta.env.VITE_GOOGLE_REDIRECT_URI || window.location.origin + "/login";

// Google OAuth 인증 URL 생성
export const getGoogleAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "email profile",
    access_type: "offline",
    prompt: "consent",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// URL에서 authorization code 추출
export const getAuthorizationCode = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("code");
};

// Google OAuth 팝업 열기
export const openGoogleAuthPopup = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const popup = window.open(
      getGoogleAuthUrl(),
      "googleAuth",
      "width=500,height=600,scrollbars=yes,resizable=yes"
    );

    if (!popup) {
      reject(new Error("팝업이 차단되었습니다. 팝업 차단을 해제해주세요."));
      return;
    }

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        reject(new Error("인증이 취소되었습니다."));
      }
    }, 1000);

    // 팝업에서 메시지 수신
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
        clearInterval(checkClosed);
        popup.close();
        window.removeEventListener("message", handleMessage);
        resolve(event.data.accessToken);
      } else if (event.data.type === "GOOGLE_AUTH_ERROR") {
        clearInterval(checkClosed);
        popup.close();
        window.removeEventListener("message", handleMessage);
        reject(new Error(event.data.error || "인증에 실패했습니다."));
      }
    };

    window.addEventListener("message", handleMessage);
  });
};

// Google OAuth 콜백 페이지용 메시지 전송
export const sendAuthMessage = (
  type: "GOOGLE_AUTH_SUCCESS" | "GOOGLE_AUTH_ERROR",
  data?: any
) => {
  if (window.opener) {
    window.opener.postMessage({ type, ...data }, window.location.origin);
    window.close();
  }
};

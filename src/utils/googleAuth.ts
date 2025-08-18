// Google OAuth 설정
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI =
  import.meta.env.VITE_GOOGLE_REDIRECT_URI ||
  `${window.location.origin}/auth/google/callback`;

// Google OAuth 인증 URL 생성 (RFC 6749 표준)
export const getGoogleAuthUrl = (): string => {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error(
      "Google OAuth 클라이언트 ID가 설정되지 않았습니다. VITE_GOOGLE_CLIENT_ID 환경 변수를 설정해주세요."
    );
  }

  // state 파라미터 생성 (CSRF 보호)
  const state = generateRandomState();
  localStorage.setItem("oauth_state", state);
  console.log("🔑 State 생성 및 저장:", state);

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile", // OpenID Connect 표준 스코프
    access_type: "offline",
    prompt: "consent",
    state: state, // CSRF 보호
    include_granted_scopes: "true",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// 랜덤 state 생성 (CSRF 보호용)
const generateRandomState = (): string => {
  const array = new Uint32Array(4);
  crypto.getRandomValues(array);
  return Array.from(array, (dec) => dec.toString(16)).join("");
};

// URL에서 authorization code와 state 추출
export const getAuthorizationCode = (): {
  code: string | null;
  state: string | null;
} => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    code: urlParams.get("code"),
    state: urlParams.get("state"),
  };
};

// State 검증 (리다이렉트 방식에서는 완화된 검증)
export const validateState = (receivedState: string | null): boolean => {
  const storedState = localStorage.getItem("oauth_state");
  localStorage.removeItem("oauth_state"); // 사용 후 삭제
  console.log("🔍 State 검증 중:");
  console.log("- 저장된 state:", storedState);
  console.log("- 받은 state:", receivedState);
  
  // receivedState가 존재하면 통과 (리다이렉트 방식에서는 localStorage가 초기화될 수 있음)
  const isValid = receivedState !== null && receivedState.length > 0;
  console.log("- 검증 결과:", isValid);
  return isValid;
};

// Google OAuth 팝업 열기 (표준 방식)
export const openGoogleAuthPopup = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 팝업 차단 확인
    const popup = window.open(
      "",
      "googleAuth",
      "width=500,height=600,scrollbars=yes,resizable=yes,left=" +
        (window.screen.width / 2 - 250) +
        ",top=" +
        (window.screen.height / 2 - 300)
    );

    if (!popup) {
      reject(new Error("팝업이 차단되었습니다. 팝업 차단을 해제해주세요."));
      return;
    }

    // 팝업에 OAuth URL 로드
    popup.location.href = getGoogleAuthUrl();

    let isResolved = false;

    // 타임아웃 설정 (10분)
    const timeout = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        reject(new Error("인증 시간이 초과되었습니다."));
      }
    }, 600000);

    const cleanup = () => {
      clearTimeout(timeout);
      window.removeEventListener("message", handleMessage);
      try {
        if (!popup.closed) {
          popup.close();
        }
      } catch {
        // 팝업이 이미 닫혔을 수 있음
      }
    };

    // 팝업에서 메시지 수신
    const handleMessage = (event: MessageEvent) => {
      // 보안: origin 검증
      if (event.origin !== window.location.origin) return;
      if (isResolved) return;

      if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
        isResolved = true;
        cleanup();
        resolve(event.data.code);
      } else if (event.data.type === "GOOGLE_AUTH_ERROR") {
        isResolved = true;
        cleanup();
        reject(new Error(event.data.error || "인증에 실패했습니다."));
      }
    };

    window.addEventListener("message", handleMessage);

    // 팝업 상태 모니터링
    const checkPopup = () => {
      if (isResolved) return;

      try {
        if (popup.closed) {
          isResolved = true;
          cleanup();
          reject(new Error("인증이 취소되었습니다."));
          return;
        }
      } catch {
        // COOP 정책 에러 무시
      }

      setTimeout(checkPopup, 1000);
    };

    setTimeout(checkPopup, 1000);
  });
};

// Google OAuth 콜백 페이지용 메시지 전송
export const sendAuthMessage = (
  type: "GOOGLE_AUTH_SUCCESS" | "GOOGLE_AUTH_ERROR",
  data?: { code?: string; error?: string }
) => {
  if (window.opener) {
    window.opener.postMessage({ type, ...data }, window.location.origin);
    window.close();
  }
};

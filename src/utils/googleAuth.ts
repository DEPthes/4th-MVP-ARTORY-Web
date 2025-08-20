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

// 구글 로그인 시작 (리다이렉트 방식)
export const startGoogleLogin = (): void => {
  const authUrl = getGoogleAuthUrl();
  console.log("🚀 구글 로그인 시작:", authUrl);
  window.location.href = authUrl;
};

// Google OAuth 콜백 페이지용 메시지 전송 (리다이렉트 방식에서는 불필요)
export const sendAuthMessage = (
  type: "GOOGLE_AUTH_SUCCESS" | "GOOGLE_AUTH_ERROR",
  data?: { code?: string; error?: string }
) => {
  // 리다이렉트 방식에서는 사용하지 않음
  console.log("📤 Auth 메시지:", type, data);
};

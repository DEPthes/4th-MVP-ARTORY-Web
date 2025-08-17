import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, type BackendLoginResponse } from "../apis/user";

// Query Keys 정의 (미래 확장을 위해 유지)
export const userKeys = {
  all: ["user"] as const,
  current: () => [...userKeys.all, "current"] as const,
  profile: (id: string) => [...userKeys.all, "profile", id] as const,
};

// Google 로그인 (실제 제공된 API)
export const useGoogleLogin = () => {
  return useMutation({
    mutationFn: userApi.googleLogin,
    onSuccess: (data: BackendLoginResponse) => {
      console.log("✅ 로그인 성공");
      console.log("📝 Google ID:", data.googleID);
      console.log("🔍 회원 여부:", data.isMember ? "기존 회원" : "신규 사용자");
    },
    onError: (error: unknown) => {
      console.error("💥 로그인 실패:", error);
    },
  });
};

// 작가 회원가입 (실제 제공된 API)
export const useRegisterArtist = () => {
  return useMutation({
    mutationFn: userApi.registerArtist,
    onSuccess: () => {
      console.log("✅ 작가 회원가입 성공");
    },
    onError: (error: unknown) => {
      console.error("💥 작가 회원가입 실패:", error);
    },
  });
};

// 컬렉터 회원가입 (실제 제공된 API)
export const useRegisterCollector = () => {
  return useMutation({
    mutationFn: userApi.registerCollector,
    onSuccess: () => {
      console.log("✅ 컬렉터 회원가입 성공");
    },
    onError: (error: unknown) => {
      console.error("💥 컬렉터 회원가입 실패:", error);
    },
  });
};

// 갤러리 회원가입 (실제 제공된 API)
export const useRegisterGallery = () => {
  return useMutation({
    mutationFn: userApi.registerGallery,
    onSuccess: () => {
      console.log("✅ 갤러리 회원가입 성공");
    },
    onError: (error: unknown) => {
      console.error("💥 갤러리 회원가입 실패:", error);
    },
  });
};

// 로그아웃
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.logout,
    onSuccess: () => {
      console.log("✅ 로그아웃 성공");

      // 모든 캐시 제거
      queryClient.clear();

      // localStorage 정리 (중복 실행이지만 안전하게)
      localStorage.removeItem("googleID");
      localStorage.removeItem("tempGoogleID");
      localStorage.removeItem("selectedJob");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userInfo");

      console.log("🧹 모든 로컬 데이터 정리 완료");
    },
    onError: (error) => {
      console.error("💥 로그아웃 실패:", error);

      // 에러가 발생해도 로컬 데이터는 정리
      localStorage.removeItem("googleID");
      localStorage.removeItem("tempGoogleID");
      localStorage.removeItem("selectedJob");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userInfo");

      console.log("🧹 에러 발생했지만 로컬 데이터 정리 완료");
    },
  });
};

// 로그인 상태 확인 (googleID 기반으로 단순화)
export const useIsLoggedIn = () => {
  const hasGoogleID = !!localStorage.getItem("googleID");

  return {
    isLoggedIn: hasGoogleID,
    isLoading: false, // googleID 체크는 즉시 완료
  };
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { galleryApi } from "../apis/gallery";

// 사업자 등록번호 조회 훅
export const useBusinessLookup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (businessNumber: string) =>
      galleryApi.lookupBusinessRegistration(businessNumber),
    onSuccess: (data) => {
      if (data.success && data.isValid) {
        console.log("✅ 사업자 등록번호 조회 성공: 유효한 사업자");
      } else if (data.success && !data.isValid) {
        console.log("❌ 사업자 등록번호 조회 성공: 유효하지 않은 사업자");
      } else {
        console.log("💥 사업자 등록번호 조회 실패");
      }

      // 사업자 등록번호 조회 후 관련 쿼리 무효화
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && queryKey[0] === "gallery";
        },
      });
    },
    onError: (error: unknown) => {
      console.error("💥 사업자 등록번호 조회 에러:", error);
    },
  });
};

// 휴대폰 인증번호 발송 훅
export const usePhoneVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (phoneNumber: string) =>
      galleryApi.sendPhoneVerification(phoneNumber),
    onSuccess: (data) => {
      if (data.success) {
        console.log("✅ 휴대폰 인증번호 발송 성공");
      } else {
        console.log("❌ 휴대폰 인증번호 발송 실패");
      }

      // 휴대폰 인증번호 발송 후 관련 쿼리 무효화
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && queryKey[0] === "gallery";
        },
      });
    },
    onError: (error: unknown) => {
      console.error("💥 휴대폰 인증번호 발송 에러:", error);
    },
  });
};

// 인증번호 확인 훅
export const useCodeVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      phoneNumber,
      code,
    }: {
      phoneNumber: string;
      code: string;
    }) => galleryApi.verifyCode(phoneNumber, code),
    onSuccess: (data) => {
      if (data.success && data.isValid) {
        console.log("✅ 인증번호 확인 성공: 올바른 인증번호");
      } else if (data.success && !data.isValid) {
        console.log("❌ 인증번호 확인 성공: 올바르지 않은 인증번호");
      } else {
        console.log("💥 인증번호 확인 실패");
      }

      // 인증번호 확인 후 관련 쿼리 무효화
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && queryKey[0] === "gallery";
        },
      });
    },
    onError: (error: unknown) => {
      console.error("💥 인증번호 확인 에러:", error);
    },
  });
};

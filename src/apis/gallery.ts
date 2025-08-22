import axios from "axios";

// 타입 안전한 에러 메시지 추출 헬퍼
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error instanceof Error && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message || defaultMessage;
  }
  return defaultMessage;
};

// 갤러리 관련 API 타입 정의
export interface BusinessLookupRequest {
  businessNum: string; // 백엔드가 요구하는 필드명
}

export interface BusinessLookupResponse {
  code: number;
  status: string;
  message: string;
  data: boolean; // true: 유효한 사업자, false: 유효하지 않은 사업자
}

export interface PhoneVerificationRequest {
  phoneNumber: string;
}

export interface PhoneVerificationResponse {
  code: number;
  status: string;
  message: string;
  data: boolean; // true: 발송 성공, false: 발송 실패
}

export interface CodeVerificationRequest {
  phoneNumber: string;
  code: string;
}

export interface CodeVerificationResponse {
  code: number;
  status: string;
  message: string;
  data: boolean; // true: 인증 성공, false: 인증 실패
}

// 갤러리 API 클래스
export class GalleryApi {
  // 사업자 등록번호 조회
  async lookupBusinessRegistration(
    businessNumber: string
  ): Promise<{ success: boolean; isValid: boolean; message: string }> {
    console.log("🏢 사업자 등록번호 조회 시작:", businessNumber);

    // 실제 API 호출 (쿼리 파라미터 방식, 인증 불필요)
    try {
      console.log("📤 사업자 조회 요청:", businessNumber);

      // 쿼리 파라미터로 businessNum 전달, Request Body는 빈 객체
      const response = await axios.post<BusinessLookupResponse>(
        `/api/gallery/register/artist?businessNum=${encodeURIComponent(
          businessNumber
        )}`,
        {}, // 빈 Request Body
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      console.log("📦 사업자 조회 응답:", response.data);

      // 성공 조건: code 200 & status "OK" (실제 백엔드 응답 형식)
      const success =
        response.data.code === 200 && response.data.status === "OK";

      return {
        success,
        isValid: success ? response.data.data : false,
        message: response.data.message,
      };
    } catch (error: unknown) {
      console.error("💥 사업자 등록번호 조회 에러:", error);
      return {
        success: false,
        isValid: false,
        message: getErrorMessage(error, "사업자 등록번호 조회에 실패했습니다."),
      };
    }

    /* 실제 API 호출 - 백엔드 인증 설정 문제 해결 후 복구
    try {
      const requestData = {
        businessNum: businessNumber,
      };

      console.log("📤 요청 데이터:", requestData);

      const response = await axios.post<BusinessLookupResponse>(
        "/api/gallery/register/artist",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization 헤더 의도적으로 제외
          },
          timeout: 30000,
        }
      );

      console.log("📦 사업자 조회 백엔드 응답:", response.data);

      // 사업자 조회 API 성공 조건: code 0 & status "100 CONTINUE"
      const success =
        response.data.code === 0 && response.data.status === "100 CONTINUE";

      return {
        success,
        isValid: success ? response.data.data : false,
        message: response.data.message,
      };
    } catch (error: unknown) {
      console.error("💥 사업자 등록번호 조회 에러:", error);
      return {
        success: false,
        isValid: false,
        message:
          getErrorMessage(error, "사업자 등록번호 조회에 실패했습니다."),
      };
    }
    */
  }

  // 휴대폰 인증번호 발송
  async sendPhoneVerification(
    phoneNumber: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log("📱 휴대폰 인증번호 발송 시작:", phoneNumber);

      const response = await axios.post<PhoneVerificationResponse>(
        "/api/gallery/register/send",
        {
          phoneNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      console.log("📦 인증번호 발송 백엔드 응답:", response.data);

      // 성공 조건: code 200 & status "OK" (실제 백엔드 응답 형식)
      const success =
        response.data.code === 200 && response.data.status === "OK";

      return {
        success: success, // HTTP 200 + OK면 발송 성공
        message: response.data.message,
      };
    } catch (error: unknown) {
      console.error("💥 휴대폰 인증번호 발송 에러:", error);
      return {
        success: false,
        message: getErrorMessage(error, "인증번호 발송에 실패했습니다."),
      };
    }
  }

  // 인증번호 확인
  async verifyCode(
    phoneNumber: string,
    code: string
  ): Promise<{ success: boolean; isValid: boolean; message: string }> {
    try {
      console.log("🔐 인증번호 확인 시작:", { phoneNumber, code });

      const response = await axios.post<CodeVerificationResponse>(
        "/api/gallery/register/verify",
        {
          phoneNumber,
          code,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      console.log("📦 인증번호 확인 백엔드 응답:", response.data);

      // HTTP 표준: 성공 시 code 200과 status "OK"
      const success =
        response.data.code === 200 && response.data.status === "OK";

      // 인증번호 일치 여부 판단: data가 true이거나 message가 성공을 나타내는 경우
      const isVerificationSuccess =
        response.data.data === true ||
        response.data.message.includes("성공") ||
        response.data.message.includes("완료") ||
        response.data.message === "OK";

      console.log(
        "✅ 인증번호 확인 결과:",
        isVerificationSuccess ? "성공" : "실패"
      );

      return {
        success,
        isValid: success && isVerificationSuccess,
        message: response.data.message,
      };
    } catch (error: unknown) {
      console.error("💥 인증번호 확인 에러:", error);
      return {
        success: false,
        isValid: false,
        message: getErrorMessage(error, "인증번호 확인에 실패했습니다."),
      };
    }
  }
}

// 갤러리 API 인스턴스 생성
export const galleryApi = new GalleryApi();
export default galleryApi;

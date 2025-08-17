import { useState, useEffect } from "react";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import Checkbox from "../components/Checkbox/Checkbox";
import {
  useRegisterArtist,
  useRegisterCollector,
  useRegisterGallery,
} from "../hooks/useUser";
import {
  useBusinessLookup,
  usePhoneVerification,
  useCodeVerification,
} from "../hooks/useGallery";
import type {
  ArtistRegistrationData,
  CollectorRegistrationData,
  GalleryRegistrationData,
} from "../apis/user";
import { Header } from "../components";
import { UserJob } from "../types/user";
import { useNavigate } from "react-router-dom";

// 작가/컬렉터용 폼 데이터
interface ArtistCollectorFormData {
  name: string;
  birthDate: string;
  education: string;
  isEducationPublic: boolean;
  phone: string;
  email: string;
  bio: string;
}

// 갤러리용 폼 데이터
interface GalleryFormData {
  // 사업자 정보
  galleryName: string;
  businessRegistrationNumber: string;
  galleryLocation: string;
  isBusinessVerified: boolean;
  // 본인인증용 전화번호
  verificationPhone: string;
  // 담당자 정보
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  bio: string;
  isPhoneVerified: boolean;
  verificationCode: string;
  isVerificationCodeSent: boolean;
}

const SignupProfilePage = () => {
  const navigate = useNavigate();
  const registerArtistMutation = useRegisterArtist();
  const registerCollectorMutation = useRegisterCollector();
  const registerGalleryMutation = useRegisterGallery();

  // 갤러리 관련 훅들
  const businessLookupMutation = useBusinessLookup();
  const phoneVerificationMutation = usePhoneVerification();
  const codeVerificationMutation = useCodeVerification();

  const [selectedJob, setSelectedJob] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 작가/컬렉터용 폼 상태
  const [artistCollectorForm, setArtistCollectorForm] =
    useState<ArtistCollectorFormData>({
      name: "",
      birthDate: "",
      education: "",
      isEducationPublic: false,
      phone: "",
      email: "",
      bio: "",
    });

  // 갤러리용 폼 상태
  const [galleryForm, setGalleryForm] = useState<GalleryFormData>({
    galleryName: "",
    businessRegistrationNumber: "",
    galleryLocation: "",
    isBusinessVerified: false,
    verificationPhone: "",
    managerName: "",
    managerPhone: "",
    managerEmail: "",
    bio: "",
    isPhoneVerified: false,
    verificationCode: "",
    isVerificationCodeSent: false,
  });

  useEffect(() => {
    const loadUserInfo = async () => {
      // 임시 Google ID 확인 (회원가입 과정 중)
      const tempGoogleID = localStorage.getItem("tempGoogleID");
      if (!tempGoogleID) {
        console.log("❌ 임시 Google ID 없음 - 로그인 페이지로 이동");
        window.location.href = "/login";
        return;
      }

      const job = localStorage.getItem("selectedJob");
      if (!job) {
        console.log("❌ 선택된 직업 없음 - 직업 선택 페이지로 이동");
        window.location.href = "/signup/job";
        return;
      }

      console.log(
        "✅ 프로필 페이지 진입, 임시 Google ID:",
        tempGoogleID,
        "직업:",
        job
      );
      setSelectedJob(job);
    };

    loadUserInfo();
  }, []);

  // 작가/컬렉터 폼 핸들러
  const handleArtistCollectorChange = (
    field: keyof ArtistCollectorFormData,
    value: string | boolean
  ) => {
    setArtistCollectorForm((prev) => ({ ...prev, [field]: value }));
    // 에러 제거
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // 갤러리 폼 핸들러
  const handleGalleryChange = (
    field: keyof GalleryFormData,
    value: string | boolean
  ) => {
    setGalleryForm((prev) => ({ ...prev, [field]: value }));
    // 에러 제거
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // 사업자 등록번호 조회
  const handleBusinessRegistrationLookup = async () => {
    if (!galleryForm.businessRegistrationNumber.trim()) {
      setErrors((prev) => ({
        ...prev,
        businessRegistrationNumber: "사업자 등록번호를 입력해주세요.",
      }));
      return;
    }

    try {
      console.log(
        "🏢 사업자 등록번호 조회 시작:",
        galleryForm.businessRegistrationNumber
      );

      const result = await businessLookupMutation.mutateAsync(
        galleryForm.businessRegistrationNumber
      );

      if (result.success && result.isValid) {
        // 유효한 사업자 등록번호
        setGalleryForm((prev) => ({ ...prev, isBusinessVerified: true }));
        setErrors((prev) => ({ ...prev, businessRegistrationNumber: "" }));
        console.log("✅ 유효한 사업자 등록번호 확인됨");
      } else if (result.success && !result.isValid) {
        // 유효하지 않은 사업자 등록번호
        setErrors((prev) => ({
          ...prev,
          businessRegistrationNumber:
            "등록되지 않은 사업자 등록번호입니다. 다시 확인해주세요.",
        }));
        console.log("❌ 유효하지 않은 사업자 등록번호");
      } else {
        // API 호출 실패
        setErrors((prev) => ({
          ...prev,
          businessRegistrationNumber:
            result.message || "사업자 등록번호 조회에 실패했습니다.",
        }));
        console.log("💥 사업자 등록번호 조회 실패:", result.message);
      }
    } catch (error) {
      console.error("💥 사업자 등록번호 조회 에러:", error);
      setErrors((prev) => ({
        ...prev,
        businessRegistrationNumber:
          "사업자 등록번호 조회에 실패했습니다. 다시 시도해주세요.",
      }));
    }
  };

  // 휴대폰 인증번호 발송
  const handlePhoneVerification = async () => {
    if (!galleryForm.verificationPhone.trim()) {
      setErrors((prev) => ({
        ...prev,
        verificationPhone: "휴대폰 번호를 입력해주세요.",
      }));
      return;
    }

    try {
      console.log(
        "📱 휴대폰 인증번호 발송 시작:",
        galleryForm.verificationPhone
      );

      const result = await phoneVerificationMutation.mutateAsync(
        galleryForm.verificationPhone
      );

      if (result.success) {
        // 인증번호 발송 성공
        alert("인증번호가 발송되었습니다.");
        setGalleryForm((prev) => ({
          ...prev,
          isVerificationCodeSent: true,
          verificationCode: "", // 기존 입력된 인증번호 초기화
        }));
        setErrors((prev) => ({ ...prev, verificationPhone: "" }));
        console.log("✅ 인증번호 발송 성공");
      } else {
        // 인증번호 발송 실패
        alert(result.message || "인증번호 발송에 실패했습니다.");
        console.log("❌ 인증번호 발송 실패:", result.message);
      }
    } catch (error) {
      console.error("💥 휴대폰 인증번호 발송 에러:", error);
      alert("인증번호 발송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 인증번호 확인
  const handleVerificationCodeCheck = async () => {
    if (!galleryForm.verificationCode.trim()) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "인증번호를 입력해주세요.",
      }));
      return;
    }

    try {
      console.log("🔐 인증번호 확인 시작:", {
        phoneNumber: galleryForm.verificationPhone,
        code: galleryForm.verificationCode,
      });

      const result = await codeVerificationMutation.mutateAsync({
        phoneNumber: galleryForm.verificationPhone,
        code: galleryForm.verificationCode,
      });

      if (result.success && result.isValid) {
        // 인증번호 확인 성공
        setGalleryForm((prev) => ({
          ...prev,
          isPhoneVerified: true,
          verificationCode: "", // 인증 성공 후 인증번호 초기화
        }));
        setErrors((prev) => ({ ...prev, verificationCode: "" }));
        console.log("✅ 인증번호 확인 성공");
      } else if (result.success && !result.isValid) {
        // 인증번호가 올바르지 않음
        setErrors((prev) => ({
          ...prev,
          verificationCode: "인증번호가 올바르지 않습니다. 다시 확인해주세요.",
        }));
        console.log("❌ 올바르지 않은 인증번호");
      } else {
        // API 호출 실패
        setErrors((prev) => ({
          ...prev,
          verificationCode: result.message || "인증번호 확인에 실패했습니다.",
        }));
        console.log("💥 인증번호 확인 실패:", result.message);
      }
    } catch (error) {
      console.error("💥 인증번호 확인 에러:", error);
      setErrors((prev) => ({
        ...prev,
        verificationCode: "인증번호 확인에 실패했습니다. 다시 시도해주세요.",
      }));
    }
  };

  // 필수 항목 체크
  const isFormValid = () => {
    if (selectedJob === UserJob.GALLERY) {
      return (
        galleryForm.galleryName.trim() &&
        galleryForm.businessRegistrationNumber.trim() &&
        galleryForm.isBusinessVerified &&
        galleryForm.galleryLocation.trim() &&
        galleryForm.verificationPhone.trim() &&
        galleryForm.managerName.trim() &&
        galleryForm.managerPhone.trim() &&
        galleryForm.managerEmail.trim() &&
        galleryForm.isPhoneVerified
      );
    } else {
      return (
        artistCollectorForm.name.trim() &&
        artistCollectorForm.education.trim() &&
        artistCollectorForm.phone.trim() &&
        artistCollectorForm.email.trim()
      );
    }
  };

  // 유효성 검사
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (selectedJob === UserJob.GALLERY) {
      // 갤러리 유효성 검사
      if (!galleryForm.galleryName.trim())
        newErrors.galleryName = "갤러리명을 입력해주세요.";
      if (!galleryForm.businessRegistrationNumber.trim())
        newErrors.businessRegistrationNumber =
          "사업자 등록번호를 입력해주세요.";
      if (!galleryForm.isBusinessVerified)
        newErrors.businessVerification = "사업자 등록번호 조회를 완료해주세요.";
      if (!galleryForm.galleryLocation.trim())
        newErrors.galleryLocation = "갤러리 위치를 입력해주세요.";
      if (!galleryForm.verificationPhone.trim())
        newErrors.verificationPhone = "본인인증용 휴대폰을 입력해주세요.";
      if (!galleryForm.managerName.trim())
        newErrors.managerName = "담당자 이름을 입력해주세요.";
      if (!galleryForm.managerPhone.trim())
        newErrors.managerPhone = "담당자 휴대폰을 입력해주세요.";
      if (!galleryForm.managerEmail.trim())
        newErrors.managerEmail = "담당자 이메일을 입력해주세요.";
      if (!galleryForm.isPhoneVerified)
        newErrors.phoneVerification = "휴대폰 본인인증을 완료해주세요.";
    } else {
      // 작가/컬렉터 유효성 검사 - 필수 항목만
      if (!artistCollectorForm.name.trim())
        newErrors.name = "이름을 입력해주세요.";
      if (!artistCollectorForm.education.trim())
        newErrors.education = "학력을 입력해주세요.";
      if (!artistCollectorForm.phone.trim())
        newErrors.phone = "연락처를 입력해주세요.";
      if (!artistCollectorForm.email.trim())
        newErrors.email = "이메일을 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log("🚀 회원가입 폼 제출 시작");
    console.log("📝 선택된 직업:", selectedJob);
    console.log("✅ 폼 검증 시작...");

    if (!validateForm()) {
      console.log("❌ 폼 검증 실패");
      return;
    }

    console.log("✅ 폼 검증 통과");
    setIsLoading(true);

    try {
      const tempGoogleID = localStorage.getItem("tempGoogleID");
      // 🧪 임시 테스트: 새로운 googleID 사용
      const testGoogleID = "TEST_GALLERY_" + Date.now();
      const testBusinessNumber = "TEST" + Date.now().toString().slice(-6); // 마지막 6자리로 사업자번호 생성
      console.log("🔍 임시 Google ID 확인:", tempGoogleID);
      console.log("🧪 테스트용 Google ID 사용:", testGoogleID);
      console.log("🧪 테스트용 사업자번호 사용:", testBusinessNumber);

      if (!tempGoogleID) {
        console.log("❌ 임시 Google ID 없음");
        alert("회원가입 과정이 올바르지 않습니다.");
        navigate("/login");
        return;
      }

      console.log("✅ 임시 Google ID 확인 완료");

      if (selectedJob === UserJob.YOUNG_ARTIST) {
        // 작가 회원가입 API 호출
        const artistData: ArtistRegistrationData = {
          name: artistCollectorForm.name,
          googleID: tempGoogleID, // 임시 Google ID 사용
          email: artistCollectorForm.email,
          introduction: artistCollectorForm.bio,
          contact: artistCollectorForm.phone,
          birth: artistCollectorForm.birthDate,
          educationBackground: artistCollectorForm.education,
          disclosureStatus: artistCollectorForm.isEducationPublic,
        };

        console.log("🎨 작가 회원가입 데이터:", artistData);

        const response = await registerArtistMutation.mutateAsync(artistData);

        if (response.success) {
          console.log("✅ 작가 회원가입 성공");
          console.log("🏠 홈페이지로 이동 준비 중...");

          // 회원가입 완료 후 로그인 상태로 전환
          localStorage.setItem("googleID", tempGoogleID);
          localStorage.removeItem("tempGoogleID");
          localStorage.removeItem("selectedJob");

          console.log("🏠 홈페이지로 이동 시작");
          navigate("/");
        } else {
          console.log("❌ 작가 회원가입 실패:", response.message);
          alert(response.message || "작가 회원가입에 실패했습니다.");
        }
      } else if (selectedJob === UserJob.GALLERY) {
        // 갤러리 회원가입 API 호출
        const galleryData: GalleryRegistrationData = {
          userName: galleryForm.managerName,
          googleID: tempGoogleID, // 실제 Google ID 사용
          email: galleryForm.managerEmail,
          introduction: galleryForm.bio,
          contact: galleryForm.managerPhone,
          galleryName: galleryForm.galleryName,
          location: galleryForm.galleryLocation,
          registrationNumber: galleryForm.businessRegistrationNumber, // 실제 사업자번호 사용
        };

        console.log("🏛️ 갤러리 회원가입 데이터:", galleryData);

        const response = await registerGalleryMutation.mutateAsync(galleryData);

        if (response.success) {
          console.log("✅ 갤러리 회원가입 성공");
          console.log("🏠 홈페이지로 이동 준비 중...");

          // 회원가입 완료 후 로그인 상태로 전환
          localStorage.setItem("googleID", tempGoogleID);
          localStorage.removeItem("tempGoogleID");
          localStorage.removeItem("selectedJob");

          console.log("🏠 홈페이지로 이동 시작");
          navigate("/");
        } else {
          console.log("❌ 갤러리 회원가입 실패:", response.message);
          alert(response.message || "갤러리 회원가입에 실패했습니다.");
        }
      } else if (selectedJob === UserJob.ART_COLLECTOR) {
        // 컬렉터 회원가입 API 호출
        const collectorData: CollectorRegistrationData = {
          name: artistCollectorForm.name,
          googleID: tempGoogleID, // 임시 Google ID 사용
          email: artistCollectorForm.email,
          introduction: artistCollectorForm.bio,
          contact: artistCollectorForm.phone,
          birth: artistCollectorForm.birthDate,
          educationBackground: artistCollectorForm.education,
          disclosureStatus: artistCollectorForm.isEducationPublic,
        };

        console.log("👥 컬렉터 회원가입 데이터:", collectorData);

        const response = await registerCollectorMutation.mutateAsync(
          collectorData
        );

        if (response.success) {
          console.log("✅ 컬렉터 회원가입 성공");
          console.log("🏠 홈페이지로 이동 준비 중...");

          // 회원가입 완료 후 로그인 상태로 전환
          localStorage.setItem("googleID", tempGoogleID);
          localStorage.removeItem("tempGoogleID");
          localStorage.removeItem("selectedJob");

          console.log("🏠 홈페이지로 이동 시작");
          navigate("/");
        } else {
          console.log("❌ 컬렉터 회원가입 실패:", response.message);
          alert(response.message || "컬렉터 회원가입에 실패했습니다.");
        }
      } else {
        alert("올바르지 않은 직업이 선택되었습니다.");
      }
    } catch (error) {
      console.error("💥 회원가입 중 에러 발생:", error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      console.log("🔄 로딩 상태 해제");
      setIsLoading(false);
    }
  };

  if (!selectedJob) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const renderArtistCollectorForm = () => (
    <div className="rounded-lg bg-gray-100 py-6 space-y-4">
      <Input
        label="이름"
        value={artistCollectorForm.name}
        onChange={(value) => handleArtistCollectorChange("name", value)}
        required
        placeholder="이름을 입력해주세요."
        error={errors.name}
      />

      <Input
        label="생년월일"
        value={artistCollectorForm.birthDate}
        onChange={(value) => handleArtistCollectorChange("birthDate", value)}
        type="date"
        useCustomDatePicker
        placeholder="생년월일을 선택해주세요"
        error={errors.birthDate}
      />

      <Input
        label="학력"
        value={artistCollectorForm.education}
        onChange={(value) => handleArtistCollectorChange("education", value)}
        required
        placeholder="학교 정보를 입력해주세요."
        error={errors.education}
        helperText="OO대학교 OO대학 OO과 OO전공 재학/휴학/졸업"
      />

      <div className="grid grid-cols-[auto_1fr] items-center py-4 px-34">
        <div className="text-lg w-fit mr-10 font-semibold text-zinc-900 whitespace-nowrap">
          학력 공개 여부 <span className="text-red-600">*</span>
        </div>
        <div className="w-full flex items-center gap-6">
          <Checkbox
            label="공개"
            checked={artistCollectorForm.isEducationPublic}
            onChange={(checked) =>
              handleArtistCollectorChange("isEducationPublic", checked)
            }
            className="size-4"
          />
          <Checkbox
            label="비공개"
            checked={!artistCollectorForm.isEducationPublic}
            onChange={(checked) =>
              handleArtistCollectorChange("isEducationPublic", !checked)
            }
            className="size-4"
          />
        </div>
      </div>

      <Input
        label="연락처"
        value={artistCollectorForm.phone}
        onChange={(value) => handleArtistCollectorChange("phone", value)}
        type="tel"
        required
        placeholder="전화번호를 -없이 입력해주세요."
        error={errors.phone}
      />

      <Input
        label="메일"
        value={artistCollectorForm.email}
        onChange={(value) => handleArtistCollectorChange("email", value)}
        type="email"
        required
        placeholder="email@example.com"
        error={errors.email}
      />

      <Input
        label="소개글"
        value={artistCollectorForm.bio}
        onChange={(value) => handleArtistCollectorChange("bio", value)}
        placeholder="소개글을 입력해주세요. (0/60)"
        multiline
        rows={2}
        maxLength={60}
        showCounter
        error={errors.bio}
      />
    </div>
  );

  const renderGalleryForm = () => (
    <div className="space-y-10 py-6">
      {/* 사업자 정보 */}
      <div>
        <p className="text-[1.25rem] font-semibold text-zinc-900 mb-4">
          사업자 정보
        </p>
        <div className="rounded-lg bg-gray-100 py-6 space-y-4">
          <Input
            label="갤러리명"
            value={galleryForm.galleryName}
            onChange={(value) => handleGalleryChange("galleryName", value)}
            required
            placeholder="갤러리명을 입력해주세요."
            error={errors.galleryName}
            labelWidth="w-32"
          />

          <div className="grid grid-cols-[auto_1fr] gap-5 items-center py-4 px-10">
            <div className="text-lg font-semibold text-zinc-900 whitespace-nowrap w-32">
              사업자 등록번호 <span className="text-red-500 ml-1">*</span>
            </div>
            <div className="w-full relative flex gap-2">
              <input
                type="text"
                value={galleryForm.businessRegistrationNumber}
                onChange={(e) =>
                  handleGalleryChange(
                    "businessRegistrationNumber",
                    e.target.value
                  )
                }
                className={`flex-1 px-4 py-3 font-light placeholder:text-zinc-500 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 ${
                  errors.businessRegistrationNumber ? "border-red-600" : ""
                } ${
                  galleryForm.isBusinessVerified
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                placeholder="사업자 등록번호를 입력해주세요."
                disabled={galleryForm.isBusinessVerified}
              />
              <Button
                onClick={handleBusinessRegistrationLookup}
                className="w-30 px-4 py-3 text-sm whitespace-nowrap"
                variant={
                  galleryForm.isBusinessVerified
                    ? "primary"
                    : galleryForm.businessRegistrationNumber.trim()
                    ? "neutral"
                    : "secondary"
                }
                disabled={
                  galleryForm.isBusinessVerified ||
                  !galleryForm.businessRegistrationNumber.trim()
                }
              >
                {galleryForm.isBusinessVerified ? (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    조회완료
                  </span>
                ) : (
                  "조회"
                )}
              </Button>
              {errors.businessRegistrationNumber && (
                <p className="absolute left-0 top-full text-xs font-light px-2 text-red-500 mt-1.5">
                  *{errors.businessRegistrationNumber}
                </p>
              )}
            </div>
          </div>

          <Input
            label="갤러리 위치"
            value={galleryForm.galleryLocation}
            onChange={(value) => handleGalleryChange("galleryLocation", value)}
            required
            placeholder="정확한 위치 확인을 위해 주소는 '동'까지 기재해주세요."
            error={errors.galleryLocation}
            labelWidth="w-32"
          />
        </div>
      </div>

      {/* 담당자 휴대폰 본인인증 */}
      <div>
        <p className="text-[1.25rem] font-semibold text-zinc-900 mb-4">
          담당자 휴대폰 본인인증
        </p>
        <div className="rounded-lg bg-gray-100 py-6">
          <div>
            <div className="grid grid-cols-[auto_1fr] gap-5 items-center py-4 px-10">
              <div className="text-lg font-semibold text-zinc-900 whitespace-nowrap w-32">
                본인인증 입력 <span className="text-red-500 ml-1">*</span>
              </div>
              <div className="w-full relative flex gap-2">
                <input
                  type="text"
                  value={(() => {
                    const cleaned = galleryForm.verificationPhone;
                    return cleaned.length <= 3
                      ? cleaned
                      : cleaned.length <= 7
                      ? `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
                      : `${cleaned.slice(0, 3)}-${cleaned.slice(
                          3,
                          7
                        )}-${cleaned.slice(7, 11)}`;
                  })()}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, "");
                    handleGalleryChange("verificationPhone", cleaned);
                  }}
                  className={`flex-1 px-4 py-3 font-light placeholder:text-zinc-500 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 ${
                    errors.verificationPhone ? "border-red-600" : ""
                  }`}
                  placeholder="담당자 전화번호를 입력해주세요."
                  maxLength={13}
                />
                <Button
                  onClick={handlePhoneVerification}
                  className="w-30 px-4 py-2 text-sm whitespace-nowrap"
                  disabled={
                    galleryForm.isPhoneVerified ||
                    !galleryForm.verificationPhone.trim()
                  }
                  variant={
                    galleryForm.verificationPhone.trim() &&
                    !galleryForm.isPhoneVerified
                      ? "neutral"
                      : "secondary"
                  }
                >
                  {galleryForm.isPhoneVerified
                    ? "인증 완료"
                    : galleryForm.isVerificationCodeSent
                    ? "재전송"
                    : "인증번호 발송"}
                </Button>
                {errors.verificationPhone && (
                  <p className="absolute left-0 top-full text-xs font-light px-2 text-red-500 mt-1.5">
                    *{errors.verificationPhone}
                  </p>
                )}
              </div>
            </div>

            {galleryForm.isVerificationCodeSent && (
              <div className="grid grid-cols-[auto_1fr] gap-5 items-center py-4 px-10">
                <div className="w-32"></div>
                <div className="w-full relative flex gap-2">
                  <input
                    type="text"
                    value={galleryForm.verificationCode}
                    onChange={(e) =>
                      handleGalleryChange("verificationCode", e.target.value)
                    }
                    className={`flex-1 px-4 py-3 font-light placeholder:text-zinc-500 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 ${
                      errors.verificationCode ? "border-red-600" : ""
                    } ${
                      galleryForm.isPhoneVerified
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    placeholder="전화번호로 발송된 인증번호를 입력해주세요."
                    maxLength={6}
                    disabled={galleryForm.isPhoneVerified}
                  />
                  <Button
                    onClick={handleVerificationCodeCheck}
                    className="w-30 px-4 py-2 text-sm whitespace-nowrap"
                    variant={
                      galleryForm.isPhoneVerified
                        ? "primary"
                        : galleryForm.verificationCode.trim()
                        ? "neutral"
                        : "secondary"
                    }
                    disabled={
                      galleryForm.isPhoneVerified ||
                      !galleryForm.verificationCode.trim()
                    }
                  >
                    {galleryForm.isPhoneVerified ? (
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        인증완료
                      </span>
                    ) : (
                      "확인"
                    )}
                  </Button>
                  {errors.verificationCode && (
                    <p className="absolute left-0 top-full text-xs font-light px-2 text-red-500 mt-1.5">
                      *{errors.verificationCode}
                    </p>
                  )}
                </div>
              </div>
            )}

            {errors.phoneVerification && (
              <div className="px-10">
                <p className="text-sm text-red-500 mt-1">
                  {errors.phoneVerification}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 담당자 정보 */}
      <div>
        <p className="text-[1.25rem] font-semibold text-zinc-900 mb-4">
          담당자 정보
        </p>
        <div className="rounded-lg bg-gray-100 py-6 space-y-4">
          <Input
            label="이름"
            value={galleryForm.managerName}
            onChange={(value) => handleGalleryChange("managerName", value)}
            required
            placeholder="담당자명을 입력해주세요."
            error={errors.managerName}
            labelWidth="w-32"
          />

          <Input
            label="연락처"
            value={galleryForm.managerPhone}
            onChange={(value) => handleGalleryChange("managerPhone", value)}
            type="tel"
            required
            placeholder="전화번호를 -없이 입력해주세요."
            error={errors.managerPhone}
            labelWidth="w-32"
          />

          <Input
            label="메일"
            value={galleryForm.managerEmail}
            onChange={(value) => handleGalleryChange("managerEmail", value)}
            type="email"
            required
            placeholder="email@example.com"
            error={errors.managerEmail}
            labelWidth="w-32"
          />

          <Input
            label="소개글"
            value={galleryForm.bio}
            onChange={(value) => handleGalleryChange("bio", value)}
            placeholder="소개글을 입력해주세요. (0/60)"
            maxLength={60}
            multiline
            rows={2}
            showCounter
            error={errors.bio}
            labelWidth="w-32"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Header />
      <div className="w-full max-w-4xl py-20">
        <div className="text-[1.75rem] text-center mb-10 font-bold text-zinc-900">
          프로필
        </div>

        {selectedJob === UserJob.GALLERY
          ? renderGalleryForm()
          : renderArtistCollectorForm()}

        <div className="mt-8 w-178 mx-auto text-center">
          <Button
            className="w-full transition-all duration-300"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!isFormValid() || isLoading}
            variant={isFormValid() ? "primary" : "secondary"}
          >
            {isLoading ? "프로필 생성 중..." : "완료"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupProfilePage;

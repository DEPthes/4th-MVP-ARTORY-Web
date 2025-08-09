import { useState, useEffect } from "react";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import Checkbox from "../components/Checkbox/Checkbox";
import { authService, apiClient } from "../apis";
import type { GoogleAuthResponse } from "../apis/auth";

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
  // 담당자 정보
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  bio: string;
  isPhoneVerified: boolean;
}

const SignupProfilePage = () => {
  const [userInfo, setUserInfo] = useState<GoogleAuthResponse["user"] | null>(
    null
  );
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
    managerName: "",
    managerPhone: "",
    managerEmail: "",
    bio: "",
    isPhoneVerified: false,
  });

  useEffect(() => {
    const loadUserInfo = async () => {
      const user = await authService.getCurrentUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUserInfo(user);

      const job = localStorage.getItem("selectedJob");
      if (!job) {
        window.location.href = "/signup/job";
        return;
      }
      setSelectedJob(job);

      // 사용자 이메일을 기본값으로 설정
      if (job === "gallery") {
        setGalleryForm((prev) => ({ ...prev, managerEmail: user.email }));
      } else {
        setArtistCollectorForm((prev) => ({ ...prev, email: user.email }));
      }
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

  // 휴대폰 인증 처리
  const handlePhoneVerification = async () => {
    if (!galleryForm.managerPhone.trim()) {
      setErrors((prev) => ({
        ...prev,
        managerPhone: "휴대폰 번호를 입력해주세요.",
      }));
      return;
    }

    try {
      // 여기에 실제 휴대폰 인증 API 호출
      // const response = await apiClient.post("/api/auth/send-sms", { phone: galleryForm.managerPhone });

      // 임시로 성공 처리
      alert("인증번호가 발송되었습니다.");
      setGalleryForm((prev) => ({ ...prev, isPhoneVerified: true }));
    } catch {
      alert("인증번호 발송에 실패했습니다.");
    }
  };

  // 유효성 검사
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (selectedJob === "gallery") {
      // 갤러리 유효성 검사
      if (!galleryForm.galleryName.trim())
        newErrors.galleryName = "갤러리명을 입력해주세요.";
      if (!galleryForm.businessRegistrationNumber.trim())
        newErrors.businessRegistrationNumber =
          "사업자 등록번호를 입력해주세요.";
      if (!galleryForm.galleryLocation.trim())
        newErrors.galleryLocation = "갤러리 위치를 입력해주세요.";
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
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      let profileData;

      if (selectedJob === "gallery") {
        profileData = {
          job: selectedJob,
          galleryName: galleryForm.galleryName,
          businessRegistrationNumber: galleryForm.businessRegistrationNumber,
          galleryLocation: galleryForm.galleryLocation,
          managerName: galleryForm.managerName,
          managerPhone: galleryForm.managerPhone,
          managerEmail: galleryForm.managerEmail,
          bio: galleryForm.bio,
          isPhoneVerified: galleryForm.isPhoneVerified,
        };
      } else {
        profileData = {
          job: selectedJob,
          name: artistCollectorForm.name,
          birthDate: artistCollectorForm.birthDate,
          education: artistCollectorForm.education,
          isEducationPublic: artistCollectorForm.isEducationPublic,
          phone: artistCollectorForm.phone,
          email: artistCollectorForm.email,
          bio: artistCollectorForm.bio,
        };
      }

      const response = await apiClient.post(
        "/api/auth/complete-profile",
        profileData
      );

      if (response.data.success) {
        localStorage.removeItem("selectedJob");
        alert("프로필 설정이 완료되었습니다! ARTORY에 오신 것을 환영합니다!");
        window.location.href = "/";
      } else {
        throw new Error(response.data.message || "프로필 설정에 실패했습니다.");
      }
    } catch (error) {
      console.error("Profile completion error:", error);
      alert("프로필 설정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userInfo || !selectedJob) {
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
        placeholder="실명을 입력해주세요"
        error={errors.name}
      />

      <Input
        label="생년월일"
        value={artistCollectorForm.birthDate}
        onChange={(value) => handleArtistCollectorChange("birthDate", value)}
        type="date"
        error={errors.birthDate}
      />

      <Input
        label="학력"
        value={artistCollectorForm.education}
        onChange={(value) => handleArtistCollectorChange("education", value)}
        required
        placeholder="최종 학력을 입력해주세요"
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
        placeholder="010-0000-0000"
        error={errors.phone}
      />

      <Input
        label="메일"
        value={artistCollectorForm.email}
        onChange={(value) => handleArtistCollectorChange("email", value)}
        type="email"
        required
        error={errors.email}
      />

      <Input
        label="소개글"
        value={artistCollectorForm.bio}
        onChange={(value) => handleArtistCollectorChange("bio", value)}
        placeholder="본인에 대해 소개해주세요"
        multiline
        rows={4}
        maxLength={500}
        error={errors.bio}
      />
    </div>
  );

  const renderGalleryForm = () => (
    <div className="space-y-8 rounded-lg bg-gray-100 py-6">
      {/* 사업자 정보 */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">사업자 정보</h3>
        <div className="space-y-4">
          <Input
            label="갤러리명"
            value={galleryForm.galleryName}
            onChange={(value) => handleGalleryChange("galleryName", value)}
            required
            placeholder="갤러리 이름을 입력해주세요"
            error={errors.galleryName}
          />

          <Input
            label="사업자 등록번호"
            value={galleryForm.businessRegistrationNumber}
            onChange={(value) =>
              handleGalleryChange("businessRegistrationNumber", value)
            }
            required
            placeholder="000-00-00000"
            error={errors.businessRegistrationNumber}
          />

          <Input
            label="갤러리 위치"
            value={galleryForm.galleryLocation}
            onChange={(value) => handleGalleryChange("galleryLocation", value)}
            required
            placeholder="갤러리 주소를 입력해주세요"
            error={errors.galleryLocation}
          />
        </div>
      </div>

      {/* 담당자 휴대폰 본인인증 */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          담당자 휴대폰 본인인증
        </h3>
        <div className="space-y-4">
          <div>
            <Input
              label="담당자 휴대폰"
              value={galleryForm.managerPhone}
              onChange={(value) => handleGalleryChange("managerPhone", value)}
              type="tel"
              required
              placeholder="010-0000-0000"
              error={errors.managerPhone}
            />
            <div className="mt-2">
              <Button
                onClick={handlePhoneVerification}
                className="px-4 py-2 text-sm"
                disabled={galleryForm.isPhoneVerified}
              >
                {galleryForm.isPhoneVerified ? "인증 완료" : "인증번호 발송"}
              </Button>
            </div>
            {galleryForm.isPhoneVerified && (
              <p className="text-sm text-green-600 mt-1">
                ✓ 휴대폰 인증이 완료되었습니다.
              </p>
            )}
            {errors.phoneVerification && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phoneVerification}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 담당자 정보 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">담당자 정보</h3>
        <div className="space-y-4">
          <Input
            label="담당자 이름"
            value={galleryForm.managerName}
            onChange={(value) => handleGalleryChange("managerName", value)}
            required
            placeholder="담당자 이름을 입력해주세요"
            error={errors.managerName}
          />

          <Input
            label="담당자 이메일"
            value={galleryForm.managerEmail}
            onChange={(value) => handleGalleryChange("managerEmail", value)}
            type="email"
            required
            error={errors.managerEmail}
          />

          <Input
            label="갤러리 소개글"
            value={galleryForm.bio}
            onChange={(value) => handleGalleryChange("bio", value)}
            required
            placeholder="갤러리에 대해 소개해주세요"
            maxLength={1000}
            error={errors.bio}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-8">
      <div className="w-full max-w-4xl">
        <div className="text-[1.75rem] text-center mt-30 mb-20 font-bold text-zinc-900">
          프로필
        </div>

        {selectedJob === "gallery"
          ? renderGalleryForm()
          : renderArtistCollectorForm()}

        <div className="mt-8 text-center">
          <Button
            className="w-full md:w-auto px-8"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "프로필 생성 중..." : "프로필 완료하기"}
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          * 필수 항목입니다. 나중에 프로필 설정에서 언제든지 수정할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default SignupProfilePage;

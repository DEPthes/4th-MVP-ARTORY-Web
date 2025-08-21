import React, { useState, useEffect } from "react";
import { Header } from "../components";
import BackNavigate from "../components/Layouts/BackNavigate";
import { useNavigate } from "react-router-dom";
import {
  getUserProfile,
  type UserProfile,
  changeArtistProfile,
  changeCollectorProfile,
  changeGalleryProfile,
  type ArtistCollectorChangePayload,
  type GalleryChangePayload,
} from "../apis/user";
import { useSidebarProfile } from "../hooks/useUser";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import Checkbox from "../components/Checkbox/Checkbox";
import { UserJob } from "../types/user";
// import { useQueryClient } from "@tanstack/react-query";

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  // const queryClient = useQueryClient();

  const [selectedJob, setSelectedJob] = useState<string>("");

  // 회원가입 폼 재사용: 작가/컬렉터
  const [artistCollectorForm, setArtistCollectorForm] = useState({
    name: "",
    birthDate: "",
    education: "",
    isEducationPublic: false,
    phone: "",
    email: "",
    bio: "",
  });

  // 회원가입 폼 재사용: 갤러리
  const [galleryForm, setGalleryForm] = useState({
    galleryName: "",
    businessRegistrationNumber: "",
    galleryLocation: "",
    managerName: "",
    managerPhone: "",
    managerEmail: "",
    bio: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 사이드바 프로필 정보 조회
  const currentGoogleID = localStorage.getItem("googleID");
  const { data: sidebarProfile } = useSidebarProfile(currentGoogleID);

  // 프로필 정보 가져오기
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const googleID = localStorage.getItem("googleID");

        if (!googleID) {
          navigate("/login");
          return;
        }

        // 사이드바에서 id를 userId로 사용
        const userId = sidebarProfile?.id?.toString() || googleID;
        const profile: UserProfile = await getUserProfile(googleID, userId);

        const role =
          profile.userType === "GALLERY"
            ? UserJob.GALLERY
            : profile.userType === "COLLECTOR"
            ? UserJob.ART_COLLECTOR
            : UserJob.YOUNG_ARTIST;
        setSelectedJob(role);

        if (role === UserJob.GALLERY) {
          setGalleryForm({
            galleryName: profile.galleryName || "",
            businessRegistrationNumber: profile.registrationNumber || "",
            galleryLocation: profile.location || "",
            managerName: profile.name || "",
            managerPhone: profile.contact || "",
            managerEmail: profile.email || "",
            bio: profile.description || "",
          });
        } else {
          setArtistCollectorForm({
            name: profile.name || "",
            birthDate: profile.birth || "",
            education: profile.educationBackground || "",
            isEducationPublic: profile.disclosureStatus ?? false,
            phone: profile.contact || "",
            email: profile.email || "",
            bio: profile.description || "",
          });
        }
      } catch (error) {
        console.error("프로필 정보를 가져오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // 사이드바 프로필 정보가 로드된 후에 프로필 정보를 가져옴
    if (sidebarProfile) {
      fetchUserProfile();
    }
  }, [navigate, sidebarProfile]);

  const handleArtistCollectorChange = (
    field: keyof typeof artistCollectorForm,
    value: string | boolean
  ) => {
    setArtistCollectorForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string])
      setErrors((prev) => ({ ...prev, [field as string]: "" }));
  };

  const handleGalleryChange = (
    field: keyof typeof galleryForm,
    value: string
  ) => {
    setGalleryForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string])
      setErrors((prev) => ({ ...prev, [field as string]: "" }));
  };

  const handleSave = async () => {
    try {
      const googleID = localStorage.getItem("googleID");
      if (!googleID) {
        navigate("/login");
        return;
      }

      if (selectedJob === UserJob.GALLERY) {
        const payload: GalleryChangePayload = {
          userName: galleryForm.managerName,
          email: galleryForm.managerEmail,
          introduction: galleryForm.bio,
          contact: galleryForm.managerPhone,
          galleryName: galleryForm.galleryName,
          location: galleryForm.galleryLocation,
          registrationNumber: galleryForm.businessRegistrationNumber,
        };
        const res = await changeGalleryProfile(googleID, payload);
        if (!res.success)
          throw new Error(res.message || "갤러리 프로필 수정 실패");
      } else if (selectedJob === UserJob.ART_COLLECTOR) {
        const payload: ArtistCollectorChangePayload = {
          name: artistCollectorForm.name,
          email: artistCollectorForm.email,
          introduction: artistCollectorForm.bio,
          contact: artistCollectorForm.phone,
          birth: artistCollectorForm.birthDate,
          educationBackground: artistCollectorForm.education,
          disclosureStatus: artistCollectorForm.isEducationPublic,
        };
        const res = await changeCollectorProfile(googleID, payload);
        if (!res.success)
          throw new Error(res.message || "컬렉터 프로필 수정 실패");
      } else {
        const payload: ArtistCollectorChangePayload = {
          name: artistCollectorForm.name,
          email: artistCollectorForm.email,
          introduction: artistCollectorForm.bio,
          contact: artistCollectorForm.phone,
          birth: artistCollectorForm.birthDate,
          educationBackground: artistCollectorForm.education,
          disclosureStatus: artistCollectorForm.isEducationPublic,
        };
        const res = await changeArtistProfile(googleID, payload);
        if (!res.success)
          throw new Error(res.message || "작가 프로필 수정 실패");
      }

      const currentGoogleID = localStorage.getItem("googleID");
      navigate(`/profile/${currentGoogleID}`);
    } catch (error) {
      console.error("프로필 저장에 실패했습니다:", error);
      alert("프로필 저장에 실패했습니다.");
    }
  };

  // 취소 버튼 제거: BackNavigate로 대체

  if (isLoading || !selectedJob) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">로딩 중...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <BackNavigate back text="취소" variant="secondary" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-full max-w-4xl py-12">
          <div className="text-[1.75rem] text-center mb-10 font-bold text-zinc-900">
            프로필 수정
          </div>

          {selectedJob === UserJob.GALLERY ? (
            <div className="space-y-10 py-6">
              <div>
                <p className="text-[1.25rem] font-semibold text-zinc-900 mb-4">
                  사업자 정보
                </p>
                <div className="rounded-lg bg-gray-100 py-6 space-y-4">
                  <Input
                    label="갤러리명"
                    value={galleryForm.galleryName}
                    onChange={(v) => handleGalleryChange("galleryName", v)}
                    required
                    placeholder="갤러리명을 입력해주세요."
                    error={errors.galleryName}
                    labelWidth="w-32"
                  />
                  <Input
                    label="사업자 등록번호"
                    value={galleryForm.businessRegistrationNumber}
                    onChange={(v) =>
                      handleGalleryChange("businessRegistrationNumber", v)
                    }
                    required
                    placeholder="사업자 등록번호를 입력해주세요."
                    error={errors.businessRegistrationNumber}
                    labelWidth="w-32"
                  />
                  <Input
                    label="갤러리 위치"
                    value={galleryForm.galleryLocation}
                    onChange={(v) => handleGalleryChange("galleryLocation", v)}
                    required
                    placeholder="정확한 위치 확인을 위해 주소는 '동'까지 기재해주세요."
                    error={errors.galleryLocation}
                    labelWidth="w-32"
                  />
                </div>
              </div>

              <div>
                <p className="text-[1.25rem] font-semibold text-zinc-900 mb-4">
                  담당자 정보
                </p>
                <div className="rounded-lg bg-gray-100 py-6 space-y-4">
                  <Input
                    label="이름"
                    value={galleryForm.managerName}
                    onChange={(v) => handleGalleryChange("managerName", v)}
                    required
                    placeholder="담당자명을 입력해주세요."
                    error={errors.managerName}
                    labelWidth="w-32"
                  />
                  <Input
                    label="연락처"
                    value={galleryForm.managerPhone}
                    onChange={(v) => handleGalleryChange("managerPhone", v)}
                    type="tel"
                    required
                    placeholder="전화번호를 -없이 입력해주세요."
                    error={errors.managerPhone}
                    labelWidth="w-32"
                  />
                  <Input
                    label="메일"
                    value={galleryForm.managerEmail}
                    onChange={(v) => handleGalleryChange("managerEmail", v)}
                    type="email"
                    required
                    placeholder="email@example.com"
                    error={errors.managerEmail}
                    labelWidth="w-32"
                  />
                  <Input
                    label="소개글"
                    value={galleryForm.bio}
                    onChange={(v) => handleGalleryChange("bio", v)}
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
          ) : (
            <div className="rounded-lg bg-gray-100 py-6 space-y-4">
              <Input
                label="이름"
                value={artistCollectorForm.name}
                onChange={(v) => handleArtistCollectorChange("name", v)}
                required
                placeholder="이름을 입력해주세요."
                error={errors.name}
              />
              <Input
                label="생년월일"
                value={artistCollectorForm.birthDate}
                onChange={(v) => handleArtistCollectorChange("birthDate", v)}
                type="date"
                useCustomDatePicker
                placeholder="생년월일을 선택해주세요"
                error={errors.birthDate}
              />
              <Input
                label="학력"
                value={artistCollectorForm.education}
                onChange={(v) => handleArtistCollectorChange("education", v)}
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
                onChange={(v) => handleArtistCollectorChange("phone", v)}
                type="tel"
                required
                placeholder="전화번호를 -없이 입력해주세요."
                error={errors.phone}
              />
              <Input
                label="메일"
                value={artistCollectorForm.email}
                onChange={(v) => handleArtistCollectorChange("email", v)}
                type="email"
                required
                placeholder="email@example.com"
                error={errors.email}
              />
              <Input
                label="소개글"
                value={artistCollectorForm.bio}
                onChange={(v) => handleArtistCollectorChange("bio", v)}
                placeholder="소개글을 입력해주세요. (0/60)"
                multiline
                rows={2}
                maxLength={60}
                showCounter
                error={errors.bio}
              />
            </div>
          )}

          <div className="mt-8 w-178 mx-auto text-center">
            <Button className="w-full" onClick={handleSave}>
              저장
            </Button>
          </div>
          {/* 취소 버튼 제거: BackNavigate로 대체 */}
        </div>
      </div>
    </>
  );
};

export default ProfileEditPage;

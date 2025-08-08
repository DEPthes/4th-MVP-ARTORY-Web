import { useState, useEffect } from "react";
import Button from "../components/Button/Button";
import { authService, apiClient } from "../apis";
import type { GoogleAuthResponse } from "../apis/auth";

interface ProfileFormData {
  nickname: string;
  bio: string;
  experience: string;
  interests: string[];
  website?: string;
  instagram?: string;
}

const interestOptions = [
  "회화",
  "조각",
  "사진",
  "디지털아트",
  "설치미술",
  "퍼포먼스",
  "비디오아트",
  "판화",
  "도예",
  "섬유예술",
  "현대미술",
  "고전미술",
  "팝아트",
  "추상화",
  "미니멀리즘",
];

const SignupProfilePage = () => {
  const [userInfo, setUserInfo] = useState<GoogleAuthResponse["user"] | null>(
    null
  );
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    nickname: "",
    bio: "",
    experience: "",
    interests: [],
    website: "",
    instagram: "",
  });

  useEffect(() => {
    // 로그인된 사용자 정보와 선택된 직업 가져오기
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
    };

    loadUserInfo();
  }, []);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async () => {
    if (!formData.nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (!formData.bio.trim()) {
      alert("자기소개를 입력해주세요.");
      return;
    }

    if (formData.interests.length === 0) {
      alert("관심 분야를 최소 1개 이상 선택해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 백엔드로 전체 프로필 정보 전송
      const response = await apiClient.post("/api/auth/complete-profile", {
        job: selectedJob,
        nickname: formData.nickname,
        bio: formData.bio,
        experience: formData.experience,
        interests: formData.interests,
        website: formData.website,
        instagram: formData.instagram,
      });

      if (response.data.success) {
        // 임시 저장된 직업 정보 삭제
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

  const getJobLabel = (jobId: string) => {
    const jobMap: { [key: string]: string } = {
      artist: "아티스트",
      collector: "컬렉터",
      gallery: "갤러리",
      curator: "큐레이터",
      critic: "비평가",
      other: "기타",
    };
    return jobMap[jobId] || jobId;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">프로필 작성</h1>
          <p className="text-gray-600">
            {userInfo.name}님의 {getJobLabel(selectedJob)} 프로필을 완성해주세요
          </p>
        </div>

        <div className="space-y-6">
          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              닉네임 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => handleInputChange("nickname", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ARTORY에서 사용할 닉네임을 입력해주세요"
              maxLength={20}
            />
          </div>

          {/* 자기소개 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              자기소개 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="본인에 대해 간단히 소개해주세요"
              rows={4}
              maxLength={200}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.bio.length}/200
            </p>
          </div>

          {/* 경력/경험 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              경력 및 경험
            </label>
            <textarea
              value={formData.experience}
              onChange={(e) => handleInputChange("experience", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="관련 경력이나 경험을 자유롭게 작성해주세요"
              rows={3}
              maxLength={300}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.experience.length}/300
            </p>
          </div>

          {/* 관심 분야 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              관심 분야 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-3 py-2 text-sm rounded-full border transition-all ${
                    formData.interests.includes(interest)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              선택됨: {formData.interests.length}개
            </p>
          </div>

          {/* 웹사이트 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              웹사이트
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://your-website.com"
            />
          </div>

          {/* 인스타그램 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              인스타그램
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                @
              </span>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="username"
              />
            </div>
          </div>
        </div>

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

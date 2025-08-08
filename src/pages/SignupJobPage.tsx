import { useState, useEffect } from "react";
import Button from "../components/Button/Button";
import { authService, apiClient } from "../apis";

interface JobOption {
  id: string;
  label: string;
  description: string;
}

const jobOptions: JobOption[] = [
  {
    id: "artist",
    label: "아티스트",
    description: "작품을 직접 제작하는 예술가",
  },
  {
    id: "collector",
    label: "컬렉터",
    description: "작품을 수집하고 감상하는 수집가",
  },
  {
    id: "gallery",
    label: "갤러리",
    description: "작품을 전시하고 판매하는 갤러리",
  },
  {
    id: "curator",
    label: "큐레이터",
    description: "전시 기획 및 작품 선별 전문가",
  },
  {
    id: "critic",
    label: "비평가",
    description: "작품을 분석하고 평가하는 전문가",
  },
  {
    id: "other",
    label: "기타",
    description: "기타 예술 관련 직업",
  },
];

const SignupJobPage = () => {
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    // 로그인된 사용자 정보 가져오기
    const loadUserInfo = async () => {
      const user = await authService.getCurrentUser();
      if (!user) {
        // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
        window.location.href = "/login";
        return;
      }
      setUserInfo(user);
    };

    loadUserInfo();
  }, []);

  const handleJobSelect = (jobId: string) => {
    setSelectedJob(jobId);
  };

  const handleSubmit = async () => {
    if (!selectedJob) {
      alert("직업을 선택해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 백엔드로 직업 정보 전송
      const response = await apiClient.post("/api/auth/complete-profile", {
        job: selectedJob,
      });

      if (response.data.success) {
        alert("프로필 설정이 완료되었습니다!");
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

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            환영합니다, {userInfo.name}님!
          </h1>
          <p className="text-gray-600">
            ARTORY에서 어떤 역할로 활동하실 예정인가요?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {jobOptions.map((job) => (
            <div
              key={job.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedJob === job.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleJobSelect(job.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{job.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {job.description}
                  </p>
                </div>
                {selectedJob === job.id && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            className="w-full md:w-auto px-8"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!selectedJob || isLoading}
          >
            {isLoading ? "설정 중..." : "프로필 완료"}
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          나중에 프로필 설정에서 언제든지 변경할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default SignupJobPage;

import { useState, useEffect } from "react";
import Button from "../components/Button/Button";
import { authService } from "../apis";
import type { GoogleAuthResponse } from "../apis/auth";
import UserCard from "../components/UserCard";
import { UserJob, type UserJobType } from "../types/user";
import { Header } from "../components";
import { isDevelopmentMode } from "../utils/mockAuth";

const SignupJobPage = () => {
  const [selectedJob, setSelectedJob] = useState<UserJobType | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<GoogleAuthResponse["user"] | null>(
    null
  );

  useEffect(() => {
    // 로그인된 사용자 정보 가져오기
    const loadUserInfo = async () => {
      // 개발 모드에서는 인증 체크 우회
      if (isDevelopmentMode()) {
        console.log("🎭 개발 모드: SignupJobPage 인증 체크 우회");
        setUserInfo({
          id: "dev-user",
          email: "dev@example.com",
          name: "개발자",
        });
        return;
      }

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

  const handleJobSelect = (job: UserJobType) => {
    setSelectedJob(selectedJob === job ? "" : job);
  };

  const handleSubmit = async () => {
    if (!selectedJob) {
      alert("직업을 선택해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 직업 정보를 임시 저장 (로컬스토리지에)
      localStorage.setItem("selectedJob", selectedJob);

      // 추가 프로필 작성 페이지로 이동
      window.location.href = "/signup/profile";
    } catch (error) {
      console.error("Job selection error:", error);
      alert("직업 선택에 실패했습니다. 다시 시도해주세요.");
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

  // UserJob의 모든 값들을 배열로 변환
  const jobOptions = Object.values(UserJob) as UserJobType[];

  return (
    <div className="flex flex-col items-center justify-center bg-white">
      <Header />
      <div className="py-20 flex flex-col items-center">
        <p className="text-[1.75rem] font-bold text-neutral-900 mb-20">
          당신의 활동 분야를 알려주세요 <span className="text-red-600">*</span>
        </p>

        <div className="grid grid-cols-3 gap-6 mb-20">
          {jobOptions.map((job) => (
            <UserCard
              key={job}
              job={job}
              isSelected={selectedJob === job}
              onSelect={handleJobSelect}
              className="w-80"
            />
          ))}
        </div>
        <div className="w-178">
          <Button
            className="w-full disabled:bg-stone-300 transition-all duration-300"
            variant="primary"
            size="base"
            loading={isLoading}
            disabled={!selectedJob || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "설정 중..." : "완료"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupJobPage;

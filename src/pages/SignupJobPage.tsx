import { useState, useEffect } from "react";
import Button from "../components/Button/Button";
import UserCard from "../components/UserCard";
import { UserJob, type UserJobType } from "../types/user";
import { Header } from "../components";

const SignupJobPage = () => {
  const [selectedJob, setSelectedJob] = useState<UserJobType | "">("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 임시 Google ID 확인 (회원가입 과정 중)
    const tempGoogleID = localStorage.getItem("tempGoogleID");
    if (!tempGoogleID) {
      // 회원가입 과정이 아닌 경우 로그인 페이지로 리다이렉트
      console.log("❌ 임시 Google ID 없음 - 로그인 페이지로 이동");
      window.location.href = "/login";
      return;
    }

    console.log("✅ 직업 선택 페이지 진입, 임시 Google ID:", tempGoogleID);
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

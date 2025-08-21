import React, { useState, useEffect } from "react";
import { Header } from "../components";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../apis/user";
import { useSidebarProfile } from "../hooks/useUser";

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // 편집 중인 프로필 정보
  const [editingProfileInfo, setEditingProfileInfo] = useState({
    name: "",
    email: "",
    role: "",
    introduction: "",
    contact: "",
    birthdate: "",
    education: "",
  });

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
        const profile = await getUserProfile(googleID, userId);

        // 사용자 정보 설정
        const userInfo = {
          name: profile.name,
          email: profile.email,
          role:
            profile.userType === "ARTIST"
              ? "작가"
              : profile.userType === "GALLERY"
              ? "갤러리"
              : "아트 컬렉터",
          introduction: profile.description,
          contact: profile.contact,
          birthdate: profile.birth,
          education: profile.educationBackground,
        };

        setEditingProfileInfo(userInfo);
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

  const handleProfileFieldChange = (field: string, value: string) => {
    setEditingProfileInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // TODO: API 호출하여 서버에 저장
      console.log("프로필 정보 저장:", editingProfileInfo);

      // 저장 성공 시 프로필 페이지로 이동
      const currentGoogleID = localStorage.getItem("googleID");
      navigate(`/profile/${currentGoogleID}`);
    } catch (error) {
      console.error("프로필 저장에 실패했습니다:", error);
      alert("프로필 저장에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    const currentGoogleID = localStorage.getItem("googleID");
    navigate(`/profile/${currentGoogleID}`);
  };

  if (isLoading) {
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                프로필 수정
              </h1>
              <p className="text-gray-600">
                프로필 정보를 수정하고 저장할 수 있습니다.
              </p>
            </div>

            <div className="space-y-6">
              {/* 이름 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름 *
                </label>
                <input
                  type="text"
                  value={editingProfileInfo.name}
                  onChange={(e) =>
                    handleProfileFieldChange("name", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="이름을 입력하세요"
                />
              </div>

              {/* 이메일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 *
                </label>
                <input
                  type="email"
                  value={editingProfileInfo.email}
                  onChange={(e) =>
                    handleProfileFieldChange("email", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="이메일을 입력하세요"
                />
              </div>

              {/* 역할 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  역할 *
                </label>
                <select
                  value={editingProfileInfo.role}
                  onChange={(e) =>
                    handleProfileFieldChange("role", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">역할을 선택하세요</option>
                  <option value="작가">작가</option>
                  <option value="갤러리">갤러리</option>
                  <option value="아트 컬렉터">아트 컬렉터</option>
                </select>
              </div>

              {/* 연락처 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연락처
                </label>
                <input
                  type="text"
                  value={editingProfileInfo.contact}
                  onChange={(e) =>
                    handleProfileFieldChange("contact", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="연락처를 입력하세요"
                />
              </div>

              {/* 생년월일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  생년월일
                </label>
                <input
                  type="text"
                  value={editingProfileInfo.birthdate}
                  onChange={(e) =>
                    handleProfileFieldChange("birthdate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="YYYY.MM.DD"
                />
              </div>

              {/* 학력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  학력
                </label>
                <input
                  type="text"
                  value={editingProfileInfo.education}
                  onChange={(e) =>
                    handleProfileFieldChange("education", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="학력을 입력하세요"
                />
              </div>

              {/* 소개 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  소개
                </label>
                <textarea
                  value={editingProfileInfo.introduction}
                  onChange={(e) =>
                    handleProfileFieldChange("introduction", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  placeholder="자신을 소개해주세요"
                />
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                저장
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileEditPage;

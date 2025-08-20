import React, { useState } from "react";
import { cn } from "../../utils/classname";
import { Button } from "../Button";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogout, useSidebarProfile } from "../../hooks/useUser";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const logoutMutation = useLogout();

  // Google ID 가져오기
  const googleId = localStorage.getItem("googleID");

  // 사이드바 프로필 정보 조회 (최초 한번만 호출, 캐싱으로 재사용)
  const {
    data: sidebarProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useSidebarProfile(googleId);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = async () => {
    try {
      console.log("🚪 로그아웃 시작");

      // TanStack Query 로그아웃 mutation 실행
      await logoutMutation.mutateAsync();

      console.log("✅ 로그아웃 완료 - 로그인 페이지로 이동");
      navigate("/login");
    } catch (error) {
      console.error("💥 로그아웃 에러:", error);
      // 에러가 발생해도 로컬 스토리지 정리는 되었으므로 로그인 페이지로 이동
      navigate("/login");
    }
  };

  const closeSidebar = () => {
    setIsMenuOpen(false);
  };

  // 현재 경로에 따른 active 상태 확인
  const isActiveMenu = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <header
        className={cn(
          "bg-white w-full h-20 flex justify-between px-8 items-center border-b border-zinc-400 relative z-50",
          className
        )}
      >
        {/* 왼쪽 영역: 햄버거 메뉴 */}
        <div className="flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md cursor-pointer focus:outline-none"
            aria-label="메뉴 열기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="18"
              viewBox="0 0 30 18"
              fill="none"
            >
              <path
                d="M1.66602 1H28.3327"
                stroke="#D32F2F"
                strokeWidth="2"
                strokeLinecap="square"
              />
              <path
                d="M1.66602 9H28.3327"
                stroke="#1D1E20"
                strokeWidth="2"
                strokeLinecap="square"
              />
              <path
                d="M1.66602 17H28.3327"
                stroke="#1D1E20"
                strokeWidth="2"
                strokeLinecap="square"
              />
            </svg>
          </button>
        </div>

        {/* 중앙 영역: 네비게이션 메뉴들 (동일한 간격) */}
        <nav className="flex items-center gap-10 lg:gap-20 text-lg font-semibold">
          <button
            onClick={() => navigate("/note")}
            className={cn(
              "cursor-pointer px-3 py-2 transition-colors duration-200",
              isActiveMenu("/note")
                ? "text-red-500"
                : "text-zinc-900 hover:text-red-500"
            )}
          >
            NOTE
          </button>
          <button
            onClick={() => navigate("/collection")}
            className={cn(
              "cursor-pointer px-3 py-2 transition-colors duration-200",
              isActiveMenu("/collection")
                ? "text-red-500"
                : "text-zinc-900 hover:text-red-500"
            )}
          >
            COLLECTION
          </button>
          <button
            onClick={() => navigate("/exhibition")}
            className={cn(
              "cursor-pointer px-3 py-2 transition-colors duration-200",
              isActiveMenu("/exhibition")
                ? "text-red-500"
                : "text-zinc-900 hover:text-red-500"
            )}
          >
            EXHIBITION
          </button>
          <button
            onClick={() => navigate("/contest")}
            className={cn(
              "cursor-pointer px-3 py-2 transition-colors duration-200",
              isActiveMenu("/contest")
                ? "text-red-500"
                : "text-zinc-900 hover:text-red-500"
            )}
          >
            CONTEST
          </button>
        </nav>

        {/* 오른쪽 영역: 검색창 + 프로필 아이콘 */}
        <div className="flex items-center gap-10">
          {/* 검색창 */}
          <div className="relative flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="absolute left-3 pointer-events-none"
            >
              <path
                d="M7.29199 1.33984C10.2861 1.49149 12.6668 3.96728 12.667 6.99902L12.6602 7.29004C12.5958 8.56131 12.1108 9.7209 11.3438 10.6357L15.0205 14.3125L14.3135 15.0195L10.6367 11.3428C9.65254 12.1673 8.38533 12.665 7.00098 12.665L6.70898 12.6582C3.81146 12.5113 1.48855 10.1876 1.3418 7.29004L1.33398 6.99902C1.33416 3.86959 3.87151 1.33208 7.00098 1.33203L7.29199 1.33984ZM7.00098 2.33203C4.42379 2.33208 2.33416 4.42187 2.33398 6.99902C2.33416 9.57618 4.42379 11.665 7.00098 11.665C9.57805 11.6649 11.6668 9.57609 11.667 6.99902C11.6668 4.42195 9.57805 2.33221 7.00098 2.33203Z"
                fill="#717478"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="block w-90 pl-10 pr-3 py-3 text-xs rounded-md bg-gray-200 focus:outline-none"
              placeholder="검색어를 입력하세요..."
            />
            <Button
              onClick={handleSearch}
              className="ml-2 py-3 px-4 rounded-md text-nowrap text-xs"
            >
              검색
            </Button>
          </div>

          {/* 프로필 아이콘 */}
          <button
            className="focus:outline-none cursor-pointer"
            aria-label="프로필 메뉴"
            onClick={() => navigate("/profile/me")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path
                d="M13.999 5.66699C16.3921 5.66699 18.3328 7.60692 18.333 10C18.333 12.3932 16.3923 14.334 13.999 14.334C11.606 14.3338 9.66602 12.3931 9.66602 10C9.66619 7.60703 11.6061 5.66718 13.999 5.66699Z"
                stroke="#D32F2F"
                strokeWidth="2"
              />
              <path
                d="M14.5117 16.6768C19.0151 16.8384 22.7297 19.128 23.7295 23.1133C23.1903 23.6889 22.6008 24.2166 21.9678 24.6895C21.8147 22.8479 21.0065 21.4608 19.8037 20.4795C18.4217 19.3522 16.3979 18.668 13.9971 18.668C11.5964 18.668 9.57236 19.3523 8.19043 20.4795C6.98778 21.4608 6.17838 22.848 6.02539 24.6895C5.39277 24.2168 4.80447 23.6885 4.26562 23.1133C5.30323 18.9774 9.26454 16.6681 13.9971 16.668L14.5117 16.6768Z"
                fill="#D32F2F"
              />
              <circle
                cx="13.9993"
                cy="14.0003"
                r="12.3333"
                stroke="#1D1E20"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* 사이드바 오버레이 */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={closeSidebar}
        />
      )}

      {/* 사이드바 */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-115 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* 사이드바 헤더 */}
        <div className="p-6 bg-gray-100">
          <div className="flex justify-end items-center">
            <button
              onClick={closeSidebar}
              className="p-2 rounded-md cursor-pointer focus:outline-none"
              aria-label="메뉴 닫기"
            >
              <div className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="21"
                  viewBox="0 0 22 21"
                  fill="none"
                >
                  <path
                    d="M1.98145 19.604L19.6039 1.9815"
                    stroke="#D32F2F"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                  <path
                    d="M2.39551 1.98145L20.018 19.6039"
                    stroke="#1D1E20"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* 프로필 섹션 */}
        <div className="p-4 bg-gray-100 pb-18">
          <div className="flex flex-col items-center">
            {/* 프로필 이미지 */}
            <div className="size-45 rounded-full mb-8.5 bg-zinc-300 flex items-center justify-center overflow-hidden">
              {sidebarProfile?.profileImageURL ? (
                <img
                  src={sidebarProfile.profileImageURL}
                  alt="프로필 이미지"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-zinc-300 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M16 8C18.2091 8 20 9.79086 20 12C20 14.2091 18.2091 16 16 16C13.7909 16 12 14.2091 12 12C12 9.79086 13.7909 8 16 8Z"
                      fill="#9CA3AF"
                    />
                    <path
                      d="M16 18C21.5228 18 26 22.4772 26 28H6C6 22.4772 10.4772 18 16 18Z"
                      fill="#9CA3AF"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* 로딩 상태 */}
            {isProfileLoading ? (
              <>
                <div className="w-16 h-6 bg-zinc-300 rounded mb-6 animate-pulse"></div>
                <div className="w-24 h-8 bg-zinc-300 rounded animate-pulse"></div>
              </>
            ) : profileError ? (
              <>
                <p className="text-xl text-red-500 mb-6">오류</p>
                <p className="text-2xl font-semibold text-zinc-900">
                  프로필 로드 실패
                </p>
              </>
            ) : sidebarProfile ? (
              <>
                <p className="text-xl text-zinc-500 mb-6">
                  {sidebarProfile.userType === "ARTIST" && "작가"}
                  {sidebarProfile.userType === "GALLERY" && "갤러리"}
                  {sidebarProfile.userType === "COLLECTOR" && "컬렉터"}
                </p>
                <p className="text-2xl font-semibold text-zinc-900">
                  {sidebarProfile.username}
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-xl text-zinc-500 mb-6"></p>
                <button
                  onClick={() => {
                    navigate("/login");
                    closeSidebar();
                  }}
                  className="text-2xl font-semibold text-zinc-900 cursor-pointer"
                >
                  로그인 하기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 메뉴 항목들 - flex-1로 남은 공간 차지 */}
        <div className="flex-1 flex flex-col justify-start pt-10 items-center">
          <nav className="px-4 space-y-1">
            <button
              onClick={() => {
                navigate("/");
                closeSidebar();
              }}
              className="w-full flex items-center justify-center cursor-pointer font-semibold px-4 py-3 text-zinc-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              아토리 가이드
            </button>

            <button
              onClick={() => {
                navigate("/profile/me");
                closeSidebar();
              }}
              className="w-full flex justify-center font-semibold cursor-pointer items-center px-4 py-3 text-zinc-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              마이페이지
            </button>
          </nav>
        </div>

        {/* 로그아웃 버튼 - 맨 아래 고정 */}
        <div className="p-4 flex justify-center pb-10">
          <button
            onClick={() => {
              handleLogout();
              closeSidebar();
            }}
            className="w-fit flex items-center justify-center cursor-pointer px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            로그아웃
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;

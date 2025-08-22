import { useIsLoggedIn } from "../hooks/useUser";
import { Header } from "../components";
import InfoCard from "../components/InfoCard";
import { UserJob } from "../types/user";

import DesignLine from "../assets/images/Line.png";

const HomePage = () => {
  const { isLoggedIn, isLoading } = useIsLoggedIn();

  console.log("🏠 HomePage - isLoggedIn:", isLoggedIn, "isLoading:", isLoading);
  console.log(
    "🏠 HomePage - localStorage googleID:",
    localStorage.getItem("googleID")
  );

  if (isLoading) {
    console.log("🏠 HomePage - 로딩 중...");
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    console.log("🏠 HomePage - 로그인되지 않음, 로그인 페이지로 이동");
    window.location.href = "/login";
    return null;
  }

  console.log("🏠 HomePage - 정상 렌더링");
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="relative z-10 min-h-[calc(100vh-5rem)] py-30 flex flex-col items-center">
        <div className="text-lg font-light text-zinc-900">
          청년 작가의 꿈과 컬렉터의 감각이 만나는 곳
        </div>
        <div className="bg-zinc-400 w-28 h-0.5 my-16"></div>
        <div className="text-[2rem] font-bold text-red-600 mb-12">ARTORY</div>
        <div className="text-xl font-light leading-10 text-zinc-900 text-center mb-30">
          <span className="font-bold">아토리(ARTORY)</span>는 예술(ART)과
          이야기(STORY)의 합성어로,
          <br />
          청년 작가와 MZ세대를 연결해, 누구나 예술을 사고 즐기고 나누는 참여형
          예술 플랫폼입니다.
        </div>
        <img
          src={DesignLine}
          alt="DesignLine"
          className="w-full absolute top-125 z-- left-0"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4 z-10">
          <InfoCard
            job={UserJob.YOUNG_ARTIST}
            description1="작가 포트폴리오"
            description2="전시 홍보"
          />
          <InfoCard
            job={UserJob.ART_COLLECTOR}
            description1="청년 작가 탐색"
            description2="작품 아카이빙"
          />
          <InfoCard
            job={UserJob.GALLERY}
            description1="청년 작가 발굴"
            description2="전시 및 공모전 홍보"
          />
        </div>
        <div className="flex flex-col items-center mt-30">
          <p className="text-xl font-light text-zinc-900">
            청년 작가를 위한 포트폴리오, 아트컬렉터를 위한 작품 추천, 갤러리를
            위한 작가 발굴
          </p>
          <div className="bg-stone-300 w-0.5 h-5 my-10" />
          <p className="text-xl font-light text-zinc-900">
            모두를 연결하는 아트 플랫폼
          </p>
          <div className="bg-zinc-400 w-28 h-0.5 my-16"></div>
          <p className="text-2xl font-semibold text-zinc-900">
            작품 그 너머의 이야기까지, 아토리에서 작가와 직접 나눠보세요
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

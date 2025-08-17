import { useState } from "react";
import { Header } from "../components";
import Chip from "../components/Chip";
import BannerControl from "../components/Profile/BannerControl";
import ProfileCard from "../components/Profile/ProfileCard";
import { useNavigate } from "react-router-dom";

const categories = [
  "전체",
  "회화",
  "조각",
  "공예",
  "건축",
  "사진",
  "미디어아트",
  "인테리어",
  "기타",
] as const;
type Category = (typeof categories)[number];

const mockData = [
  {
    id: "1",
    role: "작가",
    nickName: "닉네임",
    phoneNumber: "010-1234-5678",
    email: "test@test.com",
    introduction:
      "전통 수묵의 깊이와 현대미술의 자유로움이 만나, 새로운 숨결을 그려냅니다.",
    isMyProfile: false,
    category: "회화",
  },
  {
    id: "2",
    role: "작가",
    nickName: "닉네임",
    phoneNumber: "010-1234-5678",
    email: "test@test.com",
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    category: "조각",
  },
  {
    id: "3",
    role: "작가",
    nickName: "닉네임",
    phoneNumber: "010-1234-5678",
    email: "test@test.com",
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    category: "공예",
  },
  {
    id: "4",
    role: "작가",
    nickName: "닉네임",
    phoneNumber: "010-1234-5678",
    email: "test@test.com",
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    category: "회화",
  },
  {
    id: "5",
    role: "작가",
    nickName: "닉네임",
    phoneNumber: "010-1234-5678",
    email: "test@test.com",
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    category: "사진",
  },
  {
    id: "6",
    role: "작가",
    nickName: "닉네임",
    phoneNumber: "010-1234-5678",
    email: "test@test.com",
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    category: "미디어아트",
  },
  {
    id: "7",
    role: "작가",
    nickName: "닉네임",
    phoneNumber: "010-1234-5678",
    email: "test@test.com",
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    category: "인테리어",
  },
];

const ArtistNotePage = () => {
  const navigate = useNavigate();

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`);
  };

  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");

  // 선택된 카테고리에 따라 작가 데이터 필터링
  const filteredData =
    selectedCategory === "전체"
      ? mockData
      : mockData.filter((artist) => artist.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BannerControl isMyProfile={false} />
      <div className="flex flex-col items-center py-10">
        <div className="mb-16 w-full mx-auto px-4 flex items-center justify-center gap-4">
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              isActive={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-20">
          {filteredData.length === 0 ? (
            <div className="col-span-2 text-center mt-24 text-gray-500 text-lg">
              아직 업로드된 작가 포트폴리오가 없습니다.
            </div>
          ) : (
            filteredData.map((data) => (
              <ProfileCard
                key={data.id}
                role={data.role}
                nickName={data.nickName}
                phoneNumber={data.phoneNumber}
                email={data.email}
                introduction={data.introduction}
                isMyProfile={false}
                isHorizontal
                className="w-110"
                onClick={() => handleArtistClick(data.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistNotePage;

import { Header } from "../components";
import BannerControl from "../components/Profile/BannerControl";
import ProfileCard from "../components/Profile/ProfileCard";
import { useNavigate } from "react-router-dom";

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
  },
  {
    id: "2",
    role: "작가",
    nickName: "닉네임",
    phoneNumber: "010-1234-5678",
    email: "test@test.com",
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: "3",
    role: "작가",
    nickName: "닉네임",
    phoneNumber: "010-1234-5678",
    email: "test@test.com",
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: "4",
    role: "작가",
    nickName: "닉네임",
    phoneNumber: "010-1234-5678",
    email: "test@test.com",
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: "5",
    role: "작가",
    nickName: "닉네임",
    phoneNumber: "010-1234-5678",
    email: "test@test.com",
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: "6",
    role: "작가",
    nickName: "닉네임",
    phoneNumber: "010-1234-5678",
    email: "test@test.com",
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: "7",
    role: "작가",
    nickName: "닉네임",
    phoneNumber: "010-1234-5678",
    email: "test@test.com",
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

const ArtistNotePage = () => {
  const navigate = useNavigate();

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BannerControl isMyProfile={false} />
      <div className="flex flex-col items-center py-10">
        <div className="mb-16">chip</div>
        <div className="grid grid-cols-2 gap-x-20">
          {mockData.map((data) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistNotePage;

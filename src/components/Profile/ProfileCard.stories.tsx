import type { Meta, StoryObj } from "@storybook/react-vite";
import ProfileCard from "./ProfileCard";

const meta: Meta<typeof ProfileCard> = {
  title: "Profile/ProfileCard",
  component: ProfileCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "사용자 프로필 정보를 표시하는 카드 컴포넌트입니다. 프로필 이미지, 역할, 닉네임, 팔로워/팔로잉 수, 소개, 개인정보, 연락처 정보를 포함합니다. 세로 모드와 가로 모드를 지원합니다.",
      },
    },
  },
  argTypes: {
    role: {
      description: "사용자의 역할/직업",
      control: { type: "text" },
    },
    nickName: {
      description: "사용자의 닉네임",
      control: { type: "text" },
    },
    image: {
      description: "프로필 이미지 URL",
      control: { type: "text" },
    },
    followers: {
      description: "팔로워 수",
      control: { type: "number" },
    },
    following: {
      description: "팔로잉 수",
      control: { type: "number" },
    },
    introduction: {
      description: "자기소개",
      control: { type: "text" },
    },
    birthdate: {
      description: "생년월일",
      control: { type: "text" },
    },
    education: {
      description: "학력 정보",
      control: { type: "text" },
    },
    phoneNumber: {
      description: "전화번호",
      control: { type: "text" },
    },
    email: {
      description: "이메일",
      control: { type: "text" },
    },
    className: {
      description: "추가 CSS 클래스",
      control: { type: "text" },
    },
    isHorizontal: {
      description: "가로 모드 여부",
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProfileCard>;

// 기본 스토리
export const Default: Story = {
  args: {
    role: "프로그래머",
    nickName: "홍길동",
    image: "",
    followers: 100,
    following: 50,
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    birthdate: "1990.01.01",
    education: "명지대학교 컴퓨터공학과 졸업",
    phoneNumber: "010.1234.5678",
    email: "hong@gmail.com",
  },
};

// 디자이너 프로필
export const Designer: Story = {
  args: {
    role: "UI/UX 디자이너",
    nickName: "김디자인",
    image: "https://via.placeholder.com/160x160/EC4899/FFFFFF?text=김디자인",
    followers: 250,
    following: 120,
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    birthdate: "1992.05.15",
    education: "명지대학교 디자인학과 졸업",
    phoneNumber: "010.9876.5432",
    email: "designer.kim@gmail.com",
  },
};

// 백엔드 개발자 프로필
export const BackendDeveloper: Story = {
  args: {
    role: "백엔드 개발자",
    nickName: "박서버",
    image: "https://via.placeholder.com/160x160/059669/FFFFFF?text=박서버",
    followers: 80,
    following: 30,
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    birthdate: "1988.12.20",
    education: "명지대학교 소프트웨어학과 졸업",
    phoneNumber: "010.5555.1234",
    email: "backend.park@gmail.com",
  },
};

// 데이터 사이언티스트 프로필
export const DataScientist: Story = {
  args: {
    role: "데이터 사이언티스트",
    nickName: "이데이터",
    image: "https://via.placeholder.com/160x160/DC2626/FFFFFF?text=이데이터",
    followers: 500,
    following: 200,
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    birthdate: "1995.08.10",
    education: "명지대학교 통계학과 졸업",
    phoneNumber: "010.7777.8888",
    email: "data.lee@gmail.com",
  },
};

// 높은 팔로워 수를 가진 인플루언서
export const HighFollowers: Story = {
  args: {
    role: "테크 인플루언서",
    nickName: "최인기",
    image: "https://via.placeholder.com/160x160/F59E0B/FFFFFF?text=최인기",
    followers: 10000,
    following: 500,
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    birthdate: "1993.03.25",
    education: "명지대학교 정보통신공학과 졸업",
    phoneNumber: "010.9999.0000",
    email: "influencer.choi@gmail.com",
  },
};

// 긴 소개글이 있는 프로필
export const LongIntroduction: Story = {
  args: {
    role: "풀스택 개발자",
    nickName: "정풀스택",
    image: "https://via.placeholder.com/160x160/7C3AED/FFFFFF?text=정풀스택",
    followers: 150,
    following: 75,
    introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    birthdate: "1991.07.08",
    education: "명지대학교 컴퓨터공학과 졸업",
    phoneNumber: "010.3333.4444",
    email: "fullstack.jung@gmail.com",
  },
};

// 최소한의 정보만 있는 프로필
export const Minimal: Story = {
  args: {
    role: "개발자",
    nickName: "미니멀",
    image: "https://via.placeholder.com/160x160/6B7280/FFFFFF?text=미니멀",
    followers: 0,
    following: 0,
    introduction: "안녕하세요",
    birthdate: "1990.01.01",
    education: "명지대학교 컴퓨터공학과 졸업",
    phoneNumber: "010.0000.0000",
    email: "minimal@example.com",
  },
};

// 가로 모드 스토리들
export const HorizontalDefault: Story = {
  args: {
    role: "프로그래머",
    nickName: "홍길동",
    image: "https://via.placeholder.com/64x64/3B82F6/FFFFFF?text=홍길동",
    followers: 100,
    following: 50,
    introduction:
      "안녕하세요! 프론트엔드 개발자입니다. React와 TypeScript를 주로 사용합니다.",
    birthdate: "1990.01.01",
    education: "명지대학교 컴퓨터공학과 졸업",
    phoneNumber: "010.1234.5678",
    email: "hong@gmail.com",
    isHorizontal: true,
  },
  parameters: {
    layout: "padded",
  },
};

export const HorizontalDesigner: Story = {
  args: {
    role: "UI/UX 디자이너",
    nickName: "김디자인",
    image: "https://via.placeholder.com/64x64/EC4899/FFFFFF?text=김디자인",
    followers: 250,
    following: 120,
    introduction:
      "사용자 경험을 중시하는 UI/UX 디자이너입니다. 피그마와 어도비 제품군을 활용합니다.",
    birthdate: "1992.05.15",
    education: "명지대학교 디자인학과 졸업",
    phoneNumber: "010.9876.5432",
    email: "designer.kim@gmail.com",
    isHorizontal: true,
  },
  parameters: {
    layout: "padded",
  },
};

export const HorizontalBackend: Story = {
  args: {
    role: "백엔드 개발자",
    nickName: "박서버",
    image: "https://via.placeholder.com/64x64/059669/FFFFFF?text=박서버",
    followers: 80,
    following: 30,
    introduction:
      "Node.js와 Python을 주로 사용하는 백엔드 개발자입니다. 데이터베이스 설계와 API 개발에 전문성을 가지고 있습니다.",
    birthdate: "1988.12.20",
    education: "명지대학교 소프트웨어학과 졸업",
    phoneNumber: "010.5555.1234",
    email: "backend.park@gmail.com",
    isHorizontal: true,
  },
  parameters: {
    layout: "padded",
  },
};

export const HorizontalDataScientist: Story = {
  args: {
    role: "데이터 사이언티스트",
    nickName: "이데이터",
    image: "https://via.placeholder.com/64x64/DC2626/FFFFFF?text=이데이터",
    followers: 500,
    following: 200,
    introduction:
      "머신러닝과 딥러닝을 활용한 데이터 분석 전문가입니다. Python과 R을 주로 사용합니다.",
    birthdate: "1995.08.10",
    education: "명지대학교 통계학과 졸업",
    phoneNumber: "010.7777.8888",
    email: "data.lee@gmail.com",
    isHorizontal: true,
  },
  parameters: {
    layout: "padded",
  },
};

export const HorizontalInfluencer: Story = {
  args: {
    role: "테크 인플루언서",
    nickName: "최인기",
    image: "https://via.placeholder.com/64x64/F59E0B/FFFFFF?text=최인기",
    followers: 10000,
    following: 500,
    introduction:
      "최신 기술 트렌드와 개발 팁을 공유하는 테크 인플루언서입니다. 다양한 IT 기술에 대한 인사이트를 제공합니다.",
    birthdate: "1993.03.25",
    education: "명지대학교 정보통신공학과 졸업",
    phoneNumber: "010.9999.0000",
    email: "influencer.choi@gmail.com",
    isHorizontal: true,
  },
  parameters: {
    layout: "padded",
  },
};

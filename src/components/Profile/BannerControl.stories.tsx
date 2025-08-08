import type { Meta, StoryObj } from "@storybook/react";
import BannerControl from "./BannerControl";

const meta: Meta<typeof BannerControl> = {
  title: "Components/BannerControl",
  component: BannerControl,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    isMyProfile: { control: "boolean" },
    initialBannerUrl: {
      control: "text",
      description: "초기 배너 이미지 URL (서버에서 불러오는 이미지)",
    },
  },
};

export default meta;

type Story = StoryObj<typeof BannerControl>;

// 1. 기본 상태 (내 프로필, 기본 배너)
export const MyProfileWithDefaultBanner: Story = {
  args: {
    isMyProfile: true,
    initialBannerUrl: undefined,
  },
};

// 2. 내 프로필 (내 배너가 있는 경우)
export const MyProfileWithCustomBanner: Story = {
  args: {
    isMyProfile: true,
    initialBannerUrl: "//",
  },
};

// 3. 다른 사람 프로필 (기본 배너)
export const OtherProfileWithDefaultBanner: Story = {
  args: {
    isMyProfile: false,
    initialBannerUrl: undefined,
  },
};

// 4. 다른 사람 프로필 (커스텀 배너가 있는 경우)
export const OtherProfileWithCustomBanner: Story = {
  args: {
    isMyProfile: false,
    initialBannerUrl: "//",
  },
};

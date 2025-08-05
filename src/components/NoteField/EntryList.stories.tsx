import type { Meta, StoryObj } from "@storybook/react";
import EntryList from "./EntryList";

const meta: Meta<typeof EntryList> = {
  title: "Components/EntryList",
  component: EntryList,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EntryList>;

// 기본 상태: 한 개 입력 칸이 있고, 추가 버튼 활성화
export const Default: Story = {
  args: {},
};

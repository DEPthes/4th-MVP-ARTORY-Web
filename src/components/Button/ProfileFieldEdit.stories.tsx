import type { Meta, StoryObj } from "@storybook/react";
import ProfileFieldEdit from "./ProfileFieldEdit";

const meta: Meta<typeof ProfileFieldEdit> = {
  title: "Components/ProfileFieldEdit",
  component: ProfileFieldEdit,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["edit", "register", "complete"],
    },
    onClick: { action: "clicked" },
    className: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof ProfileFieldEdit>;

// 편집 버튼 스토리
export const EditButton: Story = {
  args: {
    variant: "edit",
  },
};

// 등록 버튼 스토리
export const RegisterButton: Story = {
  args: {
    variant: "register",
  },
};

// 완료 버튼 스토리
export const CompleteButton: Story = {
  args: {
    variant: "complete",
  },
};

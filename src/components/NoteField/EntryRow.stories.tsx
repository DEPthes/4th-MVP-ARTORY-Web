import type { Meta, StoryObj } from "@storybook/react";
import EntryRow from "./EntryRow";

const meta: Meta<typeof EntryRow> = {
  title: "Components/EntryRow",
  component: EntryRow,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    year: {
      control: "select",
      options: Array.from({ length: 20 }, (_, i) => (2025 - i).toString()),
    },
    text: { control: "text" },
    isRegistered: { control: "boolean" },
    onYearChange: { action: "year changed" },
    onTextChange: { action: "text changed" },
    onRegister: { action: "register clicked" },
    onDelete: { action: "delete clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof EntryRow>;

// 기본 상태 (빈 입력)
export const Default: Story = {
  args: {
    year: "",
    text: "",
    isRegistered: false,
  },
};

// 등록된 상태
export const Registered: Story = {
  args: {
    year: "2023",
    text: "테스트",
    isRegistered: true,
  },
};

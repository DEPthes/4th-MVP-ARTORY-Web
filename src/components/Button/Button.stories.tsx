import Button from "./Button";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
    },
    size: {
      control: "select",
      options: ["sm", "base", "lg"],
    },
    disabled: {
      control: "boolean",
    },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 버튼
export const Default: Story = {
  args: {
    children: "버튼",
  },
};

// Primary 버튼
export const Primary: Story = {
  args: {
    children: "완료",
    variant: "primary",
    className: "w-96",
    size: "base",
    disabled: false,
  },
};

// Secondary 버튼
export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
    className: "w-96",
    size: "sm",
  },
};

// Disabled 버튼
export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
    className: "w-96",
    size: "base",
  },
};

// 크기별 버튼
export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
    className: "w-96",
    variant: "primary",
  },
};

export const Medium: Story = {
  args: {
    children: "Medium",
    size: "base",
    className: "w-96",
    variant: "secondary",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
    className: "w-96",
    variant: "tertiary",
  },
};

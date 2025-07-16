import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

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
      options: ["sm", "md", "lg"],
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
    children: "Primary",
    variant: "primary",
  },
};

// Secondary 버튼
export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

// Disabled 버튼
export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

// 크기별 버튼
export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    children: "Medium",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

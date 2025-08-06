import type { Meta, StoryObj } from "@storybook/react";
import UserActionButton from "./UserActionButton";

const meta: Meta<typeof UserActionButton> = {
  title: "Components/UserActionButton",
  component: UserActionButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    initialType: {
      control: "select",
      options: ["follow", "following", "edit"],
    },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FollowButton: Story = {
  args: {
    initialType: "follow",
  },
};

export const FollowingButton: Story = {
  args: {
    initialType: "following",
  },
};

export const EditProfileButton: Story = {
  args: {
    initialType: "edit",
  },
};

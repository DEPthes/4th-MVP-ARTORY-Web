import type { Meta, StoryObj } from "@storybook/react";
import BannerControl from "./BannerControl";

const meta: Meta<typeof BannerControl> = {
  title: "Components/BannerControl",
  component: BannerControl,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof BannerControl>;

export const Default: Story = {
  args: {},
};

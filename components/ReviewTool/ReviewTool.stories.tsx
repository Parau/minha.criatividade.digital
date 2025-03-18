import type { Meta, StoryObj } from '@storybook/react';
import { ReviewTool } from './ReviewTool';

const meta = {
  title: 'Components/ReviewTool',
  component: ReviewTool,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultTab: {
      control: 'select',
      options: ['first', 'second', 'third'],
      description: 'Default selected tab',
    },
  },
} satisfies Meta<typeof ReviewTool>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultTab: 'first',
  },
};

export const WithDifferentStyles: Story = {
  args: {
    defaultTab: 'second',
    variant: 'outline',
    radius: 'xl',
  },
};

export const Different: Story = {
  args: {
    defaultTab: 'third',
    color: 'blue',
    variant: 'pills',
  },
};

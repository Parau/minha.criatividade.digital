import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { AuthenticationForm } from './AuthenticationForm';
import { PaperProps } from '@mantine/core';

export default {
  title: 'Components/AuthenticationForm',
  component: AuthenticationForm,
} as Meta<PaperProps>;

type Story = StoryObj<PaperProps>;

export const Default: Story = {
  args: {
    radius: 'md',
    p: 'xl',
    withBorder: true,
  },
};


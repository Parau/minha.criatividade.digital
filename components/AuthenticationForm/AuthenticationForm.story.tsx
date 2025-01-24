import React from 'react';
import { Meta, Story } from '@storybook/react';
import { AuthenticationForm } from './AuthenticationForm';
import { PaperProps } from '@mantine/core';

export default {
  title: 'Components/AuthenticationForm',
  component: AuthenticationForm,
} as Meta;

const Template: Story<PaperProps> = (args) => <AuthenticationForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  radius: 'md',
  p: 'xl',
  withBorder: true,
};


import React, { useState } from 'react';
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { GoogleButton } from './GoogleButton';
import { MicrosoftButton } from './MicrosoftButton';
import { EmailButton } from './EmailButton';

export interface AuthenticationFormProps extends PaperProps {
  handleLogin: (type: 'Google' | 'Microsoft' | 'Email', email?: string) => void;
}

export function AuthenticationForm({ handleLogin, ...props }: AuthenticationFormProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleGoogleClick = () => {
    handleLogin('Google');
  };

  const handleMicrosoftClick = () => {
    handleLogin('Microsoft');
  };

  const handleEmailClick = () => {
    if (!/^\S+@\S+$/.test(email)) {
      setEmailError('Digite um email válido.');
      return;
    }
    setEmailError('');
    console.log(`Função handleEmailClick acionada para ${email}`);
    handleLogin('Email', email);
  };

  return (
    <Paper radius="md" p="xl" withBorder style={{ maxWidth: 400, margin: 'auto' }} {...props}>
      <Text size="lg" fw={500}>
        Bem-vindo a sua CRIATIVIDADE.digital. Primeiro, faça o seu login:
      </Text>

      <Stack mb="md" mt="md">
        <GoogleButton radius="xl" onClick={handleGoogleClick}>Google</GoogleButton>
        <MicrosoftButton radius="xl" onClick={handleMicrosoftClick}>Microsoft</MicrosoftButton>
      </Stack>

      <Divider label='Se a sua autenticação for do tipo "email link"' labelPosition="center" my="lg" />

      <Stack>
        <TextInput
          label="Email"
          placeholder="hello@seu-email.com"
          radius="md"
          error={emailError}
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        <EmailButton radius="xl" onClick={handleEmailClick}>Login com email</EmailButton>
      </Stack>
    </Paper>
  );
}
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useAuthContext } from '../context/AuthContext';
import { AuthenticationForm } from '@/components/AuthenticationForm/AuthenticationForm';  

export function LoginPage()  {
  const router = useRouter();
  const { login, user } = useAuthContext();

  const handleLogin = async (type: 'Google' | 'Microsoft' | 'Email', email?: string) => {
    try {
      console.log(`Função handleLogin acionada para ${type}`);
      if (type === 'Email' && email) {
        await login(type, email);
      } else {
        await login(type);
        router.push('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <AuthenticationForm handleLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;

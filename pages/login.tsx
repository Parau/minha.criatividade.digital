import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useAuthContext } from '../context/AuthContext';

export function LoginPage()  {
  const router = useRouter();
  const { login, user } = useAuthContext();
  const loginWithGoogle = async () => {
    try {
      console.log("Função loginWithGoogle acionada");
      await login();
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={loginWithGoogle}>Login with google</button>
      user: {user?.email}
    </div>
  );
};

export default LoginPage;

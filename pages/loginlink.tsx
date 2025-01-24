import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { showNotification } from '@mantine/notifications';
import firebaseApp from '../firebase';

const LoginLinkPage = () => {
  const router = useRouter();
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const email = window.localStorage.getItem('emailForSignIn');
    if (isSignInWithEmailLink(auth, window.location.href) && email) {
      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          window.localStorage.removeItem('emailForSignIn');
          showNotification({
            title: 'Login bem-sucedido',
            message: 'Você foi autenticado com sucesso.',
            color: 'green',
          });
          router.push('/');
        })
        .catch((error) => {
          console.error('Error signing in with email link', error);
          showNotification({
            title: 'Erro de login',
            message: 'Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.',
            color: 'red',
          });
        });
    }
  }, [auth, router]);

  return <div>Verificando link de login...</div>;
};

export default LoginLinkPage;

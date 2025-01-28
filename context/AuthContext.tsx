// AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  User as FirebaseUser
} from 'firebase/auth';
import { firebaseApp } from '../firebase'; // Import firebaseApp
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';

// Types and Interfaces
interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  firebaseUser: FirebaseUser | null; // Adicionar firebaseUser ao contexto
  login: (provider: 'Google' | 'Microsoft' | 'Email', email?: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

// Create Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
  </div>
);

// Initialize Firebase Auth
const auth = getAuth(firebaseApp); // Use firebaseApp

// Create Context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null, // Adicionar valor padrão
  login: async () => {},
  logout: async () => {},
  error: null
});

// Custom hook for using auth context
export const useAuthContext = () => useContext(AuthContext);

// Auth Context Provider Component
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null); // Adicionar estado para firebaseUser
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      console.log('onAuthStateChanged');
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
        setFirebaseUser(firebaseUser); // Definir firebaseUser
      } else {
        setUser(null);
        setFirebaseUser(null); // Limpar firebaseUser
      }
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  const login = async (provider: 'Google' | 'Microsoft' | 'Email', email?: string) => {
    console.log(`Função login acionada para ${provider}`);
    try {
      setError(null);
      switch (provider) {
        case 'Google':
          await signInWithPopup(auth, new GoogleAuthProvider());
          break;
        case 'Microsoft':
          const microsoftProvider = new OAuthProvider('microsoft.com');
          await signInWithPopup(auth, microsoftProvider);
          break;
        case 'Email':
          console.log('Email:', email);
          if (!email) throw new Error('Email is required for email link login');
          const actionCodeSettings = {
            url: `${window.location.origin}/loginlink`,
            handleCodeInApp: true,
          };
          await sendSignInLinkToEmail(auth, email, actionCodeSettings);
          window.localStorage.setItem('emailForSignIn', email);
          showNotification({
            title: 'Link de login enviado',
            message: `Um link de login foi enviado para ${email}. Verifique sua caixa de entrada.`,
            color: 'green',
          });
          break;
        default:
          throw new Error('Provider não suportado');
      }
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        switch (error.code) {
          case 'auth/network-request-failed':
            showNotification({
              title: 'Problema de conexão',
              message: 'Por favor, verifique sua internet e tente novamente.',
              color: 'red',
            });
            break;
          case 'auth/admin-restricted-operation':
            showNotification({
              title: 'Acesso restrito',
              message: 'Nenhuma licença do CRIATIVIDADE.digital foi encontrada para este e-mail.',
              color: 'red',
            });
            break;
          case 'auth/popup-blocked':
            showNotification({
              title: 'Janela de login bloqueada',
              message: 'O navegador bloqueou a janela de login. Por favor, ajuste as configurações do navegador para permitir a abertura de janelas pop-up para fazer o login.',
              color: 'red',
            });
            break;
          default:
            console.error(error.message);
        }
      } else {
        console.error('An unknown error occurred during login');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'An error occurred during logout');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, login, logout, error }}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};
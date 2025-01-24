import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser
} from 'firebase/auth';
import firebaseApp from '../firebase';

// Types and Interfaces
interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  login: () => Promise<void>;
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
const auth = getAuth(firebaseApp);

// Create Context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  error: null
});

// Custom hook for using auth context
export const useAuthContext = () => useContext(AuthContext);

// Auth Context Provider Component
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    console.log("Função login acionada");
    try {
      setError(null);
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during login');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during logout');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};
import  { createContext, useState, useEffect, useContext } from 'react';
import type {ReactNode} from "react"
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserFromToken = async () => {
      if (token) {
        localStorage.setItem('authToken', token);
        try {
            // Here you would typically have a /me endpoint to get user data
            // For now, we can decode the token or fetch user data after another action
            // Let's assume login function will handle setting the user
            setIsLoading(false); // Assume token is valid until an API call fails
        } catch (error) {
          logout();
        }
      } else {
        setIsLoading(false);
      }
    };
    loadUserFromToken();
  }, [token]);

  const login = async (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    // You can add a call here to a '/users/me' endpoint to fetch and set user data
    // For simplicity, we'll navigate and let the dashboard fetch what it needs.
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
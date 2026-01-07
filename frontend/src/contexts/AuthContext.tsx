import { createContext, useContext, type ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '@/lib/api/auth';
import type { User, LoginRequest, RegisterRequest } from '@/types';

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Query to get current user
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      try {
        return await getCurrentUser();
      } catch (error: any) {
        // If 401, just return null (user not authenticated)
        if (error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(['auth', 'user'], data.user);
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(['auth', 'user'], data.user);
      }
    },
  });

  const login = async (data: LoginRequest) => {
    const result = await loginMutation.mutateAsync(data);
    if (!result.success) {
      throw new Error(result.error || 'Login failed');
    }
  };

  const register = async (data: RegisterRequest) => {
    const result = await registerMutation.mutateAsync(data);
    if (!result.success) {
      throw new Error(result.error || 'Registration failed');
    }
  };

  const logout = () => {
    logoutUser();
    queryClient.setQueryData(['auth', 'user'], null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

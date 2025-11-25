import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

interface UserData {
  id: string;
  username: string;
  fullName: string;
  phone: string;
  email: string;
  position?: string;
  height?: number;
  weight?: number;
  age?: number;
  guvenilirlikPuani: number;
  profilePicture?: string;
}

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserData | null) => void;
  clearUser: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [cachedUser, setCachedUser] = useState<UserData | null>(() => {
    const stored = localStorage.getItem("hali_saha_user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isManuallyAuthenticated, setIsManuallyAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("hali_saha_user") !== null;
  });

  const { data: authStatus, isLoading: isAuthLoading } = useQuery<{ authenticated: boolean; user?: UserData }>({
    queryKey: ['/api/auth/durum'],
    staleTime: 0,
    gcTime: 0,
  });

  const { data: profileData, isLoading: isProfileLoading } = useQuery<UserData>({
    queryKey: ['/api/profil'],
    enabled: authStatus?.authenticated === true || isManuallyAuthenticated,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (profileData) {
      setCachedUser(profileData);
      localStorage.setItem("hali_saha_user", JSON.stringify(profileData));
      setIsManuallyAuthenticated(true);
    }
  }, [profileData]);

  useEffect(() => {
    if (authStatus?.authenticated === false && !isManuallyAuthenticated) {
      setCachedUser(null);
      localStorage.removeItem("hali_saha_user");
    }
  }, [authStatus, isManuallyAuthenticated]);

  useEffect(() => {
    if (!isProfileLoading && authStatus?.authenticated === true && !profileData && cachedUser) {
      setCachedUser(null);
      localStorage.removeItem("hali_saha_user");
      setIsManuallyAuthenticated(false);
    }
  }, [isProfileLoading, authStatus, profileData, cachedUser]);

  const setUser = useCallback((user: UserData | null) => {
    setCachedUser(user);
    if (user) {
      localStorage.setItem("hali_saha_user", JSON.stringify(user));
      setIsManuallyAuthenticated(true);
    } else {
      localStorage.removeItem("hali_saha_user");
      setIsManuallyAuthenticated(false);
    }
  }, []);

  const clearUser = useCallback(() => {
    setCachedUser(null);
    localStorage.removeItem("hali_saha_user");
    setIsManuallyAuthenticated(false);
  }, []);

  const refreshAuth = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['/api/auth/durum'] });
    await queryClient.invalidateQueries({ queryKey: ['/api/profil'] });
    await queryClient.refetchQueries({ queryKey: ['/api/auth/durum'] });
  }, []);

  const user = cachedUser || profileData || null;
  const isAuthenticated = !!user || authStatus?.authenticated === true || isManuallyAuthenticated;
  const isLoading = !cachedUser && !isManuallyAuthenticated && (isAuthLoading || (authStatus?.authenticated === true && isProfileLoading));

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, setUser, clearUser, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

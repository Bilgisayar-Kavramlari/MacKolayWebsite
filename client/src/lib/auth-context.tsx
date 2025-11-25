import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

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

  const { data: authStatus, isLoading: isAuthLoading } = useQuery<{ authenticated: boolean; user?: UserData }>({
    queryKey: ['/api/auth/durum'],
  });

  const { data: profileData, isLoading: isProfileLoading } = useQuery<UserData>({
    queryKey: ['/api/profil'],
    enabled: authStatus?.authenticated === true,
  });

  useEffect(() => {
    if (profileData) {
      setCachedUser(profileData);
      localStorage.setItem("hali_saha_user", JSON.stringify(profileData));
    }
  }, [profileData]);

  useEffect(() => {
    // Clear cached data immediately when server reports user is not authenticated
    if (authStatus?.authenticated === false) {
      setCachedUser(null);
      localStorage.removeItem("hali_saha_user");
    }
  }, [authStatus]);

  // Handle profile fetch errors - clear cached data on 401
  useEffect(() => {
    if (!isProfileLoading && authStatus?.authenticated === true && !profileData && cachedUser) {
      // Profile fetch failed while auth claims authenticated - likely stale session
      // Clear cached data to force re-login
      setCachedUser(null);
      localStorage.removeItem("hali_saha_user");
    }
  }, [isProfileLoading, authStatus, profileData, cachedUser]);

  const setUser = (user: UserData | null) => {
    setCachedUser(user);
    if (user) {
      localStorage.setItem("hali_saha_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("hali_saha_user");
    }
  };

  const clearUser = () => {
    setCachedUser(null);
    localStorage.removeItem("hali_saha_user");
  };

  const user = cachedUser || profileData || null;
  const isAuthenticated = !!user || authStatus?.authenticated === true;
  // Don't show loading if we have cached user data - render instantly
  const isLoading = !cachedUser && (isAuthLoading || (authStatus?.authenticated === true && isProfileLoading));

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, setUser, clearUser }}>
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

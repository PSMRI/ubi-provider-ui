import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { handleLogout } from "../utils/apiClient";

interface AuthContextType {
  userRole: string | null;
  setUserRole: (role: string) => void;
  isSuperAdmin: boolean;
  logout: (reason?: 'expired' | 'unauthorized' | 'manual') => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) {
      setUserRole(role);
    }
  }, []);

  const isSuperAdmin = userRole === "Super Admin";
  const isAuthenticated = !!localStorage.getItem("token");

  // Centralized logout function that updates context and handles cleanup
  const logout = (reason: 'expired' | 'unauthorized' | 'manual' = 'manual') => {
    console.log(`Logout initiated: ${reason}`);
    
    // Update context state
    setUserRole(null);
    
    if (reason === 'manual') {
      // For manual logout, use handleLogout without showing expiry message
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      window.dispatchEvent(new Event("tokenChanged"));
      window.location.href = "/";
    } else {
      // For expired/unauthorized, let handleLogout show the message
      handleLogout();
    }
  };

  const authContextValue = useMemo(
    () => ({
      userRole,
      setUserRole,
      isSuperAdmin,
      logout,
      isAuthenticated,
    }),
    [userRole, isSuperAdmin, isAuthenticated]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

interface User {
  firstname?: string;
  lastname?: string;
  email?: string;
  s_roles?: string[];
}

interface AuthContextType {
  userRole: string | null;
  setUserRole: (role: string) => void;
  isSuperAdmin: boolean;
  logout: (reason?: 'expired' | 'unauthorized' | 'manual') => void;
  isAuthenticated: boolean;
  getUserDisplayName: () => string;
  getUserOrganization: () => string;
  setUser: (user: User | null) => void;
 user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const safeUserData = localStorage.getItem("safeUserData");
    
    if (role) {
      setUserRole(role);
    }
    
    if (safeUserData) {
      try {
        const parsedUserData = JSON.parse(safeUserData);
        setUser(parsedUserData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const isSuperAdmin = userRole === "Super Admin";
  const isAuthenticated = !!localStorage.getItem("token");

  // Centralized logout function that updates context and handles cleanup
  const logout = useCallback((reason: 'expired' | 'unauthorized' | 'manual' = 'manual') => {
    console.log(`Logout initiated: ${reason}`);
    
    // Update context state
    setUserRole(null);
    setUser(null);
    
    // Clear storage and redirect for all logout scenarios
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("safeUserData");
    window.dispatchEvent(new Event("tokenChanged"));
    window.location.href = "/";
  }, []);

  // Simple functions for user profile display (required by Header)
  const getUserDisplayName = () => {
    if (!user) return "User";

    // Try to build name from firstname and lastname
    const fullName = `${user.firstname || ""} ${user.lastname || ""}`.trim();
    if (fullName) return fullName;

    // Fallback to email username part
    if (user.email) {
      const emailUsername = user.email.split('@')[0];
      return emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);
    }

    // Final fallback
    return "User";
  };

  const getUserOrganization = () => {
    return user?.s_roles?.[0] || userRole || "";
  };

  // Make logout available globally for API interceptor
  useEffect(() => {
    (window as any).authLogout = logout;
    return () => {
      delete (window as any).authLogout;
    };
  }, [logout]);

  const authContextValue = useMemo(
    () => ({
      userRole,
      setUserRole,
      isSuperAdmin,
      logout,
      isAuthenticated,
      getUserDisplayName,
      getUserOrganization,
      setUser,
      user,
    }),
    [userRole, isSuperAdmin, isAuthenticated, user]
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

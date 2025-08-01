import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

interface User {
  id: number;
  firstname?: string;
  lastname?: string
  email?: string;
  s_roles: string[];
}

// Safe user data that can be persisted in localStorage (non-sensitive)
interface SafeUserData {
  id: number;
  s_roles: string[];
}

interface AuthContextType {
  userRole: string | null;
  setUserRole: (role: string) => void;
  isSuperAdmin: boolean;
  user: User | null;
  setUser: (user: User) => void;
  setSafeUser: (safeData: SafeUserData) => void;
  getUserDisplayName: () => string;
  getUserOrganization: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Function to set user from safe data (from localStorage)
  const setSafeUser = (safeData: SafeUserData) => {
    const safeUser: User = {
      id: safeData.id,
      s_roles: safeData.s_roles,
      // firstname, lastname, email will be undefined
    };
    setUser(safeUser);
  };

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const safeUserData = localStorage.getItem("safeUserData");
    
    if (role) {
      setUserRole(role);
    }
    
    if (safeUserData) {
      try {
        const parsedSafeData: SafeUserData = JSON.parse(safeUserData);
        setSafeUser(parsedSafeData);
      } catch (error) {
        console.error("Error parsing safe user data:", error);
      }
    }
  }, []);

  const isSuperAdmin = userRole === "Super Admin";

  const getUserDisplayName = () => {
    if (!user) return "";
    if (!user.firstname && !user.lastname) {
      return "User"; // Fallback when personal info is not available
    }
    return `${user.firstname || ""} ${user.lastname || ""}`.trim();
  };

  const getUserOrganization = () => {
    return user?.s_roles?.[0] || "";
  };

  const authContextValue = useMemo(
    () => ({
      userRole,
      setUserRole,
      isSuperAdmin,
      user,
      setUser,
      setSafeUser,
      getUserDisplayName,
      getUserOrganization,
    }),
    [userRole, isSuperAdmin, user] // only re-compute if these change
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

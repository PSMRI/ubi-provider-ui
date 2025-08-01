import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
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
  getUserDisplayName: () => string;
  getUserOrganization: () => string;
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
        const parsedSafeData: SafeUserData = JSON.parse(safeUserData);
        // Create a partial user object with only the safe data
        const partialUser: Partial<User> = {
          id: parsedSafeData.id,
          s_roles: parsedSafeData.s_roles,
          // Other fields (firstname, lastname, email) will be undefined
          // but the app should handle this gracefully
        };
        setUser(partialUser as User);
      } catch (error) {
        console.error("Error parsing safe user data:", error);
      }
    }
  }, []);

  const isSuperAdmin = userRole === "Super Admin";

  const getUserDisplayName = () => {
    if (!user?.firstname && !user?.lastname) {
      return "User"; // Fallback when personal info is not available
    }
    return user ? `${user.firstname || ""} ${user.lastname || ""}`.trim() : "";
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

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
    const userData = localStorage.getItem("userData");
    
    if (role) {
      setUserRole(role);
    }
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const isSuperAdmin = userRole === "Super Admin";

  const getUserDisplayName = () => {
    return user ? `${user.firstname} ${user.lastname}`.trim() : "";
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

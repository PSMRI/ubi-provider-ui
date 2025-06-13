import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  userRole: string | null;
  setUserRole: (role: string) => void;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Get user role from localStorage on initial load
    const role = localStorage.getItem('userRole');
    if (role) {
      setUserRole(role);
    }
  }, []);

  // Check if the role is "Super Admin"
  const isSuperAdmin = userRole === 'Super Admin';

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
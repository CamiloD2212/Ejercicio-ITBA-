import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kanban-user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Sesión por defecto para comodidad en el entorno de desarrollo y pruebas
    return {
      name: 'Dev Operator',
      email: 'dev@itba.edu.ar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    };
  });

  const login = (email, password) => {
    const dummyUser = {
      name: email.split('@')[0] || 'Usuario Dev',
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    };
    setUser(dummyUser);
    localStorage.setItem('kanban-user', JSON.stringify(dummyUser));
    return dummyUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kanban-user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}

export default useAuth;

'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin, verifyToken } from '@/lib/api';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      verifyToken()
        .then(() => setAdmin({ token }))
        .catch(() => { localStorage.removeItem('admin_token'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await loginAdmin({ email, password });
    localStorage.setItem('admin_token', data.token);
    setAdmin({ token: data.token, ...data.admin });
    router.push('/admin');
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setAdmin(null);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

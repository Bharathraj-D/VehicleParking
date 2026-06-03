import { createContext, useContext, useEffect, useState } from 'react';
import { ApiClient } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const profile = JSON.parse(localStorage.getItem('profile') || '{}');
      setProfile(profile);
      setUser({ email: profile.email });
    }
    setLoading(false);
  }, []);

  async function signIn(email, password) {
    const { token, user: userData } = await ApiClient.post('/auth/login', { email, password });
    ApiClient.setToken(token);
    localStorage.setItem('profile', JSON.stringify(userData));
    setUser(userData);
    setProfile(userData);
    return { user: userData, profile: userData };
  }

  async function signUp(email, password, meta) {
    const { token, user: userData } = await ApiClient.post('/auth/register', {
      email,
      password,
      fullName: meta.full_name,
      phone: meta.phone,
    });
    ApiClient.setToken(token);
    localStorage.setItem('profile', JSON.stringify(userData));
    setUser(userData);
    setProfile(userData);
    return { user: userData, profile: userData };
  }

  async function signOut() {
    ApiClient.setToken(null);
    localStorage.removeItem('profile');
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

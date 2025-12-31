import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as loginApi, getProfile } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await getProfile();
          console.log("userData?.data", userData?.data)
          setUser(userData?.data);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const userData = await loginApi(email, password);
      if (userData?.data?.access_token) {
        localStorage.setItem('token', userData?.data?.access_token);
        const profileData = await getProfile();
        setUser(profileData?.data);
        return userData;
      }
      return userData;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// src/context/AuthContext.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContextInstance'; // Import it here

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/users/me');
        if (res?.data?.user) {
          setUser(res.data.user);
        } else {
          const stored = localStorage.getItem('user');
          setUser(stored ? JSON.parse(stored) : { loggedIn: true });
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = (token, userData = null) => {
    localStorage.setItem('token', token);
    if (userData) localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData || { loggedIn: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

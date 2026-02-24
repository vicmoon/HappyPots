// src/context/useAuth.js
import { useContext } from 'react';
import { AuthContext } from './AuthContextInstance'; // Point to the new file

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

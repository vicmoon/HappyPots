// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../services/api';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- use the context
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const response = await api.post('/users/login', formData);

      // Accept either { token } or { token, user }
      const token = response.data?.token;
      const user = response.data?.user ?? null;

      if (!token) {
        setError('Login succeeded but no token returned. Contact admin.');
        setIsLoading(false);
        return;
      }

      // Use context to persist token and update global auth state
      login(token, user);

      setSuccessMsg('Login successful — redirecting...');
      // short delay so user sees the feedback
      setTimeout(() => navigate('/my-garden'), 600);
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (err?.response
          ? `Login failed (${err.response.status})`
          : 'Network error. Try again.');
      setError(message);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>

        {error && <div className="error-message">{error}</div>}
        {successMsg && <div className="success-message">{successMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

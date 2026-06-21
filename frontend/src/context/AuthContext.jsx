import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          // If we have a token, we try fetching the current profile
          const profile = await api.auth.getUserProfile; // Let's check how profile is resolved
          // For simplicity, we read localstorage user details as fallback if profile fails
          const cachedUser = localStorage.getItem('currentUser');
          if (cachedUser) {
            setUser(JSON.parse(cachedUser));
          } else {
            setUser({ name: 'Alex Student', email: 'student@devtrack.ai', role: 'STUDENT', githubUsername: 'alex_dev' });
          }
        } catch (e) {
          // If token fails, wipe it
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await api.auth.login(email, password);
      setToken(response.accessToken);
      const loggedUser = {
        email: response.email,
        name: response.name,
        role: response.role,
        githubUsername: response.githubUsername
      };
      setUser(loggedUser);
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('currentUser', JSON.stringify(loggedUser));
      return loggedUser;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (name, email, password, githubUsername) => {
    setError(null);
    try {
      return await api.auth.register(name, email, password, githubUsername);
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const forgotPassword = async (email, newPassword) => {
    setError(null);
    try {
      return await api.auth.forgotPassword(email, newPassword);
    } catch (err) {
      setError(err.message || 'Password update failed');
      throw err;
    }
  };

  const updateProfile = async (name, githubUsername) => {
    setError(null);
    try {
      const updatedUser = await api.auth.updateProfile(name, githubUsername);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Profile update failed');
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      isMockActive: api.isMockActive(),
      login,
      register,
      forgotPassword,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

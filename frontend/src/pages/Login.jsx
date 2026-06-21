import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillCredentials = (type) => {
    if (type === 'student') {
      setEmail('student@devtrack.ai');
      setPassword('password');
    } else {
      setEmail('admin@devtrack.ai');
      setPassword('password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 dark:bg-dark-bg dark:text-gray-100 px-4 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-8 rounded-3xl shadow-xl">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
            DevTrack AI
          </Link>
          <p className="text-sm text-gray-400 mt-2">Sign in to track your coding goals</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-sm flex items-center space-x-2">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 dark:bg-dark-bg dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-purple transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase">Password</label>
              <Link to="/forgot-password" className="text-xs text-brand-blue dark:text-brand-lightBlue hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 dark:bg-dark-bg dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-purple transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-semibold rounded-xl hover:opacity-90 transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/10"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn size={18} />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Section */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-border/50 text-center">
          <p className="text-xs text-gray-400 mb-3">Quick Login (Demo Accounts):</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => fillCredentials('student')}
              className="py-2 px-3 text-xs bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-border/80 rounded-lg transition"
            >
              👩‍🎓 Student Demo
            </button>
            <button
              onClick={() => fillCredentials('admin')}
              className="py-2 px-3 text-xs bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-border/80 rounded-lg transition"
            >
              🛠️ Admin Demo
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-blue dark:text-brand-lightBlue hover:underline font-medium">
            Register free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  User, 
  Lock, 
  Sliders, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';

const SettingsPage = () => {
  const { user, updateProfile, forgotPassword } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Profile Form States
  const [name, setName] = useState(user ? user.name : '');
  const [githubUsername, setGithubUsername] = useState(user ? (user.githubUsername || '') : '');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password Form States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdErr, setPwdErr] = useState('');
  const [updatingPwd, setUpdatingPwd] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileMsg('');
    setProfileErr('');
    try {
      await updateProfile(name, githubUsername);
      setProfileMsg('Profile updated successfully.');
    } catch (err) {
      setProfileErr(err.message || 'Failed to update profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdErr('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPwdErr('Password must be at least 6 characters.');
      return;
    }

    setUpdatingPwd(true);
    setPwdMsg('');
    setPwdErr('');
    try {
      await forgotPassword(user.email, newPassword);
      setPwdMsg('Password updated successfully.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwdErr(err.message || 'Failed to change password.');
    } finally {
      setUpdatingPwd(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black tracking-tight">System Settings</h1>
        <p className="text-gray-400 mt-1">Configure profile mappings and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Management Card */}
        <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl lg:col-span-2 space-y-6">
          <h3 className="font-bold border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-4 flex items-center">
            <User className="mr-2 text-brand-blue" size={18} />
            <span>Profile Management</span>
          </h3>

          {profileMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-sm flex items-center space-x-2">
              <CheckCircle2 size={16} />
              <span>{profileMsg}</span>
            </div>
          )}

          {profileErr && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-sm flex items-center space-x-2">
              <AlertCircle size={16} />
              <span>{profileErr}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Registered Email</label>
              <input
                type="email"
                value={user ? user.email : ''}
                disabled
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 dark:bg-dark-bg dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">GitHub Username</label>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 dark:bg-dark-bg dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <button
              type="submit"
              disabled={updatingProfile}
              className="px-6 py-2.5 bg-brand-blue text-white font-semibold rounded-xl hover:opacity-90 flex items-center space-x-2 transition shadow-sm text-sm"
            >
              <Save size={16} />
              <span>{updatingProfile ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </form>
        </div>

        {/* Configurations preferences Sidebar */}
        <div className="space-y-8">
          
          {/* Preferences layout */}
          <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl">
            <h3 className="font-bold border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-4 flex items-center">
              <Sliders className="mr-2 text-brand-purple" size={18} />
              <span>Preferences</span>
            </h3>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Layout Theme</span>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-dark-bg dark:hover:bg-dark-border/70 border border-gray-200 dark:border-dark-border rounded-xl flex items-center space-x-2 text-xs font-semibold transition"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun size={14} className="text-amber-500" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={14} className="text-brand-purple" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Credentials reset password */}
          <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl space-y-4">
            <h3 className="font-bold border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-2 flex items-center">
              <Lock className="mr-2 text-red-500" size={18} />
              <span>Security</span>
            </h3>

            {pwdMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-sm flex items-center space-x-2">
                <CheckCircle2 size={16} />
                <span>{pwdMsg}</span>
              </div>
            )}

            {pwdErr && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-sm flex items-center space-x-2">
                <AlertCircle size={16} />
                <span>{pwdErr}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 dark:bg-dark-bg dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 dark:bg-dark-bg dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={updatingPwd}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition text-xs shadow-sm"
              >
                {updatingPwd ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Github,
  Code2,
  Trello,
  FileSearch,
  BrainCircuit,
  Milestone,
  Settings,
  Shield,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout, isMockActive } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'GitHub Analytics', path: '/github', icon: Github },
    { name: 'Coding Tracker', path: '/coding', icon: Code2 },
    { name: 'Placement Tracker', path: '/placement', icon: Trello },
    { name: 'Resume Analyzer', path: '/resume', icon: FileSearch },
    { name: 'AI Skill Gap', path: '/skill-gap', icon: BrainCircuit },
    { name: 'AI Roadmap', path: '/roadmap', icon: Milestone },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  // If Admin, inject admin panel option
  if (user && user.role === 'ADMIN') {
    navItems.splice(navItems.length - 1, 0, { name: 'Admin Panel', path: '/admin', icon: Shield });
  }

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 transition-colors duration-200 dark:bg-dark-bg dark:text-gray-100">
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200 dark:border-dark-border">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
              DevTrack AI
            </span>
          </Link>
          <button className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-150 ${isActive 
                  ? 'bg-gradient-to-r from-brand-blue to-brand-purple text-white shadow-md shadow-blue-500/10' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-bg hover:text-gray-900 dark:hover:text-gray-200'}`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-150 mt-4"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header bar */}
        <header className="h-20 flex items-center justify-between px-6 border-b border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card transition-colors duration-200">
          <div className="flex items-center space-x-4">
            <button className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            
            {isMockActive && (
              <span className="px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-full flex items-center">
                <span className="w-1.5 h-1.5 mr-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                Demo Sandbox Mode
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Dark/Light mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notification alert bell */}
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-purple rounded-full"></span>
            </button>

            {/* User Profile display widget */}
            <div className="flex items-center space-x-3 pl-2 border-l border-gray-200 dark:border-dark-border">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-between text-white font-bold text-sm justify-center shadow-inner">
                {user ? user.name.split(' ').map(n=>n[0]).join('') : 'U'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold leading-tight">{user ? user.name : 'Guest User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight capitalize">{user ? user.role.toLowerCase() : ''}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content body container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

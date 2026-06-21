import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Github, 
  RefreshCw, 
  GitBranch, 
  Users, 
  Star, 
  AlertCircle,
  GitCommit,
  CheckCircle2
} from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GitHubAnalytics = () => {
  const { user, updateProfile } = useAuth();
  const [stats, setStats] = useState(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.githubUsername) {
      setUsernameInput(user.githubUsername);
      fetchGitHubStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchGitHubStats = async () => {
    try {
      const gitStats = await api.github.syncProfile(user.githubUsername);
      setStats(gitStats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!usernameInput) {
      setError('Please input a username');
      return;
    }
    setSyncing(true);
    setError('');
    setMessage('');
    try {
      // Update profile username
      await updateProfile(user.name, usernameInput);
      const updatedStats = await api.github.syncProfile(usernameInput);
      setStats(updatedStats);
      setMessage('GitHub profile connected and synced successfully.');
    } catch (err) {
      setError(err.message || 'Sync failed.');
    } finally {
      setSyncing(false);
    }
  };

  const handleSync = async () => {
    if (!user.githubUsername) return;
    setSyncing(true);
    setError('');
    setMessage('');
    try {
      const updatedStats = await api.github.syncProfile(user.githubUsername);
      setStats(updatedStats);
      setMessage('GitHub contributions refreshed successfully.');
    } catch (err) {
      setError(err.message || 'Sync failed.');
    } finally {
      setSyncing(false);
    }
  };

  // Generate GitHub-style mock contribution grid dates (last 52 weeks x 7 days)
  const generateMockContributions = () => {
    const cells = [];
    const seed = stats ? stats.commits : 120;
    for (let i = 0; i < 365; i++) {
      // pseudo-random count representing green shades
      const val = (i * seed) % 5;
      let colorClass = 'bg-gray-100 dark:bg-dark-border';
      if (val === 1) colorClass = 'bg-green-200 dark:bg-green-900/40';
      if (val === 2) colorClass = 'bg-green-300 dark:bg-green-800/60';
      if (val === 3) colorClass = 'bg-green-400 dark:bg-green-700/80';
      if (val === 4) colorClass = 'bg-green-500';
      cells.push(colorClass);
    }
    return cells;
  };

  const mockContribCells = generateMockContributions();

  const languageData = {
    labels: ['Java', 'JavaScript', 'HTML/CSS', 'Python', 'Shell'],
    datasets: [
      {
        data: [45, 30, 15, 7, 3],
        backgroundColor: ['#b07219', '#f1e05a', '#e34c26', '#3572A5', '#89e051'],
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black tracking-tight">GitHub Analytics</h1>
        <p className="text-gray-400 mt-1">Audit coding consistency and commit frequencies.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-sm flex items-center space-x-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-sm flex items-center space-x-2">
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {/* Connection Card if no username connected */}
      {!user?.githubUsername ? (
        <div className="p-8 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl text-center max-w-xl mx-auto">
          <div className="w-16 h-16 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Github size={32} />
          </div>
          <h3 className="text-xl font-bold">Connect GitHub Profile</h3>
          <p className="text-sm text-gray-400 mt-2 mb-6">
            Track daily contributions and analyze language metrics by connecting your public profile username.
          </p>
          <form onSubmit={handleConnect} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Enter GitHub username (e.g. torvalds)"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full sm:flex-1 px-4 py-3 bg-gray-50 border border-gray-200 dark:bg-dark-bg dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
              required
            />
            <button
              type="submit"
              disabled={syncing}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-semibold rounded-xl hover:opacity-90 transition shrink-0"
            >
              {syncing ? 'Syncing...' : 'Connect'}
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Active Statistics Header */}
          <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border flex items-center justify-center text-gray-800 dark:text-gray-100 shadow-sm">
                <Github size={28} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold">@{user.githubUsername}</h3>
                  <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/30 rounded border border-emerald-100 dark:border-emerald-900/30">Connected</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Synced statistics: {stats?.commits || 0} commits</p>
              </div>
            </div>

            <button
              onClick={handleSync}
              disabled={syncing}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-dark-bg dark:hover:bg-dark-border text-gray-700 dark:text-gray-200 font-semibold rounded-xl flex items-center space-x-2 transition self-start md:self-auto"
            >
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
              <span>{syncing ? 'Refreshing...' : 'Refresh Stats'}</span>
            </button>
          </div>

          {/* Repo Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Commits</span>
              <h4 className="text-2xl font-black text-brand-blue mt-1">{stats?.commits || 0}</h4>
              <div className="flex items-center text-[10px] text-gray-400 mt-2">
                <GitCommit size={12} className="mr-1" />
                <span>Total contributions</span>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Streak</span>
              <h4 className="text-2xl font-black text-amber-500 mt-1">{stats?.streak || 0} Days</h4>
              <div className="flex items-center text-[10px] text-gray-400 mt-2">
                <RefreshCw size={12} className="mr-1" />
                <span>Daily commits</span>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Longest Streak</span>
              <h4 className="text-2xl font-black text-purple-500 mt-1">{stats?.longestStreak || 0} Days</h4>
              <div className="flex items-center text-[10px] text-gray-400 mt-2">
                <Users size={12} className="mr-1" />
                <span>Personal record</span>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Repository Count</span>
              <h4 className="text-2xl font-black text-emerald-500 mt-1">14</h4>
              <div className="flex items-center text-[10px] text-gray-400 mt-2">
                <GitBranch size={12} className="mr-1" />
                <span>Public projects</span>
              </div>
            </div>
          </div>

          {/* Grid: Contribution Calendar & Languages */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contribution Calendar grid */}
            <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl lg:col-span-2">
              <h3 className="font-bold border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-6">Contribution Grid</h3>
              
              <div className="overflow-x-auto pb-4">
                <div className="min-w-[600px]">
                  {/* Pseudo-grid representation */}
                  <div className="grid grid-flow-col grid-rows-7 gap-1 h-32">
                    {mockContribCells.map((color, idx) => (
                      <div key={idx} className={`heatmap-cell ${color}`} title={`Cell ${idx + 1}`} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-4 px-2">
                    <span>Last 365 Days</span>
                    <div className="flex items-center space-x-1.5">
                      <span>Less</span>
                      <div className="w-3.5 h-3.5 bg-gray-100 dark:bg-dark-border rounded-sm"></div>
                      <div className="w-3.5 h-3.5 bg-green-200 rounded-sm"></div>
                      <div className="w-3.5 h-3.5 bg-green-300 rounded-sm"></div>
                      <div className="w-3.5 h-3.5 bg-green-400 rounded-sm"></div>
                      <div className="w-3.5 h-3.5 bg-green-500 rounded-sm"></div>
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Language usage pie/doughnut */}
            <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl flex flex-col justify-between">
              <h3 className="font-bold border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-6">Language Usage</h3>
              <div className="h-44 relative flex items-center justify-center mb-4">
                <Doughnut data={languageData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 bg-[#b07219] rounded-full"></span><span>Java (45%)</span></div>
                <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 bg-[#f1e05a] rounded-full"></span><span>JS (30%)</span></div>
                <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 bg-[#e34c26] rounded-full"></span><span>HTML/CSS (15%)</span></div>
                <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 bg-[#3572A5] rounded-full"></span><span>Python (7%)</span></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GitHubAnalytics;

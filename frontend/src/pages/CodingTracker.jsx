import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  Code, 
  Target, 
  Flame, 
  Save, 
  AlertCircle, 
  CheckCircle2,
  TrendingUp,
  Award
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';

const CodingTracker = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leetcodeInput, setLeetcodeInput] = useState(0);
  const [hackerrankInput, setHackerrankInput] = useState(0);
  const [weeklyGoalInput, setWeeklyGoalInput] = useState(10);
  const [monthlyGoalInput, setMonthlyGoalInput] = useState(40);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCodingData();
  }, []);

  const fetchCodingData = async () => {
    try {
      const progress = await api.coding.updateProgress; // trigger placeholder resolve or read
      const current = await api.dashboard.getSummary(); // read aggregated values
      const cData = current.codingProgress;
      setData(cData);
      setLeetcodeInput(cData.leetcodeProblems);
      setHackerrankInput(cData.hackerrankProblems);
      setWeeklyGoalInput(cData.weeklyGoals);
      setMonthlyGoalInput(cData.monthlyGoals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSyncing(true);
    setError('');
    setMessage('');
    try {
      const updated = await api.coding.updateProgress(
        leetcodeInput,
        hackerrankInput,
        weeklyGoalInput,
        monthlyGoalInput
      );
      setData(updated);
      setMessage('Coding metrics and goals updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update metrics.');
    } finally {
      setSyncing(false);
    }
  };

  const totalSolved = leetcodeInput + hackerrankInput;

  // Chart data showing weekly progress trends
  const progressLineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'LeetCode Problems',
        data: [2, 5, 5, 8, 10, 14, 15],
        borderColor: '#7C3AED',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'HackerRank Problems',
        data: [1, 3, 4, 4, 6, 7, 9],
        borderColor: '#60A5FA',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        tension: 0.3,
        fill: true,
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
        }
      }
    },
    scales: {
      y: { grid: { color: 'rgba(156, 163, 175, 0.1)' } },
      x: { grid: { display: false } }
    }
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
        <h1 className="text-3xl font-black tracking-tight">Coding Tracker</h1>
        <p className="text-gray-400 mt-1">Log platform challenges and track target objectives.</p>
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

      {/* Main progress stats and goals grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Metric Form Panel */}
        <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl h-fit">
          <h3 className="font-bold border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-6">Log Solved Challenges</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">LeetCode Problems Solved</label>
              <input
                type="number"
                min="0"
                value={leetcodeInput}
                onChange={(e) => setLeetcodeInput(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 dark:bg-dark-bg dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">HackerRank Problems Solved</label>
              <input
                type="number"
                min="0"
                value={hackerrankInput}
                onChange={(e) => setHackerrankInput(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 dark:bg-dark-bg dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Weekly Goal</label>
                <input
                  type="number"
                  min="1"
                  value={weeklyGoalInput}
                  onChange={(e) => setWeeklyGoalInput(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 dark:bg-dark-bg dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Monthly Goal</label>
                <input
                  type="number"
                  min="1"
                  value={monthlyGoalInput}
                  onChange={(e) => setMonthlyGoalInput(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 dark:bg-dark-bg dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={syncing}
              className="w-full py-3.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-semibold rounded-xl hover:opacity-90 transition flex items-center justify-center space-x-2 mt-6 shadow-md"
            >
              <Save size={18} />
              <span>{syncing ? 'Saving...' : 'Save Progress'}</span>
            </button>
          </form>
        </div>

        {/* Goals Progress Panel */}
        <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl flex flex-col justify-between lg:col-span-2">
          <div>
            <h3 className="font-bold border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-6">Coding Goals Progression</h3>
            
            <div className="space-y-6">
              {/* Weekly progress bar */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-600 dark:text-gray-300">Weekly Target Progress</span>
                  <span className="font-black text-brand-blue">
                    {totalSolved} / {weeklyGoalInput} ({Math.min(100, Math.round((totalSolved * 100) / weeklyGoalInput))}% completed)
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-dark-bg h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-blue h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (totalSolved * 100) / weeklyGoalInput)}%` }}
                  ></div>
                </div>
              </div>

              {/* Monthly progress bar */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-600 dark:text-gray-300">Monthly Target Progress</span>
                  <span className="font-black text-brand-purple">
                    {totalSolved} / {monthlyGoalInput} ({Math.min(100, Math.round((totalSolved * 100) / monthlyGoalInput))}% completed)
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-dark-bg h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-purple h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (totalSolved * 100) / monthlyGoalInput)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-dark-border/40 text-center">
            <div className="p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Daily Coding Streak</span>
              <span className="text-xl font-black text-amber-500 mt-1 flex items-center justify-center">
                <span>{data?.dailyStreak || 0} Days</span>
                <Flame className="ml-1 fill-amber-500 text-amber-500" size={16} />
              </span>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Global Problems Rank</span>
              <span className="text-xl font-black text-emerald-500 mt-1 flex items-center justify-center">
                <span>Rank A</span>
                <Award className="ml-1 text-emerald-500" size={16} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl">
        <h3 className="font-bold border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-6">Weekly Problems Solved Trend</h3>
        <div className="h-64">
          <Line data={progressLineData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
};

export default CodingTracker;

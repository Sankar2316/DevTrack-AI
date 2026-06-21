import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  Trophy, 
  Flame, 
  Code, 
  Briefcase, 
  GitCommit, 
  ArrowRight, 
  Search, 
  Medal,
  Award,
  Sparkles,
  Zap
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const summary = await api.dashboard.getSummary();
        setData(summary);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Setup Line Chart data (GitHub Weekly Commits)
  const commitChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        fill: true,
        label: 'Commits',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Setup Bar Chart data (Solved Coding Problems)
  const codingChartData = {
    labels: ['LeetCode', 'HackerRank'],
    datasets: [
      {
        label: 'Problems Solved',
        data: [data?.codingProgress?.leetcodeProblems || 0, data?.codingProgress?.hackerrankProblems || 0],
        backgroundColor: ['#7C3AED', '#60A5FA'],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { grid: { color: 'rgba(156, 163, 175, 0.1)' } },
      x: { grid: { display: false } },
    },
  };

  // Predefined badges earned logic
  const badges = [
    { title: 'Streak Master', desc: 'Maintained 10+ days habit', icon: Flame, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
    { title: 'Commit King', desc: '100+ commits synced', icon: GitCommit, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
    { title: 'Code Warrior', desc: 'Solved 50+ total problems', icon: Code, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20' },
  ];

  // Predefined Leaderboard mock data
  const leaderboard = [
    { rank: 1, name: 'Rohan Gupta', score: 96, avatar: 'RG' },
    { rank: 2, name: 'Priya Sen', score: 92, avatar: 'PS' },
    { rank: 3, name: 'Amit Verma', score: 88, avatar: 'AV' },
    { rank: 4, name: 'You', score: data?.readinessScore || 78, avatar: 'U', active: true },
  ];

  const filteredLeaderboard = leaderboard.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome header search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Student Dashboard</h1>
          <p className="text-gray-400 mt-1">Monitor coding consistency and job eligibility logs.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search leaderboard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>
      </div>

      {/* Main Core Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Current Streak</p>
            <h3 className="text-3xl font-black mt-1 text-amber-500 flex items-center">
              <span>{data?.githubStats?.streak || 0} Days</span>
              <Flame className="ml-1 fill-amber-500 text-amber-500" size={24} />
            </h3>
            <p className="text-xs text-gray-400 mt-2">Longest streak: {data?.githubStats?.longestStreak || 0} days</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500">
            <Flame size={24} />
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">GitHub Commits</p>
            <h3 className="text-3xl font-black mt-1 text-blue-500">{data?.githubStats?.commits || 0}</h3>
            <p className="text-xs text-gray-400 mt-2">Synced in real-time</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-500">
            <GitCommit size={24} />
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Problems Solved</p>
            <h3 className="text-3xl font-black mt-1 text-purple-500">
              {(data?.codingProgress?.leetcodeProblems || 0) + (data?.codingProgress?.hackerrankProblems || 0)}
            </h3>
            <p className="text-xs text-gray-400 mt-2">LeetCode & HackerRank</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center text-purple-500">
            <Code size={24} />
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Active Applications</p>
            <h3 className="text-3xl font-black mt-1 text-emerald-500">{data?.activeApplications || 0}</h3>
            <p className="text-xs text-gray-400 mt-2">Total submissions: {data?.totalApplications || 0}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500">
            <Briefcase size={24} />
          </div>
        </div>
      </div>

      {/* Grid: Placement readiness chart, commit chart, coding chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Placement Readiness Score Gauge */}
        <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl flex flex-col justify-between items-center text-center">
          <div className="w-full flex items-center justify-between border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-4">
            <h3 className="font-bold">Placement Readiness</h3>
            <Sparkles className="text-brand-purple" size={18} />
          </div>

          <div className="relative my-6 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="64"
                className="stroke-gray-100 dark:stroke-dark-border"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="64"
                className="stroke-brand-blue dark:stroke-brand-purple"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={402}
                strokeDashoffset={402 - (402 * (data?.readinessScore || 0)) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black">{data?.readinessScore || 0}%</span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1">Ready</span>
            </div>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed px-4">
            Your scores represent GitHub consistency, solved coding levels, and application tracking funnels combined.
          </p>
        </div>

        {/* Line Chart showing commit history */}
        <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl flex flex-col justify-between lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-4">
            <h3 className="font-bold">GitHub Weekly Progress</h3>
            <span className="text-xs font-semibold text-brand-blue bg-blue-50 dark:bg-blue-950/20 px-2 py-1 rounded">Real-time stats</span>
          </div>
          <div className="h-56">
            <Line data={commitChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Grid: Solved Problem Chart & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Coding Progress Solved Problems bar */}
        <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-4">
            <h3 className="font-bold">Coding Platforms Breakdown</h3>
            <Zap className="text-amber-500" size={18} />
          </div>
          <div className="h-64">
            <Bar data={codingChartData} options={chartOptions} />
          </div>
        </div>

        {/* Leaderboard Card */}
        <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-6">
            <h3 className="font-bold">Placement Leaderboard</h3>
            <Trophy className="text-amber-500" size={18} />
          </div>
          
          <div className="space-y-4">
            {filteredLeaderboard.map((student) => (
              <div
                key={student.name}
                className={`flex items-center justify-between p-3 rounded-2xl border ${student.active 
                  ? 'border-brand-purple bg-purple-50/10 dark:bg-purple-950/10' 
                  : 'border-gray-100 dark:border-dark-border/50 bg-gray-50/30 dark:bg-dark-bg/20'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 text-xs font-bold text-gray-400 flex items-center justify-center">
                    #{student.rank}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white text-xs font-semibold uppercase">
                    {student.avatar}
                  </div>
                  <span className={`font-semibold text-sm ${student.active ? 'text-brand-purple' : ''}`}>
                    {student.name}
                  </span>
                </div>
                <div className="text-sm font-black">
                  {student.score} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges Earned Section */}
      <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl">
        <h3 className="font-bold border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-6">Unlocked Achievement Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.title} className="p-4 border border-gray-100 dark:border-dark-border/50 rounded-2xl flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${badge.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">{badge.title}</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-tight">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

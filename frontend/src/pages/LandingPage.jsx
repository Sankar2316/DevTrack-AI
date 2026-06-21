import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, 
  Github, 
  Code2, 
  Trello, 
  FileSearch, 
  BrainCircuit, 
  Milestone, 
  Check, 
  ChevronRight, 
  Users, 
  Briefcase, 
  GraduationCap 
} from 'lucide-react';

const LandingPage = () => {
  const { token } = useAuth();

  const features = [
    { name: 'GitHub Streak Tracker', desc: 'Sync your contributions daily, visualize calendars, and build coding habits.', icon: Github, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
    { name: 'Coding Progress Metrics', desc: 'Track your HackerRank milestones and LeetCode problem counts with analytical goals.', icon: Code2, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' },
    { name: 'Placement Kanban Board', desc: 'Manage your job applications across columns from applied to selected.', icon: Trello, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30' },
    { name: 'AI Resume Optimizer', desc: 'Extract keywords, check JD matches, and optimize with circular ATS score charts.', icon: FileSearch, color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/30' },
    { name: 'AI Skill Gap Analysis', desc: 'Compare your skills against Cloud, Data, Java, and Full-Stack profiles.', icon: BrainCircuit, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
    { name: 'AI Learning Roadmap', desc: 'Get structured weekly curriculum modules automatically updated with checkboxes.', icon: Milestone, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' }
  ];

  const steps = [
    { title: 'Create Account', desc: 'Sign up in 30 seconds and enter your career targets.' },
    { title: 'Connect Coding Portals', desc: 'Connect your GitHub and input your LeetCode metrics.' },
    { title: 'Audit and Align profile', desc: 'Upload your resume and select your target engineering track.' },
    { title: 'Execute and Succeed', desc: 'Complete weekly tasks, update applications, and get placed.' }
  ];

  const testimonials = [
    { quote: "DevTrack AI helped me maintain my 100-day GitHub contribution streak. It motivated me to solve coding problems daily, which eventually landed me a Software Engineer role!", name: "Karan Sen", title: "Placed at Stripe", role: "Student" },
    { quote: "The ATS Resume Analyzer is incredibly accurate. It flagged exactly what keywords were missing for my Full Stack applications, increasing my interview callbacks by 3x.", name: "Nidhi Sharma", title: "Placed at Microsoft", role: "Data grad" }
  ];

  return (
    <div className="bg-white text-gray-900 dark:bg-dark-bg dark:text-gray-100 transition-colors duration-200">
      {/* Top Navbar */}
      <nav className="border-b border-gray-100 dark:border-dark-border px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <span className="text-2xl font-bold bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
          DevTrack AI
        </span>
        <div className="flex items-center space-x-4">
          {token ? (
            <Link to="/dashboard" className="px-5 py-2.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-medium rounded-xl hover:opacity-90 shadow-lg shadow-blue-500/10 flex items-center space-x-1 transition">
              <span>Go to Dashboard</span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-brand-blue font-medium px-3 transition">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-medium rounded-xl hover:opacity-90 shadow-lg shadow-blue-500/10 transition">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-brand-blue dark:bg-blue-950/40 dark:text-brand-lightBlue border border-blue-100 dark:border-blue-900/40 mb-6 flex items-center space-x-1 animate-pulse">
          <span>🎯 Your AI Career Readiness Copilot</span>
        </span>
        
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl leading-tight mb-8">
          Accelerate Your Placement Readiness with{' '}
          <span className="bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
            Continuous Dev Habits
          </span>
        </h1>
        
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed mb-12">
          Sync GitHub contributions, analyze resume keywords against recruiter filters, log LeetCode metrics, and generate customized career roadmaps.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
          <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-semibold rounded-2xl hover:opacity-95 shadow-xl shadow-blue-500/15 flex items-center justify-center space-x-2 transition-transform hover:-translate-y-0.5">
            <span>Start Tracking Free</span>
            <ArrowRight size={18} />
          </Link>
          <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-700 dark:bg-dark-card dark:text-gray-200 font-semibold rounded-2xl hover:bg-gray-200 dark:hover:bg-dark-border flex items-center justify-center space-x-1 transition">
            <span>Learn How It Works</span>
          </a>
        </div>

        {/* Dashboard preview */}
        <div className="relative mt-20 w-full max-w-5xl rounded-3xl border border-gray-200 dark:border-dark-border shadow-2xl p-2 bg-gray-100 dark:bg-dark-card/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-dark-bg via-transparent to-transparent z-10"></div>
          <div className="rounded-2xl bg-white dark:bg-dark-card p-6 border border-gray-100 dark:border-dark-border/50 text-left min-h-[300px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border/50 pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
                <span className="text-xs font-semibold text-gray-400 ml-2">devtrack_dashboard_v1.0.exe</span>
              </div>
              <div className="w-24 h-2 bg-gray-100 dark:bg-dark-bg rounded"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 border border-gray-100 dark:border-dark-border/60 rounded-2xl bg-gray-50/50 dark:bg-dark-bg/40">
                <p className="text-xs font-medium text-gray-400 uppercase">GitHub Habit Streak</p>
                <h3 className="text-3xl font-bold text-brand-blue mt-1">12 Days</h3>
                <div className="w-full bg-gray-200 dark:bg-dark-border h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-brand-blue h-full w-[80%]"></div>
                </div>
              </div>
              <div className="p-5 border border-gray-100 dark:border-dark-border/60 rounded-2xl bg-gray-50/50 dark:bg-dark-bg/40">
                <p className="text-xs font-medium text-gray-400 uppercase">Resume ATS Audit</p>
                <h3 className="text-3xl font-bold text-brand-purple mt-1">78 Score</h3>
                <div className="w-full bg-gray-200 dark:bg-dark-border h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-brand-purple h-full w-[78%]"></div>
                </div>
              </div>
              <div className="p-5 border border-gray-100 dark:border-dark-border/60 rounded-2xl bg-gray-50/50 dark:bg-dark-bg/40">
                <p className="text-xs font-medium text-gray-400 uppercase">Placement Readiness</p>
                <h3 className="text-3xl font-bold text-emerald-500 mt-1">82%</h3>
                <div className="w-full bg-gray-200 dark:bg-dark-border h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[82%]"></div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-100 dark:border-dark-border/50 pt-4 flex items-center justify-between text-xs text-gray-400">
              <span>Habits logged: 142 commits</span>
              <span>Next update: in 2 hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 dark:bg-dark-card/30 py-24 px-6 border-y border-gray-100 dark:border-dark-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Every Feature To Audit Your Readiness</h2>
            <p className="text-gray-500 dark:text-gray-400">Eliminate guesswork. Build continuous habits and track your application funnel in one unified command center.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.name} className="p-8 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border/50 hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feat.color}`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feat.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">{feat.desc}</p>
                  </div>
                  <Link to="/register" className="text-xs font-semibold text-brand-blue hover:text-brand-purple flex items-center space-x-1 mt-auto">
                    <span>Learn more</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Four Steps to Job Readiness</h2>
          <p className="text-gray-500 dark:text-gray-400">Deploy DevTrack AI as your daily tracking engine and audit your career stats.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-10 left-1/8 right-1/8 h-0.5 bg-gradient-to-r from-brand-blue via-brand-purple to-emerald-500 z-0"></div>
          {steps.map((step, idx) => (
            <div key={step.title} className="relative z-10 flex flex-col items-center text-center p-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple text-white font-extrabold text-lg flex items-center justify-center shadow-lg mb-6">
                {idx + 1}
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 dark:bg-dark-card/30 py-24 px-6 border-t border-gray-100 dark:border-dark-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold mb-4">Loved by Students</h2>
            <p className="text-gray-500 dark:text-gray-400">See how students are optimizing their applications with DevTrack AI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((test) => (
              <div key={test.name} className="p-8 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border/50 shadow-sm relative flex flex-col justify-between">
                <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed mb-8">"{test.quote}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-xs uppercase">
                    {test.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight">{test.name}</h4>
                    <p className="text-xs text-brand-blue mt-0.5 leading-tight">{test.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Flexible Free & Premium Plans</h2>
          <p className="text-gray-500 dark:text-gray-400">Scale up your career prep. Start free, transition to premium as you request mock cycles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Free Tier */}
          <div className="p-8 bg-white dark:bg-dark-card rounded-3xl border border-gray-200 dark:border-dark-border flex flex-col justify-between hover:border-gray-300 transition">
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">Basic Tier</h3>
                <div className="flex items-baseline mt-2">
                  <span className="text-5xl font-extrabold">$0</span>
                  <span className="text-gray-400 ml-2">/ month</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Free habits logging for all active students.</p>
              </div>

              <ul className="space-y-4 mb-8">
                {['GitHub contribution sync', 'LeetCode/HackerRank goal trackers', 'Basic Kanban board (up to 5 apps)', '1 free ATS resume audit'].map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Check className="text-brand-blue mr-3 shrink-0" size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link to="/register" className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-dark-bg dark:hover:bg-dark-border text-gray-800 dark:text-gray-200 font-semibold rounded-xl text-center transition">
              Get Started Free
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="p-8 bg-white dark:bg-dark-card rounded-3xl border-2 border-brand-purple flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-brand-purple text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
              POPULAR
            </div>
            
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-brand-purple">Career Pro</h3>
                <div className="flex items-baseline mt-2">
                  <span className="text-5xl font-extrabold">$9</span>
                  <span className="text-gray-400 ml-2">/ month</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Full access to AI analyzers & roadmaps.</p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Everything in Free tier',
                  'Unlimited ATS resume checks',
                  'AI Skill Gap comparison',
                  'Personalized weekly roadmap generation',
                  'Unlimited Kanban boards',
                  'Priority recruitment alerts'
                ].map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Check className="text-brand-purple mr-3 shrink-0" size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link to="/register" className="w-full py-3.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-semibold rounded-xl text-center shadow-lg shadow-purple-500/25 transition">
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-dark-border py-12 px-6 bg-gray-55 text-center text-xs text-gray-400 dark:bg-dark-bg">
        <p className="mb-2">© 2026 DevTrack AI. Built for recruitment consistency.</p>
        <div className="flex items-center justify-center space-x-4 mt-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:underline">Terms of Service</a>
          <span>•</span>
          <a href="#" className="hover:underline">Support Desk</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

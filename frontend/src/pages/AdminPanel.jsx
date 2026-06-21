import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  Shield, 
  Users, 
  Map, 
  Briefcase, 
  FileText, 
  Megaphone, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  UserCheck
} from 'lucide-react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Announcement Form
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annMsg, setAnnMsg] = useState('');
  const [annErr, setAnnErr] = useState('');
  const [submittingAnn, setSubmittingAnn] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const uData = await api.admin.getUsers();
      setUsers(uData);

      const aData = await api.admin.getAnalytics();
      setAnalytics(aData);

      const annData = await api.admin.getAnnouncements();
      setAnnouncements(annData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    setSubmittingAnn(true);
    setAnnMsg('');
    setAnnErr('');
    try {
      const newAnn = await api.admin.createAnnouncement(annTitle, annContent);
      setAnnouncements((prev) => [newAnn, ...prev]);
      setAnnTitle('');
      setAnnContent('');
      setAnnMsg('Announcement published successfully.');
      
      // Update analytics roadmap count if mock
      const aData = await api.admin.getAnalytics();
      setAnalytics(aData);
    } catch (err) {
      setAnnErr(err.message || 'Failed to publish.');
    } finally {
      setSubmittingAnn(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await api.admin.deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const nextRole = currentRole === 'STUDENT' ? 'ADMIN' : 'STUDENT';
    // Optimistic Update
    const previousUsers = [...users];
    setUsers((prev) => 
      prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
    );

    try {
      await api.admin.updateRole(userId, nextRole);
    } catch (err) {
      console.error(err);
      setUsers(previousUsers); // rollback
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
        <h1 className="text-3xl font-black tracking-tight">Admin Console</h1>
        <p className="text-gray-400 mt-1">Audit platform usage metrics and configure student accounts.</p>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Registered</span>
            <h4 className="text-2xl font-black mt-1 text-blue-500">{analytics?.totalUsers || 0} Users</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-500">
            <Users size={20} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Roadmaps</span>
            <h4 className="text-2xl font-black mt-1 text-purple-500">{analytics?.activeRoadmaps || 0} Paths</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center text-purple-500">
            <Map size={20} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Applications funneled</span>
            <h4 className="text-2xl font-black mt-1 text-emerald-500">{analytics?.totalApplications || 0} Jobs</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500">
            <Briefcase size={20} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Average ATS Score</span>
            <h4 className="text-2xl font-black mt-1 text-pink-500">{analytics?.averageAtsScore || 0} pts</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/20 flex items-center justify-center text-pink-500">
            <FileText size={20} />
          </div>
        </div>
      </div>

      {/* Grid: User Management & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User Management Table */}
        <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl lg:col-span-2">
          <h3 className="font-bold border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-4 flex items-center">
            <UserCheck className="mr-2 text-brand-blue" size={18} />
            <span>User Management</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-dark-border/50 text-gray-400">
                  <th className="pb-3 font-semibold text-xs uppercase">Name</th>
                  <th className="pb-3 font-semibold text-xs uppercase">Email</th>
                  <th className="pb-3 font-semibold text-xs uppercase">Role</th>
                  <th className="pb-3 font-semibold text-xs uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border/40">
                {users.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-dark-bg/20">
                    <td className="py-3.5 font-semibold text-xs">{student.name}</td>
                    <td className="py-3.5 text-xs text-gray-500 dark:text-gray-400">{student.email}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${student.role === 'ADMIN' 
                        ? 'text-purple-600 bg-purple-50 dark:text-purple-300 dark:bg-purple-950/20' 
                        : 'text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/20'}`}
                      >
                        {student.role}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleToggleRole(student.id, student.role)}
                        className="px-2.5 py-1 text-[10px] font-semibold border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg rounded-lg transition"
                      >
                        Toggle Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Announcements Controller */}
        <div className="space-y-8">
          {/* Post announcement */}
          <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl">
            <h3 className="font-bold border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-4 flex items-center">
              <Megaphone className="mr-2 text-brand-purple" size={18} />
              <span>Broadcast Announcement</span>
            </h3>

            {annMsg && (
              <div className="p-3 mb-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
                <CheckCircle2 size={14} />
                <span>{annMsg}</span>
              </div>
            )}

            {annErr && (
              <div className="p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle size={14} />
                <span>{annErr}</span>
              </div>
            )}

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-2">Subject / Title</label>
                <input
                  type="text"
                  placeholder="New Mock Interview Batch"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 dark:bg-dark-bg dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-2">Content Details</label>
                <textarea
                  placeholder="Add schedule specifications here..."
                  rows="3"
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 dark:bg-dark-bg dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple text-xs resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submittingAnn}
                className="w-full py-2.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-semibold rounded-xl hover:opacity-90 flex items-center justify-center space-x-2 text-xs"
              >
                <Plus size={14} />
                <span>{submittingAnn ? 'Publishing...' : 'Broadcast'}</span>
              </button>
            </form>
          </div>

          {/* List announcements */}
          <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl space-y-4">
            <h3 className="font-bold border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-2">Active Bulletins</h3>
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-3 border border-gray-100 dark:border-dark-border/50 rounded-xl space-y-2 bg-gray-50/20 dark:bg-dark-bg/25">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs leading-tight">{ann.title}</h5>
                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="text-gray-350 hover:text-red-500 p-0.5"
                      title="Delete bulletin"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-505 leading-normal">{ann.content}</p>
                </div>
              ))}
              {announcements.length === 0 && (
                <p className="text-[10px] text-gray-400 text-center py-4">No active broadcasts.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

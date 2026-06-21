import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  Trello, 
  Plus, 
  Trash2, 
  Calendar, 
  CheckCircle, 
  Building2, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const COLUMNS = [
  { id: 'APPLIED', title: 'Applied', color: 'border-t-blue-500 bg-blue-50/20' },
  { id: 'OA_CLEARED', title: 'OA Cleared', color: 'border-t-indigo-500 bg-indigo-50/20' },
  { id: 'INTERVIEW_ROUND_1', title: 'Interview 1', color: 'border-t-purple-500 bg-purple-50/20' },
  { id: 'INTERVIEW_ROUND_2', title: 'Interview 2', color: 'border-t-pink-500 bg-pink-50/20' },
  { id: 'HR_ROUND', title: 'HR Round', color: 'border-t-orange-500 bg-orange-50/20' },
  { id: 'SELECTED', title: 'Selected 🎉', color: 'border-t-emerald-500 bg-emerald-50/20' },
  { id: 'REJECTED', title: 'Rejected ❌', color: 'border-t-red-500 bg-red-50/20' }
];

const PlacementTracker = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [initialStatus, setInitialStatus] = useState('APPLIED');
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await api.placements.getApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddApplication = async (e) => {
    e.preventDefault();
    if (!companyName) return;
    setError('');
    try {
      const dateStr = new Date().toISOString().split('T')[0];
      const newApp = await api.placements.addApplication(companyName, initialStatus, dateStr);
      setApplications((prev) => [...prev, newApp]);
      setCompanyName('');
      setShowAddForm(false);
    } catch (err) {
      setError(err.message || 'Failed to add application.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.placements.deleteApplication(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('text/plain'));
    if (!id) return;

    // Optimistic UI update
    const previousApps = [...applications];
    setApplications((prev) => 
      prev.map((app) => (app.id === id ? { ...app, status: columnId } : app))
    );

    try {
      await api.placements.updateStatus(id, columnId);
    } catch (err) {
      console.error(err);
      // Rollback on failure
      setApplications(previousApps);
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
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Placement Tracker</h1>
          <p className="text-gray-400 mt-1">Manage applications funnel and review interview progression status.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-semibold rounded-xl flex items-center space-x-2 hover:opacity-90 transition self-start md:self-auto shadow-md"
        >
          <Plus size={18} />
          <span>Add Application</span>
        </button>
      </div>

      {/* Add application form overlay */}
      {showAddForm && (
        <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl max-w-xl animate-slide-up">
          <h3 className="font-bold mb-4">New Company Application</h3>
          <form onSubmit={handleAddApplication} className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Company Name</label>
              <input
                type="text"
                placeholder="Google"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 dark:bg-dark-bg dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              />
            </div>
            <div className="w-full sm:w-44">
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Initial Column</label>
              <select
                value={initialStatus}
                onChange={(e) => setInitialStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 dark:bg-dark-bg dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                {COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-brand-blue text-white font-semibold rounded-xl hover:bg-opacity-90 transition shadow-sm h-[42px]"
            >
              Add
            </button>
          </form>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>
      )}

      {/* Kanban Board Container scroll wrapper */}
      <div className="overflow-x-auto pb-6">
        <div className="flex space-x-4 min-w-[1200px] h-[600px] items-stretch">
          {COLUMNS.map((col) => {
            const columnApps = applications.filter((app) => app.status === col.id);
            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="w-80 flex flex-col bg-gray-50/50 dark:bg-dark-card/40 border border-gray-200/60 dark:border-dark-border/40 rounded-3xl p-4 overflow-y-auto"
              >
                {/* Column header */}
                <div className={`border-t-4 ${col.color} pt-3 pb-4 mb-4 flex items-center justify-between`}>
                  <h4 className="font-bold text-sm text-gray-700 dark:text-gray-200">{col.title}</h4>
                  <span className="px-2 py-0.5 text-xs font-bold text-gray-400 bg-gray-100 dark:bg-dark-bg rounded-md">
                    {columnApps.length}
                  </span>
                </div>

                {/* Column card container */}
                <div className="space-y-3 flex-1">
                  {columnApps.map((app) => (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app.id)}
                      className="p-4 bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-2xl shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition duration-150"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Building2 size={16} className="text-gray-400" />
                          <span className="font-bold text-sm">{app.companyName}</span>
                        </div>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                          title="Delete application"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center text-[10px] text-gray-400 mt-3 pt-2.5 border-t border-gray-50 dark:border-dark-border/40">
                        <Calendar size={12} className="mr-1" />
                        <span>Applied: {app.appliedDate}</span>
                      </div>
                    </div>
                  ))}

                  {columnApps.length === 0 && (
                    <div className="h-24 border border-dashed border-gray-200 dark:border-dark-border/60 rounded-2xl flex items-center justify-center text-xs text-gray-400">
                      Drag companies here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlacementTracker;

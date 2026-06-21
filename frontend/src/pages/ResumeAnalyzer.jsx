import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  FileText, 
  UploadCloud, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  BookOpen,
  Plus
} from 'lucide-react';

const ResumeAnalyzer = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await api.resume.getHistory();
      setHistory(data);
      if (data && data.length > 0) {
        setActiveAnalysis(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setUploading(true);
    setError('');
    try {
      const result = await api.resume.analyze(file);
      setActiveAnalysis(result);
      setHistory((prev) => [result, ...prev]);
    } catch (err) {
      setError('Failed to analyze resume. Please check file type.');
    } finally {
      setUploading(false);
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
        <h1 className="text-3xl font-black tracking-tight">AI Resume Analyzer</h1>
        <p className="text-gray-400 mt-1">Check ATS scores, extract missing keywords, and review alignment ratios.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-sm flex items-center space-x-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Upload & Analysis Result */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Zone & History Panel */}
        <div className="space-y-6 lg:col-span-1">
          {/* Drag & Drop Card */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`p-8 border-2 border-dashed rounded-3xl text-center transition relative flex flex-col items-center justify-center min-h-[220px] ${dragActive 
              ? 'border-brand-purple bg-purple-50/10' 
              : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card'}`}
          >
            {uploading ? (
              <div className="space-y-4">
                <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm font-semibold">Running ATS Scans...</p>
              </div>
            ) : (
              <>
                <UploadCloud className="text-gray-400 mb-4" size={40} />
                <p className="text-sm font-bold">Drag and drop resume here</p>
                <p className="text-xs text-gray-450 mt-1.5 mb-4">PDF or DOCX (max 10MB)</p>
                <label className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-dark-bg dark:hover:bg-dark-border text-xs font-semibold rounded-lg cursor-pointer transition">
                  Browse Files
                  <input type="file" onChange={handleFileChange} accept=".pdf,.docx" className="hidden" />
                </label>
              </>
            )}
          </div>

          {/* Upload History List */}
          <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl">
            <h3 className="font-bold border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-4">Historical Audits</h3>
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveAnalysis(item)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition ${activeAnalysis?.id === item.id 
                    ? 'border-brand-blue bg-blue-50/10' 
                    : 'border-gray-100 dark:border-dark-border/50 bg-gray-50/30 hover:bg-gray-100 dark:bg-dark-bg/20'}`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText size={16} className="text-gray-400" />
                    <span className="text-xs font-semibold">Score: {item.atsScore}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {new Date(item.createdDate).toLocaleDateString()}
                  </span>
                </button>
              ))}
              {history.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No audits logged.</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Analysis Display Panel */}
        <div className="lg:col-span-2 space-y-6">
          {activeAnalysis ? (
            <div className="p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl space-y-6">
              {/* Gauges header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-gray-100 dark:border-dark-border/45 pb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="32" className="stroke-gray-100 dark:stroke-dark-border" strokeWidth="6" fill="none" />
                      <circle cx="40" cy="40" r="32" className="stroke-brand-purple" strokeWidth="8" fill="none" strokeDasharray={201} strokeDashoffset={201 - (201 * activeAnalysis.atsScore) / 100} strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-lg font-black">{activeAnalysis.atsScore}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">ATS Score</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Scanned against global filters</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="32" className="stroke-gray-100 dark:stroke-dark-border" strokeWidth="6" fill="none" />
                      <circle cx="40" cy="40" r="32" className="stroke-brand-blue" strokeWidth="8" fill="none" strokeDasharray={201} strokeDashoffset={201 - (201 * activeAnalysis.jdMatchPercentage) / 100} strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-lg font-black">{activeAnalysis.jdMatchPercentage}%</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">JD Match</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Job description keywords alignment</p>
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="text-xs font-bold text-gray-450 uppercase mb-3 flex items-center">
                  <Sparkles size={14} className="mr-1.5 text-brand-purple" />
                  Profile Strengths
                </h4>
                <ul className="space-y-2">
                  {activeAnalysis.strengthAnalysis.split(' | ').map((str, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="text-emerald-500 mr-2 shrink-0 mt-0.5" size={16} />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div>
                <h4 className="text-xs font-bold text-gray-450 uppercase mb-3 flex items-center">
                  <BookOpen size={14} className="mr-1.5 text-brand-blue" />
                  Improvement Suggestions
                </h4>
                <ul className="space-y-2">
                  {activeAnalysis.suggestions.split(' | ').map((sug, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 bg-brand-blue rounded-full mr-2.5 shrink-0 mt-2"></span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing keywords tags */}
              {activeAnalysis.missingKeywords && (
                <div>
                  <h4 className="text-xs font-bold text-gray-450 uppercase mb-3">Missing Keywords (Action Required)</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeAnalysis.missingKeywords.split(', ').map((kw) => (
                      <span
                        key={kw}
                        className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/20 rounded-full border border-red-200 dark:border-red-900/30"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl text-center min-h-[300px] flex flex-col items-center justify-center">
              <p className="text-gray-400">No active analysis. Please upload your resume to start.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;

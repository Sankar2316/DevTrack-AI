import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  Flame,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ROLES = [
  { name: 'Java Developer', desc: 'Enterprise backends, APIs, and microservices.', icon: Award, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
  { name: 'Full Stack Developer', desc: 'SPA frontends linked with Spring boot APIs.', icon: Briefcase, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
  { name: 'Data Analyst', desc: 'Relational query scripting and dashboard charting.', icon: Flame, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20' },
  { name: 'Cloud Engineer', desc: 'DevOps pipelines, containers, and deployment scripts.', icon: Sparkles, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' }
];

const SkillGapAnalysis = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('Java Developer');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (roleName) => {
    setSelectedRole(roleName);
    setLoading(true);
    try {
      const data = await api.skills.gapAnalysis(roleName);
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerRoadmap = () => {
    navigate('/roadmap');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black tracking-tight">AI Skill Gap Analysis</h1>
        <p className="text-gray-400 mt-1">Audit profile alignments across common engineering roles.</p>
      </div>

      {/* Grid: Role Selectors cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ROLES.map((role) => {
          const Icon = role.icon;
          const isActive = selectedRole === role.name;
          return (
            <button
              key={role.name}
              onClick={() => handleAnalyze(role.name)}
              className={`p-6 text-left bg-white dark:bg-dark-card border rounded-3xl transition duration-150 flex flex-col justify-between ${isActive 
                ? 'border-brand-purple shadow-lg ring-2 ring-brand-purple/20' 
                : 'border-gray-200 dark:border-dark-border hover:border-gray-300'}`}
            >
              <div className="space-y-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role.color}`}>
                  <Icon size={20} />
                </div>
                <h4 className="font-bold text-sm leading-tight">{role.name}</h4>
                <p className="text-xs text-gray-400 leading-normal">{role.desc}</p>
              </div>
              <span className="text-[10px] font-semibold text-brand-purple mt-4 flex items-center">
                <span>Select role</span>
                <ArrowRight size={10} className="ml-1" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Analysis Output Panel */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Readiness gauge and recommendation checklist */}
          <div className="lg:col-span-1 p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl flex flex-col justify-between items-center text-center">
            <div className="w-full flex items-center justify-between border-b border-gray-150 dark:border-dark-border/40 pb-4 mb-4">
              <h3 className="font-bold text-sm">Target Readiness</h3>
              <BrainCircuit className="text-brand-purple" size={16} />
            </div>

            <div className="relative my-6 flex items-center justify-center">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle cx="72" cy="72" r="56" className="stroke-gray-100 dark:stroke-dark-border" strokeWidth="8" fill="none" />
                <circle cx="72" cy="72" r="56" className="stroke-brand-purple" strokeWidth="10" fill="none" strokeDasharray={351} strokeDashoffset={351 - (351 * analysis.readinessScore) / 100} strokeLinecap="round" />
              </svg>
              <span className="absolute text-3xl font-black">{analysis.readinessScore}%</span>
            </div>

            <p className="text-xs text-gray-450 leading-relaxed px-2 mb-6">
              You match {analysis.currentSkills.length} out of {analysis.requiredSkills.length} baseline requirements for this role.
            </p>

            <button
              onClick={handleTriggerRoadmap}
              className="w-full py-3 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-semibold rounded-xl hover:opacity-90 shadow-md flex items-center justify-center space-x-2 text-xs"
            >
              <span>View Generated Roadmap</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Detailed Skill Mapping checklist */}
          <div className="lg:col-span-2 p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl space-y-6">
            <h3 className="font-bold border-b border-gray-100 dark:border-dark-border/40 pb-4 mb-4">Detailed Competency Mapping</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Matched skills list */}
              <div className="p-4 bg-gray-50 dark:bg-dark-bg/40 border border-gray-100 dark:border-dark-border/50 rounded-2xl">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Matched Competencies</h4>
                <div className="space-y-2">
                  {analysis.currentSkills.map((sk) => (
                    <div key={sk} className="flex items-center text-sm">
                      <CheckCircle2 className="text-emerald-500 mr-2 shrink-0" size={16} />
                      <span className="font-semibold">{sk}</span>
                    </div>
                  ))}
                  {analysis.currentSkills.length === 0 && (
                    <p className="text-xs text-gray-405 italic">No baseline skills matched.</p>
                  )}
                </div>
              </div>

              {/* Missing skills list */}
              <div className="p-4 bg-gray-50 dark:bg-dark-bg/40 border border-gray-100 dark:border-dark-border/50 rounded-2xl">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Gaps Identified</h4>
                <div className="space-y-2">
                  {analysis.missingSkills.map((sk) => (
                    <div key={sk} className="flex items-center text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="mr-2 shrink-0" size={16} />
                      <span className="font-semibold">{sk}</span>
                    </div>
                  ))}
                  {analysis.missingSkills.length === 0 && (
                    <p className="text-xs text-emerald-500 font-semibold flex items-center">
                      <CheckCircle2 size={16} className="mr-1.5" />
                      All gaps satisfied!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Learning recommendations */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Placement Recommendations</h4>
              <ul className="space-y-2">
                {analysis.learningRecommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-500 dark:text-gray-300">
                    <span className="w-1.5 h-1.5 bg-brand-purple rounded-full mr-2.5 shrink-0 mt-2"></span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl text-center min-h-[300px] flex flex-col items-center justify-center">
          <p className="text-gray-400 max-w-sm">
            Select one of the career roles above and launch the audit to parse skill gaps and generate a roadmap.
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillGapAnalysis;

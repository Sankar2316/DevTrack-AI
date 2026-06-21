// DevTrack AI API Service Wrapper
const API_BASE_URL = 'http://localhost:8080/api';

// Detect if we should use local mocks
let isMockMode = false;

// Helper to check token and get headers
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Seed LocalStorage with initial data if empty
const seedMockDatabase = () => {
  if (!localStorage.getItem('mock_users')) {
    localStorage.setItem('mock_users', JSON.stringify([
      { id: 1, name: 'Alex Student', email: 'student@devtrack.ai', password: 'password', role: 'STUDENT', githubUsername: 'alex_dev' },
      { id: 2, name: 'Sarah Admin', email: 'admin@devtrack.ai', password: 'password', role: 'ADMIN', githubUsername: 'sarah_admin' }
    ]));
  }
  if (!localStorage.getItem('mock_github_stats')) {
    localStorage.setItem('mock_github_stats', JSON.stringify({
      id: 1, commits: 142, streak: 12, longestStreak: 18
    }));
  }
  if (!localStorage.getItem('mock_skills')) {
    localStorage.setItem('mock_skills', JSON.stringify([
      { id: 1, skillName: 'Java', skillLevel: 4 },
      { id: 2, skillName: 'Spring Boot', skillLevel: 3 },
      { id: 3, skillName: 'React', skillLevel: 3 },
      { id: 4, skillName: 'MySQL', skillLevel: 4 },
      { id: 5, skillName: 'Docker', skillLevel: 2 }
    ]));
  }
  if (!localStorage.getItem('mock_placements')) {
    localStorage.setItem('mock_placements', JSON.stringify([
      { id: 1, companyName: 'Google', status: 'APPLIED', appliedDate: '2026-06-01' },
      { id: 2, companyName: 'Microsoft', status: 'OA_CLEARED', appliedDate: '2026-06-05' },
      { id: 3, companyName: 'Amazon', status: 'INTERVIEW_ROUND_1', appliedDate: '2026-06-10' },
      { id: 4, companyName: 'Meta', status: 'INTERVIEW_ROUND_2', appliedDate: '2026-06-12' },
      { id: 5, companyName: 'Netflix', status: 'HR_ROUND', appliedDate: '2026-06-15' },
      { id: 6, companyName: 'Stripe', status: 'SELECTED', appliedDate: '2026-06-18' },
      { id: 7, companyName: 'Uber', status: 'REJECTED', appliedDate: '2026-06-02' }
    ]));
  }
  if (!localStorage.getItem('mock_coding')) {
    localStorage.setItem('mock_coding', JSON.stringify({
      id: 1, leetcodeProblems: 84, hackerrankProblems: 52, dailyStreak: 14, weeklyGoals: 15, monthlyGoals: 60
    }));
  }
  if (!localStorage.getItem('mock_resumes')) {
    localStorage.setItem('mock_resumes', JSON.stringify([
      {
        id: 1,
        atsScore: 78,
        suggestions: 'Add more quantification to accomplishments (e.g. "improved response time by 25%"). Add Docker and Kubernetes to technologies section.',
        missingKeywords: 'Kubernetes, Redis, CI/CD pipelines',
        strengthAnalysis: 'Strong projects section showing React/Spring Boot applications, solid technical summary.',
        jdMatchPercentage: 82,
        createdDate: new Date().toISOString()
      }
    ]));
  }
  if (!localStorage.getItem('mock_roadmaps')) {
    localStorage.setItem('mock_roadmaps', JSON.stringify({
      id: 1,
      targetRole: 'Java Developer',
      completionPercentage: 50,
      generatedPlan: JSON.stringify([
        { week: 1, title: 'Core Java & OOPs', completed: true, topics: ['Inheritance', 'Polymorphism', 'Collections Framework', 'Java 8 Features'] },
        { week: 2, title: 'Spring Core & Boot Basics', completed: true, topics: ['Dependency Injection', 'IOC Container', 'Spring Beans', 'REST Controllers'] },
        { week: 3, title: 'Spring Data JPA & Hibernate', completed: false, topics: ['Entity Mappings', 'Repository Interfaces', 'H2 Database Integration'] },
        { week: 4, title: 'Security & Deployments', completed: false, topics: ['Spring Security', 'JWT Authentication', 'Docker Containers'] }
      ])
    }));
  }
  if (!localStorage.getItem('mock_announcements')) {
    localStorage.setItem('mock_announcements', JSON.stringify([
      { id: 1, title: 'Placement Drive Commencing July 1st', content: 'The campus placement drive will officially start from July 1st. Please update your resumes and github stats.', createdBy: 'Sarah Admin', createdDate: new Date().toISOString() },
      { id: 2, title: 'Platform Version 1.0 Release', content: 'Welcome to DevTrack AI. Explore the AI skill gap analyzer and interactive resume optimizer to gear up for your next role.', createdBy: 'Sarah Admin', createdDate: new Date().toISOString() }
    ]));
  }
  if (!localStorage.getItem('mock_notifications')) {
    localStorage.setItem('mock_notifications', JSON.stringify([
      { id: 1, message: 'GitHub contribution sync successful. Daily streak at 12 days!', readStatus: false, type: 'GITHUB', createdDate: new Date().toISOString() },
      { id: 2, message: 'Coding Tracker: You are 5 problems away from your weekly LeetCode goal.', readStatus: false, type: 'CODING', createdDate: new Date().toISOString() },
      { id: 3, message: 'Interview Reminder: Mock interview round with Netflix on June 25th.', readStatus: false, type: 'INTERVIEW', createdDate: new Date().toISOString() }
    ]));
  }
};

// Invoke seeding immediately
seedMockDatabase();

// Centralized request wrapper with backend offline detection
const apiRequest = async (url, options = {}) => {
  if (isMockMode) {
    throw new Error('MOCK_TRIGGER'); // skip fetch entirely if mock mode is hard locked
  }
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: { ...getHeaders(), ...options.headers }
    });
    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg || 'API Error');
    }
    if (response.status === 204) return null;
    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      console.warn(`Connection failed to Spring Boot backend at ${API_BASE_URL}. Activating stateful mock mode.`);
      isMockMode = true;
      throw new Error('MOCK_TRIGGER');
    }
    throw error;
  }
};

// API Services object containing both REST calls and client-side mocks
export const api = {
  isMockActive: () => isMockMode,
  setMockMode: (val) => { isMockMode = val; },

  auth: {
    login: async (email, password) => {
      try {
        return await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          const users = JSON.parse(localStorage.getItem('mock_users'));
          const match = users.find(u => u.email === email && u.password === password);
          if (match) {
            localStorage.setItem('token', 'mock_jwt_token_for_' + match.email);
            localStorage.setItem('currentUser', JSON.stringify(match));
            return {
              accessToken: 'mock_jwt_token_for_' + match.email,
              email: match.email,
              name: match.name,
              role: match.role,
              githubUsername: match.githubUsername
            };
          } else {
            throw new Error('Invalid credentials');
          }
        }
        throw err;
      }
    },

    register: async (name, email, password, githubUsername) => {
      try {
        return await apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password, githubUsername, role: 'STUDENT' })
        });
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          const users = JSON.parse(localStorage.getItem('mock_users'));
          if (users.some(u => u.email === email)) {
            throw new Error('Email address already in use!');
          }
          const newUser = { id: users.length + 1, name, email, password, role: 'STUDENT', githubUsername };
          users.push(newUser);
          localStorage.setItem('mock_users', JSON.stringify(users));
          return { success: true, message: 'User registered successfully!' };
        }
        throw err;
      }
    },

    forgotPassword: async (email, newPassword) => {
      try {
        return await apiRequest('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email, newPassword })
        });
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          const users = JSON.parse(localStorage.getItem('mock_users'));
          const userIdx = users.findIndex(u => u.email === email);
          if (userIdx !== -1) {
            users[userIdx].password = newPassword;
            localStorage.setItem('mock_users', JSON.stringify(users));
            return { success: true, message: 'Password updated successfully!' };
          }
          throw new Error('User not found!');
        }
        throw err;
      }
    },

    updateProfile: async (name, githubUsername) => {
      try {
        return await apiRequest('/auth/profile', {
          method: 'PUT',
          body: JSON.stringify({ name, githubUsername })
        });
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          const currentUser = JSON.parse(localStorage.getItem('currentUser'));
          if (!currentUser) throw new Error('Not authenticated');
          currentUser.name = name;
          currentUser.githubUsername = githubUsername;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          
          // Sync changes in mock users list
          const users = JSON.parse(localStorage.getItem('mock_users'));
          const idx = users.findIndex(u => u.email === currentUser.email);
          if (idx !== -1) {
            users[idx].name = name;
            users[idx].githubUsername = githubUsername;
            localStorage.setItem('mock_users', JSON.stringify(users));
          }
          return currentUser;
        }
        throw err;
      }
    }
  },

  dashboard: {
    getSummary: async () => {
      try {
        return await apiRequest('/dashboard/summary');
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          const githubStats = JSON.parse(localStorage.getItem('mock_github_stats'));
          const codingProgress = JSON.parse(localStorage.getItem('mock_coding'));
          const applications = JSON.parse(localStorage.getItem('mock_placements'));
          const notifications = JSON.parse(localStorage.getItem('mock_notifications'));

          const githubComponent = Math.min(35, (githubStats.streak * 35) / 15);
          const codingComponent = Math.min(35, ((codingProgress.leetcodeProblems + codingProgress.hackerrankProblems) * 35) / 150);
          const appComponent = Math.min(30, (applications.length * 30) / 5);
          const readinessScore = Math.min(100, Math.max(35, githubComponent + codingComponent + appComponent));

          return {
            githubStats,
            codingProgress,
            totalApplications: applications.length,
            activeApplications: applications.filter(a => a.status !== 'SELECTED' && a.status !== 'REJECTED').length,
            readinessScore,
            recentActivities: notifications.slice(0, 5)
          };
        }
        throw err;
      }
    }
  },

  github: {
    syncProfile: async (username) => {
      try {
        return await apiRequest(`/github/sync?username=${username}`, { method: 'POST' });
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          const stats = JSON.parse(localStorage.getItem('mock_github_stats'));
          stats.commits += 15;
          stats.streak += 1;
          stats.longestStreak = Math.max(stats.longestStreak, stats.streak);
          localStorage.setItem('mock_github_stats', JSON.stringify(stats));

          // Also trigger a notification in mock
          const notifs = JSON.parse(localStorage.getItem('mock_notifications'));
          notifs.unshift({
            id: Date.now(),
            message: `GitHub synced for ${username}: Streak is now ${stats.streak} days!`,
            readStatus: false,
            type: 'GITHUB',
            createdDate: new Date().toISOString()
          });
          localStorage.setItem('mock_notifications', JSON.stringify(notifs));

          return stats;
        }
        throw err;
      }
    }
  },

  coding: {
    updateProgress: async (leetcode, hackerrank, weeklyGoal, monthlyGoal) => {
      try {
        return await apiRequest('/coding/update', {
          method: 'POST',
          body: JSON.stringify({ leetcodeProblems: leetcode, hackerrankProblems: hackerrank, weeklyGoals: weeklyGoal, monthlyGoals: monthlyGoal })
        });
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          const progress = JSON.parse(localStorage.getItem('mock_coding'));
          if (leetcode > progress.leetcodeProblems || hackerrank > progress.hackerrankProblems) {
            progress.dailyStreak += 1;
          }
          progress.leetcodeProblems = leetcode;
          progress.hackerrankProblems = hackerrank;
          progress.weeklyGoals = weeklyGoal;
          progress.monthlyGoals = monthlyGoal;
          localStorage.setItem('mock_coding', JSON.stringify(progress));
          return progress;
        }
        throw err;
      }
    }
  },

  placements: {
    getApplications: async () => {
      try {
        return await apiRequest('/placement/applications');
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          return JSON.parse(localStorage.getItem('mock_placements'));
        }
        throw err;
      }
    },

    addApplication: async (companyName, status, appliedDate) => {
      try {
        return await apiRequest('/placement/applications', {
          method: 'POST',
          body: JSON.stringify({ companyName, status, appliedDate })
        });
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          const apps = JSON.parse(localStorage.getItem('mock_placements'));
          const newApp = {
            id: Date.now(),
            companyName,
            status: status.toUpperCase(),
            appliedDate: appliedDate || new Date().toISOString().split('T')[0]
          };
          apps.push(newApp);
          localStorage.setItem('mock_placements', JSON.stringify(apps));
          return newApp;
        }
        throw err;
      }
    },

    updateStatus: async (id, status) => {
      try {
        return await apiRequest(`/placement/applications/${id}/status?status=${status}`, { method: 'PUT' });
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          const apps = JSON.parse(localStorage.getItem('mock_placements'));
          const idx = apps.findIndex(a => a.id === id);
          if (idx !== -1) {
            apps[idx].status = status.toUpperCase();
            localStorage.setItem('mock_placements', JSON.stringify(apps));
            return apps[idx];
          }
          throw new Error('Application not found');
        }
        throw err;
      }
    },

    deleteApplication: async (id) => {
      try {
        return await apiRequest(`/placement/applications/${id}`, { method: 'DELETE' });
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          const apps = JSON.parse(localStorage.getItem('mock_placements'));
          const filtered = apps.filter(a => a.id !== id);
          localStorage.setItem('mock_placements', JSON.stringify(filtered));
          return null;
        }
        throw err;
      }
    }
  },

  resume: {
    getHistory: async () => {
      try {
        return await apiRequest('/resume/history');
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          return JSON.parse(localStorage.getItem('mock_resumes'));
        }
        throw err;
      }
    },

    analyze: async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${API_BASE_URL}/resume/analyze`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        if (!response.ok) throw new Error('Upload error');
        return await response.json();
      } catch (err) {
        // Fallback for mocks
        const history = JSON.parse(localStorage.getItem('mock_resumes'));
        const fileName = file.name.toLowerCase();
        
        let score = 70 + Math.floor(Math.random() * 20);
        let keywords = [];
        let suggestions = [];
        
        if (fileName.includes('java') || fileName.includes('backend')) {
            keywords = ['Microservices', 'Kubernetes', 'CI/CD', 'Kafka'];
            suggestions = ['Expand on distributed databases experience.', 'Define core JUnit testing coverages.'];
        } else if (fileName.includes('frontend') || fileName.includes('react')) {
            keywords = ['TypeScript', 'TailwindCSS', 'Redux Toolkit', 'Next.js'];
            suggestions = ['Incorporate state machines description.', 'Add server-side rendering experience logs.'];
        } else {
            keywords = ['Data Structures', 'Git Version Control', 'Cloud Infrastructure', 'Unit Testing'];
            suggestions = ['Highlight database optimization methods.', 'Mention API security practices.'];
        }

        const newAnalysis = {
          id: Date.now(),
          atsScore: score,
          suggestions: suggestions.join(' | ') || 'Revise formatting to single column layout.',
          missingKeywords: keywords.join(', '),
          strengthAnalysis: 'Clean structure, outlines roles and target projects logically.',
          jdMatchPercentage: score + 3,
          createdDate: new Date().toISOString()
        };

        history.unshift(newAnalysis);
        localStorage.setItem('mock_resumes', JSON.stringify(history));
        return newAnalysis;
      }
    }
  },

  skills: {
    gapAnalysis: async (targetRole) => {
      try {
        return await apiRequest('/skills/gap-analysis', {
          method: 'POST',
          body: JSON.stringify({ targetRole })
        });
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          const userSkills = JSON.parse(localStorage.getItem('mock_skills'));
          
          const reqs = {
            'Java Developer': ['Java', 'Spring Boot', 'MySQL', 'Git', 'REST API', 'Microservices'],
            'Full Stack Developer': ['Java', 'React', 'JavaScript', 'HTML/CSS', 'Spring Boot', 'REST API'],
            'Data Analyst': ['Python', 'SQL', 'Pandas', 'Excel', 'Tableau', 'Statistics'],
            'Cloud Engineer': ['AWS', 'Docker', 'Kubernetes', 'Linux', 'Terraform', 'CI/CD']
          };

          const required = reqs[targetRole] || reqs['Java Developer'];
          const userSkillsLower = userSkills.filter(s => s.skillLevel >= 3).map(s => s.skillName.toLowerCase());
          
          const current = [];
          const missing = [];
          for (let req of required) {
            if (userSkillsLower.includes(req.toLowerCase())) {
              current.push(req);
            } else {
              missing.push(req);
            }
          }

          const score = Math.max(35, Math.min(100, Math.round((current.length * 100) / required.length)));
          const recs = missing.map(m => `Complete training modules in: ${m}`);
          recs.push(score < 70 ? 'Build core projects before applying.' : 'Baselines satisfied. Optimize interview prep.');

          // Save roadmap
          let week = 1;
          const plan = [
            { week: week++, title: 'Core Fundamentals & Goal Definition', completed: true, topics: ['Review active pre-requisites', 'Set up local dev environment'] }
          ];
          for (let mis of missing) {
            plan.push({
              week: week++,
              title: `Deep Dive into ${mis}`,
              completed: false,
              topics: [`Study core guides on ${mis}`, `Build minor portfolio projects for ${mis}`, `Review common interview questions`]
            });
          }
          plan.push({
            week: week,
            title: 'Full Capstone Project & Deployment',
            completed: false,
            topics: ['Integrate all technologies learned', 'Deploy application to cloud', 'Optimize resume descriptions']
          });

          const roadmap = {
            id: Date.now(),
            targetRole,
            completionPercentage: 20,
            generatedPlan: JSON.stringify(plan)
          };
          localStorage.setItem('mock_roadmaps', JSON.stringify(roadmap));

          return {
            targetRole,
            readinessScore: score,
            currentSkills: current,
            requiredSkills: required,
            missingSkills: missing,
            learningRecommendations: recs,
            roadmapJson: JSON.stringify(plan)
          };
        }
        throw err;
      }
    }
  },

  roadmaps: {
    getCurrent: async () => {
      try {
        return await apiRequest('/roadmaps/current');
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          const map = JSON.parse(localStorage.getItem('mock_roadmaps'));
          if (!map) throw new Error('No active roadmap');
          return map;
        }
        throw err;
      }
    },

    updateProgress: async (planJson, completionPercentage) => {
      try {
        return await apiRequest('/roadmaps/update-progress', {
          method: 'POST',
          body: JSON.stringify({ generatedPlan: planJson, completionPercentage })
        });
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          const map = JSON.parse(localStorage.getItem('mock_roadmaps'));
          map.generatedPlan = planJson;
          map.completionPercentage = completionPercentage;
          localStorage.setItem('mock_roadmaps', JSON.stringify(map));
          return map;
        }
        throw err;
      }
    }
  },

  notifications: {
    list: async () => {
      try {
        return await apiRequest('/notifications');
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          return JSON.parse(localStorage.getItem('mock_notifications'));
        }
        throw err;
      }
    },

    markAsRead: async (id) => {
      try {
        return await apiRequest(`/notifications/read/${id}`, { method: 'POST' });
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          const list = JSON.parse(localStorage.getItem('mock_notifications'));
          const idx = list.findIndex(n => n.id === id);
          if (idx !== -1) {
            list[idx].readStatus = true;
            localStorage.setItem('mock_notifications', JSON.stringify(list));
            return list[idx];
          }
          throw new Error('Notification not found');
        }
        throw err;
      }
    }
  },

  admin: {
    getUsers: async () => {
      try {
        return await apiRequest('/admin/users');
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          return JSON.parse(localStorage.getItem('mock_users'));
        }
        throw err;
      }
    },

    updateRole: async (userId, role) => {
      try {
        return await apiRequest(`/admin/users/${userId}/role?role=${role}`, { method: 'PUT' });
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          const users = JSON.parse(localStorage.getItem('mock_users'));
          const idx = users.findIndex(u => u.id === userId);
          if (idx !== -1) {
            users[idx].role = role.toUpperCase();
            localStorage.setItem('mock_users', JSON.stringify(users));
            return users[idx];
          }
          throw new Error('User not found');
        }
        throw err;
      }
    },

    getAnalytics: async () => {
      try {
        return await apiRequest('/admin/analytics');
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          const users = JSON.parse(localStorage.getItem('mock_users'));
          const roadmaps = JSON.parse(localStorage.getItem('mock_roadmaps'));
          const apps = JSON.parse(localStorage.getItem('mock_placements'));
          const resumes = JSON.parse(localStorage.getItem('mock_resumes'));

          const avgAts = resumes.reduce((acc, r) => acc + r.atsScore, 0) / (resumes.length || 1);

          return {
            totalUsers: users.length,
            activeRoadmaps: roadmaps ? 1 : 0,
            totalApplications: apps.length,
            averageAtsScore: Math.round(avgAts * 10) / 10
          };
        }
        throw err;
      }
    },

    getAnnouncements: async () => {
      try {
        return await apiRequest('/admin/announcements');
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          return JSON.parse(localStorage.getItem('mock_announcements'));
        }
        throw err;
      }
    },

    createAnnouncement: async (title, content) => {
      try {
        return await apiRequest('/admin/announcements', {
          method: 'POST',
          body: JSON.stringify({ title, content })
        });
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          const list = JSON.parse(localStorage.getItem('mock_announcements'));
          const newAnn = {
            id: Date.now(),
            title,
            content,
            createdBy: 'Sarah Admin',
            createdDate: new Date().toISOString()
          };
          list.unshift(newAnn);
          localStorage.setItem('mock_announcements', JSON.stringify(list));
          
          // Also create a global notification
          const notifs = JSON.parse(localStorage.getItem('mock_notifications'));
          notifs.unshift({
            id: Date.now(),
            message: `Announcement: ${title}`,
            readStatus: false,
            type: 'GENERAL',
            createdDate: new Date().toISOString()
          });
          localStorage.setItem('mock_notifications', JSON.stringify(notifs));

          return newAnn;
        }
        throw err;
      }
    },

    deleteAnnouncement: async (id) => {
      try {
        return await apiRequest(`/admin/announcements/${id}`, { method: 'DELETE' });
      } catch (err) {
        if (err.message === 'MOCK_TRIGGER' || isMockMode) {
          const list = JSON.parse(localStorage.getItem('mock_announcements'));
          const filtered = list.filter(a => a.id !== id);
          localStorage.setItem('mock_announcements', JSON.stringify(filtered));
          return null;
        }
        throw err;
      }
    }
  }
};

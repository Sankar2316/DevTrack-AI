-- Seed data for DevTrack AI

-- Clean tables before inserting to avoid primary key constraints
DELETE FROM notifications;
DELETE FROM announcements;
DELETE FROM coding_progress;
DELETE FROM roadmaps;
DELETE FROM resume_analyses;
DELETE FROM placement_applications;
DELETE FROM skills;
DELETE FROM github_stats;
DELETE FROM users;

-- Insert Users (Standard Student and Admin)
INSERT INTO users (id, name, email, password, role, github_username) VALUES
(1, 'Alex Student', 'student@devtrack.ai', '$2a$10$8.2MwM8S.4M2G5qWJtXbOuF7b1f5kXp.xL4L4P9qW3Qp1yW.rX7Xy', 'STUDENT', 'alex_dev'),
(2, 'Sarah Admin', 'admin@devtrack.ai', '$2a$10$8.2MwM8S.4M2G5qWJtXbOuF7b1f5kXp.xL4L4P9qW3Qp1yW.rX7Xy', 'ADMIN', 'sarah_admin');

-- GitHub Stats
INSERT INTO github_stats (id, user_id, commits, streak, longest_streak) VALUES
(1, 1, 142, 12, 18),
(2, 2, 850, 0, 42);

-- Skills
INSERT INTO skills (id, user_id, skill_name, skill_level) VALUES
(1, 1, 'Java', 4),
(2, 1, 'Spring Boot', 3),
(3, 1, 'React', 3),
(4, 1, 'MySQL', 4),
(5, 1, 'Docker', 2),
(6, 2, 'Java', 5),
(7, 2, 'AWS', 5);

-- Placement Applications
INSERT INTO placement_applications (id, user_id, company_name, status, applied_date) VALUES
(1, 1, 'Google', 'APPLIED', '2026-06-01'),
(2, 1, 'Microsoft', 'OA_CLEARED', '2026-06-05'),
(3, 1, 'Amazon', 'INTERVIEW_ROUND_1', '2026-06-10'),
(4, 1, 'Meta', 'INTERVIEW_ROUND_2', '2026-06-12'),
(5, 1, 'Netflix', 'HR_ROUND', '2026-06-15'),
(6, 1, 'Stripe', 'SELECTED', '2026-06-18'),
(7, 1, 'Uber', 'REJECTED', '2026-06-02');

-- Resume Analysis
INSERT INTO resume_analyses (id, user_id, ats_score, suggestions, missing_keywords, strength_analysis, jd_match_percentage) VALUES
(1, 1, 78, 'Add more quantification to accomplishments (e.g. "improved response time by 25%"). Add Docker and Kubernetes to technologies section.', 'Kubernetes, Redis, CI/CD pipelines', 'Strong projects section showing React/Spring Boot applications, solid technical summary.', 82);

-- Roadmaps
INSERT INTO roadmaps (id, user_id, target_role, generated_plan, completion_percentage) VALUES
(1, 1, 'Java Developer', '[{"week":1,"title":"Core Java & OOPs","completed":true,"topics":["Inheritance","Polymorphism","Collections Framework","Java 8 Features"]},{"week":2,"title":"Spring Core & Boot Basics","completed":true,"topics":["Dependency Injection","IOC Container","Spring Beans","REST Controllers"]},{"week":3,"title":"Spring Data JPA & Hibernate","completed":false,"topics":["Entity Mappings","Repository Interfaces","H2 Database Integration"]},{"week":4,"title":"Security & Deployments","completed":false,"topics":["Spring Security","JWT Authentication","Docker Containers"]}]', 50);

-- Coding Progress
INSERT INTO coding_progress (id, user_id, leetcode_problems, hackerrank_problems, daily_streak, weekly_goals, monthly_goals) VALUES
(1, 1, 84, 52, 14, 15, 60);

-- Announcements
INSERT INTO announcements (id, title, content, created_by) VALUES
(1, 'Placement Drive Commencing July 1st', 'The campus placement drive will officially start from July 1st. Please update your resumes and github stats.', 'Sarah Admin'),
(2, 'Platform Version 1.0 Release', 'Welcome to DevTrack AI. Explore the AI skill gap analyzer and interactive resume optimizer to gear up for your next role.', 'Sarah Admin');

-- Notifications
INSERT INTO notifications (id, user_id, message, read_status, type) VALUES
(1, 1, 'GitHub contribution sync successful. Daily streak at 12 days!', FALSE, 'GITHUB'),
(2, 1, 'Coding Tracker: You are 5 problems away from your weekly LeetCode goal.', FALSE, 'CODING'),
(3, 1, 'Interview Reminder: Mock interview round with Netflix on June 25th.', FALSE, 'INTERVIEW');

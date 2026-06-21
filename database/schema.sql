-- Database Schema for DevTrack AI

CREATE DATABASE IF NOT EXISTS devtrack_db;
USE devtrack_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'STUDENT',
    github_username VARCHAR(100)
);

-- GitHub Stats Table
CREATE TABLE IF NOT EXISTS github_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    commits INT DEFAULT 0,
    streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    skill_level INT DEFAULT 0, -- 1 to 5 scale
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Placement Applications Table
CREATE TABLE IF NOT EXISTS placement_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL, -- APPLIED, OA_CLEARED, INTERVIEW_ROUND_1, INTERVIEW_ROUND_2, HR_ROUND, SELECTED, REJECTED
    applied_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Resume Analyses Table
CREATE TABLE IF NOT EXISTS resume_analyses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    ats_score INT DEFAULT 0,
    suggestions TEXT,
    missing_keywords VARCHAR(500),
    strength_analysis TEXT,
    jd_match_percentage INT DEFAULT 0,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Roadmaps Table
CREATE TABLE IF NOT EXISTS roadmaps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    target_role VARCHAR(100) NOT NULL,
    generated_plan TEXT NOT NULL, -- Store JSON format plan
    completion_percentage INT DEFAULT 0,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Coding Progress Table
CREATE TABLE IF NOT EXISTS coding_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    leetcode_problems INT DEFAULT 0,
    hackerrank_problems INT DEFAULT 0,
    daily_streak INT DEFAULT 0,
    weekly_goals INT DEFAULT 10, -- number of problems targeted per week
    monthly_goals INT DEFAULT 40,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_by VARCHAR(100) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message VARCHAR(255) NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    type VARCHAR(50) NOT NULL, -- GITHUB, CODING, PLACEMENT, INTERVIEW, GENERAL
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

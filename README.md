# DevTrack AI

DevTrack AI is a full-stack, AI-powered **GitHub Streak and Placement Readiness Tracker** designed for college students and job seekers. The platform helps track coding consistency, GitHub activity, placement preparation, skill gaps, resume quality (ATS score), and job application progress.

---

## 🚀 Features Mapped

1. **Landing Page**: Complete product marketing page, animated feature grids, stepping outlines, and pricing cards.
2. **Dashboard Command Center**: Streak Flame counts, commit progress graphs, active job pipelines summary, unlocked badge achievements, and a peer leaderboard.
3. **GitHub Analytics**: Connect profiles, sync public commit metrics, contribution calendar grid maps, and repository language breakdown.
4. **Coding Tracker**: Track LeetCode & HackerRank progress against custom weekly and monthly targets.
5. **Placement Kanban Board**: Fully interactive drag-and-drop board to manage jobs from Applied to Selected/Rejected.
6. **AI Resume Analyzer**: Interactive ATS scorer circle dials, missing keyword tag scanners, and suggestions lists.
7. **AI Skill Gap Auditor**: Selection grids matching profiles (Cloud, Data, Full-Stack, Java) against baseline competencies.
8. **AI Learning Roadmap**: Milestone checklists automatically updated to track weekly curriculum objectives.
9. **Admin Panel Control**: Secured console containing analytical aggregates, broadcast bulletins publishment boards, and user role overrides.

---

## 🛠️ Tech Stack & Directory Structure

```
c:\Users\DELL\OneDrive\Desktop\GitHub Project
├── database/                 # Relational Database SQL files
│   ├── schema.sql            # Table definitions (MySQL)
│   └── seed.sql              # Database seeding values
│
├── backend/                  # Spring Boot REST API
│   ├── pom.xml               # Maven configuration
│   └── src/main/
│       ├── java/com/devtrack/ai/
│       │   ├── config/       # Spring Security & JWT Filter
│       │   ├── controller/   # REST Controllers
│       │   ├── model/        # JPA Entities & Enums
│       │   ├── payload/      # DTOs / Payloads
│       │   ├── repository/   # JPA Repositories
│       │   └── service/      # Auth, AI logic, and Scrapers
│       └── resources/
│           ├── application.properties
│           └── data.sql      # Dev/Test Startup Seeder
│
└── frontend/                 # Vite + React + Tailwind CSS client
    ├── package.json          # npm dependencies
    ├── tailwind.config.js    # Custom Tailwind styling rules
    ├── index.html            # Entry HTML page
    └── src/
        ├── components/       # Layouts and Route guards
        ├── context/          # Auth & Theme states
        ├── pages/            # Feature Views (Dashboard, Kanban, etc.)
        └── services/         # api.js Client & Mock engines
```

---

## ⚙️ Getting Started: Execution Guide

### Prerequisite Check
Ensure you have the following installed on your machine:
- **Java 17 Development Kit (JDK)**
- **Maven** (to compile the Java backend)
- **Node.js** and **npm**

---

### Step 1: Initialize Spring Boot Backend
Navigate to the backend directory and run compiling actions:

```bash
cd backend
# Compile and boot application
mvn spring-boot:run
```
The REST server initializes on port `8080`.

#### H2-to-MySQL Database Selection:
By default, the backend runs with an in-memory **H2 Database** and auto-seeds the tables on launch from `data.sql` so that the app works instantly with zero setup. 
To switch to a local **MySQL Server**, open `backend/src/main/resources/application.properties`, comment the H2 datasource block, and uncomment the MySQL section:
```properties
# MySQL Connection Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/devtrack_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

---

### Step 2: Spin Up React Client
Navigate to the frontend directory, install npm modules, and boot Vite dev server:

```bash
cd ../frontend
# Install routing, icons, and charts libraries
npm install

# Launch Vite local server
npm run dev
```
The client opens in your browser at `http://localhost:3000` (or `http://localhost:5173`).

---

## 🔑 Testing Preset Credentials

Use these accounts to test student and admin flows (password for both is `password`):
* **Student View**: `student@devtrack.ai`
* **Admin View**: `admin@devtrack.ai`

---

## 🧪 Unified Offline Mock Mode
If the React application detects that the Spring Boot REST API is offline on startup, it will automatically switch to **Demo Sandbox Mode** and load a stateful client-side mock backend backed by `localStorage` (pre-seeded with data matching the SQL seed file). 
All features (editing profiles, changing passwords, drag-and-drop Kanban, checking milestones, uploading resumes, role selection) will remain **100% functional and interactive** on the client side!

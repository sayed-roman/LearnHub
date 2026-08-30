# LearnHub — Learning Management System

A full-stack LMS built with **Next.js** (frontend) and **Strapi** (backend/CMS), featuring role-based access control, course management, progress tracking, quizzes, an admin panel, and a blog.

## Live Links

- **Frontend (Vercel):** https://learn-hub-ten-mauve.vercel.app
- **Backend (Railway):** https://learnhub-production-32ee.up.railway.app

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend:** Strapi 5, PostgreSQL (production) / SQLite (local dev)
- **Deployment:** Vercel (frontend), Railway (backend + database)

## Features

### Roles
Four roles with distinct permissions, enforced on the backend (not just hidden in the UI):
- **Admin** — full platform control, manages users and roles
- **Content Manager** — manages courses, lessons, quizzes, and blog posts platform-wide
- **Instructor** — manages their own courses, lessons, and quizzes
- **Student** — enrolls in courses, completes lessons, takes quizzes, tracks progress

### Core Features
- Authentication (signup/login) with role-based protected routes
- Course browsing, details, and enrollment
- Sequential lesson viewing

### Differentiator Features
- Per-student, per-course progress tracking with a visual progress bar
- Multiple-choice quizzes with automatic grading and retry
- Admin panel with user/role management and platform stats
- Blog with draft/published workflow

## Project Structure

```
LearnHub/
  learnhub-backend/    Strapi CMS (content-types, roles, permissions, custom controllers)
  learnhub-frontend/   Next.js app (all pages and UI)
```

## Running Locally

### Backend
```bash
cd learnhub-backend
npm install
npm run develop
```
Runs on `http://localhost:1337`. First run will prompt you to create a Strapi admin account.

### Frontend
```bash
cd learnhub-frontend
npm install
npm run dev
```
Runs on `http://localhost:3000`. Create a `.env.local` file with:
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

### First-time Strapi setup
After starting the backend for the first time, in the Strapi admin panel (`/admin`):
1. Create the 4 roles (Admin, Content Manager, Instructor, Student) under Settings → Users & Permissions → Roles
2. Set permissions per role (see `docs/permissions.md` if included, or the video walkthrough)
3. Set the default role for new signups to **Student** under Advanced Settings
4. Enable `find`/`findOne` for Course, Lesson, and BlogPost on the **Public** role

## Notes on Backend Design

- Role-based "own data only" access (e.g., an Instructor can only edit their own courses) is enforced via custom Strapi controllers using the Document Service API — not just hidden in the frontend.
- A few endpoints (`/api/me-with-role`, `/api/user-roles/:id`) are custom-built to work around known Strapi v5 limitations with the built-in `/api/users/me` populate behavior and relation validation for the User model.

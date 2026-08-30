# LearnHub — Frontend

The frontend application for **LearnHub**, a full-stack Learning Management System (LMS) built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.

The frontend communicates with a **Strapi 5 backend** through REST APIs and provides role-based interfaces for Admins, Content Managers, Instructors, and Students.

## 🌐 Live Application

**Frontend:**
https://learn-hub-ten-mauve.vercel.app

**Backend API:**
https://learnhub-production-32ee.up.railway.app

---

## 🚀 Tech Stack

* **Next.js 15**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Next.js App Router**
* **Strapi REST API**
* **Vercel** — Deployment

---

## ✨ Features

### 🔐 Authentication

* User registration
* User login
* Logout
* Authentication state management
* Protected routes
* Role-based access control

### 👥 Role-Based Interfaces

The application provides different interfaces based on the authenticated user's role:

* **Admin**

  * Platform administration
  * User and role management
  * Platform statistics

* **Content Manager**

  * Course management
  * Lesson management
  * Quiz management
  * Blog management

* **Instructor**

  * Manage own courses
  * Manage own lessons
  * Manage own quizzes

* **Student**

  * Browse courses
  * Enroll in courses
  * Complete lessons
  * Take quizzes
  * Track course progress

### 📚 Course Management

* Course listing
* Course details
* Course enrollment
* Lesson navigation
* Sequential lesson viewing
* Course progress tracking

### 📊 Progress Tracking

Students can track their learning progress through:

* Completed lessons
* Total lessons
* Completion percentage
* Visual progress bar
* Per-course progress

### 📝 Quiz System

* Multiple-choice quizzes
* Automatic grading
* Score calculation
* Quiz retry functionality
* Student-specific quiz results

### 📰 Blog

* Blog post listing
* Blog post details
* Published content
* Draft/published workflow support

### 🛡️ Protected UI

The frontend conditionally displays pages and actions according to the authenticated user's role.

> **Important:** Frontend protection is only for the user experience. Actual authorization is enforced by the Strapi backend.

---

## 📁 Project Structure

```text
learnhub-frontend/
│
├── app/
│   ├── admin/
│   ├── courses/
│   ├── dashboard/
│   ├── blog/
│   ├── login/
│   ├── register/
│   └── ...
│
├── components/
│   ├── ui/
│   ├── courses/
│   ├── quizzes/
│   └── ...
│
├── lib/
│   ├── api/
│   ├── auth/
│   └── ...
│
├── public/
│
├── types/
│
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

> The exact folder structure may vary depending on the current implementation.

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd LearnHub/learnhub-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the frontend root directory:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

For production:

```env
NEXT_PUBLIC_STRAPI_URL=https://learnhub-production-32ee.up.railway.app
```

### 4. Start Development Server

```bash
npm run dev
```

The application will run at:

```text
http://localhost:3000
```

---

## 🔗 Backend Connection

The frontend requires the LearnHub Strapi backend to be running.

Local development:

```text
Next.js
   │
   │ REST API
   ▼
Strapi
   │
   ▼
PostgreSQL / SQLite
```

The API base URL is configured through:

```env
NEXT_PUBLIC_STRAPI_URL
```

---

## 🏗️ Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

## ☁️ Deployment

The frontend is deployed using **Vercel**.

Production frontend:

https://learn-hub-ten-mauve.vercel.app

When deploying, configure the following environment variable in Vercel:

```env
NEXT_PUBLIC_STRAPI_URL=https://learnhub-production-32ee.up.railway.app
```

---

## 🔒 Security

The frontend implements:

* Protected routes
* Role-based UI
* Authentication handling
* API-based authorization checks

However, frontend restrictions should **never be considered the primary security layer**.

All sensitive authorization and ownership checks are handled by the backend.

---

## 🔄 Frontend Architecture

```text
User
 │
 ▼
Next.js UI
 │
 ├── Authentication
 ├── Courses
 ├── Lessons
 ├── Quizzes
 ├── Progress
 ├── Blog
 └── Admin Dashboard
 │
 ▼
Strapi REST API
 │
 ▼
Database
```

---

## 📌 Related Project

Backend repository:

```text
learnhub-backend/
```

See the backend README for Strapi installation, content types, permissions, controllers, and API configuration.

---

## 👨‍💻 Project

**LearnHub — Learning Management System**

Built using Next.js, TypeScript, Tailwind CSS, Strapi, and PostgreSQL.

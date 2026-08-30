# LearnHub — Backend

The backend and content management system for **LearnHub**, a full-stack Learning Management System (LMS) built with **Strapi 5** and **PostgreSQL**.

The backend provides REST APIs, authentication, role-based authorization, course management, lesson management, quizzes, progress tracking, user management, and blog content management.

## 🌐 Production API

**Backend:**
https://learnhub-production-32ee.up.railway.app

**Frontend:**
https://learn-hub-ten-mauve.vercel.app

---

## 🚀 Tech Stack

* **Strapi 5**
* **Node.js**
* **PostgreSQL** — Production
* **SQLite** — Local development
* **REST API**
* **Document Service API**
* **Railway** — Backend and database deployment

---

## ✨ Features

### 🔐 Authentication

The backend provides authentication functionality including:

* User registration
* User login
* JWT-based authentication
* Current user information
* Role information
* Protected API endpoints

---

## 👥 Role-Based Access Control

LearnHub uses four application-level roles:

| Role                | Main Responsibility                        |
| ------------------- | ------------------------------------------ |
| **Admin**           | Full platform control                      |
| **Content Manager** | Manage platform content                    |
| **Instructor**      | Manage own courses and educational content |
| **Student**         | Enroll and consume courses                 |

Authorization is enforced on the **backend**, rather than relying only on frontend visibility.

---

## 🛡️ Authorization & Ownership

One of the main backend design decisions is enforcing **ownership-based authorization**.

For example:

> An Instructor should only be able to modify courses that belong to that Instructor.

This is implemented through custom Strapi controllers and the **Document Service API**.

Therefore, hiding an edit button in the frontend is not considered sufficient security.

The backend validates:

```text
Authenticated User
        │
        ▼
      Role
        │
        ▼
Resource Ownership
        │
        ▼
Allow / Deny Request
```

---

## 📚 Core Content

The backend manages several major resources.

### Courses

Courses contain information such as:

* Title
* Description
* Instructor
* Lessons
* Enrollment information
* Course metadata

### Lessons

Lessons are associated with courses and support sequential learning.

### Quizzes

The quiz system supports:

* Multiple-choice questions
* Answer options
* Correct answers
* Automatic grading
* Student attempts
* Quiz results

### Progress

Progress data is maintained per:

```text
Student + Course
```

This allows each student to have an independent progress record for every enrolled course.

### Blog Posts

Blog content supports a publishing workflow:

```text
Draft → Published
```

---

## 📁 Project Structure

```text
learnhub-backend/
│
├── config/
│   ├── database.*
│   ├── server.*
│   └── ...
│
├── src/
│   ├── api/
│   │   ├── course/
│   │   ├── lesson/
│   │   ├── quiz/
│   │   ├── blog-post/
│   │   ├── progress/
│   │   └── ...
│   │
│   ├── extensions/
│   │
│   └── index.*
│
├── public/
├── database/
├── package.json
├── .env
└── README.md
```

> The exact structure may vary depending on the implemented Strapi content types and customizations.

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd LearnHub/learnhub-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend root directory.

Example:

```env
HOST=0.0.0.0
PORT=1337

APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

For production, configure PostgreSQL and use secure randomly generated secrets.

> Never commit `.env` files or production secrets to GitHub.

---

## 🗄️ Database

### Local Development

The project can use SQLite for local development:

```env
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

### Production

The deployed application uses:

```text
PostgreSQL
```

The backend and production database are hosted on Railway.

---

## ▶️ Running the Backend

Start the Strapi development server:

```bash
npm run develop
```

The backend will be available at:

```text
http://localhost:1337
```

The Strapi administration panel is available at:

```text
http://localhost:1337/admin
```

---

## 👤 First-Time Strapi Setup

After starting Strapi for the first time:

### 1. Create Admin Account

Open:

```text
http://localhost:1337/admin
```

Create the Strapi administrator account.

### 2. Create Application Roles

Navigate to:

```text
Settings
→ Users & Permissions Plugin
→ Roles
```

Create:

* Admin
* Content Manager
* Instructor
* Student

### 3. Configure Permissions

Configure permissions according to each role's responsibility.

For example:

```text
Admin
 └── Full access

Content Manager
 ├── Courses
 ├── Lessons
 ├── Quizzes
 └── Blog Posts

Instructor
 ├── Own Courses
 ├── Own Lessons
 └── Own Quizzes

Student
 ├── View Courses
 ├── Enroll
 ├── Complete Lessons
 ├── Take Quizzes
 └── Track Progress
```

### 4. Configure Default Signup Role

Set:

```text
Student
```

as the default role for newly registered users.

### 5. Configure Public Permissions

Enable the required `find` and `findOne` permissions for public course, lesson, and blog content where appropriate.

---

## 🔌 API

The frontend communicates with the backend through Strapi REST APIs.

Example:

```text
GET /api/courses
GET /api/courses/:id
GET /api/lessons
GET /api/blog-posts
```

Authenticated requests use the user's authentication token.

---

## 🧩 Custom Endpoints

The backend includes custom endpoints to address specific Strapi v5 requirements.

### Current User With Role

```text
/api/me-with-role
```

This endpoint provides authenticated user information together with role information.

### User Role

```text
/api/user-roles/:id
```

This endpoint provides role information for a specific user.

These custom endpoints help work around limitations related to Strapi v5's built-in User model population and relation handling.

---

## 🏗️ Backend Architecture

```text
Next.js Frontend
       │
       │ REST API
       ▼
┌──────────────────────┐
│      Strapi 5        │
│                      │
│ Authentication       │
│ Role Authorization   │
│ Custom Controllers   │
│ Document Service API │
│ Content Types        │
└──────────┬───────────┘
           │
           ▼
      PostgreSQL
```

---

## 🔒 Security

The backend is responsible for enforcing authorization.

Important security principles include:

* Authentication before protected operations
* Role-based authorization
* Resource ownership validation
* Server-side permission checks
* Protected custom controllers
* Secure environment variables
* JWT authentication

For example:

```text
Instructor A
     │
     ├── Course A ✅ Edit
     │
     └── Course B ❌ Edit denied
                  │
                  ▼
          Owned by Instructor B
```

This prevents users from bypassing frontend restrictions by directly calling the API.

---

## 🧪 Development

Run Strapi in development mode:

```bash
npm run develop
```

Build the application:

```bash
npm run build
```

Start production mode:

```bash
npm run start
```

---

## ☁️ Deployment

The backend is deployed on **Railway**.

Production API:

https://learnhub-production-32ee.up.railway.app

The production environment uses PostgreSQL.

Required production environment variables should be configured through Railway's environment variable settings rather than committed to the repository.

---

## 🔗 Frontend Integration

The LearnHub frontend is built with Next.js and communicates with this backend through REST APIs.

```text
learnhub-frontend
        │
        │ HTTP / REST API
        ▼
learnhub-backend
        │
        ▼
   PostgreSQL
```

Frontend environment variable:

```env
NEXT_PUBLIC_STRAPI_URL=https://learnhub-production-32ee.up.railway.app
```

---

## 📌 Related Project

Frontend repository:

```text
learnhub-frontend/
```

See the frontend README for Next.js installation, UI architecture, environment variables, and frontend deployment.

---

## 👨‍💻 Project

**LearnHub — Learning Management System**

Built with Strapi 5, Node.js, PostgreSQL, and Next.js.

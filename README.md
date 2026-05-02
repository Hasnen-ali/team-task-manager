# TaskFlow — Team Task Manager

A full-stack Team Task Manager built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js).

---

## Features

- **JWT Authentication** — Secure signup/login with bcrypt password hashing
- **Role-Based Access Control** — Admin and Member roles with different permissions
- **Project Management** — Create, update, delete projects; add/remove team members
- **Task Management** — Full CRUD with assignment, status tracking, priority, and due dates
- **Dashboard** — Summary stats: total tasks, completed, in-progress, overdue, completion rate
- **Pagination & Filtering** — Filter tasks by project, status, priority, and search by title
- **Toast Notifications** — Real-time feedback on all actions
- **Loading States** — Spinners and disabled states during async operations
- **Responsive UI** — Tailwind CSS with clean, modern design

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS        |
| Forms     | React Hook Form                     |
| HTTP      | Axios                               |
| Routing   | React Router v6                     |
| Toasts    | react-hot-toast                     |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB with Mongoose               |
| Auth      | JWT + bcryptjs                      |
| Validation| express-validator                   |

---

## Project Structure

```
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Route handlers (MVC)
│   ├── middleware/     # Auth, error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   └── server.js       # Entry point
│
├── frontend/
│   └── src/
│       ├── api/        # Axios API calls
│       ├── components/ # Reusable UI components
│       ├── context/    # Auth context
│       └── pages/      # Route pages
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd team-task-manager
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 3. Seed dummy data (optional but recommended)
```bash
cd backend
npm run seed
```

This inserts **6 users**, **5 projects**, and **30 tasks** with realistic data.

**Demo login credentials** (all passwords: `password123`):

| Email | Role |
|---|---|
| alice@taskflow.com | Admin |
| frank@taskflow.com | Admin |
| bob@taskflow.com | Member |
| carol@taskflow.com | Member |
| david@taskflow.com | Member |
| eva@taskflow.com | Member |

### 3. Frontend setup
```bash
cd frontend
npm install
cp .env.example .env
# .env already points to localhost:5000 for local dev
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/team-task-manager
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

---

## API Endpoints

### Auth
| Method | Endpoint              | Access  | Description        |
|--------|-----------------------|---------|--------------------|
| POST   | /api/auth/register    | Public  | Register user      |
| POST   | /api/auth/login       | Public  | Login user         |
| GET    | /api/auth/me          | Private | Get current user   |
| GET    | /api/auth/users       | Private | List all users     |

### Projects
| Method | Endpoint                          | Access       |
|--------|-----------------------------------|--------------|
| GET    | /api/projects                     | Private      |
| POST   | /api/projects                     | Admin only   |
| GET    | /api/projects/:id                 | Private      |
| PUT    | /api/projects/:id                 | Admin only   |
| DELETE | /api/projects/:id                 | Admin only   |
| POST   | /api/projects/:id/members         | Admin only   |
| DELETE | /api/projects/:id/members/:userId | Admin only   |

### Tasks
| Method | Endpoint       | Access                    |
|--------|----------------|---------------------------|
| GET    | /api/tasks     | Private (filtered by role)|
| POST   | /api/tasks     | Admin only                |
| GET    | /api/tasks/:id | Private                   |
| PUT    | /api/tasks/:id | Admin (all) / Member (status only) |
| DELETE | /api/tasks/:id | Admin only                |

### Dashboard
| Method | Endpoint       | Access  |
|--------|----------------|---------|
| GET    | /api/dashboard | Private |

---

## Deployment on Render

### Backend
1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo, set root directory to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`

### Frontend
1. Create a new **Static Site** on Render
2. Connect your GitHub repo, set root directory to `frontend`
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
6. Add a rewrite rule: `/* → /index.html` (for SPA routing)

---

## Role Permissions

| Action                    | Admin | Member |
|---------------------------|-------|--------|
| Create/delete projects    | ✅    | ❌     |
| Add/remove members        | ✅    | ❌     |
| Create/delete tasks       | ✅    | ❌     |
| Assign tasks              | ✅    | ❌     |
| Update task status        | ✅    | ✅ (own tasks only) |
| View all projects/tasks   | ✅    | ❌ (own only) |

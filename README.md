# 📋 TaskFlow — Team Task Manager

A full-stack **Team Task Manager** built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

![Tech Stack](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

---

## 🌐 Live Demo

| | URL |
|---|---|
| 🔺 **Frontend (Vercel)** | [https://team-task-manager-five-delta.vercel.app](https://team-task-manager-five-delta.vercel.app) |
| ⚙️ **Backend API (Render)** | [https://taskflow-backend-23i0.onrender.com](https://taskflow-backend-23i0.onrender.com) |

> ⚠️ **Note:** Backend is on Render free tier — first request may take **30-60 seconds** to wake up after inactivity.

---

## 🔐 Demo Accounts

> Click any account card on the login page to instantly log in!
> All passwords: `password123`

| Name | Email | Role |
|---|---|---|
| 👑 Alice Admin | alice@taskflow.com | **Admin** |
| 👑 Frank Manager | frank@taskflow.com | **Admin** |
| 👤 Bob Builder | bob@taskflow.com | Member |
| 👤 Carol Designer | carol@taskflow.com | Member |
| 👤 David Dev | david@taskflow.com | Member |
| 👤 Eva Engineer | eva@taskflow.com | Member |

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure signup/login with bcrypt password hashing
- 👥 **Role-Based Access** — Admin and Member roles with different permissions
- 📁 **Project Management** — Create, update, delete projects; add/remove team members
- ✅ **Task Management** — Full CRUD with assignment, status, priority, and due dates
- 📊 **Dashboard** — Summary stats: total, completed, in-progress, overdue, completion rate
- 🔍 **Search & Filter** — Filter tasks by project, status, priority, search by title
- 📄 **Pagination** — Tasks paginated for better performance
- 🔔 **Toast Notifications** — Real-time feedback on all actions
- ⏳ **Loading States** — Spinners during async operations
- 📱 **Responsive UI** — Works on desktop and mobile

---

## 🗂️ Project Structure

```
team-task-manager/
│
├── backend/                   # Node.js + Express API
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/           # Route logic (MVC)
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protect + adminOnly
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── seedRoutes.js
│   ├── seed.js                # Demo data script (local)
│   ├── server.js              # Entry point
│   ├── package.json
│   └── .env.example           # Environment variables template
│
├── frontend/                  # React + Vite + Tailwind
│   ├── src/
│   │   ├── api/               # Axios API calls
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Auth context (JWT)
│   │   └── pages/             # Route pages
│   │       ├── LoginPage.jsx
│   │       ├── RegisterPage.jsx
│   │       ├── DashboardPage.jsx
│   │       ├── ProjectsPage.jsx
│   │       ├── ProjectDetailPage.jsx
│   │       └── TasksPage.jsx
│   ├── vercel.json            # SPA routing fix for Vercel
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Local Setup — Step by Step

### Prerequisites

Make sure these are installed:

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) (local) **OR** [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud)
- [Git](https://git-scm.com/)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Hasnen-ali/team-task-manager.git
cd team-task-manager
```

---

### Step 2 — Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
SEED_SECRET=taskflow_seed_2024
```

> **Using MongoDB Atlas?** Replace `MONGO_URI` with:
> `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/team-task-manager`

---

### Step 3 — Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
```

No `.env` needed for local — the app auto-detects dev mode and uses the Vite proxy.

---

### Step 4 — Start the App

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
✅ Expected:
```
Server running on port 5000
MongoDB Connected: localhost
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
✅ Expected:
```
➜  Local:   http://localhost:3000/
```

---

### Step 5 — Seed Demo Data

**Terminal 3** (while backend is running):

```bash
cd backend
npm run seed
```

✅ Expected:
```
✅ Connected to MongoDB
👤 Created 6 users
📁 Created 5 projects
✅ Created 30 tasks
🌱 Seed completed successfully!
```

---

### Step 6 — Open in Browser

```
http://localhost:3000
```

Click any **demo account card** on the login page to instantly log in!

---

## 🌱 Demo Data

| | Count |
|---|---|
| Users | 6 (2 Admins, 4 Members) |
| Projects | 5 (Active, On Hold, Completed) |
| Tasks | 30 (Todo, In Progress, Completed, Overdue) |

---

## 🔒 Role Permissions

| Action | Admin | Member |
|---|---|---|
| Create / delete projects | ✅ | ❌ |
| Add / remove members | ✅ | ❌ |
| Create / delete tasks | ✅ | ❌ |
| Assign tasks to users | ✅ | ❌ |
| Update task status | ✅ | ✅ (own tasks only) |
| View all projects & tasks | ✅ | ❌ (own only) |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Private | Get current user |
| GET | `/api/auth/users` | Private | Get all users |

### Projects
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/projects` | Private | Get all projects |
| POST | `/api/projects` | Admin | Create project |
| GET | `/api/projects/:id` | Private | Get project by ID |
| PUT | `/api/projects/:id` | Admin | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project |
| POST | `/api/projects/:id/members` | Admin | Add member |
| DELETE | `/api/projects/:id/members/:userId` | Admin | Remove member |

### Tasks
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/tasks` | Private | Get tasks (filtered + paginated) |
| POST | `/api/tasks` | Admin | Create task |
| GET | `/api/tasks/:id` | Private | Get task by ID |
| PUT | `/api/tasks/:id` | Admin/Member | Update task |
| DELETE | `/api/tasks/:id` | Admin | Delete task |

### Dashboard
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/dashboard` | Private | Get summary stats |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Styling | Tailwind CSS |
| Forms | React Hook Form |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Notifications | react-hot-toast |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT + bcryptjs |
| Validation | express-validator |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |
| Database Host | MongoDB Atlas |

---

## ☁️ Deployment

### Backend → Render
| Field | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Environment Variables | `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV=production`, `SEED_SECRET` |

### Frontend → Vercel
| Field | Value |
|---|---|
| Root Directory | `frontend` |
| Framework | `Vite` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

> No environment variables needed on Vercel — API URL is auto-detected at build time.

---

## ❗ Common Issues

| Error | Fix |
|---|---|
| `MongoDB connection error` | Check `MONGO_URI` in `.env`, make sure MongoDB is running |
| `Port 5000 already in use` | Change `PORT=5001` in `backend/.env` |
| `Cannot find module` | Run `npm install` inside `backend/` and `frontend/` |
| Frontend shows blank page | Make sure backend is running on port 5000 |
| Render first request slow | Free tier sleeps — wait 30-60 sec for wake up |
| GitHub push asks for password | Use a [Personal Access Token](https://github.com/settings/tokens) |

---

## 📄 License

MIT License — free to use and modify.

---

> Built with ❤️ using the MERN Stack | Deployed on Vercel + Render + MongoDB Atlas

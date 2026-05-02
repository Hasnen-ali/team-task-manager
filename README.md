# 📋 TaskFlow — Team Task Manager

A full-stack **Team Task Manager** built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

![Tech Stack](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure signup/login with bcrypt password hashing
- 👥 **Role-Based Access** — Admin and Member roles with different permissions
- 📁 **Project Management** — Create, update, delete projects; add/remove team members
- ✅ **Task Management** — Full CRUD with assignment, status, priority, and due dates
- 📊 **Dashboard** — Summary stats: total, completed, in-progress, overdue tasks
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
├── backend/                  # Node.js + Express API
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/          # Route logic (MVC)
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
│   │   └── dashboardRoutes.js
│   ├── seed.js               # Demo data script
│   ├── server.js             # Entry point
│   ├── package.json
│   └── .env.example          # Environment variables template
│
├── frontend/                 # React + Vite + Tailwind
│   └── src/
│       ├── api/              # Axios API calls
│       ├── components/       # Reusable UI components
│       ├── context/          # Auth context (JWT)
│       └── pages/            # Route pages
│           ├── LoginPage.jsx
│           ├── RegisterPage.jsx
│           ├── DashboardPage.jsx
│           ├── ProjectsPage.jsx
│           ├── ProjectDetailPage.jsx
│           └── TasksPage.jsx
│
├── .gitignore
└── README.md
```

---

## 🚀 Local Setup — Step by Step

### Prerequisites

Make sure these are installed on your system:

- [Node.js](https://nodejs.org/) v18 or higher
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
```

Create the `.env` file:

```bash
cp .env.example .env
```

Now open `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

> **Using MongoDB Atlas?** Replace `MONGO_URI` with your Atlas connection string:
> `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/team-task-manager`

---

### Step 3 — Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
```

Create the `.env` file:

```bash
cp .env.example .env
```

The default `frontend/.env` already points to localhost — no changes needed for local dev:

```env
VITE_API_URL=http://localhost:5000/api
```

---

### Step 4 — Start the App

You need **2 terminals** running simultaneously:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
✅ Expected output:
```
Server running on port 5000
MongoDB Connected: localhost
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
✅ Expected output:
```
  VITE v5.x.x  ready in 500ms
  ➜  Local:   http://localhost:3000/
```

---

### Step 5 — Seed Demo Data (Recommended)

Open a **third terminal** (while backend is running):

```bash
cd backend
npm run seed
```

✅ Expected output:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
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

The login page shows **demo account cards** — just click any card to instantly log in!

---

## 🔐 Demo Accounts

> All accounts use password: `password123`

| Name | Email | Role |
|---|---|---|
| Alice Admin | alice@taskflow.com | **Admin** |
| Frank Manager | frank@taskflow.com | **Admin** |
| Bob Builder | bob@taskflow.com | Member |
| Carol Designer | carol@taskflow.com | Member |
| David Dev | david@taskflow.com | Member |
| Eva Engineer | eva@taskflow.com | Member |

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
| GET | `/api/tasks` | Private | Get tasks (filtered) |
| POST | `/api/tasks` | Admin | Create task |
| GET | `/api/tasks/:id` | Private | Get task by ID |
| PUT | `/api/tasks/:id` | Admin/Member | Update task |
| DELETE | `/api/tasks/:id` | Admin | Delete task |

### Dashboard
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/dashboard` | Private | Get summary stats |

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

---

## ☁️ Deployment on Render

### Backend (Web Service)
1. Go to [render.com](https://render.com) → New → **Web Service**
2. Connect your GitHub repo
3. Set **Root Directory** → `backend`
4. **Build Command** → `npm install`
5. **Start Command** → `npm start`
6. Add **Environment Variables**:
   - `MONGO_URI` → your MongoDB Atlas URI
   - `JWT_SECRET` → any random secret string
   - `CLIENT_URL` → your frontend Render URL
   - `NODE_ENV` → `production`

### Frontend (Static Site)
1. Go to [render.com](https://render.com) → New → **Static Site**
2. Connect your GitHub repo
3. Set **Root Directory** → `frontend`
4. **Build Command** → `npm install && npm run build`
5. **Publish Directory** → `dist`
6. Add **Environment Variable**:
   - `VITE_API_URL` → your backend Render URL + `/api`
7. Add **Rewrite Rule**: `/*` → `/index.html` (for SPA routing)

---

## ❗ Common Issues

| Error | Fix |
|---|---|
| `MongoDB connection error` | Check `MONGO_URI` in `.env`, make sure MongoDB is running |
| `Port 5000 already in use` | Change `PORT=5001` in `backend/.env` |
| `Cannot find module` | Run `npm install` inside `backend/` and `frontend/` folders |
| Frontend shows blank page | Make sure backend is running on port 5000 |
| Seed fails | Make sure backend `.env` has correct `MONGO_URI` |
| GitHub push asks for password | Use a [Personal Access Token](https://github.com/settings/tokens) instead |

---

## 📄 License

MIT License — free to use and modify.

---

> Built with ❤️ using the MERN Stack

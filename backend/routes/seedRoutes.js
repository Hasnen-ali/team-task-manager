const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Seed demo data — only works with correct secret key
// @route   POST /api/seed?secret=YOUR_SEED_SECRET
// @access  Protected by secret key
router.post('/', async (req, res) => {
  try {
    // Secret key check — prevent unauthorized seeding
    const secret = req.query.secret || req.body.secret;
    if (secret !== process.env.SEED_SECRET) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    // ── Users ──────────────────────────────────────────────────────────────
    const usersData = [
      { name: 'Alice Admin',    email: 'alice@taskflow.com',  password: 'password123', role: 'Admin'  },
      { name: 'Frank Manager',  email: 'frank@taskflow.com',  password: 'password123', role: 'Admin'  },
      { name: 'Bob Builder',    email: 'bob@taskflow.com',    password: 'password123', role: 'Member' },
      { name: 'Carol Designer', email: 'carol@taskflow.com',  password: 'password123', role: 'Member' },
      { name: 'David Dev',      email: 'david@taskflow.com',  password: 'password123', role: 'Member' },
      { name: 'Eva Engineer',   email: 'eva@taskflow.com',    password: 'password123', role: 'Member' },
    ];

    const users = await User.create(usersData);
    const alice = users.find(u => u.email === 'alice@taskflow.com');
    const frank = users.find(u => u.email === 'frank@taskflow.com');
    const bob   = users.find(u => u.email === 'bob@taskflow.com');
    const carol = users.find(u => u.email === 'carol@taskflow.com');
    const david = users.find(u => u.email === 'david@taskflow.com');
    const eva   = users.find(u => u.email === 'eva@taskflow.com');

    // ── Projects ───────────────────────────────────────────────────────────
    const projectsData = [
      {
        name: 'Website Redesign',
        description: 'Complete overhaul of the company website with modern UI/UX, improved performance, and mobile responsiveness.',
        createdBy: alice._id,
        members: [alice._id, bob._id, carol._id, david._id],
        status: 'Active',
      },
      {
        name: 'Mobile App Development',
        description: 'Build a cross-platform mobile application for iOS and Android using React Native.',
        createdBy: alice._id,
        members: [alice._id, david._id, eva._id],
        status: 'Active',
      },
      {
        name: 'E-Commerce Platform',
        description: 'Develop a full-featured e-commerce platform with payment integration, inventory management, and analytics.',
        createdBy: frank._id,
        members: [frank._id, bob._id, carol._id, eva._id],
        status: 'Active',
      },
      {
        name: 'Internal HR Portal',
        description: 'Build an internal HR management portal for employee onboarding, leave management, and performance reviews.',
        createdBy: frank._id,
        members: [frank._id, alice._id, bob._id],
        status: 'On Hold',
      },
      {
        name: 'API Integration Suite',
        description: 'Integrate third-party APIs including payment gateways, SMS providers, and analytics platforms.',
        createdBy: alice._id,
        members: [alice._id, david._id, eva._id, frank._id],
        status: 'Completed',
      },
    ];

    const projects = await Project.create(projectsData);
    const web   = projects.find(p => p.name === 'Website Redesign');
    const mob   = projects.find(p => p.name === 'Mobile App Development');
    const ecom  = projects.find(p => p.name === 'E-Commerce Platform');
    const hr    = projects.find(p => p.name === 'Internal HR Portal');
    const api   = projects.find(p => p.name === 'API Integration Suite');

    // ── Tasks ──────────────────────────────────────────────────────────────
    const now = new Date();
    const future = n => new Date(now.getTime() + n * 86400000);
    const past   = n => new Date(now.getTime() - n * 86400000);

    const tasksData = [
      // Website Redesign
      { title: 'Create wireframes for homepage',       projectId: web._id,  assignedTo: carol._id, createdBy: alice._id, status: 'Completed',   priority: 'High',   dueDate: past(10)   },
      { title: 'Set up React project structure',       projectId: web._id,  assignedTo: david._id, createdBy: alice._id, status: 'Completed',   priority: 'High',   dueDate: past(8)    },
      { title: 'Implement responsive navigation',      projectId: web._id,  assignedTo: bob._id,   createdBy: alice._id, status: 'In Progress', priority: 'High',   dueDate: future(3)  },
      { title: 'Design hero section with animations',  projectId: web._id,  assignedTo: carol._id, createdBy: alice._id, status: 'In Progress', priority: 'Medium', dueDate: future(5)  },
      { title: 'Optimize images and assets',           projectId: web._id,  assignedTo: david._id, createdBy: alice._id, status: 'Todo',        priority: 'Medium', dueDate: future(10) },
      { title: 'Write SEO meta tags and sitemap',      projectId: web._id,  assignedTo: bob._id,   createdBy: alice._id, status: 'Todo',        priority: 'Low',    dueDate: future(14) },
      { title: 'Cross-browser testing',                projectId: web._id,  assignedTo: carol._id, createdBy: alice._id, status: 'Todo',        priority: 'High',   dueDate: future(18) },
      { title: 'Fix broken links audit',               projectId: web._id,  assignedTo: bob._id,   createdBy: alice._id, status: 'Todo',        priority: 'Low',    dueDate: past(2)    },
      // Mobile App
      { title: 'Set up React Native environment',      projectId: mob._id,  assignedTo: david._id, createdBy: alice._id, status: 'Completed',   priority: 'High',   dueDate: past(15)   },
      { title: 'Design app UI mockups',                projectId: mob._id,  assignedTo: eva._id,   createdBy: alice._id, status: 'Completed',   priority: 'High',   dueDate: past(12)   },
      { title: 'Implement user authentication screens',projectId: mob._id,  assignedTo: david._id, createdBy: alice._id, status: 'In Progress', priority: 'High',   dueDate: future(4)  },
      { title: 'Build home dashboard screen',          projectId: mob._id,  assignedTo: eva._id,   createdBy: alice._id, status: 'In Progress', priority: 'High',   dueDate: future(6)  },
      { title: 'Integrate push notifications',         projectId: mob._id,  assignedTo: david._id, createdBy: alice._id, status: 'Todo',        priority: 'Medium', dueDate: future(12) },
      { title: 'App store submission preparation',     projectId: mob._id,  assignedTo: eva._id,   createdBy: alice._id, status: 'Todo',        priority: 'Low',    dueDate: future(30) },
      { title: 'Performance profiling and optimization',projectId: mob._id, assignedTo: david._id, createdBy: alice._id, status: 'Todo',        priority: 'Medium', dueDate: past(1)    },
      // E-Commerce
      { title: 'Database schema design',               projectId: ecom._id, assignedTo: eva._id,   createdBy: frank._id, status: 'Completed',   priority: 'High',   dueDate: past(20)   },
      { title: 'Product catalog with search & filters',projectId: ecom._id, assignedTo: bob._id,   createdBy: frank._id, status: 'In Progress', priority: 'High',   dueDate: future(5)  },
      { title: 'Shopping cart and checkout flow',      projectId: ecom._id, assignedTo: carol._id, createdBy: frank._id, status: 'In Progress', priority: 'High',   dueDate: future(7)  },
      { title: 'Stripe payment integration',           projectId: ecom._id, assignedTo: eva._id,   createdBy: frank._id, status: 'Todo',        priority: 'High',   dueDate: future(10) },
      { title: 'Admin dashboard for inventory',        projectId: ecom._id, assignedTo: bob._id,   createdBy: frank._id, status: 'Todo',        priority: 'Medium', dueDate: future(15) },
      { title: 'Email notification system',            projectId: ecom._id, assignedTo: carol._id, createdBy: frank._id, status: 'Todo',        priority: 'Medium', dueDate: future(20) },
      { title: 'Write unit tests for cart logic',      projectId: ecom._id, assignedTo: eva._id,   createdBy: frank._id, status: 'Todo',        priority: 'Low',    dueDate: past(3)    },
      // HR Portal
      { title: 'Requirements gathering',               projectId: hr._id,   assignedTo: bob._id,   createdBy: frank._id, status: 'Completed',   priority: 'High',   dueDate: past(30)   },
      { title: 'Employee onboarding module',           projectId: hr._id,   assignedTo: alice._id, createdBy: frank._id, status: 'Todo',        priority: 'High',   dueDate: future(25) },
      { title: 'Leave management system',              projectId: hr._id,   assignedTo: bob._id,   createdBy: frank._id, status: 'Todo',        priority: 'Medium', dueDate: future(35) },
      // API Suite
      { title: 'Integrate Twilio SMS API',             projectId: api._id,  assignedTo: david._id, createdBy: alice._id, status: 'Completed',   priority: 'High',   dueDate: past(25)   },
      { title: 'Google Analytics 4 setup',             projectId: api._id,  assignedTo: eva._id,   createdBy: alice._id, status: 'Completed',   priority: 'Medium', dueDate: past(20)   },
      { title: 'PayPal payment gateway',               projectId: api._id,  assignedTo: david._id, createdBy: alice._id, status: 'Completed',   priority: 'High',   dueDate: past(15)   },
      { title: 'Slack webhook notifications',          projectId: api._id,  assignedTo: eva._id,   createdBy: frank._id, status: 'Completed',   priority: 'Low',    dueDate: past(10)   },
      { title: 'API documentation with Swagger',       projectId: api._id,  assignedTo: david._id, createdBy: alice._id, status: 'Completed',   priority: 'Medium', dueDate: past(5)    },
    ];

    const tasks = await Task.create(tasksData);

    const completed  = tasks.filter(t => t.status === 'Completed').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const todo       = tasks.filter(t => t.status === 'Todo').length;
    const overdue    = tasks.filter(t => t.dueDate && t.status !== 'Completed' && new Date() > new Date(t.dueDate)).length;

    res.json({
      success: true,
      message: '🌱 Seed completed successfully!',
      data: {
        users: users.length,
        projects: projects.length,
        tasks: tasks.length,
        breakdown: { completed, inProgress, todo, overdue },
      },
    });

  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

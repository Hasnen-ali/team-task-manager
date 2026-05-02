/**
 * Seed Script — Team Task Manager
 * Run: node seed.js
 * Inserts demo users, projects, and tasks into MongoDB.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const usersData = [
  {
    name: 'Alice Admin',
    email: 'alice@taskflow.com',
    password: 'password123',
    role: 'Admin',
  },
  {
    name: 'Bob Builder',
    email: 'bob@taskflow.com',
    password: 'password123',
    role: 'Member',
  },
  {
    name: 'Carol Designer',
    email: 'carol@taskflow.com',
    password: 'password123',
    role: 'Member',
  },
  {
    name: 'David Dev',
    email: 'david@taskflow.com',
    password: 'password123',
    role: 'Member',
  },
  {
    name: 'Eva Engineer',
    email: 'eva@taskflow.com',
    password: 'password123',
    role: 'Member',
  },
  {
    name: 'Frank Manager',
    email: 'frank@taskflow.com',
    password: 'password123',
    role: 'Admin',
  },
];

// ─── Main Seed Function ───────────────────────────────────────────────────────

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users (passwords hashed via pre-save hook)
    const users = await User.create(usersData);
    console.log(`👤 Created ${users.length} users`);

    const alice = users.find((u) => u.email === 'alice@taskflow.com');
    const bob = users.find((u) => u.email === 'bob@taskflow.com');
    const carol = users.find((u) => u.email === 'carol@taskflow.com');
    const david = users.find((u) => u.email === 'david@taskflow.com');
    const eva = users.find((u) => u.email === 'eva@taskflow.com');
    const frank = users.find((u) => u.email === 'frank@taskflow.com');

    // ─── Projects ─────────────────────────────────────────────────────────────

    const projectsData = [
      {
        name: 'Website Redesign',
        description:
          'Complete overhaul of the company website with modern UI/UX, improved performance, and mobile responsiveness.',
        createdBy: alice._id,
        members: [alice._id, bob._id, carol._id, david._id],
        status: 'Active',
      },
      {
        name: 'Mobile App Development',
        description:
          'Build a cross-platform mobile application for iOS and Android using React Native.',
        createdBy: alice._id,
        members: [alice._id, david._id, eva._id],
        status: 'Active',
      },
      {
        name: 'E-Commerce Platform',
        description:
          'Develop a full-featured e-commerce platform with payment integration, inventory management, and analytics.',
        createdBy: frank._id,
        members: [frank._id, bob._id, carol._id, eva._id],
        status: 'Active',
      },
      {
        name: 'Internal HR Portal',
        description:
          'Build an internal HR management portal for employee onboarding, leave management, and performance reviews.',
        createdBy: frank._id,
        members: [frank._id, alice._id, bob._id],
        status: 'On Hold',
      },
      {
        name: 'API Integration Suite',
        description:
          'Integrate third-party APIs including payment gateways, SMS providers, and analytics platforms.',
        createdBy: alice._id,
        members: [alice._id, david._id, eva._id, frank._id],
        status: 'Completed',
      },
    ];

    const projects = await Project.create(projectsData);
    console.log(`📁 Created ${projects.length} projects`);

    const websiteProject = projects.find((p) => p.name === 'Website Redesign');
    const mobileProject = projects.find((p) => p.name === 'Mobile App Development');
    const ecomProject = projects.find((p) => p.name === 'E-Commerce Platform');
    const hrProject = projects.find((p) => p.name === 'Internal HR Portal');
    const apiProject = projects.find((p) => p.name === 'API Integration Suite');

    // ─── Tasks ────────────────────────────────────────────────────────────────

    const now = new Date();
    const daysFromNow = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);
    const daysAgo = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

    const tasksData = [
      // ── Website Redesign Tasks ──────────────────────────────────────────────
      {
        title: 'Create wireframes for homepage',
        description:
          'Design low-fidelity wireframes for the new homepage layout including hero section, features, and CTA.',
        projectId: websiteProject._id,
        assignedTo: carol._id,
        createdBy: alice._id,
        status: 'Completed',
        priority: 'High',
        dueDate: daysAgo(10),
      },
      {
        title: 'Set up React project structure',
        description:
          'Initialize the React project with Vite, configure Tailwind CSS, ESLint, and folder structure.',
        projectId: websiteProject._id,
        assignedTo: david._id,
        createdBy: alice._id,
        status: 'Completed',
        priority: 'High',
        dueDate: daysAgo(8),
      },
      {
        title: 'Implement responsive navigation',
        description:
          'Build a fully responsive navigation bar with mobile hamburger menu, dropdowns, and smooth animations.',
        projectId: websiteProject._id,
        assignedTo: bob._id,
        createdBy: alice._id,
        status: 'In Progress',
        priority: 'High',
        dueDate: daysFromNow(3),
      },
      {
        title: 'Design hero section with animations',
        description:
          'Create an eye-catching hero section with CSS animations, gradient backgrounds, and a compelling CTA button.',
        projectId: websiteProject._id,
        assignedTo: carol._id,
        createdBy: alice._id,
        status: 'In Progress',
        priority: 'Medium',
        dueDate: daysFromNow(5),
      },
      {
        title: 'Optimize images and assets',
        description:
          'Compress and optimize all images, implement lazy loading, and set up a CDN for static assets.',
        projectId: websiteProject._id,
        assignedTo: david._id,
        createdBy: alice._id,
        status: 'Todo',
        priority: 'Medium',
        dueDate: daysFromNow(10),
      },
      {
        title: 'Write SEO meta tags and sitemap',
        description:
          'Add proper meta tags, Open Graph tags, structured data, and generate an XML sitemap.',
        projectId: websiteProject._id,
        assignedTo: bob._id,
        createdBy: alice._id,
        status: 'Todo',
        priority: 'Low',
        dueDate: daysFromNow(14),
      },
      {
        title: 'Cross-browser testing',
        description:
          'Test the website on Chrome, Firefox, Safari, and Edge. Fix any compatibility issues found.',
        projectId: websiteProject._id,
        assignedTo: carol._id,
        createdBy: alice._id,
        status: 'Todo',
        priority: 'High',
        dueDate: daysFromNow(18),
      },
      {
        title: 'Fix broken links audit',
        description:
          'Run a full audit of all internal and external links. Fix or redirect any broken URLs.',
        projectId: websiteProject._id,
        assignedTo: bob._id,
        createdBy: alice._id,
        status: 'Todo',
        priority: 'Low',
        dueDate: daysAgo(2), // overdue
      },

      // ── Mobile App Tasks ────────────────────────────────────────────────────
      {
        title: 'Set up React Native environment',
        description:
          'Configure React Native with Expo, set up Android and iOS simulators, and install core dependencies.',
        projectId: mobileProject._id,
        assignedTo: david._id,
        createdBy: alice._id,
        status: 'Completed',
        priority: 'High',
        dueDate: daysAgo(15),
      },
      {
        title: 'Design app UI mockups',
        description:
          'Create high-fidelity mockups for all app screens in Figma including onboarding, dashboard, and profile.',
        projectId: mobileProject._id,
        assignedTo: eva._id,
        createdBy: alice._id,
        status: 'Completed',
        priority: 'High',
        dueDate: daysAgo(12),
      },
      {
        title: 'Implement user authentication screens',
        description:
          'Build login, signup, forgot password, and OTP verification screens with form validation.',
        projectId: mobileProject._id,
        assignedTo: david._id,
        createdBy: alice._id,
        status: 'In Progress',
        priority: 'High',
        dueDate: daysFromNow(4),
      },
      {
        title: 'Build home dashboard screen',
        description:
          'Develop the main dashboard with stats cards, recent activity feed, and quick action buttons.',
        projectId: mobileProject._id,
        assignedTo: eva._id,
        createdBy: alice._id,
        status: 'In Progress',
        priority: 'High',
        dueDate: daysFromNow(6),
      },
      {
        title: 'Integrate push notifications',
        description:
          'Set up Firebase Cloud Messaging for push notifications on both iOS and Android platforms.',
        projectId: mobileProject._id,
        assignedTo: david._id,
        createdBy: alice._id,
        status: 'Todo',
        priority: 'Medium',
        dueDate: daysFromNow(12),
      },
      {
        title: 'App store submission preparation',
        description:
          'Prepare app store listings, screenshots, descriptions, and privacy policy for both App Store and Play Store.',
        projectId: mobileProject._id,
        assignedTo: eva._id,
        createdBy: alice._id,
        status: 'Todo',
        priority: 'Low',
        dueDate: daysFromNow(30),
      },
      {
        title: 'Performance profiling and optimization',
        description:
          'Profile the app for memory leaks, slow renders, and unnecessary re-renders. Optimize critical paths.',
        projectId: mobileProject._id,
        assignedTo: david._id,
        createdBy: alice._id,
        status: 'Todo',
        priority: 'Medium',
        dueDate: daysAgo(1), // overdue
      },

      // ── E-Commerce Tasks ────────────────────────────────────────────────────
      {
        title: 'Database schema design',
        description:
          'Design MongoDB schemas for products, orders, customers, inventory, and reviews with proper indexing.',
        projectId: ecomProject._id,
        assignedTo: eva._id,
        createdBy: frank._id,
        status: 'Completed',
        priority: 'High',
        dueDate: daysAgo(20),
      },
      {
        title: 'Product catalog with search & filters',
        description:
          'Build product listing page with full-text search, category filters, price range, and sorting options.',
        projectId: ecomProject._id,
        assignedTo: bob._id,
        createdBy: frank._id,
        status: 'In Progress',
        priority: 'High',
        dueDate: daysFromNow(5),
      },
      {
        title: 'Shopping cart and checkout flow',
        description:
          'Implement add-to-cart, cart management, address selection, and multi-step checkout process.',
        projectId: ecomProject._id,
        assignedTo: carol._id,
        createdBy: frank._id,
        status: 'In Progress',
        priority: 'High',
        dueDate: daysFromNow(7),
      },
      {
        title: 'Stripe payment integration',
        description:
          'Integrate Stripe for credit card payments, handle webhooks for order confirmation and refunds.',
        projectId: ecomProject._id,
        assignedTo: eva._id,
        createdBy: frank._id,
        status: 'Todo',
        priority: 'High',
        dueDate: daysFromNow(10),
      },
      {
        title: 'Admin dashboard for inventory',
        description:
          'Build admin panel for managing products, stock levels, orders, and generating sales reports.',
        projectId: ecomProject._id,
        assignedTo: bob._id,
        createdBy: frank._id,
        status: 'Todo',
        priority: 'Medium',
        dueDate: daysFromNow(15),
      },
      {
        title: 'Email notification system',
        description:
          'Set up transactional emails for order confirmation, shipping updates, and password reset using Nodemailer.',
        projectId: ecomProject._id,
        assignedTo: carol._id,
        createdBy: frank._id,
        status: 'Todo',
        priority: 'Medium',
        dueDate: daysFromNow(20),
      },
      {
        title: 'Write unit tests for cart logic',
        description:
          'Write comprehensive unit tests for cart calculations, discount codes, and tax computation.',
        projectId: ecomProject._id,
        assignedTo: eva._id,
        createdBy: frank._id,
        status: 'Todo',
        priority: 'Low',
        dueDate: daysAgo(3), // overdue
      },

      // ── HR Portal Tasks ─────────────────────────────────────────────────────
      {
        title: 'Requirements gathering and documentation',
        description:
          'Meet with HR team to document all requirements, user stories, and acceptance criteria.',
        projectId: hrProject._id,
        assignedTo: bob._id,
        createdBy: frank._id,
        status: 'Completed',
        priority: 'High',
        dueDate: daysAgo(30),
      },
      {
        title: 'Employee onboarding module',
        description:
          'Build the employee onboarding workflow with document upload, task checklists, and manager approval.',
        projectId: hrProject._id,
        assignedTo: alice._id,
        createdBy: frank._id,
        status: 'Todo',
        priority: 'High',
        dueDate: daysFromNow(25),
      },
      {
        title: 'Leave management system',
        description:
          'Implement leave request, approval workflow, leave balance tracking, and calendar integration.',
        projectId: hrProject._id,
        assignedTo: bob._id,
        createdBy: frank._id,
        status: 'Todo',
        priority: 'Medium',
        dueDate: daysFromNow(35),
      },

      // ── API Integration Tasks (Completed Project) ───────────────────────────
      {
        title: 'Integrate Twilio SMS API',
        description:
          'Set up Twilio for OTP verification, order notifications, and marketing SMS campaigns.',
        projectId: apiProject._id,
        assignedTo: david._id,
        createdBy: alice._id,
        status: 'Completed',
        priority: 'High',
        dueDate: daysAgo(25),
      },
      {
        title: 'Google Analytics 4 setup',
        description:
          'Implement GA4 tracking with custom events, conversion goals, and e-commerce tracking.',
        projectId: apiProject._id,
        assignedTo: eva._id,
        createdBy: alice._id,
        status: 'Completed',
        priority: 'Medium',
        dueDate: daysAgo(20),
      },
      {
        title: 'PayPal payment gateway',
        description:
          'Integrate PayPal as an alternative payment method with sandbox testing and production deployment.',
        projectId: apiProject._id,
        assignedTo: david._id,
        createdBy: alice._id,
        status: 'Completed',
        priority: 'High',
        dueDate: daysAgo(15),
      },
      {
        title: 'Slack webhook notifications',
        description:
          'Set up Slack webhooks to send real-time alerts for new orders, errors, and system events.',
        projectId: apiProject._id,
        assignedTo: eva._id,
        createdBy: frank._id,
        status: 'Completed',
        priority: 'Low',
        dueDate: daysAgo(10),
      },
      {
        title: 'API documentation with Swagger',
        description:
          'Write comprehensive API documentation using Swagger/OpenAPI spec for all integrated endpoints.',
        projectId: apiProject._id,
        assignedTo: david._id,
        createdBy: alice._id,
        status: 'Completed',
        priority: 'Medium',
        dueDate: daysAgo(5),
      },
    ];

    const tasks = await Task.create(tasksData);
    console.log(`✅ Created ${tasks.length} tasks`);

    // ─── Summary ──────────────────────────────────────────────────────────────
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌱 Seed completed successfully!\n');
    console.log('📋 Summary:');
    console.log(`   Users    : ${users.length}`);
    console.log(`   Projects : ${projects.length}`);
    console.log(`   Tasks    : ${tasks.length}`);
    console.log('\n🔐 Login credentials (all passwords: password123):');
    console.log('   ┌─────────────────────────────────┬──────────┐');
    console.log('   │ Email                           │ Role     │');
    console.log('   ├─────────────────────────────────┼──────────┤');
    users.forEach((u) => {
      const email = u.email.padEnd(31);
      const role = u.role.padEnd(8);
      console.log(`   │ ${email} │ ${role} │`);
    });
    console.log('   └─────────────────────────────────┴──────────┘');
    console.log('\n📊 Task breakdown:');
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const todo = tasks.filter((t) => t.status === 'Todo').length;
    const overdue = tasks.filter(
      (t) => t.dueDate && t.status !== 'Completed' && new Date() > new Date(t.dueDate)
    ).length;
    console.log(`   Completed  : ${completed}`);
    console.log(`   In Progress: ${inProgress}`);
    console.log(`   Todo       : ${todo}`);
    console.log(`   Overdue    : ${overdue}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();

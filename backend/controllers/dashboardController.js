const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get dashboard summary stats
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();

  let projectFilter = {};
  let taskFilter = {};

  // Members only see their own data
  if (req.user.role !== 'Admin') {
    const userProjects = await Project.find({ members: req.user._id }).select('_id');
    const projectIds = userProjects.map((p) => p._id);
    projectFilter = { members: req.user._id };
    taskFilter = {
      $or: [
        { projectId: { $in: projectIds } },
        { assignedTo: req.user._id },
      ],
    };
  }

  // Aggregate task stats
  const [totalTasks, completedTasks, inProgressTasks, todoTasks, overdueTasks, totalProjects] =
    await Promise.all([
      Task.countDocuments(taskFilter),
      Task.countDocuments({ ...taskFilter, status: 'Completed' }),
      Task.countDocuments({ ...taskFilter, status: 'In Progress' }),
      Task.countDocuments({ ...taskFilter, status: 'Todo' }),
      Task.countDocuments({
        ...taskFilter,
        dueDate: { $lt: now },
        status: { $ne: 'Completed' },
      }),
      Project.countDocuments(projectFilter),
    ]);

  // Recent tasks (last 5)
  const recentTasks = await Task.find(taskFilter)
    .populate('assignedTo', 'name email')
    .populate('projectId', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  // Tasks by status breakdown
  const tasksByStatus = [
    { status: 'Todo', count: todoTasks },
    { status: 'In Progress', count: inProgressTasks },
    { status: 'Completed', count: completedTasks },
  ];

  // Admin-only: total users count
  let totalUsers = null;
  if (req.user.role === 'Admin') {
    totalUsers = await User.countDocuments({});
  }

  res.json({
    success: true,
    stats: {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      totalProjects,
      totalUsers,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    },
    tasksByStatus,
    recentTasks,
  });
});

module.exports = { getDashboardStats };

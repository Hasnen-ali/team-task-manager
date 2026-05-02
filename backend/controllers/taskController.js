const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { asyncHandler, AppError } = require('../middleware/errorMiddleware');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private (Admin only)
const createTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, description, projectId, assignedTo, status, priority, dueDate } = req.body;

  // Verify project exists
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // If assigning to someone, verify they are a project member
  if (assignedTo) {
    const isMember = project.members.some((m) => m.toString() === assignedTo);
    if (!isMember) {
      throw new AppError('Assigned user is not a member of this project', 400);
    }
  }

  const task = await Task.create({
    title,
    description,
    projectId,
    assignedTo: assignedTo || null,
    createdBy: req.user._id,
    status: status || 'Todo',
    priority: priority || 'Medium',
    dueDate: dueDate || null,
  });

  await task.populate('assignedTo', 'name email');
  await task.populate('createdBy', 'name email');
  await task.populate('projectId', 'name');

  res.status(201).json({ success: true, task });
});

// @desc    Get all tasks (with filters and pagination)
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const { projectId, status, priority, assignedTo, search, page = 1, limit = 10 } = req.query;

  // Build filter object
  const filter = {};

  if (projectId) filter.projectId = projectId;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedTo) filter.assignedTo = assignedTo;

  // Search by title
  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  // Members can only see tasks in their projects or assigned to them
  if (req.user.role !== 'Admin') {
    const userProjects = await Project.find({ members: req.user._id }).select('_id');
    const projectIds = userProjects.map((p) => p._id);
    filter.$or = [
      { projectId: { $in: projectIds } },
      { assignedTo: req.user._id },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Task.countDocuments(filter);

  const tasks = await Task.find(filter)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('projectId', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.json({
    success: true,
    count: tasks.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    tasks,
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('projectId', 'name members');

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  // Members can only view tasks in their projects
  if (req.user.role !== 'Admin') {
    const project = await Project.findById(task.projectId);
    if (!project || !project.members.includes(req.user._id)) {
      throw new AppError('Access denied', 403);
    }
  }

  res.json({ success: true, task });
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private (Admin: all fields; Member: status only)
const updateTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  let task = await Task.findById(req.params.id);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  // Members can only update status of tasks assigned to them
  if (req.user.role !== 'Admin') {
    if (
      !task.assignedTo ||
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      throw new AppError('Access denied: You can only update your assigned tasks', 403);
    }

    // Members can only change status
    const { status } = req.body;
    if (!status) {
      throw new AppError('Members can only update task status', 400);
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'name');

    return res.json({ success: true, task });
  }

  // Admin can update all fields
  const { title, description, assignedTo, status, priority, dueDate } = req.body;

  // If reassigning, verify new assignee is a project member
  if (assignedTo) {
    const project = await Project.findById(task.projectId);
    const isMember = project.members.some((m) => m.toString() === assignedTo);
    if (!isMember) {
      throw new AppError('Assigned user is not a member of this project', 400);
    }
  }

  task = await Task.findByIdAndUpdate(
    req.params.id,
    { title, description, assignedTo, status, priority, dueDate },
    { new: true, runValidators: true }
  )
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('projectId', 'name');

  res.json({ success: true, task });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  await task.deleteOne();
  res.json({ success: true, message: 'Task deleted successfully' });
});

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };

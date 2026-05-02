const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const { asyncHandler, AppError } = require('../middleware/errorMiddleware');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Admin only)
const createProject = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    createdBy: req.user._id,
    members: [req.user._id],
  });

  await project.populate('createdBy', 'name email');
  await project.populate('members', 'name email role');

  res.status(201).json({ success: true, project });
});

// @desc    Get all projects (Admin sees all, Member sees their own)
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  let query;

  if (req.user.role === 'Admin') {
    query = Project.find({});
  } else {
    query = Project.find({ members: req.user._id });
  }

  const projects = await query
    .populate('createdBy', 'name email')
    .populate('members', 'name email role')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: projects.length, projects });
});

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('members', 'name email role');

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Members can only view projects they belong to
  if (
    req.user.role !== 'Admin' &&
    !project.members.some((m) => m._id.toString() === req.user._id.toString())
  ) {
    throw new AppError('Access denied', 403);
  }

  res.json({ success: true, project });
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
const updateProject = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  let project = await Project.findById(req.params.id);
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  const { name, description, status } = req.body;
  project = await Project.findByIdAndUpdate(
    req.params.id,
    { name, description, status },
    { new: true, runValidators: true }
  )
    .populate('createdBy', 'name email')
    .populate('members', 'name email role');

  res.json({ success: true, project });
});

// @desc    Delete a project (also deletes all tasks)
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Delete all tasks associated with this project
  await Task.deleteMany({ projectId: req.params.id });
  await project.deleteOne();

  res.json({ success: true, message: 'Project and its tasks deleted successfully' });
});

// @desc    Add a member to a project
// @route   POST /api/projects/:id/members
// @access  Private (Admin only)
const addMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new AppError('User ID is required', 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (project.members.includes(userId)) {
    throw new AppError('User is already a member of this project', 400);
  }

  project.members.push(userId);
  await project.save();

  await project.populate('members', 'name email role');
  await project.populate('createdBy', 'name email');

  res.json({ success: true, project });
});

// @desc    Remove a member from a project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (Admin only)
const removeMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // Cannot remove the project creator
  if (project.createdBy.toString() === req.params.userId) {
    throw new AppError('Cannot remove the project creator', 400);
  }

  project.members = project.members.filter(
    (m) => m.toString() !== req.params.userId
  );
  await project.save();

  await project.populate('members', 'name email role');
  await project.populate('createdBy', 'name email');

  res.json({ success: true, project });
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};

const express = require('express');
const { body } = require('express-validator');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

const projectValidation = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
];

router.route('/')
  .get(protect, getProjects)
  .post(protect, adminOnly, projectValidation, createProject);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, adminOnly, projectValidation, updateProject)
  .delete(protect, adminOnly, deleteProject);

router.post('/:id/members', protect, adminOnly, addMember);
router.delete('/:id/members/:userId', protect, adminOnly, removeMember);

module.exports = router;

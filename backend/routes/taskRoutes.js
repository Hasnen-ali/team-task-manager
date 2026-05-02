const express = require('express');
const { body } = require('express-validator');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

const taskValidation = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('projectId').notEmpty().withMessage('Project ID is required'),
  body('status')
    .optional()
    .isIn(['Todo', 'In Progress', 'Completed'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid priority'),
];

const updateTaskValidation = [
  body('status')
    .optional()
    .isIn(['Todo', 'In Progress', 'Completed'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid priority'),
];

router.route('/')
  .get(protect, getTasks)
  .post(protect, adminOnly, taskValidation, createTask);

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTaskValidation, updateTask)
  .delete(protect, adminOnly, deleteTask);

module.exports = router;

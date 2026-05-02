import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getTasks, createTask, updateTask, deleteTask } from '../api/taskApi';
import { getProjects } from '../api/projectApi';
import { getAllUsers } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { PriorityBadge } from '../components/StatusBadge';

// ─── Task Form ────────────────────────────────────────────────────────────────
function TaskForm({ defaultValues, projects, users, onSubmit, isSubmitting, isAdmin }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: defaultValues || { status: 'Todo', priority: 'Medium' },
  });

  const selectedProject = watch('projectId');

  // Filter users to members of selected project
  const projectMembers = selectedProject
    ? (projects.find((p) => p._id === selectedProject)?.members || [])
    : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          className="input-field"
          placeholder="Task title"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          className="input-field resize-none"
          rows={2}
          placeholder="Optional description..."
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
          <select
            className="input-field"
            {...register('projectId', { required: 'Project is required' })}
            disabled={!!defaultValues?._id}
          >
            <option value="">Select project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          {errors.projectId && <p className="text-red-500 text-xs mt-1">{errors.projectId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
          <select className="input-field" {...register('assignedTo')}>
            <option value="">Unassigned</option>
            {(defaultValues?._id ? users : projectMembers).map((u) => (
              <option key={u._id} value={u._id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select className="input-field" {...register('status')}>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select className="input-field" {...register('priority')} disabled={!isAdmin}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
        <input
          type="date"
          className="input-field"
          {...register('dueDate')}
          disabled={!isAdmin}
        />
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Saving...' : defaultValues?._id ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────
function TaskCard({ task, isAdmin, currentUserId, onEdit, onDelete, onStatusChange }) {
  const isOverdue =
    task.dueDate && task.status !== 'Completed' && new Date() > new Date(task.dueDate);
  const canEdit =
    isAdmin || (task.assignedTo?._id === currentUserId);

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{task.title}</p>
          {task.description && (
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{task.description}</p>
          )}
        </div>
        {isAdmin && (
          <div className="flex gap-2 shrink-0">
            <button onClick={() => onEdit(task)} className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="Edit task">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button onClick={() => onDelete(task)} className="text-gray-400 hover:text-red-600 transition-colors" aria-label="Delete task">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-gray-500">
        <span className="bg-gray-100 px-2 py-0.5 rounded">{task.projectId?.name}</span>
        {task.assignedTo && (
          <span>👤 {task.assignedTo.name}</span>
        )}
        {task.dueDate && (
          <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
            📅 {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusBadge status={isOverdue ? 'Overdue' : task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
        {/* Quick status change for assigned members */}
        {canEdit && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className="text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TasksPage() {
  const { user, isAdmin } = useAuth();
  const [searchParams] = useSearchParams();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Filters
  const [filters, setFilters] = useState({
    projectId: searchParams.get('projectId') || '',
    status: '',
    priority: '',
    search: '',
    page: 1,
  });

  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = useCallback(() => {
    setLoading(true);
    const params = { limit: 12, ...filters };
    // Remove empty filters
    Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
    getTasks(params)
      .then((res) => {
        setTasks(res.data.tasks);
        setPagination({ page: res.data.page, pages: res.data.pages, total: res.data.total });
      })
      .catch(() => toast.error('Failed to load tasks'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  useEffect(() => {
    getProjects().then((res) => setProjects(res.data.projects));
    if (isAdmin) getAllUsers().then((res) => setUsers(res.data.users));
  }, [isAdmin]);

  const handleCreate = async (data) => {
    setSubmitting(true);
    try {
      if (data.dueDate === '') data.dueDate = null;
      if (data.assignedTo === '') data.assignedTo = null;
      await createTask(data);
      toast.success('Task created!');
      setShowCreate(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    setSubmitting(true);
    try {
      if (data.dueDate === '') data.dueDate = null;
      if (data.assignedTo === '') data.assignedTo = null;
      await updateTask(editTask._id, data);
      toast.success('Task updated!');
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(deleteTarget._id);
      toast.success('Task deleted');
      setDeleteTarget(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTask(taskId, { status });
      toast.success('Status updated');
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // Prepare edit defaults
  const editDefaults = editTask
    ? {
        ...editTask,
        projectId: editTask.projectId?._id || editTask.projectId,
        assignedTo: editTask.assignedTo?._id || '',
        dueDate: editTask.dueDate
          ? new Date(editTask.dueDate).toISOString().split('T')[0]
          : '',
      }
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination.total} task{pagination.total !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="input-field"
          />
          <select
            value={filters.projectId}
            onChange={(e) => updateFilter('projectId', e.target.value)}
            className="input-field"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="input-field"
          >
            <option value="">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => updateFilter('priority', e.target.value)}
            className="input-field"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Task grid */}
      {loading ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No tasks found</p>
          {isAdmin && (
            <button onClick={() => setShowCreate(true)} className="btn-primary mt-4">
              Create your first task
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              isAdmin={isAdmin}
              currentUserId={user?._id}
              onEdit={setEditTask}
              onDelete={setDeleteTarget}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={filters.page <= 1}
            onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
            className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            disabled={filters.page >= pagination.pages}
            onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
            className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}

      {/* Create modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Task" size="lg">
        <TaskForm
          projects={projects}
          users={users}
          onSubmit={handleCreate}
          isSubmitting={submitting}
          isAdmin={isAdmin}
        />
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={!!editTask} onClose={() => setEditTask(null)} title="Edit Task" size="lg">
        {editTask && (
          <TaskForm
            defaultValues={editDefaults}
            projects={projects}
            users={users}
            onSubmit={handleUpdate}
            isSubmitting={submitting}
            isAdmin={isAdmin}
          />
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Task" size="sm">
        <p className="text-gray-600 text-sm">
          Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancel</button>
          <button onClick={handleDelete} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </div>
  );
}

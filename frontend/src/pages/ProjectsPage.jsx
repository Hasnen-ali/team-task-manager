import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getProjects, createProject, updateProject, deleteProject } from '../api/projectApi';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

// Project card component
function ProjectCard({ project, isAdmin, onEdit, onDelete }) {
  const statusColors = {
    Active: 'bg-green-100 text-green-700',
    Completed: 'bg-blue-100 text-blue-700',
    'On Hold': 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 truncate">{project.name}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[project.status]}`}>
              {project.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {project.description || 'No description'}
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onEdit(project)}
              className="text-gray-400 hover:text-blue-600 transition-colors"
              aria-label="Edit project"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(project)}
              className="text-gray-400 hover:text-red-600 transition-colors"
              aria-label="Delete project"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.members?.slice(0, 4).map((m) => (
            <div
              key={m._id}
              title={m.name}
              className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-semibold text-blue-700"
            >
              {m.name?.charAt(0).toUpperCase()}
            </div>
          ))}
          {project.members?.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
              +{project.members.length - 4}
            </div>
          )}
        </div>
        <Link
          to={`/projects/${project._id}`}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          View details →
        </Link>
      </div>
    </div>
  );
}

// Project form (create / edit)
function ProjectForm({ defaultValues, onSubmit, isSubmitting }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
        <input
          className="input-field"
          placeholder="e.g. Website Redesign"
          {...register('name', { required: 'Project name is required' })}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="Brief description..."
          {...register('description')}
        />
      </div>
      {defaultValues?._id && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select className="input-field" {...register('status')}>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Saving...' : defaultValues?._id ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}

export default function ProjectsPage() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  const fetchProjects = () => {
    setLoading(true);
    getProjects()
      .then((res) => setProjects(res.data.projects))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (data) => {
    setSubmitting(true);
    try {
      await createProject(data);
      toast.success('Project created!');
      setShowCreate(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    setSubmitting(true);
    try {
      await updateProject(editProject._id, data);
      toast.success('Project updated!');
      setEditProject(null);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProject(deleteTarget._id);
      toast.success('Project deleted');
      setDeleteTarget(null);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
    }
  };

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-48"
          />
          {isAdmin && (
            <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Project
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No projects found</p>
          {isAdmin && (
            <button onClick={() => setShowCreate(true)} className="btn-primary mt-4">
              Create your first project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProjectCard
              key={p._id}
              project={p}
              isAdmin={isAdmin}
              onEdit={setEditProject}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Project">
        <ProjectForm onSubmit={handleCreate} isSubmitting={submitting} />
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={!!editProject} onClose={() => setEditProject(null)} title="Edit Project">
        {editProject && (
          <ProjectForm
            defaultValues={editProject}
            onSubmit={handleUpdate}
            isSubmitting={submitting}
          />
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Project" size="sm">
        <p className="text-gray-600 text-sm">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This will also delete all associated tasks. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancel</button>
          <button onClick={handleDelete} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </div>
  );
}

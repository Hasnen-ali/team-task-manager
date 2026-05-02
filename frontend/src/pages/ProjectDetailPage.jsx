import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProjectById, addMember, removeMember } from '../api/projectApi';
import { getTasks } from '../api/taskApi';
import { getAllUsers } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  const fetchData = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        getProjectById(id),
        getTasks({ projectId: id, limit: 50 }),
      ]);
      setProject(projRes.data.project);
      setTasks(taskRes.data.tasks);
    } catch {
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  useEffect(() => {
    if (isAdmin) {
      getAllUsers().then((res) => setAllUsers(res.data.users));
    }
  }, [isAdmin]);

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    setAddingMember(true);
    try {
      await addMember(id, selectedUserId);
      toast.success('Member added!');
      setShowAddMember(false);
      setSelectedUserId('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await removeMember(id, userId);
      toast.success('Member removed');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!project) return <p className="text-center text-gray-500 py-16">Project not found</p>;

  // Users not yet in the project
  const nonMembers = allUsers.filter(
    (u) => !project.members.some((m) => m._id === u._id)
  );

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    todo: tasks.filter((t) => t.status === 'Todo').length,
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/projects" className="hover:text-blue-600">Projects</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{project.name}</span>
      </div>

      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-500 mt-1">{project.description || 'No description'}</p>
            <p className="text-xs text-gray-400 mt-2">
              Created by {project.createdBy?.name} •{' '}
              {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              project.status === 'Active'
                ? 'bg-green-100 text-green-700'
                : project.status === 'Completed'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {project.status}
          </span>
        </div>

        {/* Task stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total', value: taskStats.total, color: 'text-gray-700' },
            { label: 'Todo', value: taskStats.todo, color: 'text-gray-500' },
            { label: 'In Progress', value: taskStats.inProgress, color: 'text-blue-600' },
            { label: 'Completed', value: taskStats.completed, color: 'text-green-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">
              Members ({project.members?.length})
            </h2>
            {isAdmin && (
              <button
                onClick={() => setShowAddMember(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                + Add
              </button>
            )}
          </div>
          <div className="space-y-3">
            {project.members?.map((member) => (
              <div key={member._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>
                {isAdmin && project.createdBy?._id !== member._id && (
                  <button
                    onClick={() => handleRemoveMember(member._id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    aria-label="Remove member"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tasks list */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Tasks</h2>
            <Link to={`/tasks?projectId=${id}`} className="text-sm text-blue-600 hover:underline">
              Manage tasks →
            </Link>
          </div>
          {tasks.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No tasks yet</p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => {
                const isOverdue =
                  task.dueDate &&
                  task.status !== 'Completed' &&
                  new Date() > new Date(task.dueDate);
                return (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                      <p className="text-xs text-gray-500">
                        {task.assignedTo?.name || 'Unassigned'}
                        {task.dueDate && (
                          <> • Due {new Date(task.dueDate).toLocaleDateString()}</>
                        )}
                      </p>
                    </div>
                    <StatusBadge status={isOverdue ? 'Overdue' : task.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add member modal */}
      <Modal isOpen={showAddMember} onClose={() => setShowAddMember(false)} title="Add Member" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
            <select
              className="input-field"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">-- Choose a user --</option>
              {nonMembers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email}) — {u.role}
                </option>
              ))}
            </select>
          </div>
          {nonMembers.length === 0 && (
            <p className="text-sm text-gray-500">All users are already members.</p>
          )}
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowAddMember(false)} className="btn-secondary">Cancel</button>
            <button
              onClick={handleAddMember}
              disabled={!selectedUserId || addingMember}
              className="btn-primary"
            >
              {addingMember ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

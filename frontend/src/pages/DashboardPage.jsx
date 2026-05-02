import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../api/dashboardApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { PriorityBadge } from '../components/StatusBadge';
import toast from 'react-hot-toast';

// Stat card component
function StatCard({ label, value, color, icon }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    gray: 'bg-gray-50 text-gray-700 border-gray-100',
  };

  return (
    <div className={`card border ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-3xl opacity-60">{icon}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setData(res.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const { stats, recentTasks, tasksByStatus } = data || {};

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back, {user?.name}. Here's what's happening.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={stats?.totalTasks ?? 0} color="blue" icon="📋" />
        <StatCard label="Completed" value={stats?.completedTasks ?? 0} color="green" icon="✅" />
        <StatCard label="In Progress" value={stats?.inProgressTasks ?? 0} color="yellow" icon="🔄" />
        <StatCard label="Overdue" value={stats?.overdueTasks ?? 0} color="red" icon="⚠️" />
        <StatCard label="Projects" value={stats?.totalProjects ?? 0} color="purple" icon="📁" />
        {isAdmin && (
          <StatCard label="Total Users" value={stats?.totalUsers ?? 0} color="gray" icon="👥" />
        )}
        <div className="card border border-blue-100 bg-blue-50">
          <p className="text-sm font-medium text-blue-700 opacity-75">Completion Rate</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">{stats?.completionRate ?? 0}%</p>
          <div className="mt-2 bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${stats?.completionRate ?? 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Tasks by Status</h2>
          <div className="space-y-3">
            {tasksByStatus?.map(({ status, count }) => {
              const total = stats?.totalTasks || 1;
              const pct = Math.round((count / total) * 100);
              const colors = {
                'Todo': 'bg-gray-400',
                'In Progress': 'bg-blue-500',
                'Completed': 'bg-green-500',
              };
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{status}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2">
                    <div
                      className={`${colors[status]} h-2 rounded-full transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Recent Tasks</h2>
            <Link to="/tasks" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          {recentTasks?.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No tasks yet</p>
          ) : (
            <div className="space-y-3">
              {recentTasks?.map((task) => {
                const isOverdue =
                  task.dueDate &&
                  task.status !== 'Completed' &&
                  new Date() > new Date(task.dueDate);
                return (
                  <div
                    key={task._id}
                    className="flex items-start justify-between gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {task.projectId?.name} •{' '}
                        {task.assignedTo?.name || 'Unassigned'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={isOverdue ? 'Overdue' : task.status} />
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

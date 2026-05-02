export default function StatusBadge({ status }) {
  const map = {
    'Todo': 'badge-todo',
    'In Progress': 'badge-inprogress',
    'Completed': 'badge-completed',
    'Overdue': 'badge-overdue',
  };
  return <span className={map[status] || 'badge-todo'}>{status}</span>;
}

export function PriorityBadge({ priority }) {
  const map = {
    Low: 'badge-low',
    Medium: 'badge-medium',
    High: 'badge-high',
  };
  return <span className={map[priority] || 'badge-medium'}>{priority}</span>;
}

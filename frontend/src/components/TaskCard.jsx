import { useState } from 'react';
import { updateTask, deleteTask } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  Pending: {
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  'In Progress': {
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  Completed: {
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function TaskCard({ task, onRefresh }) {
  const [completing, setCompleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const config = STATUS_CONFIG[task.status] || STATUS_CONFIG.Pending;

  const handleComplete = async () => {
    if (task.status === 'Completed') return;
    setCompleting(true);
    try {
      await updateTask(task.id, 'Completed');
      toast.success('Task marked as completed!');
      onRefresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success('Task deleted.');
      onRefresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="card p-5 flex flex-col gap-3 animate-slide-up group">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2 flex-1">
          {task.title}
        </h3>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${config.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
          {task.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1">
        {task.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(task.created_at)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {task.status !== 'Completed' && (
            <button
              id={`complete-btn-${task.id}`}
              onClick={handleComplete}
              disabled={completing}
              className="btn-success text-xs py-1 px-2.5"
            >
              {completing ? (
                <span className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {completing ? 'Saving...' : 'Complete'}
            </button>
          )}

          <button
            id={`delete-btn-${task.id}`}
            onClick={handleDelete}
            disabled={deleting}
            className={`btn-danger text-xs py-1 px-2.5 ${confirmDelete ? 'ring-2 ring-red-400 ring-offset-1' : ''}`}
          >
            {deleting ? (
              <span className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            {confirmDelete ? 'Confirm?' : deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

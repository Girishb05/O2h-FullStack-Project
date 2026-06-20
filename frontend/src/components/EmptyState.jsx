import { Link } from 'react-router-dom';

export default function EmptyState({ filtered = false }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 animate-fade-in">
      {/* Illustration */}
      <div className="relative">
        <div className="w-28 h-28 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-3xl flex items-center justify-center shadow-inner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-14 w-14 text-primary-400 dark:text-primary-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-xs">✨</span>
        </div>
      </div>

      <div className="text-center max-w-xs">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
          {filtered ? 'No matching tasks' : 'No tasks yet'}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {filtered
            ? 'Try a different filter to see your tasks.'
            : 'Create your first task and start tracking your progress.'}
        </p>
      </div>

      {!filtered && (
        <Link to="/add" id="empty-state-add-btn" className="btn-primary mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Your First Task
        </Link>
      )}
    </div>
  );
}

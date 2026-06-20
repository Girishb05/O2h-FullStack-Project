import { useState, useEffect, useCallback } from 'react';
import { getTasks } from '../services/api';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const FILTERS = ['All', 'Pending', 'In Progress', 'Completed'];

const STATS_CONFIG = [
  { label: 'Total', key: 'total', color: 'from-blue-500 to-primary-600', icon: '📋' },
  { label: 'Pending', key: 'Pending', color: 'from-amber-400 to-orange-500', icon: '⏳' },
  { label: 'In Progress', key: 'In Progress', color: 'from-sky-400 to-blue-500', icon: '🔄' },
  { label: 'Completed', key: 'Completed', color: 'from-emerald-400 to-teal-500', icon: '✅' },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTasks();
      setTasks(res.data || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks =
    activeFilter === 'All'
      ? tasks
      : tasks.filter((t) => t.status === activeFilter);

  const stats = {
    total: tasks.length,
    Pending: tasks.filter((t) => t.status === 'Pending').length,
    'In Progress': tasks.filter((t) => t.status === 'In Progress').length,
    Completed: tasks.filter((t) => t.status === 'Completed').length,
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Task Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Manage and track all your project tasks in one place.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS_CONFIG.map((stat) => (
          <div key={stat.key} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg shadow-sm`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats[stat.key]}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {FILTERS.map((filter) => {
          const count =
            filter === 'All' ? tasks.length : tasks.filter((t) => t.status === filter).length;
          return (
            <button
              key={filter}
              id={`filter-${filter.replace(' ', '-').toLowerCase()}`}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                activeFilter === filter
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              {filter}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                activeFilter === filter
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredTasks.length === 0 ? (
        <EmptyState filtered={activeFilter !== 'All'} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onRefresh={fetchTasks} />
          ))}
        </div>
      )}
    </main>
  );
}

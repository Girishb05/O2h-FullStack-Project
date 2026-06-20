import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createTask } from '../services/api';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'In Progress'];

export default function AddTask() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Pending',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = 'Task title is required.';
    }
    if (form.description.trim().length < 20) {
      newErrors.description = `Description must be at least 20 characters. (${form.description.trim().length}/20)`;
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await createTask({
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
      });
      toast.success('Task created successfully! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          Dashboard
        </Link>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 dark:text-white font-medium">Add Task</span>
      </nav>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Create New Task
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Fill in the details below to add a new task to your project.
        </p>
      </div>

      {/* Form Card */}
      <div className="card p-6 sm:p-8 animate-slide-up">
        <form id="add-task-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

          {/* Title */}
          <div>
            <label htmlFor="title" className="label">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Build the login page"
              className={`input ${errors.title ? 'border-red-400 focus:ring-red-400 dark:border-red-500' : ''}`}
              maxLength={120}
            />
            {errors.title && <p className="error-text">{errors.title}</p>}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {form.title.length}/120
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="label">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the task in detail (minimum 20 characters)..."
              className={`input resize-none ${errors.description ? 'border-red-400 focus:ring-red-400 dark:border-red-500' : ''}`}
            />
            {errors.description ? (
              <p className="error-text">{errors.description}</p>
            ) : (
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-400 dark:text-gray-500">Minimum 20 characters</p>
                <p className={`text-xs font-medium ${
                  form.description.trim().length >= 20
                    ? 'text-emerald-500'
                    : 'text-amber-500'
                }`}>
                  {form.description.trim().length} chars
                </p>
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="label">Status</label>
            <div className="flex gap-3">
              {STATUSES.map((s) => (
                <label
                  key={s}
                  className={`flex items-center gap-2.5 flex-1 cursor-pointer border rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    form.status === s
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={form.status === s}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                    form.status === s ? 'border-primary-500' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {form.status === s && <span className="w-1.5 h-1.5 rounded-full bg-primary-500 block" />}
                  </span>
                  {s}
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              id="submit-task-btn"
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1 justify-center py-2.5"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating Task...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Task
                </>
              )}
            </button>
            <Link to="/" className="btn-ghost border border-gray-200 dark:border-gray-700">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor — unwrap data
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const getTasks = (status = '') => {
  const params = status ? { status } : {};
  return api.get('/tasks', { params });
};

export const createTask = (taskData) => api.post('/tasks', taskData);

export const updateTask = (id, status) => api.put(`/tasks/${id}`, { status });

export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export default api;

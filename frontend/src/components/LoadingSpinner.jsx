export default function LoadingSpinner({ message = 'Loading tasks...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-primary-100 dark:border-gray-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{message}</p>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] p-4 text-center">
      <div className="animate-fade-in">
        <h1 className="text-8xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-xl font-semibold text-[var(--color-text)] mt-4">Page not found</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-2 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard" className="inline-block mt-6">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

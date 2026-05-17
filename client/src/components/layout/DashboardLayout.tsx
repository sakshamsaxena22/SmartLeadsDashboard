import React from 'react';
import { Sidebar } from './Sidebar';
import { ErrorBoundary } from './ErrorBoundary';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Sidebar />
      <main className="lg:ml-64 min-h-screen p-4 md:p-6 lg:p-8">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
};

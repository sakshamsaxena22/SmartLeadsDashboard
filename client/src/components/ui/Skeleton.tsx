import React from 'react';

interface SkeletonProps {
  className?: string;
  rows?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', rows = 1 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`rounded-lg bg-[var(--color-border)] animate-skeleton ${className}`}
        />
      ))}
    </>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 5,
}) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          {Array.from({ length: cols }).map((__, j) => (
            <div
              key={j}
              className="h-8 rounded-lg bg-[var(--color-border)] animate-skeleton flex-1"
              style={{ animationDelay: `${(i * cols + j) * 0.05}s` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

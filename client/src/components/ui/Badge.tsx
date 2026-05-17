import React from 'react';

type BadgeVariant = 'blue' | 'amber' | 'emerald' | 'red' | 'purple' | 'gray';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  red: 'bg-red-500/10 text-red-500 border-red-500/20',
  purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  gray: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray', className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

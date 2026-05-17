import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { TableSkeleton } from '../ui/Skeleton';
import type { ILead } from '../../types';
import { LeadStatus, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface LeadTableProps {
  leads: ILead[];
  isLoading: boolean;
  onEdit: (lead: ILead) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const statusBadgeVariant: Record<string, 'blue' | 'amber' | 'emerald' | 'red'> = {
  [LeadStatus.NEW]: 'blue',
  [LeadStatus.CONTACTED]: 'amber',
  [LeadStatus.QUALIFIED]: 'emerald',
  [LeadStatus.LOST]: 'red',
};

export const LeadTable: React.FC<LeadTableProps> = ({ leads, isLoading, onEdit, onDelete, onView }) => {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
        <TableSkeleton rows={5} cols={6} />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1">No leads found</h3>
        <p className="text-sm text-[var(--color-text-muted)]">Try adjusting your filters or create a new lead.</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Name</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Source</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Created</th>
              <th className="text-right px-6 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
                onClick={() => onView(lead._id)}
              >
                <td className="px-6 py-4 text-sm font-medium text-[var(--color-text)]">{lead.name}</td>
                <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">{lead.email}</td>
                <td className="px-6 py-4">
                  <Badge variant={statusBadgeVariant[lead.status] || 'gray'}>{lead.status}</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">{lead.source}</td>
                <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="ghost" onClick={() => onEdit(lead)}>Edit</Button>
                    {user?.role === UserRole.ADMIN && (
                      <Button size="sm" variant="danger" onClick={() => onDelete(lead._id)}>Delete</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

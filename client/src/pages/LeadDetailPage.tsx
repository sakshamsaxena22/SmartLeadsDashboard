import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '../api/leads.api';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { LeadStatus, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const statusBadgeVariant: Record<string, 'blue' | 'amber' | 'emerald' | 'red'> = {
  [LeadStatus.NEW]: 'blue',
  [LeadStatus.CONTACTED]: 'amber',
  [LeadStatus.QUALIFIED]: 'emerald',
  [LeadStatus.LOST]: 'red',
};

export const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsApi.getById(id!).then((res) => res.data.data),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => leadsApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead deleted');
      navigate('/dashboard');
    },
    onError: () => toast.error('Failed to delete lead'),
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl animate-fade-in">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Button>

        {isLoading && (
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-8 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-32" rows={4} />
          </div>
        )}

        {isError && (
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-12 text-center">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">Lead not found</h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-2">This lead may have been deleted.</p>
          </div>
        )}

        {data && (
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
            <div className="px-8 py-6 border-b border-[var(--color-border)] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text)]">{data.name}</h2>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">{data.email}</p>
              </div>
              <Badge variant={statusBadgeVariant[data.status] || 'gray'}>{data.status}</Badge>
            </div>

            <div className="px-8 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Source</p>
                  <p className="text-sm text-[var(--color-text)]">{data.source}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Created</p>
                  <p className="text-sm text-[var(--color-text)]">{new Date(data.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Last Updated</p>
                  <p className="text-sm text-[var(--color-text)]">{new Date(data.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {user?.role === UserRole.ADMIN && (
              <div className="px-8 py-4 border-t border-[var(--color-border)] flex justify-end">
                <Button variant="danger" onClick={handleDelete} isLoading={deleteMutation.isPending}>
                  Delete Lead
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

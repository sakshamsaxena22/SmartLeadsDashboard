import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '../api/leads.api';
import type { ILead, LeadQueryParams } from '../types';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { FilterBar } from '../components/leads/FilterBar';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadForm } from '../components/leads/LeadForm';
import { Pagination } from '../components/leads/Pagination';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import type { CreateLeadSchemaType } from '../../../shared/validators/lead.validator';
import toast from 'react-hot-toast';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Filter state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  // Reset to page 1 on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, source, sort]);

  // Build query params
  const queryParams: LeadQueryParams = {
    page,
    limit: 10,
    sort: sort as 'latest' | 'oldest',
    ...(status && { status: status as LeadQueryParams['status'] }),
    ...(source && { source: source as LeadQueryParams['source'] }),
    ...(debouncedSearch && { search: debouncedSearch }),
  };

  // Fetch leads
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['leads', queryParams],
    queryFn: () => leadsApi.getAll(queryParams).then((res) => res.data),
  });

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<ILead | null>(null);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (formData: CreateLeadSchemaType) => leadsApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setIsCreateOpen(false);
      toast.success('Lead created successfully!');
    },
    onError: () => toast.error('Failed to create lead'),
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data: formData }: { id: string; data: CreateLeadSchemaType }) =>
      leadsApi.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setEditingLead(null);
      toast.success('Lead updated successfully!');
    },
    onError: () => toast.error('Failed to update lead'),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead deleted successfully!');
    },
    onError: () => toast.error('Failed to delete lead'),
  });

  // CSV Export
  const handleExport = useCallback(async () => {
    try {
      const response = await leadsApi.exportCsv(queryParams);
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV exported!');
    } catch {
      toast.error('Export failed');
    }
  }, [queryParams]);

  const handleCreate = async (formData: CreateLeadSchemaType) => {
    await createMutation.mutateAsync(formData);
  };

  const handleUpdate = async (formData: CreateLeadSchemaType) => {
    if (!editingLead) return;
    await updateMutation.mutateAsync({ id: editingLead._id, data: formData });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Failed to load leads</h3>
          <Button onClick={() => refetch()} variant="secondary">Retry</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">Leads Dashboard</h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Manage and track your sales leads
            </p>
          </div>
          <div className="flex gap-3">
            {user?.role === UserRole.ADMIN && (
              <Button variant="secondary" onClick={handleExport}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </Button>
            )}
            <Button onClick={() => setIsCreateOpen(true)}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Lead
            </Button>
          </div>
        </div>

        {/* Filters */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          source={source}
          onSourceChange={setSource}
          sort={sort}
          onSortChange={setSort}
        />

        {/* Table */}
        <LeadTable
          leads={data?.data || []}
          isLoading={isLoading}
          onEdit={setEditingLead}
          onDelete={handleDelete}
          onView={(id) => navigate(`/leads/${id}`)}
        />

        {/* Pagination */}
        {data?.pagination && (
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            total={data.pagination.total}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Lead">
        <LeadForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        title="Edit Lead"
      >
        {editingLead && (
          <LeadForm
            lead={editingLead}
            onSubmit={handleUpdate}
            onCancel={() => setEditingLead(null)}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
};

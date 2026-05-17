import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLeadSchema } from '../../../../shared/validators/lead.validator';
import { LeadStatus, LeadSource } from '../../types';
import type { ILead } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { z } from 'zod';

// Use Zod's input type (before defaults) for form values
type LeadFormValues = z.input<typeof createLeadSchema>;

interface LeadFormProps {
  lead?: ILead;
  onSubmit: (data: z.output<typeof createLeadSchema>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const statusOptions = Object.values(LeadStatus).map((s) => ({ value: s, label: s }));
const sourceOptions = Object.values(LeadSource).map((s) => ({ value: s, label: s }));

export const LeadForm: React.FC<LeadFormProps> = ({ lead, onSubmit, onCancel, isLoading }) => {
  const isEditing = !!lead;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: lead?.name || '',
      email: lead?.email || '',
      status: lead?.status || LeadStatus.NEW,
      source: lead?.source || LeadSource.WEBSITE,
    },
  });

  const onFormSubmit = (data: LeadFormValues) => {
    // Zod will have applied defaults by this point via the resolver
    return onSubmit(data as z.output<typeof createLeadSchema>);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <Input label="Name" placeholder="Enter lead name" error={errors.name?.message} {...register('name')} />
      <Input label="Email" type="email" placeholder="Enter lead email" error={errors.email?.message} {...register('email')} />
      <Select label="Status" options={statusOptions} error={errors.status?.message} {...register('status')} />
      <Select label="Source" options={sourceOptions} error={errors.source?.message} {...register('source')} />
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>{isEditing ? 'Update Lead' : 'Create Lead'}</Button>
      </div>
    </form>
  );
};

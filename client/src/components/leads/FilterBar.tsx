import React from 'react';
import { LeadStatus, LeadSource } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  source: string;
  onSourceChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  ...Object.values(LeadStatus).map((s) => ({ value: s, label: s })),
];

const sourceOptions = [
  { value: '', label: 'All Sources' },
  ...Object.values(LeadSource).map((s) => ({ value: s, label: s })),
];

const sortOptions = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  source,
  onSourceChange,
  sort,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          id="search-leads"
        />
      </div>
      <div className="w-full sm:w-40">
        <Select
          options={statusOptions}
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          id="filter-status"
        />
      </div>
      <div className="w-full sm:w-40">
        <Select
          options={sourceOptions}
          value={source}
          onChange={(e) => onSourceChange(e.target.value)}
          id="filter-source"
        />
      </div>
      <div className="w-full sm:w-40">
        <Select
          options={sortOptions}
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          id="filter-sort"
        />
      </div>
    </div>
  );
};

import { ILeadDocument } from '../models/Lead.model';

/**
 * Sanitize a CSV cell value to prevent CSV injection attacks.
 * Values starting with =, +, -, @ are prefixed with a single quote.
 */
function sanitizeCsvValue(val: string): string {
  if (typeof val === 'string' && /^[=+\-@]/.test(val)) {
    return `'${val}`;
  }
  return val;
}

function escapeCsvField(val: string): string {
  const sanitized = sanitizeCsvValue(val);
  if (sanitized.includes(',') || sanitized.includes('"') || sanitized.includes('\n')) {
    return `"${sanitized.replace(/"/g, '""')}"`;
  }
  return sanitized;
}

interface LeadLean {
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt?: Date | string;
}

export function generateLeadsCsv(leads: LeadLean[]): string {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((lead) => [
    escapeCsvField(lead.name),
    escapeCsvField(lead.email),
    escapeCsvField(lead.status),
    escapeCsvField(lead.source),
    escapeCsvField(lead.createdAt ? new Date(lead.createdAt).toISOString() : ''),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

import { z } from 'zod';

const leadStatusEnum = z.enum(['New', 'Contacted', 'Qualified', 'Lost']);
const leadSourceEnum = z.enum(['Website', 'Instagram', 'Referral']);

export const createLeadSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  status: leadStatusEnum.default('New'),
  source: leadSourceEnum,
});

export const updateLeadSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .trim()
    .optional(),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim()
    .optional(),
  status: leadStatusEnum.optional(),
  source: leadSourceEnum.optional(),
});

export const leadQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: leadStatusEnum.optional(),
  source: leadSourceEnum.optional(),
  search: z.string().max(200).optional(),
  sort: z.enum(['latest', 'oldest']).default('latest'),
});

export type CreateLeadSchemaType = z.infer<typeof createLeadSchema>;
export type UpdateLeadSchemaType = z.infer<typeof updateLeadSchema>;
export type LeadQuerySchemaType = z.infer<typeof leadQuerySchema>;

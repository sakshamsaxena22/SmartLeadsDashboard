import { Lead, ILeadDocument } from '../models/Lead.model';
import { IUserDocument } from '../models/User.model';
import { UserRole, LeadStatus, LeadSource } from '../../../shared/types';
import { CreateLeadSchemaType, UpdateLeadSchemaType, LeadQuerySchemaType } from '../../../shared/validators';
import { generateLeadsCsv } from '../utils/csv';
import mongoose, { SortOrder } from 'mongoose';

class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Mongoose filter types are complex; using Record for filter building
type MongoFilter = Record<string, any>;

function buildLeadQuery(
  params: LeadQuerySchemaType,
  user: IUserDocument
): MongoFilter {
  const query: MongoFilter = {};

  if (user.role === UserRole.SALES) {
    query.createdBy = user._id;
  }

  if (params.status) {
    query.status = params.status;
  }

  if (params.source) {
    query.source = params.source;
  }

  if (params.search && params.search.trim()) {
    query.$text = { $search: params.search.trim() };
  }

  return query;
}

function buildSortOrder(sort: string): Record<string, SortOrder> {
  return sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
}

export const leadService = {
  async create(data: CreateLeadSchemaType, userId: string) {
    const lead = await Lead.create({
      name: data.name,
      email: data.email,
      status: data.status as LeadStatus,
      source: data.source as LeadSource,
      createdBy: new mongoose.Types.ObjectId(userId),
    });
    return lead;
  },

  async getAll(params: LeadQuerySchemaType, user: IUserDocument) {
    const query = buildLeadQuery(params, user);
    const sortObj = buildSortOrder(params.sort);
    const skip = (params.page - 1) * params.limit;

    const [data, total] = await Promise.all([
      Lead.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(params.limit)
        .populate('createdBy', 'name email')
        .lean(),
      Lead.countDocuments(query),
    ]);

    return {
      data,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit) || 1,
      },
    };
  },

  async getById(id: string, user: IUserDocument) {
    const lead = await Lead.findById(id).populate('createdBy', 'name email');
    if (!lead) {
      throw new AppError('Lead not found.', 404);
    }

    if (
      user.role === UserRole.SALES &&
      (lead.createdBy as any)._id.toString() !== (user._id as any).toString()
    ) {
      throw new AppError('You do not have permission to view this lead.', 403);
    }

    return lead;
  },

  async update(id: string, data: UpdateLeadSchemaType, user: IUserDocument) {
    const lead = await Lead.findById(id);
    if (!lead) {
      throw new AppError('Lead not found.', 404);
    }

    if (
      user.role === UserRole.SALES &&
      lead.createdBy.toString() !== (user._id as any).toString()
    ) {
      throw new AppError('You can only edit your own leads.', 403);
    }

    if (data.name !== undefined) lead.name = data.name;
    if (data.email !== undefined) lead.email = data.email;
    if (data.status !== undefined) lead.status = data.status as LeadStatus;
    if (data.source !== undefined) lead.source = data.source as LeadSource;

    await lead.save();
    return lead;
  },

  async delete(id: string, user: IUserDocument) {
    if (user.role !== UserRole.ADMIN) {
      throw new AppError('Only admins can delete leads.', 403);
    }

    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      throw new AppError('Lead not found.', 404);
    }
  },

  async exportCsv(params: LeadQuerySchemaType, user: IUserDocument): Promise<string> {
    if (user.role !== UserRole.ADMIN) {
      throw new AppError('Only admins can export leads.', 403);
    }

    const query = buildLeadQuery(params, user);
    const sortObj = buildSortOrder(params.sort);

    const leads = await Lead.find(query).sort(sortObj).lean();
    return generateLeadsCsv(leads);
  },
};

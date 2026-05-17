import mongoose, { Schema, Document, Types } from 'mongoose';
import { LeadStatus, LeadSource } from '../../../shared/types';

export interface ILeadDocument extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.NEW,
    },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      required: [true, 'Lead source is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for filtering
leadSchema.index({ status: 1, source: 1 });

// Text index for scalable search
leadSchema.index({ name: 'text', email: 'text' });

// Index for email lookups
leadSchema.index({ email: 1 });

export const Lead = mongoose.model<ILeadDocument>('Lead', leadSchema);

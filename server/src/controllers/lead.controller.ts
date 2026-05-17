import { Request, Response, NextFunction } from 'express';
import { leadService } from '../services/lead.service';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import { LeadQuerySchemaType } from '../../../shared/validators';

export const leadController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await leadService.create(req.body, (req.user as any)._id.toString());
      sendSuccess({ res, data: lead, message: 'Lead created successfully', statusCode: 201 });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as LeadQuerySchemaType;
      const result = await leadService.getAll(query, req.user!);
      sendPaginated({ res, data: result.data, pagination: result.pagination });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await leadService.getById(req.params.id as string, req.user!);
      sendSuccess({ res, data: lead });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await leadService.update(req.params.id as string, req.body, req.user!);
      sendSuccess({ res, data: lead, message: 'Lead updated successfully' });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await leadService.delete(req.params.id as string, req.user!);
      sendSuccess({ res, data: null, message: 'Lead deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  async exportCsv(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as LeadQuerySchemaType;
      const csv = await leadService.exportCsv(query, req.user!);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
      res.send(csv);
    } catch (error) {
      next(error);
    }
  },
};

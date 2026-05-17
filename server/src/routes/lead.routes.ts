import { Router } from 'express';
import { leadController } from '../controllers/lead.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { createLeadSchema, updateLeadSchema, leadQuerySchema } from '../../../shared/validators';
import { UserRole } from '../../../shared/types';

const router = Router();

// All lead routes require authentication
router.use(authenticate);

router.get('/', validate(leadQuerySchema, 'query'), leadController.getAll);
router.get('/export', authorize(UserRole.ADMIN), validate(leadQuerySchema, 'query'), leadController.exportCsv);
router.get('/:id', leadController.getById);
router.post('/', validate(createLeadSchema), leadController.create);
router.put('/:id', validate(updateLeadSchema), leadController.update);
router.delete('/:id', authorize(UserRole.ADMIN), leadController.delete);

export default router;

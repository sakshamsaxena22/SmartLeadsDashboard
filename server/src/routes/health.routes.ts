import { Router } from 'express';
import { healthController } from '../controllers/health.controller';

const router = Router();

router.get('/', healthController.check);
router.get('/db', healthController.dbCheck);

export default router;

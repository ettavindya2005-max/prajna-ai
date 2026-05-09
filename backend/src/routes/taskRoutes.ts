import { Router } from 'express';
import { getTasks, updateTaskStatus } from '../controllers/taskController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.put('/:id', updateTaskStatus);

export default router;

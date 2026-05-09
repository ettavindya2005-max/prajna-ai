import { Router } from 'express';
import { askChat } from '../controllers/chatController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, askChat);

export default router;

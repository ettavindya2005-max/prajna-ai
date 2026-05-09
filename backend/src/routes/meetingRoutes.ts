import { Router } from 'express';
import { processMeeting, getMeetings, getMeetingById } from '../controllers/meetingController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', processMeeting);
router.get('/', getMeetings);
router.get('/:id', getMeetingById);

export default router;

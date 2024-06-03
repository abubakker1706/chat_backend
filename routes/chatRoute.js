import express from 'express';
import { sendMessage, getMessagesForUser } from '../controller/chatController.js';
import authMiddleware from '../server/middleware/auth.js';

const router = express.Router();

router.post('/send', authMiddleware, sendMessage);
router.get('/messages', authMiddleware, getMessagesForUser);

export default router;

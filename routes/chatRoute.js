import express from 'express';

import authMiddleware from '../server/middleware/auth.js';
import {addMemberToGroupController, getMessagesController, sendGroupMessageController, sendMessageController} from "../controller/chatController.js"

const router = express.Router();

router.post('/send', authMiddleware, sendMessageController);
router.post('/send-group-message', authMiddleware, sendGroupMessageController);
router.post('/add-member', authMiddleware, addMemberToGroupController);
router.get('/get-messages', getMessagesController);

export default router;

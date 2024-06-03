import express from 'express';
import { register, login, getUsers } from '../controller/authController.js';
import authMiddleware from '../server/middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/get-user', authMiddleware, getUsers);

export default router;



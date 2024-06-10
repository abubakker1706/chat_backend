import express from 'express';
import { register, login, getUsers, searchUsers, getUserById } from '../controller/authController.js';
import authMiddleware from '../server/middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/get-user', authMiddleware, getUsers);
router.get('/search', searchUsers);

router.get('/user', authMiddleware, getUserById);
export default router;



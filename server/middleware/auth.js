import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/config.js';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token,jwtSecret);
    console.log(decoded,"decoded token")
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(err,"error decoding")
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findAllUsers, findUserByEmail } from '../model/authModel.js';
import { jwtSecret } from '../server/config/config.js';

export const register = async (req, res) => {
  const { email, password, username } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  createUser(email, hashedPassword, username, (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, email, username });
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.user_id }, jwtSecret);
    res.json({ token });
  });
};
export const getUsers = (req, res) => {
    findAllUsers((err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Could not retrieve users' });
      }
      res.json(results);
    });
  };

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findAllUsers, findUserByEmail, findUserById } from '../model/authModel.js';
import { jwtSecret } from '../server/config/config.js';
import { connection } from '../db.js'

export const register = async (req, res) => {
  const { email, password, username } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  createUser(email, hashedPassword, username, (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      console.log(err,"err from signup");
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
    console.log(err)
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
  export const searchUsers = (req, res) => {
    const query = req.query.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
  
    const searchQuery = `SELECT user_id, username, email FROM user_table WHERE username LIKE ?`;
    const formattedQuery = `%${query}%`;
  
    connection.query(searchQuery, [formattedQuery], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      res.json(results);
    });
  };
  export const getUserById = async (req, res) => {
    try {
      const userId = req.userId;
      findUserById(userId, (err, results) => {
        if (err) {
          console.error('Error fetching user data:', err);
          return res.status(500).json({ error: 'Failed to fetch user data' });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
        const user = results[0]; 
        res.json(user); 
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  };
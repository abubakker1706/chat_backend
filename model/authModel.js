import { connection } from '../db.js';

export const createUser = (email, hashedPassword, username, callback) => {
  const query = `INSERT INTO user_table (email, password, username) VALUES (?, ?, ?)`;
  connection.query(query, [email, hashedPassword, username], callback);
};

export const findUserByEmail = (email, callback) => {
  const query = `SELECT * FROM user_table WHERE email = ?`;
  connection.query(query, [email], callback);
};

export const findAllUsers = (callback) => {
  const query = `SELECT user_id, email, username FROM user_table`;
  connection.query(query, callback);
};

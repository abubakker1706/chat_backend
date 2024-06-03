import { connection } from '../db.js';

export const createMessage = (senderId, receiverId, content, isGroup, callback) => {
  const query = `INSERT INTO message (sender_id, receiver_id, content, is_group) VALUES (?, ?, ?, ?)`;
  connection.query(query, [senderId, receiverId, content, isGroup], callback);
};

export const getMessages = (userId, callback) => {
  const query = `SELECT * FROM message WHERE receiver_id = ? OR sender_id = ? ORDER BY created_at ASC`;
  connection.query(query, [userId, userId], callback);
};

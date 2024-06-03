import { createMessage, getMessages } from '../model/chatModel.js';

export const sendMessage = (req, res) => {
  const { receiverId, content, isGroup } = req.body;
  const senderId = req.userId;

  createMessage(senderId, receiverId, content, isGroup, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, senderId, receiverId, content, isGroup });
  });
};

export const getMessagesForUser = (req, res) => {
  const userId = req.userId;

  getMessages(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};

import { connection } from '../db.js';




export const sendMessage = (senderId, receiverId, message, callback) => {
    const query = `INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`;
    connection.query(query, [senderId, receiverId, message], callback);
};

export const sendGroupMessage = (groupId, senderId, message, callback) => {
    const query = `INSERT INTO group_chat_messages (group_id, sender_id, message) VALUES (?, ?, ?)`;
    connection.query(query, [groupId, senderId, message], callback);
};

export const addMemberToGroup = (groupId, userId, callback) => {
    const query = `INSERT INTO group_chat_members (group_id, user_id) VALUES (?, ?)`;
    connection.query(query, [groupId, userId], callback);
};

export const getMessages = (userId, chatId, isGroup, callback) => {
    let query, params;
    if (isGroup) {
        query = `SELECT * FROM group_chat_messages WHERE group_id = ?`;
        params = [chatId];
    } else {
        query = `SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)`;
        params = [userId, chatId, chatId, userId];
    }
    connection.query(query, params, (err, results) => {
        if (err) {
            callback(err);
        } else {
            callback(null, results);
        }
    });
};


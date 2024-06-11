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
    if (isGroup === true) {  
        query = `SELECT * FROM group_chat_messages WHERE group_id = ?`;
        params = [chatId];
    } else {
        query = `SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)`;
        params = [userId, chatId, chatId, userId];
    }
    
    connection.query(query, params, (err, results) => {
      
        if (err) {
            console.error('Query Error:', err);
            callback(err);
        } else {
            callback(null, results);
        }
    });
};

export const transferMessagesToGroup = (userId1, userId2, groupId, callback) => {
    const query = `SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)`;
    connection.query(query, [userId1, userId2, userId2, userId1], callback);
};

export const insertGroupMessages = (groupId, messages, callback) => {
    const groupMessagesData = messages.map(msg => [groupId, msg.sender_id, msg.message]);
    const query = `INSERT INTO group_chat_messages (group_id, sender_id, message) VALUES ?`;
    connection.query(query, [groupMessagesData], callback);
};
export const createGroup = (groupName, callback) => {
    const query = `INSERT INTO group_chat (name) VALUES (?)`;
    connection.query(query, [groupName], callback);
};
export const getMessagedUsers = (currentUserId, callback) => {
    const query = `
        SELECT DISTINCT u.user_id, u.username
        FROM user_table u
        JOIN messages m ON (u.user_id = m.receiver_id OR u.user_id = m.sender_id)
        WHERE (m.sender_id = ? OR m.receiver_id = ?)
        AND u.user_id != ?
    `;
    connection.query(query, [currentUserId, currentUserId, currentUserId], (err, results) => {
        if (err) {
            callback(err);
        } else {
            callback(null, results);
        }
    });
};


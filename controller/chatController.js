import { sendMessage as sendMsg, sendGroupMessage as sendGrpMsg, addMemberToGroup as addMember, getMessages as getMsgs } from '../model/chatModel.js';

export const sendMessageController = (req, res) => {
    const { senderId, receiverId, message } = req.body;
    sendMsg(senderId, receiverId, message, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ success: true, message: 'Message sent successfully' });
    });
};

export const sendGroupMessageController = (req, res) => {
    const { groupId, senderId, message } = req.body;
    sendGrpMsg(groupId, senderId, message, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ success: true, message: 'Group message sent successfully' });
    });
};

export const addMemberToGroupController = (req, res) => {
    const { groupId, userId } = req.body;
    addMember(groupId, userId, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ success: true, message: 'Member added to group successfully' });
    });
};

export const getMessagesController = (req, res) => {
    const { userId, chatId, isGroup } = req.query;
    getMsgs(userId, chatId, isGroup, (err, messages) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ success: true, messages });
    });
};


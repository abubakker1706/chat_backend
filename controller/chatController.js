import { sendMessage as sendMsg, sendGroupMessage as sendGrpMsg, addMemberToGroup as addMember, getMessages as getMsgs, createGroup, transferMessagesToGroup, insertGroupMessages, getMessagedUsers } from '../model/chatModel.js';

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
        res.status(200).json({ success: true, data:messages });
    });
};




export const convertToGroupChat = (req, res) => {
    const { userId1, userId2, groupName } = req.body;

    createGroup(groupName, (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error creating group' });

        const groupId = result.insertId;

        addMembersToGroup(groupId, userId1, userId2, (err) => {
            if (err) return res.status(500).json({ error: 'Database error adding members to group' });

           
            transferMessagesToGroup(userId1, userId2, groupId, (err, messages) => {
                if (err) return res.status(500).json({ error: 'Database error retrieving messages' });

                if (messages.length > 0) {
                    insertGroupMessages(groupId, messages, (err) => {
                        if (err) return res.status(500).json({ error: 'Database error transferring messages' });

                        res.status(200).json({ success: true, message: 'Chat converted to group successfully' });
                    });
                } else {
                    res.status(200).json({ success: true, message: 'Chat converted to group successfully, no messages to transfer' });
                }
            });
        });
    });
};
export const getMessagedUsersController = (req, res) => {
    const { userId } = req.params;
    getMessagedUsers(userId, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ success: true, data });
    });
};
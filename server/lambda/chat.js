import { addMemberToGroupController, convertToGroupChat, getMessagedUsersController, getMessagesController, sendGroupMessageController, sendMessageController } from "../../controller/chatController";
import authMiddleware from "../middleware/auth";


const createResponse = () => {
  const res = {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    json: (body) => {
      res.body = JSON.stringify(body);
      return res;
    },
    status: (code) => {
      res.statusCode = code;
      return res;
    },
  };
  return res;
};

export const sendMessageHandler = async (event) => {
  const body = JSON.parse(event.body);
  const res = createResponse();
  try {
    const userId = authMiddleware(event);
    const req = { body: { ...body, senderId: userId } };
    await sendMessageController(req, res);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
  return res;
};

export const sendGroupMessageHandler = async (event) => {
  const body = JSON.parse(event.body);
  const res = createResponse();
  try {
    const userId = authMiddleware(event);
    const req = { body: { ...body, senderId: userId } };
    await sendGroupMessageController(req, res);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
  return res;
};

export const addMemberToGroupHandler = async (event) => {
  const body = JSON.parse(event.body);
  const res = createResponse();
  try {
    const userId = authMiddleware(event);
    const req = { body: { ...body, userId } };
    await addMemberToGroupController(req, res);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
  return res;
};

export const getMessagesHandler = async (event) => {
  const res = createResponse();
  try {
    const userId = authMiddleware(event);
    const req = { query: { ...event.queryStringParameters, userId } };
    await getMessagesController(req, res);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
  return res;
};

export const convertToGroupChatHandler = async (event) => {
  const body = JSON.parse(event.body);
  const res = createResponse();
  try {
    const userId = authMiddleware(event);
    const req = { body: { ...body, userId1: userId } };
    await convertToGroupChat(req, res);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
  return res;
};

export const getMessagedUsersHandler = async (event) => {
  const res = createResponse();
  try {
    const userId = authMiddleware(event);
    const req = { params: { userId } };
    await getMessagedUsersController(req, res);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
  return res;
};

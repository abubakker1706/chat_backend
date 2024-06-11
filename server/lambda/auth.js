// lambda/auth/auth.js
import { register, login, getUsers, searchUsers, getUserById } from '../../controller/authController.js';
import authMiddleware from '../middleware/auth.js';


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

export const registerHandler = async (event) => {
  const body = JSON.parse(event.body);
  const req = { body };
  const res = createResponse();
  await register(req, res);
  return res;
};

export const loginHandler = async (event) => {
  const body = JSON.parse(event.body);
  const req = { body };
  const res = createResponse();
  await login(req, res);
  return res;
};

export const getUsersHandler = async (event) => {
  const res = createResponse();
  try {
    const userId = authMiddleware(event);
    const req = { userId };
    await getUsers(req, res);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
  return res;
};

export const searchUsersHandler = async (event) => {
  const query = event.queryStringParameters;
  const req = { query };
  const res = createResponse();
  await searchUsers(req, res);
  return res;
};

export const getUserByIdHandler = async (event) => {
  const res = createResponse();
  try {
    const userId = authMiddleware(event);
    const req = { userId };
    await getUserById(req, res);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
  return res;
};

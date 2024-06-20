import express from 'express';
import { connection } from './db.js';
import authRoutes from './routes/authRoute.js';
import chatRoutes from './routes/chatRoute.js';

import cors from 'cors'
import { Server } from 'socket.io';
import http from 'http';
import authMiddleware from './server/middleware/auth.js';
import  {registerHandler,loginHandler,getUsersHandler,searchUsersHandler,getUserByIdHandler } from "./lambda/auth.js"
import { sendMessageHandler,sendGroupMessageHandler,addMemberToGroupHandler,getMessagesHandler,convertToGroupChatHandler,getMessagedUsersHandler } from './lambda/chat.js';
import { handler as websocketHandler} from './lambda/websocket.js';
const app = express();

app.use(cors())

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected My Database');
});
app.use(express.json())

const PORT = 8080;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

app.get('/', (req, res) => {
    res.send('Hello, World! Connected to sql and express project');
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

function getUserIdFromSocket(socket) {
  // Implement logic to retrieve userId from the socket,
  // such as using a token or a session
  // For example, you can access the user ID from the socket's handshake data

  const userId = socket.handshake.auth.userId;
  console.log(userId,"userId: " + userId);  
  return userId;
}
const onlineUsers = new Map();
// Socket.IO setup
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (userId) => {
    console.log(`User joined room: ${userId}`);
    socket.join(userId);
    onlineUsers.set(userId, socket.id);
    io.emit('userOnline', userId);
});

socket.on('disconnect', () => {
  console.log('User disconnected');
 
  for (const [userId, socketId] of onlineUsers.entries()) {
    if (socketId === socket.id) {
      onlineUsers.delete(userId);
    
      io.emit('userOffline', userId);
      break;
    }
  }
});
  socket.on('sendMessage', (data) => {
      console.log(`Sending message from ${data.senderId} to ${data.receiverId}`);
     
      const message = {
          sender_id: data.senderId,
          receiver_id: data.receiverId,
          message: data.message,
          sender_name: data.senderName
       
      };
      io.to(data.receiverId).emit('receiveMessage', message);
      io.to(data.senderId).emit('receiveMessage', message); 
  });

  socket.on('sendGroupMessage', (data) => {
      console.log(`Sending group message to group ${data.groupId}`);
      socket.broadcast.to(data.groupId).emit('receiveGroupMessage', data);
  });

  socket.on('joinGroup', (groupId) => {
      console.log(`User joined group: ${groupId}`);
      socket.join(groupId);
  });

  socket.on('typing', (data) => {
      console.log(`User ${data.senderId} is typing to ${data.receiverId}`);
      io.to(data.receiverId).emit('typing', {
          sender_id: data.senderId,
          receiver_id: data.receiverId
      });
  });

  socket.on('stop_typing', (data) => {
      console.log(`User ${data.senderId} stopped typing to ${data.receiverId}`);
      io.to(data.receiverId).emit('stop_typing', {
          sender_id: data.senderId,
          receiver_id: data.receiverId
      });
  });
});

// handler
export const authHandler = async (event) => {

  switch (event.path) {
    case '/register':
      return registerHandler(event);
    case '/login':
      return loginHandler(event);
    case '/getUsers':
      return getUsersHandler(event);
    case '/searchUsers':
      return searchUsersHandler(event);
    case '/getUserById':
      return getUserByIdHandler(event);
    default:
      return { statusCode: 404, body: JSON.stringify({ message: 'Not Found' }) };
  }
};


export const chatHandler = async (event) => {
 
  switch (event.path) {
    case '/sendMessage':
      return sendMessageHandler(event);
    case '/sendGroupMessage':
      return sendGroupMessageHandler(event);
    case '/addMemberToGroup':
      return addMemberToGroupHandler(event);
    case '/getMessages':
      return getMessagesHandler(event);
    case '/convertToGroupChat':
      return convertToGroupChatHandler(event);
    case '/getMessagedUsers':
      return getMessagedUsersHandler(event);
    default:
      return { statusCode: 404, body: JSON.stringify({ message: 'Not Found' }) };
  }
};


export const socketHandler = async (event) => {
  console.log(event,"event log from socket");
  
  return websocketHandler(event);
};

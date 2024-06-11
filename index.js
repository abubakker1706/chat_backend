import express from 'express';
import { connection } from './db.js';
import authRoutes from './routes/authRoute.js';
import chatRoutes from './routes/chatRoute.js';

import cors from 'cors'
import { Server } from 'socket.io';
import http from 'http';
import authMiddleware from './server/middleware/auth.js';
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
          sender_id: data.senderId
      });
  });

  socket.on('stop_typing', (data) => {
      console.log(`User ${data.senderId} stopped typing to ${data.receiverId}`);
      io.to(data.receiverId).emit('stop_typing', {
          sender_id: data.senderId
      });
  });
});
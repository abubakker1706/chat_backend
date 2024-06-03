import express from 'express';
import { connection } from './db.js';
import authRoutes from './routes/authRoute.js';
import chatRoutes from './routes/chatRoute.js';
import cors from 'cors'
import { Server } from 'socket.io';
import http from 'http';
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

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('send_message', (data) => {
    const { senderId, receiverId, content, isGroup } = data;
    io.to(receiverId).emit('receive_message', { senderId, content, isGroup });
  });

  socket.on('typing', (data) => {
    const { senderId, receiverId } = data;
    io.to(receiverId).emit('typing', { senderId });
  });

  socket.on('stop_typing', (data) => {
    const { senderId, receiverId } = data;
    io.to(receiverId).emit('stop_typing', { senderId });
  });
});
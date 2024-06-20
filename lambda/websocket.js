
// import AWS from 'aws-sdk';
// import { sendMessageController, sendGroupMessageController } from '../controller/chatController.js';




// const apiGateway = new AWS.ApiGatewayManagementApi({
//   endpoint:"https://7xd79lsle7.execute-api.eu-north-1.amazonaws.com/test/@connections",
// });

// export const handler = async (event) => {
//   const { routeKey, requestContext, body } = event;
//   const connectionId = requestContext.connectionId;

//   switch (routeKey) {
//     case '$connect':
//       return handleConnect(connectionId);
//     case '$disconnect':
//       return handleDisconnect(connectionId);
//     case 'sendMessage':
//       return handleSendMessage(body, connectionId);
//     case 'sendGroupMessage':
//       return handleSendGroupMessage(body, connectionId);
//     case 'typing':
//         return handleTyping(body, connectionId);
//     case 'stopTyping':
//         return handleStopTyping(body, connectionId);
//     case 'joinGroup':
//         return handleJoinGroup(body, connectionId);
//     case 'join':
//         return handleJoin(body, connectionId);
//     default:
//       return handleDefault(connectionId);
//   }
// };

// const handleConnect = async (connectionId) => {
//   console.log('Client connected:', connectionId);
  
//   const response = {
//     statusCode: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Headers': 'Content-Type',
//       'Access-Control-Allow-Methods': 'OPTIONS,POST',
//     },
//     body: 'Connected to websocket server',
//   };
//   return response;
// };

// const handleDisconnect = async (connectionId) => {
//   console.log('Client disconnected:', connectionId);
//   // Clean up connectionId if needed
//   return { statusCode: 200, body: 'Disconnected' };
// };

// const handleSendMessage = async (body, connectionId) => {
//   console.log('Received sendMessage:', body);
//   const { senderId, receiverId, message } = JSON.parse(body);
//   const res = createResponse();
//   const req = { body: { senderId, receiverId, message } };
//   await sendMessageController(req, res);
//   await sendToConnection(receiverId, JSON.stringify({ senderId, message }));
//   return { statusCode: 200, body: 'Message sent' };
// };

// const handleSendGroupMessage = async (body, connectionId) => {
//   console.log('Received sendGroupMessage:', body);
//   const { groupId, senderId, message } = JSON.parse(body);
//   const res = createResponse();
//   const req = { body: { groupId, senderId, message } };
//   await sendGroupMessageController(req, res);
//   await broadcastToGroup(groupId, JSON.stringify({ senderId, message }));
//   return { statusCode: 200, body: 'Group message sent' };
// };

// const handleDefault = async (connectionId) => {
//   console.log('Received default route event');
//   return { statusCode: 200, body: 'Default route' };
// };
// const handleTyping = async (body, connectionId) => {
//     try {
//       const data = JSON.parse(body);
//       const { senderId, receiverId } = data;
//       console.log(`User ${senderId} is typing to ${receiverId}`);
//       io.to(receiverId).emit('typing', { sender_id: senderId });
//     } catch (error) {
//       console.error('Error handling typing event:', error);
//     }
//   };
  
//   const handleStopTyping = async (body, connectionId) => {
//     try {
//       const data = JSON.parse(body);
//       const { senderId, receiverId } = data;
//       console.log(`User ${senderId} stopped typing to ${receiverId}`);
//       io.to(receiverId).emit('stop_typing', { sender_id: senderId });
//     } catch (error) {
//       console.error('Error handling stop_typing event:', error);
//     }
//   };
  
//   const handleJoinGroup = async (body, connectionId) => {
//     try {
//       const groupId = body;
//       console.log(`User joined group: ${groupId}`);
//       socket.join(groupId);
//     } catch (error) {
//       console.error('Error handling joinGroup event:', error);
//     }
//   };
  
//   const handleJoin = async (body, connectionId) => {
//     try {
//       const userId = body;
//       console.log(`User joined room: ${userId}`);
//       socket.join(userId);
//       onlineUsers.set(userId, socket.id);
//       io.emit('userOnline', userId);
//     } catch (error) {
//       console.error('Error handling join event:', error);
//     }
//   };
  

// const sendToConnection = async (connectionId, data) => {
//   await apiGateway.postToConnection({ ConnectionId: connectionId, Data: data }).promise();
// };

// const broadcastToGroup = async (groupId, data) => {
//     try {
     
//       io.to(groupId).emit('receiveGroupMessage', JSON.parse(data));
//     } catch (error) {
//       console.error('Error broadcasting message to group:', error);
//     }
//   };
  

// const createResponse = () => {
//   const res = {};
//   res.status = (code) => {
//     res.statusCode = code;
//     return res;
//   };
//   res.json = (json) => {
//     res.body = JSON.stringify(json);
//     return res;
//   };
//   return res;
// };

import AWS from 'aws-sdk';

const apiGateway = new AWS.ApiGatewayManagementApi({
    endpoint: "https://gsnpc2ee7i.execute-api.eu-north-1.amazonaws.com/test"
});

export const handler = async (event) => {
    const { routeKey, requestContext, body } = event;
    const connectionId = requestContext.connectionId;

    try {
        switch (routeKey) {
            case '$connect':
                return await handleConnect(connectionId);
            case '$disconnect':
                return await handleDisconnect(connectionId);
            case 'sendMessage':
                return await handleSendMessage(connectionId, body);
            default:
                return handleDefault();
        }
    } catch (err) {
        console.error(`Error handling route ${routeKey}: ${err.message}`, err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        };
    }
};

const handleConnect = async (connectionId) => {
    console.log(`Client connected: ${connectionId}`);
    return {
        statusCode: 200,
        body: 'Connected'
    };
};

const handleDisconnect = async (connectionId) => {
    console.log(`Client disconnected: ${connectionId}`);
    return {
        statusCode: 200,
        body: 'Disconnected'
    };
};

const handleSendMessage = async (connectionId, body) => {
    let message;
    try {
        message = JSON.parse(body).message;
    } catch (err) {
        console.error(`Failed to parse message body: ${err.message}`, err);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid message format' })
        };
    }

    console.log(`Received message: ${message} from ${connectionId}`);

    try {
        await apiGateway.postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify({ message: `You said: ${message}` })
        }).promise();
        return {
            statusCode: 200,
            body: 'Message sent'
        };
    } catch (err) {
        console.error(`Failed to send message: ${err.message}`, err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: err.message })
        };
    }
};

const handleDefault = () => {
    console.log('Received unknown route');
    return {
        statusCode: 200,
        body: 'Default route'
    };
};


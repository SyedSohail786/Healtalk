// middleware/socket.js
const socketIO = require('socket.io');
const db = require('../config/db');

function initializeSocket(server) {
     const io = socketIO(server, {
          cors: {
               origin: ["http://localhost:3000", "http://localhost:5000"],
               methods: ["GET", "POST"],
               credentials: true,
               allowedHeaders: ["Authorization", "Content-Type"]
          },
          transports: ['websocket', 'polling'] 
     });

     io.on('connection', (socket) => {
          console.log('New client connected:', socket.id);

          // Join supporter room
          socket.on('join-supporter', async (supporterId) => {
               socket.join(`supporter_${supporterId}`);
               console.log(`Supporter ${supporterId} joined their room`);

               // Update supporter status to online
               await updateSupporterStatus(supporterId, 'online');
          });

          // Join user room
          socket.on('join-user', (userId) => {
               socket.join(`user_${userId}`);
               console.log(`User ${userId} joined their room`);
          });

          // Join session room
          socket.on('join-session', (sessionId) => {
               socket.join(`session_${sessionId}`);
               console.log(`Client joined session ${sessionId}`);
          });

          // Send message
          socket.on('send-message', async (data) => {
               console.log(data)
               const { sessionId, senderId, receiverId, message, senderName, messageType = 'text' } = data;
               try {
                    // Save to database
                    const messageId = await saveMessageToDB(sessionId, senderId, message, messageType);

                    const messageData = {
                         messageId,
                         sessionId,
                         senderId,
                         senderName,
                         receiverId,
                         message,
                         messageType,
                         timestamp: new Date().toISOString(),
                         status: 'delivered'
                    };

                    // Emit to receiver
                    socket.to(`user_${receiverId}`).emit('new-message', messageData);
                    socket.to(`supporter_${receiverId}`).emit('new-message', messageData);
                    socket.to(`session_${sessionId}`).emit('new-message', messageData);

                    // Also send back to sender for UI update
                    socket.emit('message-sent', messageData);

                    console.log(`Message sent from ${senderId} to ${receiverId}`);
               } catch (error) {
                    console.error('Error saving message:', error);
                    socket.emit('message-error', { error: 'Failed to send message' });
               }
          });

          // Start session (video/audio)
          socket.on('start-session', (data) => {
               const { sessionId, supporterId, userId, sessionType } = data;

               // Notify both parties
               socket.to(`user_${userId}`).emit('session-started', {
                    sessionId,
                    supporterId,
                    sessionType,
                    timestamp: new Date().toISOString()
               });

               socket.to(`supporter_${supporterId}`).emit('session-started', {
                    sessionId,
                    userId,
                    sessionType,
                    timestamp: new Date().toISOString()
               });

               console.log(`Session ${sessionId} started`);
          });

          // End session
          socket.on('end-session', async (data) => {
               const { sessionId, endedBy } = data;

               // Update session status in database
               await updateSessionStatus(sessionId, 'completed');

               // Notify all participants
               io.to(`session_${sessionId}`).emit('session-ended', {
                    sessionId,
                    endedBy,
                    timestamp: new Date().toISOString()
               });

               console.log(`Session ${sessionId} ended by ${endedBy}`);
          });

          // Typing indicator
          socket.on('typing', (data) => {
               const { sessionId, userId, isTyping } = data;
               socket.to(`session_${sessionId}`).emit('user-typing', {
                    userId,
                    isTyping
               });
          });

          // Message read receipt
          socket.on('message-read', async (data) => {
               const { messageId, readerId } = data;

               // Update message status in database
               await updateMessageStatus(messageId, 'read');

               // Notify sender
               socket.emit('message-read-receipt', {
                    messageId,
                    readerId,
                    timestamp: new Date().toISOString()
               });
          });

          socket.on('disconnect', async () => {
               console.log('Client disconnected:', socket.id);

               // Update supporter status to offline if they were online
               // You would need to track which socket belongs to which user
          });
     });

     return io;
}

async function saveMessageToDB(sessionId, senderId, message, messageType = 'text') {
     return new Promise((resolve, reject) => {
          db.query(
               'INSERT INTO chat_messages (session_id, sender_id, message_type, content, is_read) VALUES (?, ?, ?, ?, ?)',
               [sessionId, senderId, messageType, message, 0],
               (err, result) => {
                    if (err) {
                         reject(err);
                    } else {
                         resolve(result.insertId);
                    }
               }
          );
     });
}

async function updateMessageStatus(messageId, status) {
     return new Promise((resolve, reject) => {
          db.query(
               'UPDATE chat_messages SET is_read = 1 WHERE message_id = ?',
               [messageId],
               (err) => {
                    if (err) reject(err);
                    else resolve();
               }
          );
     });
}

async function updateSessionStatus(sessionId, status) {
     return new Promise((resolve, reject) => {
          db.query(
               'UPDATE chat_sessions SET status = ?, end_time = NOW() WHERE session_id = ?',
               [status, sessionId],
               (err) => {
                    if (err) reject(err);
                    else resolve();
               }
          );
     });
}

async function updateSupporterStatus(supporterId, status) {
     return new Promise((resolve, reject) => {
          db.query(
               'UPDATE peer_supporters SET availability = ? WHERE supporter_id = ?',
               [status, supporterId],
               (err) => {
                    if (err) reject(err);
                    else resolve();
               }
          );
     });
}

module.exports = initializeSocket;
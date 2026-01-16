// server.js
const app = require('./app');
const http = require('http');
const initializeSocket = require('./middleware/socket');

const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);

// Make io accessible to routes if needed
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready on port ${PORT}`);
});
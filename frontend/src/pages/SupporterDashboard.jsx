// pages/contributor/SupporterDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
     Box,
     Container,
     Grid,
     Typography,
     Card,
     CardContent,
     CardActions,
     Button,
     Chip,
     Paper,
     List,
     ListItem,
     ListItemText,
     ListItemAvatar,
     Avatar,
     Badge,
     Tabs,
     Tab,
     IconButton,
     TextField,
     InputAdornment,
     Divider,
     CircularProgress,
     Alert,
     Dialog,
     DialogTitle,
     DialogContent,
     DialogActions,
} from '@mui/material';
import {
     VideoCall,
     Headset,
     Chat,
     AccessTime,
     Person,
     CalendarToday,
     Send,
     Notifications,
     Search,
     Refresh,
     CheckCircle,
     Cancel,
     MoreVert,
     Videocam,
     Mic,
     Message,
     Schedule,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import axios from 'axios';

const SupporterDashboard = () => {
     const { user, logout, token } = useAuth();
     const navigate = useNavigate();
     const [activeTab, setActiveTab] = useState(0);
     const [sessions, setSessions] = useState([]);
     const [activeChats, setActiveChats] = useState([]);
     const [selectedChat, setSelectedChat] = useState(null);
     const [chatMessages, setChatMessages] = useState([]);
     const [message, setMessage] = useState('');
     const [loading, setLoading] = useState(true);
     const [socket, setSocket] = useState(null);
     const [isTyping, setIsTyping] = useState(false);
     const [typingUsers, setTypingUsers] = useState({});
     const messagesEndRef = useRef(null);
     const [openSessionDialog, setOpenSessionDialog] = useState(false);
     const [selectedSession, setSelectedSession] = useState(null);
     const [isOnline, setIsOnline] = useState(true);
     const [isSocketConnected, setIsSocketConnected] = useState(false);

     // Check if user is a supporter
     useEffect(() => {
          if (!user || user.role !== 'supporter') {
               navigate('/login');
               toast.error('Access denied. Please login as a supporter.');
          }
     }, [user, navigate]);

     // Add this useEffect to handle online/offline status
     useEffect(() => {
          // Update supporter status on component mount
          updateSupporterStatus(true);

          // Listen for page visibility changes
          const handleVisibilityChange = () => {
               updateSupporterStatus(!document.hidden);
          };

          document.addEventListener('visibilitychange', handleVisibilityChange);

          return () => {
               // Update status to offline when component unmounts
               updateSupporterStatus(false);
               document.removeEventListener('visibilitychange', handleVisibilityChange);
          };
     }, []);

     // Function to update supporter status in database
     const updateSupporterStatus = async (online) => {
          try {
               await axios.put(
                    `http://localhost:5000/api/supporters/status`,
                    { isOnline: online },
                    { headers: { Authorization: `Bearer ${token}` } }
               );
               setIsOnline(online);
          } catch (error) {
               console.error('Error updating status:', error);
          }
     };

     // Function to toggle online/offline status
     const toggleStatus = async () => {
          const newStatus = !isOnline;
          try {
               await axios.put(
                    `http://localhost:5000/api/supporters/status`,
                    { isOnline: newStatus },
                    { headers: { Authorization: `Bearer ${token}` } }
               );
               setIsOnline(newStatus);
               toast.success(newStatus ? 'You are now online' : 'You are now offline');
          } catch (error) {
               console.error('Error updating status:', error);
          }
     };

     // Fetch supporter's sessions
     useEffect(() => {
          fetchSessions();
          fetchActiveChats();
     }, []);

     // Initialize WebSocket connection with proper configuration - UPDATED
     useEffect(() => {
          if (user && token) {
               console.log('Attempting to connect WebSocket for supporter...');

               const newSocket = io('http://localhost:5000', {
                    transports: ['websocket', 'polling'],
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                    timeout: 20000,
                    auth: { token }
               });

               newSocket.on('connect', () => {
                    console.log('Supporter Socket connected successfully:', newSocket.id);
                    setIsSocketConnected(true);

                    // Join supporter room with correct ID
                    // IMPORTANT: Use supporter_id from user object
                    const supporterId = user.supporter_id || user.userId;
                    newSocket.emit('join-supporter', supporterId);

                    console.log('Supporter joined room:', supporterId);

                    // Also join user's personal room for receiving messages
                    newSocket.emit('join-user', user.userId);

                    // Join all existing chat session rooms
                    activeChats.forEach(chat => {
                         newSocket.emit('join-session', chat.session_id);
                    });
               });

               newSocket.on('connect_error', (error) => {
                    console.error('Socket connection error:', error);
                    setIsSocketConnected(false);
                    toast.error('Connection error. Please refresh the page.');
               });

               newSocket.on('disconnect', (reason) => {
                    console.log('Socket disconnected:', reason);
                    setIsSocketConnected(false);
               });

               newSocket.on('reconnect', (attemptNumber) => {
                    console.log('Socket reconnected on attempt:', attemptNumber);
                    setIsSocketConnected(true);

                    // Rejoin rooms after reconnection
                    const supporterId = user.supporter_id || user.userId;
                    newSocket.emit('join-supporter', supporterId);
                    newSocket.emit('join-user', user.userId);

                    activeChats.forEach(chat => {
                         newSocket.emit('join-session', chat.session_id);
                    });
               });

               // Listen for new messages - FIXED EVENT NAME
               newSocket.on('new-message', (data) => {
                    console.log('Supporter received new message:', data);
                    handleNewMessage(data);
               });

               // Listen for message sent confirmation
               newSocket.on('message-sent', (data) => {
                    console.log('Message sent confirmation:', data);
               });

               // Listen for typing indicators
               newSocket.on('user-typing', (data) => {
                    setTypingUsers(prev => ({
                         ...prev,
                         [data.userId]: data.isTyping
                    }));
               });

               // Listen for message read receipts
               newSocket.on('message-read-receipt', (data) => {
                    // Update message status in UI
                    setChatMessages(prev => prev.map(msg =>
                         msg.message_id === data.messageId ? { ...msg, is_read: 1 } : msg
                    ));
               });

               // Listen for session started notifications
               newSocket.on('session-started', (data) => {
                    console.log('Session started notification:', data);
                    toast.info(`${data.sessionType} session started`);
               });

               // Listen for session ended notifications
               newSocket.on('session-ended', (data) => {
                    console.log('Session ended notification:', data);
                    toast.info('Session ended');
               });

               setSocket(newSocket);

               return () => {
                    console.log('Cleaning up supporter socket connection...');
                    newSocket.disconnect();
               };
          }
     }, [user, token, activeChats]);

     // Scroll to bottom when new messages arrive
     useEffect(() => {
          scrollToBottom();
     }, [chatMessages]);

     const scrollToBottom = () => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
     };

     const fetchSessions = async () => {
          try {
               setLoading(true);

               console.log('Fetching sessions for user:', user);

               let userId;

               if (user) {
                    // Try different possible ID properties
                    userId = user.userId || user.user_id || user._id || user.userId;

                    // If still not found, try to parse from any property
                    if (!userId) {
                         // Check if user is an object with nested ID
                         for (const key in user) {
                              if (typeof user[key] === 'object' && user[key]?.id) {
                                   userId = user[key].id;
                                   break;
                              }
                         }
                    }
               }

               if (!userId) {
                    console.error('Cannot find user ID in:', user);
                    toast.error('User information not available. Please login again.');
                    return;
               }

               console.log('Using user ID:', userId);

               const response = await axios.get(`http://localhost:5000/api/sessions/supporter/${user.supporterId}`, {
                    headers: { Authorization: `Bearer ${token}` }
               });

               if (response.data.success) {
                    setSessions(response.data.sessions);
                    console.log('Sessions fetched:', response.data.sessions.length);
               }
          } catch (error) {
               console.error('Error fetching sessions:', error);
          } finally {
               setLoading(false);
          }
     };

     const fetchActiveChats = async () => {
          try {
               // Get the correct supporter ID from user object
               let supporterId = user?.supporterId || user?.supporter_id;

               if (!supporterId) {
                    console.error('Cannot find supporter ID for fetching chats:', user);
                    return;
               }

               console.log('Fetching chats for supporter ID:', supporterId);

               const response = await axios.get(`http://localhost:5000/api/sessions/chats/supporter/${supporterId}`, {
                    headers: { Authorization: `Bearer ${token}` }
               });

               if (response.data.success) {
                    setActiveChats(response.data.chats);
                    console.log('Active chats fetched:', response.data.chats);
               }
          } catch (error) {
               console.error('Error fetching chats:', error);
          }
     };

     const fetchChatMessages = async (sessionId) => {
          try {
               console.log('Fetching messages for session:', sessionId);
               const response = await axios.get(`http://localhost:5000/api/sessions/chat/${sessionId}/messages`, {
                    headers: { Authorization: `Bearer ${token}` }
               });

               console.log('RAW MESSAGES RESPONSE:', JSON.stringify(response.data, null, 2));
               
               if (response.data.success) {
                    console.log('Messages fetched:', response.data.messages);

                    // IMPORTANT: Ensure all messages have the correct structure
                    const formattedMessages = response.data.messages.map(msg => ({
                         ...msg,
                         // Ensure sender_id is properly set
                         sender_id: msg.sender_id,
                         // Determine if sender is current user
                         is_sender: isMessageFromCurrentUser(msg.sender_id)
                    }));

                    setChatMessages(formattedMessages);
                    // Mark messages as read
                    const unreadMessages = formattedMessages.filter(msg => !msg.is_read && msg.sender_id !== user.userId);
                    if (unreadMessages.length > 0 && socket) {
                         unreadMessages.forEach(msg => {
                              socket.emit('message-read', {
                                   messageId: msg.message_id,
                                   readerId: user.userId
                              });
                         });
                    }
               }
          } catch (error) {
               console.error('Error fetching messages:', error);
          }
     };

     // Helper function to determine if message is from current user
     const isMessageFromCurrentUser = (senderId) => {
          if (!user || !senderId) return false;


          // Compare with user.userId
          return senderId === user.userId || senderId === user.user_id;
     };

     const handleNewMessage = (data) => {
          console.log('Handling new message in supporter dashboard:', data);

          // Always add message to chatMessages if it belongs to the selected chat
          if (selectedChat && selectedChat.session_id === data.sessionId) {
               const newMessage = {
                    message_id: data.messageId,
                    session_id: data.sessionId,
                    sender_id: data.senderId,
                    sender_name: data.senderName,
                    content: data.message,
                    message_type: data.messageType,
                    created_at: data.timestamp,
                    is_read: data.senderId === user.userId ? 1 : 0,
                    is_sender: isMessageFromCurrentUser(data.senderId)
               };

               setChatMessages(prev => [...prev, newMessage]);

               // Send read receipt if message is from other user
               if (data.senderId !== user.userId && socket) {
                    socket.emit('message-read', {
                         messageId: data.messageId,
                         readerId: user.userId
                    });
               }
          }

          // Update active chats list
          setActiveChats(prev => prev.map(chat => {
               if (chat.session_id === data.sessionId) {
                    return {
                         ...chat,
                         last_message: data.message,
                         last_message_time: data.timestamp,
                         unread_count: chat.unread_count + (data.senderId !== user.userId ? 1 : 0),
                    };
               }
               return chat;
          }));

          // Show notification for new messages not in current chat
          if (!selectedChat || selectedChat.session_id !== data.sessionId) {
               if (data.senderId !== user.userId) {
                    toast.info(`New message from ${data.senderName}`);
               }
          }
     };

     const handleSendMessage = () => {
          if (!message.trim() || !selectedChat || !socket || !isSocketConnected) {
               if (!isSocketConnected) {
                    toast.error('Not connected. Please wait for connection.');
               }
               return;
          }

          // Create temporary message ID for immediate display
          const tempMessageId = Date.now();

          // Immediately add message to chatMessages for instant display
          const newMessage = {
               message_id: tempMessageId,
               session_id: selectedChat.session_id,
               sender_id: user.userId, // Use user.userId
               sender_name: user.name,
               content: message.trim(),
               message_type: 'text',
               created_at: new Date().toISOString(),
               is_read: 1,
               is_sender: true // Mark as sender
          };

          setChatMessages(prev => [...prev, newMessage]);
          const messageData = {
               sessionId: selectedChat.session_id,
               senderId: user.userId, // Use user.userId
               senderName: user.name,
               receiverId: selectedChat.user_id,
               message: message.trim(),
               messageType: 'text'
          };

          console.log('Supporter sending message:', messageData);

          // Send via WebSocket
          socket.emit('send-message', messageData);

          // Clear input
          setMessage('');

          // Stop typing indicator
          if (socket) {
               socket.emit('typing', {
                    sessionId: selectedChat.session_id,
                    userId: user.userId,
                    isTyping: false
               });
          }
     };

     const handleStartSession = async (session) => {
          try {
               setSelectedSession(session);

               if (session.session_type === 'chat') {
                    // For chat sessions, open the chat directly
                    const chat = activeChats.find(c => c.user_id === session.user_id);
                    if (chat) {
                         setSelectedChat(chat);

                         // Join WebSocket room for this chat
                         if (socket && isSocketConnected) {
                              socket.emit('join-session', chat.session_id);
                         }

                         await fetchChatMessages(chat.session_id);
                         setActiveTab(2);
                    } else {
                         // Create new chat session
                         const response = await axios.post(
                              `http://localhost:5000/api/sessions/start/${session.session_id}`,
                              { sessionType: 'chat' },
                              { headers: { Authorization: `Bearer ${token}` } }
                         );

                         if (response.data.success) {
                              toast.success('Chat session started');
                              fetchSessions();
                              fetchActiveChats();
                         }
                    }
               } else {
                    // For video/audio sessions, show confirmation dialog
                    setOpenSessionDialog(true);
               }
          } catch (error) {
               console.error('Error starting session:', error);
               toast.error('Failed to start session');
          }
     };

     const confirmStartSession = async () => {
          try {
               const response = await axios.post(
                    `http://localhost:5000/api/sessions/start/${selectedSession.session_id}`,
                    { sessionType: selectedSession.session_type },
                    { headers: { Authorization: `Bearer ${token}` } }
               );

               if (response.data.success) {
                    toast.success(`${selectedSession.session_type} session started`);

                    // Notify via socket
                    if (socket && isSocketConnected) {
                         socket.emit('start-session', {
                              sessionId: selectedSession.session_id,
                              supporterId: user.userId,
                              userId: selectedSession.user_id,
                              sessionType: selectedSession.session_type
                         });
                    }

                    setOpenSessionDialog(false);
                    fetchSessions();
               }
          } catch (error) {
               console.error('Error confirming session:', error);
               toast.error('Failed to start session');
          }
     };

     const handleTyping = () => {
          if (!socket || !selectedChat || !isSocketConnected) return;

          socket.emit('typing', {
               sessionId: selectedChat.session_id,
               userId: user.userId,
               isTyping: true
          });

          // Clear typing indicator after 2 seconds
          clearTimeout(window.typingTimeout);
          window.typingTimeout = setTimeout(() => {
               socket.emit('typing', {
                    sessionId: selectedChat.session_id,
                    userId: user.userId,
                    isTyping: false
               });
          }, 2000);
     };

     const formatTime = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
     };

     const formatDate = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toLocaleDateString('en-US', {
               weekday: 'short',
               month: 'short',
               day: 'numeric',
               year: 'numeric'
          });
     };

     const formatDateTime = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toLocaleString('en-US', {
               month: 'short',
               day: 'numeric',
               hour: '2-digit',
               minute: '2-digit'
          });
     };

     const getSessionIcon = (type) => {
          switch (type) {
               case 'video': return <Videocam />;
               case 'audio': return <Mic />;
               case 'chat': return <Message />;
               default: return <Schedule />;
          }
     };

     const getSessionColor = (type) => {
          switch (type) {
               case 'video': return 'primary.main';
               case 'audio': return 'secondary.main';
               case 'chat': return 'success.main';
               default: return 'info.main';
          }
     };

     // Handle chat selection - UPDATED to join WebSocket room
     const handleSelectChat = async (chat) => {
          setSelectedChat(chat);

          // Join WebSocket room for this chat
          if (socket && isSocketConnected) {
               socket.emit('join-session', chat.session_id);
          }

          await fetchChatMessages(chat.session_id);
     };

     if (loading) {
          return (
               <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <CircularProgress />
               </Box>
          );
     }

     return (
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex' }}>
               {/* Left Sidebar - ONLY Active Chats */}
               <Paper
                    elevation={0}
                    sx={{
                         width: 350,
                         minHeight: '100vh',
                         bgcolor: 'background.paper',
                         borderRight: 1,
                         borderColor: 'divider',
                         display: 'flex',
                         flexDirection: 'column'
                    }}
               >
                    {/* Sidebar Header */}
                    <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                         <Typography variant="h6" gutterBottom>
                              Active Chats
                         </Typography>
                         <TextField
                              fullWidth
                              placeholder="Search chats..."
                              size="small"
                              sx={{ mb: 2 }}
                              InputProps={{
                                   startAdornment: (
                                        <InputAdornment position="start">
                                             <Search fontSize="small" />
                                        </InputAdornment>
                                   ),
                              }}
                         />
                         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                   <Chip
                                        label={isOnline ? "Online" : "Offline"}
                                        color={isOnline ? "success" : "default"}
                                        size="small"
                                        onClick={toggleStatus}
                                        clickable
                                        sx={{
                                             color: isOnline ? 'white' : 'text.primary',
                                             bgcolor: isOnline ? 'success.dark' : 'grey.300',
                                             cursor: 'pointer',
                                             '&:hover': {
                                                  bgcolor: isOnline ? 'success.main' : 'grey.400'
                                             }
                                        }}
                                   />
                                   {!isSocketConnected && (
                                        <Chip
                                             label="Connecting..."
                                             color="warning"
                                             size="small"
                                             sx={{ height: 24 }}
                                        />
                                   )}
                              </Box>
                              <IconButton size="small" onClick={fetchActiveChats}>
                                   <Refresh />
                              </IconButton>
                         </Box>
                    </Box>

                    {/* Chat List */}
                    <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                         {activeChats.length === 0 ? (
                              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                   No active chats
                              </Typography>
                         ) : (
                              activeChats.map((chat) => (
                                   <motion.div key={chat.session_id} whileHover={{ scale: 1.01 }}>
                                        <ListItem
                                             button
                                             selected={selectedChat?.session_id === chat.session_id}
                                             onClick={() => handleSelectChat(chat)}
                                             sx={{
                                                  mb: 1,
                                                  borderRadius: 1,
                                                  bgcolor: selectedChat?.session_id === chat.session_id ? 'action.selected' : 'transparent',
                                             }}
                                        >
                                             <ListItemAvatar>
                                                  <Badge
                                                       color="primary"
                                                       variant="dot"
                                                       invisible={chat.status !== 'active'}
                                                  >
                                                       <Avatar>
                                                            {chat.user_name?.charAt(0) || 'U'}
                                                       </Avatar>
                                                  </Badge>
                                             </ListItemAvatar>
                                             <ListItemText
                                                  primary={
                                                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Typography variant="subtitle2" noWrap>
                                                                 {chat.user_name}
                                                            </Typography>
                                                            {chat.unread_count > 0 && (
                                                                 <Chip
                                                                      label={chat.unread_count}
                                                                      size="small"
                                                                      color="primary"
                                                                      sx={{ ml: 1, height: 20, minWidth: 20 }}
                                                                 />
                                                            )}
                                                       </Box>
                                                  }
                                                  secondary={
                                                       <Typography variant="body2" color="text.secondary" noWrap>
                                                            {chat.last_message || 'No messages yet'}
                                                       </Typography>
                                                  }
                                             />
                                             <Typography variant="caption" color="text.secondary">
                                                  {formatTime(chat.last_message_time || chat.start_time)}
                                             </Typography>
                                        </ListItem>
                                   </motion.div>
                              ))
                         )}
                    </Box>
               </Paper>

               {/* Main Content Area */}
               <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <Paper elevation={0} sx={{ py: 2, px: 3, bgcolor: 'primary.main', color: 'white' }}>
                         <Container maxWidth="xl">
                              <Grid container alignItems="center" justifyContent="space-between">
                                   <Grid item>
                                        <Typography variant="h5" fontWeight={600}>
                                             Supporter Dashboard
                                        </Typography>
                                        <Typography variant="body2">
                                             Welcome back, {user?.name || 'Supporter'}!
                                             {!isSocketConnected && ' (Connecting...)'}
                                        </Typography>
                                   </Grid>
                                   <Grid item>
                                        <Button
                                             variant="outlined"
                                             onClick={logout}
                                             sx={{ color: 'white', borderColor: 'white' }}
                                        >
                                             Logout
                                        </Button>
                                   </Grid>
                              </Grid>
                         </Container>
                    </Paper>

                    <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
                         {selectedChat ? (
                              // Fixed Chat Screen
                              <Card sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
                                   <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
                                        {/* Chat Header */}
                                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                                             <Grid container alignItems="center">
                                                  <Grid item>
                                                       <Avatar sx={{ mr: 2 }}>
                                                            {selectedChat.user_name?.charAt(0) || 'U'}
                                                       </Avatar>
                                                  </Grid>
                                                  <Grid item xs>
                                                       <Typography variant="subtitle1" fontWeight={600}>
                                                            {selectedChat.user_name}
                                                       </Typography>
                                                       <Typography variant="body2" color="text.secondary">
                                                            {typingUsers[selectedChat.user_id] ? 'Typing...' : 'Online'}
                                                            {!isSocketConnected && ' (Disconnected)'}
                                                       </Typography>
                                                  </Grid>
                                                  <Grid item>
                                                       <IconButton size="small" onClick={() => {
                                                            setSelectedChat(null);
                                                            setChatMessages([]);
                                                       }}>
                                                            <Cancel />
                                                       </IconButton>
                                                  </Grid>
                                             </Grid>
                                        </Box>

                                        {/* Fixed Height Chat Messages Area */}
                                        <Box sx={{
                                             flex: 1,
                                             p: 2,
                                             overflow: 'auto',
                                             bgcolor: 'action.hover',
                                             minHeight: 400,
                                             maxHeight: 'calc(100vh - 350px)'
                                        }}>
                                             {chatMessages.length === 0 ? (
                                                  <Typography align="center" color="text.secondary" sx={{ py: 8 }}>
                                                       Start chatting with {selectedChat.user_name}
                                                  </Typography>
                                             ) : (
                                                  chatMessages.map((msg) => {
                                                       // Determine if message is from current user
                                                       const isCurrentUser = isMessageFromCurrentUser(msg.sender_id);

                                                       return (
                                                            <Box
                                                                 key={msg.message_id}
                                                                 sx={{
                                                                      display: 'flex',
                                                                      justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                                                                      mb: 2
                                                                 }}
                                                            >
                                                                 <Card
                                                                      sx={{
                                                                           maxWidth: '70%',
                                                                           bgcolor: isCurrentUser ? 'primary.main' : 'background.paper',
                                                                           color: isCurrentUser ? 'white' : 'text.primary'
                                                                      }}
                                                                 >
                                                                      <CardContent sx={{ py: 1, px: 2 }}>
                                                                           {!isCurrentUser && (
                                                                                <Typography variant="caption" color="inherit" sx={{ opacity: 0.8 }}>
                                                                                     {msg.sender_name}
                                                                                </Typography>
                                                                           )}
                                                                           <Typography variant="body2">
                                                                                {msg.content}
                                                                           </Typography>
                                                                           <Typography variant="caption" sx={{
                                                                                display: 'block',
                                                                                textAlign: 'right',
                                                                                opacity: 0.7,
                                                                                color: isCurrentUser ? 'white' : 'text.secondary'
                                                                           }}>
                                                                                {formatTime(msg.created_at)}
                                                                                {msg.is_read && isCurrentUser && ' ✓'}
                                                                           </Typography>
                                                                      </CardContent>
                                                                 </Card>
                                                            </Box>
                                                       );
                                                  })
                                             )}
                                             <div ref={messagesEndRef} />
                                        </Box>

                                        {/* Fixed Message Input at Bottom - FIXED VISIBILITY */}
                                        <Box sx={{
                                             p: 2,
                                             borderTop: 1,
                                             borderColor: 'divider',
                                             bgcolor: 'background.paper',
                                             position: 'sticky',
                                             bottom: 0,
                                             width: '100%'
                                        }}>
                                             <Grid container spacing={1} alignItems="center">
                                                  <Grid item xs>
                                                       <TextField
                                                            fullWidth
                                                            placeholder={!isSocketConnected ? "Connecting to server..." : "Type your message..."}
                                                            value={message}
                                                            onChange={(e) => {
                                                                 setMessage(e.target.value);
                                                                 handleTyping();
                                                            }}
                                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                            size="small"
                                                            disabled={!isSocketConnected}
                                                            sx={{ bgcolor: 'background.paper' }}
                                                       />
                                                  </Grid>
                                                  <Grid item>
                                                       <Button
                                                            variant="contained"
                                                            onClick={handleSendMessage}
                                                            disabled={!message.trim() || !isSocketConnected}
                                                            sx={{ minWidth: 'auto', p: 1 }}
                                                       >
                                                            <Send />
                                                       </Button>
                                                  </Grid>
                                             </Grid>
                                        </Box>
                                   </CardContent>
                              </Card>
                         ) : (
                              // No Chat Selected - Show Dashboard
                              <Grid container spacing={3}>
                                   <Grid item xs={12}>
                                        <Card>
                                             <CardContent>
                                                  <Tabs
                                                       value={activeTab}
                                                       onChange={(e, newValue) => setActiveTab(newValue)}
                                                       sx={{ mb: 3 }}
                                                  >
                                                       <Tab icon={<Videocam />} label="Video Sessions" />
                                                       <Tab icon={<Mic />} label="Audio Sessions" />
                                                  </Tabs>

                                                  {activeTab === 0 && (
                                                       <Box>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                                                 <Typography variant="h6">
                                                                      Scheduled Video Sessions
                                                                 </Typography>
                                                                 <Button
                                                                      variant="outlined"
                                                                      startIcon={<Refresh />}
                                                                      onClick={fetchSessions}
                                                                      size="small"
                                                                 >
                                                                      Refresh
                                                                 </Button>
                                                            </Box>

                                                            {sessions.filter(s => s.session_type === 'video').length === 0 ? (
                                                                 <Alert severity="info">No video sessions scheduled</Alert>
                                                            ) : (
                                                                 <Grid container spacing={2}>
                                                                      {sessions
                                                                           .filter(s => s.session_type === 'video')
                                                                           .map((session) => (
                                                                                <Grid item xs={12} key={session.session_id}>
                                                                                     <Card variant="outlined">
                                                                                          <CardContent>
                                                                                               <Grid container alignItems="center" spacing={2}>
                                                                                                    <Grid item>
                                                                                                         <Avatar sx={{ bgcolor: getSessionColor(session.session_type) }}>
                                                                                                              {getSessionIcon(session.session_type)}
                                                                                                         </Avatar>
                                                                                                    </Grid>
                                                                                                    <Grid item xs>
                                                                                                         <Typography variant="subtitle1" fontWeight={600}>
                                                                                                              {session.title || `${session.session_type} Session`}
                                                                                                         </Typography>
                                                                                                         <Typography variant="body2" color="text.secondary">
                                                                                                              With: {session.user_name}
                                                                                                         </Typography>
                                                                                                         <Typography variant="body2" color="text.secondary">
                                                                                                              <CalendarToday sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                                                                                                              {formatDateTime(session.scheduled_time)}
                                                                                                         </Typography>
                                                                                                         {session.notes && (
                                                                                                              <Typography variant="caption" color="text.secondary">
                                                                                                                   Notes: {session.notes}
                                                                                                              </Typography>
                                                                                                         )}
                                                                                                    </Grid>
                                                                                                    <Grid item>
                                                                                                         <Chip
                                                                                                              label={session.status}
                                                                                                              color={session.status === 'scheduled' ? 'primary' : 'default'}
                                                                                                              size="small"
                                                                                                         />
                                                                                                    </Grid>
                                                                                                    <Grid item>
                                                                                                         <Button
                                                                                                              variant="contained"
                                                                                                              size="small"
                                                                                                              onClick={() => handleStartSession(session)}
                                                                                                              disabled={session.status !== 'scheduled'}
                                                                                                         >
                                                                                                              Start Session
                                                                                                         </Button>
                                                                                                    </Grid>
                                                                                               </Grid>
                                                                                          </CardContent>
                                                                                     </Card>
                                                                                </Grid>
                                                                           ))}
                                                                 </Grid>
                                                            )}
                                                       </Box>
                                                  )}

                                                  {activeTab === 1 && (
                                                       <Box>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                                                 <Typography variant="h6">
                                                                      Scheduled Audio Sessions
                                                                 </Typography>
                                                                 <Button
                                                                      variant="outlined"
                                                                      startIcon={<Refresh />}
                                                                      onClick={fetchSessions}
                                                                      size="small"
                                                                 >
                                                                      Refresh
                                                                 </Button>
                                                            </Box>

                                                            {sessions.filter(s => s.session_type === 'audio').length === 0 ? (
                                                                 <Alert severity="info">No audio sessions scheduled</Alert>
                                                            ) : (
                                                                 <Grid container spacing={2}>
                                                                      {sessions
                                                                           .filter(s => s.session_type === 'audio')
                                                                           .map((session) => (
                                                                                <Grid item xs={12} key={session.session_id}>
                                                                                     <Card variant="outlined">
                                                                                          <CardContent>
                                                                                               <Grid container alignItems="center" spacing={2}>
                                                                                                    <Grid item>
                                                                                                         <Avatar sx={{ bgcolor: getSessionColor(session.session_type) }}>
                                                                                                              {getSessionIcon(session.session_type)}
                                                                                                         </Avatar>
                                                                                                    </Grid>
                                                                                                    <Grid item xs>
                                                                                                         <Typography variant="subtitle1" fontWeight={600}>
                                                                                                              {session.title || `${session.session_type} Session`}
                                                                                                         </Typography>
                                                                                                         <Typography variant="body2" color="text.secondary">
                                                                                                              With: {session.user_name}
                                                                                                         </Typography>
                                                                                                         <Typography variant="body2" color="text.secondary">
                                                                                                              <CalendarToday sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                                                                                                              {formatDateTime(session.scheduled_time)}
                                                                                                         </Typography>
                                                                                                    </Grid>
                                                                                                    <Grid item>
                                                                                                         <Chip
                                                                                                              label={session.status}
                                                                                                              color={session.status === 'scheduled' ? 'secondary' : 'default'}
                                                                                                              size="small"
                                                                                                         />
                                                                                                    </Grid>
                                                                                                    <Grid item>
                                                                                                         <Button
                                                                                                              variant="contained"
                                                                                                              color="secondary"
                                                                                                              size="small"
                                                                                                              onClick={() => handleStartSession(session)}
                                                                                                              disabled={session.status !== 'scheduled'}
                                                                                                         >
                                                                                                              Start Session
                                                                                                         </Button>
                                                                                                    </Grid>
                                                                                               </Grid>
                                                                                          </CardContent>
                                                                                     </Card>
                                                                                </Grid>
                                                                           ))}
                                                                 </Grid>
                                                            )}
                                                       </Box>
                                                  )}
                                             </CardContent>
                                        </Card>
                                   </Grid>
                              </Grid>
                         )}
                    </Container>
               </Box>

               {/* Session Start Confirmation Dialog */}
               <Dialog open={openSessionDialog} onClose={() => setOpenSessionDialog(false)}>
                    <DialogTitle>
                         Start {selectedSession?.session_type} Session
                    </DialogTitle>
                    <DialogContent>
                         <Typography variant="body1" gutterBottom>
                              Are you ready to start the {selectedSession?.session_type} session with {selectedSession?.user_name}?
                         </Typography>
                         <Typography variant="body2" color="text.secondary">
                              Session scheduled for: {selectedSession && formatDateTime(selectedSession.scheduled_time)}
                         </Typography>
                    </DialogContent>
                    <DialogActions>
                         <Button onClick={() => setOpenSessionDialog(false)}>Cancel</Button>
                         <Button
                              variant="contained"
                              onClick={confirmStartSession}
                              color={selectedSession?.session_type === 'video' ? 'primary' : 'secondary'}
                         >
                              Start Session
                         </Button>
                    </DialogActions>
               </Dialog>
          </Box>
     );
};

export default SupporterDashboard;
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  TextField,
  IconButton,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Send,
  AttachFile,
  EmojiEmotions,
  Search,
  Star,
  Person,
  CheckCircle,
  Videocam,
  Phone,
  MoreVert,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supportService } from '../../services/supportService';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const ChatSupport = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [supporters, setSupporters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize WebSocket connection with proper configuration
  useEffect(() => {
    if (!user) return;

    console.log('Attempting to connect WebSocket...');
    
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000
    });

    newSocket.on('connect', () => {
      console.log('Socket connected successfully:', newSocket.id);
      setIsSocketConnected(true);
      
      // Join user's personal room
      newSocket.emit('join-user', user.id);
      
      // Join all existing chat rooms
      chats.forEach(chat => {
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
      newSocket.emit('join-user', user.id);
      chats.forEach(chat => {
        newSocket.emit('join-session', chat.session_id);
      });
    });

    setSocket(newSocket);

    fetchSupporters();
    fetchUserChats();

    return () => {
      console.log('Cleaning up socket connection...');
      newSocket.close();
    };
  }, [user]);

  // WebSocket listeners - Fixed event names
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewMessage = (messageData) => {
      console.log('New message received via socket:', messageData);
      
      // Check if this message belongs to the selected chat
      if (selectedChat && selectedChat.session_id === messageData.sessionId) {
        setSelectedChat(prev => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              id: messageData.messageId,
              session_id: messageData.sessionId,
              sender_id: messageData.senderId,
              content: messageData.message,
              created_at: messageData.timestamp,
              sender_name: messageData.senderName,
              isSender: messageData.senderId === user.id
            }
          ]
        }));
      }

      // Update chats list
      setChats(prevChats =>
        prevChats.map(chat => {
          if (chat.session_id === messageData.sessionId) {
            return {
              ...chat,
              lastMessage: messageData.message,
              lastMessageTime: messageData.timestamp,
              unreadCount: chat.session_id !== selectedChat?.session_id ? 
                (chat.unreadCount || 0) + 1 : 0
            };
          }
          return chat;
        })
      );
    };

    const handleMessageSent = (messageData) => {
      console.log('Message sent confirmation:', messageData);
      // You can update message status here if needed
    };

    const handleMessageError = (errorData) => {
      console.error('Message sending error:', errorData);
      toast.error('Failed to send message: ' + errorData.error);
    };

    const handleUserTyping = (typingData) => {
      console.log('User typing:', typingData);
      // You can implement typing indicators here
    };

    const handleSessionStarted = (sessionData) => {
      console.log('Session started:', sessionData);
    };

    const handleSessionEnded = (sessionData) => {
      console.log('Session ended:', sessionData);
    };

    // Listen for correct event names
    socket.on('new-message', handleNewMessage);
    socket.on('message-sent', handleMessageSent);
    socket.on('message-error', handleMessageError);
    socket.on('user-typing', handleUserTyping);
    socket.on('session-started', handleSessionStarted);
    socket.on('session-ended', handleSessionEnded);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('message-sent', handleMessageSent);
      socket.off('message-error', handleMessageError);
      socket.off('user-typing', handleUserTyping);
      socket.off('session-started', handleSessionStarted);
      socket.off('session-ended', handleSessionEnded);
    };
  }, [socket, selectedChat, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSupporters = async () => {
    try {
      setLoading(true);
      const data = await supportService.getAvailableSupporters();
      setSupporters(data);
    } catch (error) {
      console.error('Error fetching supporters:', error);
      toast.error('Failed to load supporters');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserChats = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/chat/sessions/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      const data = await response.json();

      // Process chats with proper message formatting
      const processedChats = data.map(chat => ({
        ...chat,
        supporter: chat.supporter || supporters.find(s => s.supporter_id === chat.supporter_id),
        messages: chat.messages ? chat.messages.map(msg => ({
          ...msg,
          isSender: msg.sender_id === user.userId,
          sender_name: msg.sender_name || (msg.sender_id === user.userId ? 'You' : chat.supporter?.name)
        })) : []
      }));

      setChats(processedChats);

      // If there's a selected chat, update it with fresh data
      if (selectedChat) {
        const updatedChat = processedChats.find(c => c.session_id === selectedChat.session_id);
        if (updatedChat) {
          setSelectedChat(updatedChat);
        }
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.success('Loading.....');
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat || !user || !socket) {
      toast.error('Cannot send message');
      return;
    }
    console.log(user)
    const messageData = {
      sessionId: selectedChat.session_id,
      senderId: user.userId,
      receiverId: selectedChat.supporter.user_id || selectedChat.supporter.id,
      message: message,
      senderName: user.name || 'You',
      messageType: 'text'
    };
    console.log(messageData)
    try {
      // Send via WebSocket with correct event name
      socket.emit('send-message', messageData);

      // Also save to database via API
      await supportService.sendMessage({
        session_id: selectedChat.session_id,
        sender_id: user.userId,
        content: message,
        message_type: 'text'
      });

      // Optimistically update UI
      const newMessage = {
        id: Date.now(),
        session_id: selectedChat.session_id,
        sender_id: user.id,
        content: message,
        created_at: new Date().toISOString(),
        sender_name: user.name || 'You',
        isSender: true
      };

      // Update selected chat
      setSelectedChat(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage]
      }));

      // Update chats list
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.session_id === selectedChat.session_id
            ? {
                ...chat,
                lastMessage: message,
                lastMessageTime: new Date().toISOString(),
                messages: [...chat.messages, newMessage]
              }
            : chat
        )
      );

      setMessage('');
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleStartNewChat = async (supporter) => {
    if (!user) {
      toast.error('Please login to start a chat');
      return;
    }

    try {
      const chatData = {
        user_id: user.id,
        supporter_id: supporter.supporter_id || supporter.id,
        session_type: 'chat',
        title: `Chat with ${supporter.name}`
      };

      const newChat = await supportService.startChatSession(chatData);

      // Join WebSocket room with correct event name
      socket.emit('join-session', newChat.session_id);

      const formattedChat = {
        session_id: newChat.session_id,
        supporter: {
          ...supporter,
          user_id: supporter.user_id || supporter.id
        },
        messages: [],
        lastMessage: '',
        lastMessageTime: new Date().toISOString()
      };

      // Update states
      setSelectedChat(formattedChat);
      setChats(prev => [formattedChat, ...prev]);

      toast.success(`Started chat with ${supporter.name}`);

    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start chat');
    }
  };

  const handleSelectChat = async (chat) => {
    try {
      // Join the WebSocket room for this chat with correct event name
      socket.emit('join-session', chat.session_id);

      // Fetch messages for this chat
      const res = await fetch(`/api/chat/${chat.session_id}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });

      const data = await res.json();

      if (!data.success) {
        toast.error("Failed to load chat");
        return;
      }

      // Process messages with proper formatting
      const messages = data.messages.map(msg => ({
        ...msg,
        isSender: msg.sender_id === user.id,
        sender_name: msg.sender_name || (msg.sender_id === user.id ? 'You' : chat.supporter?.name)
      }));

      const updatedChat = {
        ...chat,
        messages: messages,
        unreadCount: 0
      };

      setSelectedChat(updatedChat);

      // Update chats list to mark as read
      setChats(prevChats =>
        prevChats.map(c =>
          c.session_id === chat.session_id
            ? { ...c, unreadCount: 0 }
            : c
        )
      );

    } catch (err) {
      console.error('Error loading chat:', err);
      toast.error("Error loading chat messages");
    }
  };

  const isMessageFromCurrentUser = (message) => {
  if (message.isSender !== undefined) {
    return message.isSender;
  }
  
  // Debug: Check what IDs we're comparing
  console.log('isMessageFromCurrentUser - Debug:', {
    messageSenderId: message.sender_id,
    userId: user?.id,
    user_user_id: user?.user_id,
    isMatch: message.sender_id === user?.id || message.sender_type === 'user'
  });
  
  return message.sender_id === user?.id || message.sender_type === 'user';
};

  // Calculate filtered supporters
  const filteredSupporters = supporters.filter(supporter =>
    supporter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (supporter.role && supporter.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (supporter.specialization && supporter.specialization.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate filtered chats
  const filteredChats = chats.filter(chat =>
    chat.supporter?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const CustomRating = ({ value }) => {
    const stars = [];
    const fullStars = Math.floor(value || 0);
    const partialStar = (value || 0) - fullStars;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} sx={{ fontSize: 14, color: '#FFD700' }} />);
    }

    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={i} sx={{ fontSize: 14, color: '#E5E7EB' }} />);
    }

    return <Box sx={{ display: 'flex' }}>{stars}</Box>;
  };

  // Typing handler
  const handleTyping = useCallback(() => {
    if (socket && selectedChat) {
      socket.emit('typing', {
        sessionId: selectedChat.session_id,
        userId: user.id,
        isTyping: true
      });
    }
  }, [socket, selectedChat, user]);

  return (
    <Container maxWidth="lg" sx={{ py: 4, height: 'calc(100vh - 128px)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ height: '100%' }}
      >
        {/* Connection status indicator */}
        {!isSocketConnected && (
          <Box sx={{ 
            position: 'fixed', 
            top: 70, 
            right: 20, 
            zIndex: 1000,
            bgcolor: 'error.main',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            boxShadow: 3
          }}>
            <CircularProgress size={16} color="inherit" />
            <Typography variant="caption">Reconnecting...</Typography>
          </Box>
        )}

        <Grid container spacing={3} sx={{ height: '100%' }}>
          {/* Left Sidebar - Chats History */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Chat History
                </Typography>

                {/* Search */}
                <TextField
                  fullWidth
                  placeholder="Search chats or supporters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                {/* Chats List */}
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                  <List>
                    {filteredChats.map((chat) => (
                      <ListItem
                        key={chat.session_id}
                        button
                        selected={selectedChat?.session_id === chat.session_id}
                        onClick={() => handleSelectChat(chat)}
                        sx={{
                          mb: 1,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: selectedChat?.session_id === chat.session_id 
                            ? 'primary.main' 
                            : 'divider',
                          '&:hover': {
                            borderColor: 'primary.main',
                          },
                          bgcolor: selectedChat?.session_id === chat.session_id 
                            ? 'primary.light' 
                            : 'background.paper',
                        }}
                      >
                        <ListItemAvatar>
                          <Box sx={{ position: 'relative' }}>
                            <Avatar sx={{ bgcolor: chat.supporter?.avatarColor || '#4F46E5' }}>
                              {chat.supporter?.name?.split(' ').map(n => n[0]).join('') || 'SA'}
                            </Avatar>
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: chat.supporter?.status === 'online' ? '#10B981' :
                                  chat.supporter?.status === 'away' ? '#F59E0B' : '#6B7280',
                                border: '2px solid white',
                              }}
                            />
                          </Box>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {chat.supporter?.name || 'Support Agent'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {chat.lastMessageTime ? 
                                  new Date(chat.lastMessageTime).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  }) : 
                                  'Just now'
                                }
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {chat.lastMessage || 'No messages yet'}
                              </Typography>
                              {chat.unreadCount > 0 && (
                                <Chip
                                  label={chat.unreadCount}
                                  size="small"
                                  color="primary"
                                  sx={{ mt: 0.5, height: 20, fontSize: '0.75rem' }}
                                />
                              )}
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Available Supporters
                </Typography>

                {/* Supporters List */}
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box sx={{ overflow: 'auto', maxHeight: '300px' }}>
                    <List>
                      {filteredSupporters.map((supporter) => (
                        <ListItem
                          key={supporter.id || supporter.supporter_id}
                          button
                          onClick={() => handleStartNewChat(supporter)}
                          sx={{
                            mb: 1,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                              borderColor: 'primary.main',
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Box sx={{ position: 'relative' }}>
                              <Avatar sx={{ bgcolor: supporter.avatarColor || '#4F46E5' }}>
                                {supporter.name.split(' ').map(n => n[0]).join('')}
                              </Avatar>
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: 0,
                                  right: 0,
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  bgcolor: supporter.status === 'online' ? '#10B981' :
                                    supporter.status === 'away' ? '#F59E0B' : '#6B7280',
                                  border: '2px solid white',
                                }}
                              />
                            </Box>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {supporter.name}
                                </Typography>
                                {supporter.is_verified && (
                                  <CheckCircle sx={{ fontSize: 16, color: 'primary.main' }} />
                                )}
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" color="text.secondary">
                                  {supporter.role || supporter.specialization}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                  <CustomRating value={supporter.rating} />
                                  <Typography variant="body2" color="text.secondary">
                                    {(Number(supporter.rating) || 4.5).toFixed(1)}
                                  </Typography>
                                </Box>
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Side - Chat Interface */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: selectedChat.supporter?.avatarColor || '#4F46E5' }}>
                          {selectedChat.supporter?.name?.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {selectedChat.supporter?.name || 'Support Agent'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: selectedChat.supporter?.status === 'online' ? '#10B981' : '#6B7280',
                              }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {selectedChat.supporter?.status === 'online' ? 'Online' : 'Offline'}
                            </Typography>
                            {!isSocketConnected && (
                              <Chip 
                                label="Connecting..." 
                                size="small" 
                                color="warning" 
                                sx={{ ml: 1, height: 20 }} 
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton onClick={() => {
                          if (isSocketConnected) {
                            socket.emit('start-session', {
                              sessionId: selectedChat.session_id,
                              supporterId: selectedChat.supporter.user_id || selectedChat.supporter.id,
                              userId: user.id,
                              sessionType: 'video'
                            });
                          } else {
                            toast.info('Please wait for connection');
                          }
                        }}>
                          <Videocam />
                        </IconButton>
                        <IconButton onClick={() => {
                          if (isSocketConnected) {
                            socket.emit('start-session', {
                              sessionId: selectedChat.session_id,
                              supporterId: selectedChat.supporter.user_id || selectedChat.supporter.id,
                              userId: user.id,
                              sessionType: 'audio'
                            });
                          } else {
                            toast.info('Please wait for connection');
                          }
                        }}>
                          <Phone />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>

                  {/* Messages Area */}
                  <Box sx={{ flex: 1, overflow: 'auto', p: 3, bgcolor: 'grey.50' }}>
                    {selectedChat.messages.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                          Start a conversation with {selectedChat.supporter?.name || 'Support Agent'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Share what's on your mind. All conversations are private and confidential.
                        </Typography>
                      </Box>
                    ) : (
                      selectedChat.messages.map((msg) => {
                        const isCurrentUser = isMessageFromCurrentUser(msg);

                        return (
                          <motion.div
                            key={msg.id || msg.message_id || `msg-${Date.now()}-${msg.content?.slice(0, 10)}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                                mb: 2,
                              }}
                            >
                              <Paper
                                sx={{
                                  p: 2,
                                  maxWidth: '70%',
                                  bgcolor: isCurrentUser ? 'primary.main' : 'white',
                                  color: isCurrentUser ? 'white' : 'text.primary',
                                  borderRadius: 2,
                                  borderTopLeftRadius: isCurrentUser ? 12 : 2,
                                  borderTopRightRadius: isCurrentUser ? 2 : 12,
                                }}
                              >
                                {!isCurrentUser && msg.sender_name && msg.sender_name !== 'You' && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      display: 'block',
                                      mb: 0.5,
                                      color: isCurrentUser ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                                      fontWeight: 600
                                    }}
                                  >
                                    {msg.sender_name}
                                  </Typography>
                                )}

                                <Typography variant="body1">{msg.content}</Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: 'block',
                                    mt: 0.5,
                                    color: isCurrentUser ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                                  }}
                                >
                                  {msg.created_at ? 
                                    new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                                    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  }
                                </Typography>
                              </Paper>
                            </Box>
                          </motion.div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </Box>

                  {/* Message Input */}
                  <Box sx={{
                    p: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                    position: 'sticky',
                    bottom: 0,
                    bgcolor: 'background.paper',
                    width: '100%'
                  }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs>
                        <TextField
                          fullWidth
                          placeholder="Type your message..."
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value);
                            handleTyping();
                          }}
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                          multiline
                          maxRows={4}
                          disabled={!isSocketConnected}
                          sx={{ bgcolor: 'background.paper' }}
                        />
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          endIcon={<Send />}
                          onClick={handleSendMessage}
                          disabled={!message.trim() || !isSocketConnected}
                          sx={{ height: '56px' }}
                        >
                          Send
                        </Button>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Chip
                        size="small"
                        label="I'm feeling anxious"
                        onClick={() => setMessage("I'm feeling anxious about...")}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label="Need urgent help"
                        onClick={() => setMessage("I need urgent help with...")}
                        variant="outlined"
                        color="error"
                      />
                    </Box>
                  </Box>
                </>
              ) : (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                  <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                      Welcome to Chat Support
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 4 }}>
                      Select a supporter from the list to start a confidential chat session.
                      All conversations are encrypted and private.
                    </Typography>
                    {!isSocketConnected && (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Connecting to server...
                        </Typography>
                      </Box>
                    )}
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (supporters.length > 0) {
                          handleStartNewChat(supporters[0]);
                        }
                      }}
                      disabled={!isSocketConnected}
                    >
                      Start New Chat
                    </Button>
                  </Box>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default ChatSupport;
import React, { useState, useRef, useEffect } from 'react';
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
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Send,
  AttachFile,
  EmojiEmotions,
  Search,
  Schedule,
  Star,
  Person,
  CheckCircle,
  Videocam,
  Phone,
  MoreVert,
  ThumbUp,
  ThumbDown,
  Block,
  Report,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ChatSupport = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [supporters, setSupporters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  // Mock data
  useEffect(() => {
    // Mock supporters
    const mockSupporters = [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        role: 'Clinical Psychologist',
        status: 'online',
        lastSeen: 'Just now',
        avatarColor: '#4F46E5',
        rating: 4.9,
        isVerified: true,
      },
      {
        id: 2,
        name: 'Michael Chen',
        role: 'Counselor',
        status: 'online',
        lastSeen: '5 min ago',
        avatarColor: '#10B981',
        rating: 4.8,
        isVerified: true,
      },
      {
        id: 3,
        name: 'Priya Sharma',
        role: 'Mindfulness Coach',
        status: 'away',
        lastSeen: '30 min ago',
        avatarColor: '#F59E0B',
        rating: 4.7,
        isVerified: true,
      },
      {
        id: 4,
        name: 'David Wilson',
        role: 'Trauma Specialist',
        status: 'offline',
        lastSeen: '2 hours ago',
        avatarColor: '#EF4444',
        rating: 4.9,
        isVerified: true,
      },
    ];

    // Mock chats
    const mockChats = [
      {
        id: 1,
        supporterId: 1,
        messages: [
          { id: 1, text: 'Hello! How can I help you today?', sender: 'supporter', time: '10:00 AM' },
          { id: 2, text: 'Hi, I\'ve been feeling anxious lately.', sender: 'user', time: '10:02 AM' },
          { id: 3, text: 'I understand. Can you tell me more about what triggers your anxiety?', sender: 'supporter', time: '10:05 AM' },
        ],
        unread: 2,
        lastMessage: 'I understand. Can you tell me more about what triggers your anxiety?',
        lastMessageTime: '10:05 AM',
      },
      {
        id: 2,
        supporterId: 2,
        messages: [
          { id: 1, text: 'How have you been feeling since our last session?', sender: 'supporter', time: 'Yesterday' },
          { id: 2, text: 'Much better, thank you! The breathing exercises helped.', sender: 'user', time: 'Yesterday' },
        ],
        unread: 0,
        lastMessage: 'Much better, thank you! The breathing exercises helped.',
        lastMessageTime: 'Yesterday',
      },
    ];

    setSupporters(mockSupporters);
    setChats(mockChats);
    if (mockChats.length > 0) {
      setSelectedChat({ ...mockChats[0], supporter: mockSupporters[0] });
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: selectedChat.messages.length + 1,
      text: message,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: message,
          lastMessageTime: newMessage.time,
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
    });
    setMessage('');

    // Simulate auto-reply after 2 seconds
    setTimeout(() => {
      const autoReply = {
        id: selectedChat.messages.length + 2,
        text: 'Thank you for sharing that. I\'m here to listen and help.',
        sender: 'supporter',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updatedChatsWithReply = updatedChats.map(chat => {
        if (chat.id === selectedChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage, autoReply],
            lastMessage: autoReply.text,
            lastMessageTime: autoReply.time,
          };
        }
        return chat;
      });

      setChats(updatedChatsWithReply);
      setSelectedChat(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage, autoReply],
      }));
    }, 2000);
  };

  const handleStartNewChat = (supporter) => {
    const newChat = {
      id: chats.length + 1,
      supporterId: supporter.id,
      supporter: supporter,
      messages: [],
      unread: 0,
      lastMessage: 'New conversation started',
      lastMessageTime: 'Just now',
    };

    setChats([newChat, ...chats]);
    setSelectedChat(newChat);
    toast.success(`Started chat with ${supporter.name}`);
  };

  const filteredSupporters = supporters.filter(supporter =>
    supporter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supporter.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4, height: 'calc(100vh - 128px)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ height: '100%' }}
      >
        <Grid container spacing={3} sx={{ height: '100%' }}>
          {/* Left Sidebar - Supporters List */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Available Supporters
                </Typography>

                {/* Search */}
                <TextField
                  fullWidth
                  placeholder="Search supporters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                {/* Supporters List */}
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                  <List>
                    {filteredSupporters.map((supporter) => (
                      <ListItem
                        key={supporter.id}
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
                            <Avatar sx={{ bgcolor: supporter.avatarColor }}>
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
                              {supporter.isVerified && (
                                <CheckCircle sx={{ fontSize: 16, color: 'primary.main' }} />
                              )}
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                {supporter.role}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Star sx={{ fontSize: 14, color: '#FFD700' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {supporter.rating}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  • {supporter.lastSeen}
                                </Typography>
                              </Box>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                {/* Quick Actions */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Quick Connect
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Videocam />}
                        onClick={() => toast.info('Redirecting to video support...')}
                      >
                        Video
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Phone />}
                        onClick={() => toast.info('Redirecting to audio support...')}
                      >
                        Audio
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
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
                        <Avatar sx={{ bgcolor: selectedChat.supporter?.avatarColor }}>
                          {selectedChat.supporter?.name?.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {selectedChat.supporter?.name}
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
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton>
                          <Videocam />
                        </IconButton>
                        <IconButton>
                          <Phone />
                        </IconButton>
                        <IconButton>
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>

                  {/* Messages Area */}
                  <Box sx={{ flex: 1, overflow: 'auto', p: 3, bgcolor: 'grey.50' }}>
                    {selectedChat.messages.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                          Start a conversation with {selectedChat.supporter?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Share what's on your mind. All conversations are private and confidential.
                        </Typography>
                      </Box>
                    ) : (
                      selectedChat.messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                              mb: 2,
                            }}
                          >
                            <Paper
                              sx={{
                                p: 2,
                                maxWidth: '70%',
                                bgcolor: msg.sender === 'user' ? 'primary.main' : 'white',
                                color: msg.sender === 'user' ? 'white' : 'text.primary',
                                borderRadius: 2,
                                borderTopLeftRadius: msg.sender === 'user' ? 12 : 2,
                                borderTopRightRadius: msg.sender === 'user' ? 2 : 12,
                              }}
                            >
                              <Typography variant="body1">{msg.text}</Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  display: 'block',
                                  mt: 0.5,
                                  color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                                }}
                              >
                                {msg.time}
                              </Typography>
                            </Paper>
                          </Box>
                        </motion.div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </Box>

                  {/* Message Input */}
                  <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <IconButton>
                          <AttachFile />
                        </IconButton>
                      </Grid>
                      <Grid item xs>
                        <TextField
                          fullWidth
                          placeholder="Type your message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          multiline
                          maxRows={4}
                          InputProps={{
                            endAdornment: (
                              <IconButton>
                                <EmojiEmotions />
                              </IconButton>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          endIcon={<Send />}
                          onClick={handleSendMessage}
                          disabled={!message.trim()}
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
                      <Chip
                        size="small"
                        label="Just need to talk"
                        onClick={() => setMessage("I just need someone to talk to about...")}
                        variant="outlined"
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
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (supporters.length > 0) {
                          handleStartNewChat(supporters[0]);
                        }
                      }}
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
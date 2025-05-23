const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

// Demo contacts for UI
const DEMO_CONTACTS = [
  {
    id: 'contact1',
    name: 'Alice Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: 'Hey there! How are you doing?',
    lastMessageTime: '10:30 AM',
    unreadCount: 2,
    online: true
  },
  {
    id: 'contact2',
    name: 'Bob Smith',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: 'Can you send me the report?',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    online: false
  },
  {
    id: 'contact3',
    name: 'Carol Williams',
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    lastMessage: 'The meeting is scheduled for tomorrow',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    online: true
  },
  {
    id: 'contact4',
    name: 'David Brown',
    avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
    lastMessage: 'Thanks for the update!',
    lastMessageTime: 'Monday',
    unreadCount: 0,
    online: false
  },
  {
    id: 'contact5',
    name: 'Emma Davis',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    lastMessage: 'Let\'s meet up for coffee sometime',
    lastMessageTime: '08/10/2023',
    unreadCount: 0,
    online: true
  }
];

// Demo chat messages for UI
const DEMO_CHAT_MESSAGES = {
  'contact1': [
    {
      id: 'msg1',
      senderId: 'contact1',
      text: 'Hey there! How are you doing?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'read'
    },
    {
      id: 'msg2',
      senderId: 'currentUser',
      text: 'I\'m good, thanks! How about you?',
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      status: 'read'
    },
    {
      id: 'msg3',
      senderId: 'contact1',
      text: 'Doing great! Just finished a big project.',
      timestamp: new Date(Date.now() - 3400000).toISOString(),
      status: 'read'
    },
    {
      id: 'msg4',
      senderId: 'contact1',
      text: 'What are you up to this weekend?',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      status: 'delivered'
    }
  ],
  'contact2': [
    {
      id: 'msg5',
      senderId: 'currentUser',
      text: 'Hi Bob, did you get a chance to review the proposal?',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'read'
    },
    {
      id: 'msg6',
      senderId: 'contact2',
      text: 'Yes, it looks good. Can you send me the report?',
      timestamp: new Date(Date.now() - 82800000).toISOString(),
      status: 'read'
    }
  ]
};

/**
 * Get user contacts/chats
 * @param {string} token - JWT token
 * @returns {Promise} - Promise with contacts list
 */
export const getContacts = async (token) => {
  try {
    // In a real app, this would be an actual API call
    // const response = await fetch(`${API_URL}/chats`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    // return await response.json();
    
    // For demo purposes, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DEMO_CONTACTS);
      }, 600);
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    throw new Error('Failed to fetch contacts. Please try again.');
  }
};

/**
 * Get chat messages with a specific contact
 * @param {string} contactId - Contact ID
 * @param {string} token - JWT token
 * @returns {Promise} - Promise with chat messages
 */
export const getChatMessages = async (contactId, token) => {
  try {
    // In a real app, this would be an actual API call
    // const response = await fetch(`${API_URL}/chats/${contactId}/messages`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    // return await response.json();
    
    // For demo purposes, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DEMO_CHAT_MESSAGES[contactId] || []);
      }, 500);
    });
  } catch (error) {
    console.error('Get messages error:', error);
    throw new Error('Failed to fetch messages. Please try again.');
  }
};

/**
 * Send a message to a contact
 * @param {string} contactId - Contact ID
 * @param {string} message - Message text
 * @param {string} token - JWT token
 * @returns {Promise} - Promise with sent message data
 */
export const sendMessage = async (contactId, message, token) => {
  try {
    // In a real app, this would be an actual API call
    // const response = await fetch(`${API_URL}/chats/${contactId}/messages`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ text: message })
    // });
    // return await response.json();
    
    // For demo purposes, simulate API response
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMessage = {
          id: 'msg_' + Math.random().toString(36).substr(2, 9),
          senderId: 'currentUser',
          text: message,
          timestamp: new Date().toISOString(),
          status: 'sent'
        };
        
        // In a real app, this would be handled by the server
        // For demo, we're just returning the new message
        resolve(newMessage);
      }, 300);
    });
  } catch (error) {
    console.error('Send message error:', error);
    throw new Error('Failed to send message. Please try again.');
  }
};
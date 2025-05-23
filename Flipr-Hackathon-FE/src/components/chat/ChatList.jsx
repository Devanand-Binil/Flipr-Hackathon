import { useState, useEffect } from 'react';
import { getContacts } from '../../api/chat';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const data = await getContacts(token);
        setContacts(data);
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setError('Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [token]);

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format timestamp for last message
  const formatTime = (timestamp) => {
    return timestamp;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-3 bg-white">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-neutral-600">
            {error}
            <button 
              className="block mx-auto mt-2 text-primary-500 hover:text-primary-600"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-4 text-center text-neutral-600">
            {searchQuery ? 'No contacts match your search' : 'No contacts found'}
          </div>
        ) : (
          <div>
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-3 flex items-center hover:bg-neutral-100 cursor-pointer transition-colors duration-150 ${
                  selectedChatId === contact.id ? 'bg-neutral-100' : ''
                }`}
                onClick={() => onSelectChat(contact)}
              >
                <Avatar 
                  src={contact.avatar} 
                  alt={contact.name} 
                  size="md" 
                  status={contact.online ? 'online' : 'offline'} 
                />
                
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-neutral-900 truncate">{contact.name}</h3>
                    <span className="text-xs text-neutral-500">{formatTime(contact.lastMessageTime)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-neutral-600 truncate">{contact.lastMessage}</p>
                    
                    {contact.unreadCount > 0 && (
                      <span className="bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
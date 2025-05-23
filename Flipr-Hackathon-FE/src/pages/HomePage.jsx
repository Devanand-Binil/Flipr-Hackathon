import { useState } from 'react';
import { Link } from 'react-router-dom';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import Avatar from '../components/common/Avatar';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showMobileChatList, setShowMobileChatList] = useState(true);
  const { user } = useAuth();

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setShowMobileChatList(false);
  };

  const toggleMobileView = () => {
    setShowMobileChatList(!showMobileChatList);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary-500 text-white p-3">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">WhatsApp Clone</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mobile back button in chat view */}
            {!showMobileChatList && selectedChat && (
              <button 
                className="md:hidden flex items-center text-white" 
                onClick={toggleMobileView}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
            
            <Link to="/profile" className="flex items-center">
              <Avatar 
                src={user?.avatar} 
                alt={user?.name} 
                size="sm" 
                className="cursor-pointer"
              />
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat List (Sidebar) */}
        <div 
          className={`
            ${showMobileChatList ? 'flex' : 'hidden'} 
            md:flex w-full md:w-1/3 lg:w-1/4 border-r border-neutral-200 bg-white
          `}
        >
          <div className="w-full">
            <ChatList 
              onSelectChat={handleSelectChat} 
              selectedChatId={selectedChat?.id}
            />
          </div>
        </div>
        
        {/* Chat Window */}
        <div 
          className={`
            ${!showMobileChatList ? 'flex' : 'hidden'}
            md:flex flex-col flex-1
          `}
        >
          <ChatWindow selectedChat={selectedChat} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
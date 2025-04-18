import React, { useState } from 'react';
import ChatHeader from './components/ChatHeader';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import useChat from './hooks/useChat';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const {
    chats,
    currentChatId,
    setCurrentChatId,
    getCurrentChat,
    createNewChat,
    sendMessage,
    deleteChat,
    clearAllChats,
    updateModelType,
    loading,
    error,
  } = useChat();
  
  const currentChat = getCurrentChat();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex flex-col h-screen bg-white text-gray-800">
      <ChatHeader 
        currentChat={currentChat}
        onNewChat={createNewChat}
        onClearChats={clearAllChats}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {isSidebarOpen && (
          <Sidebar
            chats={chats}
            currentChatId={currentChatId}
            onSelectChat={setCurrentChatId}
            onDeleteChat={deleteChat}
            onCreateNewChat={createNewChat}
          />
        )}
        
        <button
          onClick={toggleSidebar}
          className="absolute top-16 left-2 z-10 p-2 bg-white rounded border border-gray-200 shadow-sm text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          {isSidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <ChatView
          currentChat={currentChat}
          sendMessage={sendMessage}
          loading={loading}
          error={error}
          updateModelType={(modelType) => updateModelType(modelType)}
        />
      </div>
      
      <footer className="bg-white border-t border-gray-200 p-2 text-center text-xs text-gray-500">
        <a 
          href="https://www.zapt.ai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-indigo-600"
        >
          Made on ZAPT
        </a>
      </footer>
    </div>
  );
}
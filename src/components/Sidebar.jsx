import React from 'react';

export default function Sidebar({ chats, currentChatId, onSelectChat, onDeleteChat, onCreateNewChat }) {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <button 
          onClick={onCreateNewChat}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors mb-4 cursor-pointer flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Chat
        </button>
        
        <div className="space-y-2">
          {chats.map((chat) => (
            <div 
              key={chat.id} 
              className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${
                chat.id === currentChatId ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-200'
              }`}
            >
              <div 
                className="truncate flex-1"
                onClick={() => onSelectChat(chat.id)}
              >
                {chat.title || 'New Chat'}
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="text-gray-500 hover:text-red-500 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 right-4">
        <a 
          href="https://www.zapt.ai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-indigo-600 flex items-center justify-center"
        >
          Made on ZAPT
        </a>
      </div>
    </aside>
  );
}
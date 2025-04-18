import React from 'react';

export default function ChatHeader({ currentChat, onNewChat, onClearChats }) {
  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img 
          src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=48&height=48" 
          alt="ALESCAI logo" 
          className="h-8 w-8 mr-2"
        />
        <h1 className="text-xl font-bold text-gray-800">ALESCAI</h1>
      </div>
      
      <div className="flex space-x-2">
        <button 
          onClick={onNewChat}
          className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          New Chat
        </button>
        <button 
          onClick={onClearChats}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>
    </header>
  );
}
import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ModelSelector from './ModelSelector';

export default function ChatView({ 
  currentChat, 
  sendMessage, 
  loading, 
  error,
  updateModelType
}) {
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);
  
  // If there's no current chat, show an empty state
  if (!currentChat) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to ALESCAI</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Start a new conversation to chat with our AI assistant. You can ask questions, get creative ideas, or learn something new.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-left max-w-md mx-auto">
              <p className="text-gray-700 font-medium mb-2">Examples to try:</p>
              <ul className="space-y-2 text-gray-600">
                <li>"Can you explain quantum computing in simple terms?"</li>
                <li>"Write a short poem about technology and nature."</li>
                <li>"What are some creative ways to recycle household items?"</li>
              </ul>
            </div>
          </div>
        </div>
        <ChatInput onSendMessage={sendMessage} loading={loading} />
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <ModelSelector 
            currentModel={currentChat.modelType} 
            onChangeModel={updateModelType} 
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {currentChat.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Start a Conversation</h2>
              <p className="text-gray-500 max-w-md">
                Type a message below to begin chatting with ALESCAI.
              </p>
            </div>
          </div>
        ) : (
          <div>
            {currentChat.messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
          {error}
        </div>
      )}
      
      <ChatInput onSendMessage={sendMessage} loading={loading} />
    </div>
  );
}
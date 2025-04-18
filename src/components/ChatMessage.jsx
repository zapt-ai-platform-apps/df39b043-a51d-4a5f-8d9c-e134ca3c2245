import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  
  // Format the timestamp
  const formattedTime = message.timestamp 
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  
  return (
    <div className={`py-4 ${isUser ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${isUser ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {isUser ? 'U' : 'AI'}
          </div>
          
          <div className="flex-1">
            <div className="text-sm text-gray-500 mb-1">
              {isUser ? 'You' : 'ALESCAI'} • {formattedTime}
            </div>
            
            <div className="prose max-w-none">
              <ReactMarkdown>
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
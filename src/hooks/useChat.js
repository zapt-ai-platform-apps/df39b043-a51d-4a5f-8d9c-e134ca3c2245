import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { generateResponse } from '../services/aiService';
import * as Sentry from '@sentry/browser';

export default function useChat() {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Load chats from localStorage when component mounts
  useEffect(() => {
    try {
      const savedChats = localStorage.getItem('alescai-chats');
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats);
        setChats(parsedChats);
        
        // If there are chats, set the most recent one as current
        if (parsedChats.length > 0) {
          setCurrentChatId(parsedChats[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading chats from localStorage:', err);
      Sentry.captureException(err);
    }
  }, []);
  
  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      try {
        localStorage.setItem('alescai-chats', JSON.stringify(chats));
      } catch (err) {
        console.error('Error saving chats to localStorage:', err);
        Sentry.captureException(err);
      }
    }
  }, [chats]);
  
  // Create a new chat
  const createNewChat = (title = 'New Chat') => {
    const newChat = {
      id: uuidv4(),
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      modelType: 'assistant',
    };
    
    setChats(prevChats => [newChat, ...prevChats]);
    setCurrentChatId(newChat.id);
    return newChat.id;
  };
  
  // Get the current chat
  const getCurrentChat = () => {
    return chats.find(chat => chat.id === currentChatId) || null;
  };
  
  // Update the current chat's model type
  const updateModelType = (modelType) => {
    if (!currentChatId) return;
    
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, modelType } 
          : chat
      )
    );
  };
  
  // Send a message in the current chat
  const sendMessage = async (content) => {
    if (!currentChatId && !createNewChat()) return;
    
    const currentChat = getCurrentChat();
    if (!currentChat) return;
    
    const userMessage = { role: 'user', content, timestamp: new Date().toISOString() };
    
    // Optimistically update the UI with the user's message
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === currentChatId 
          ? { 
              ...chat, 
              messages: [...chat.messages, userMessage],
              // Update title if this is the first message
              title: chat.messages.length === 0 
                ? content.substring(0, 30) + (content.length > 30 ? '...' : '') 
                : chat.title
            } 
          : chat
      )
    );
    
    setLoading(true);
    setError(null);
    
    try {
      // Prepare the chat history for the API
      const messagesForApi = currentChat.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the new user message
      messagesForApi.push({ role: 'user', content });
      
      console.log('Sending message to AI service:', { 
        modelType: currentChat.modelType,
        messageCount: messagesForApi.length
      });
      
      // Get response from AI
      const response = await generateResponse(messagesForApi, currentChat.modelType);
      
      console.log('Received response from AI service:', {
        responseLength: response.message.length
      });
      
      // Add the AI's response to the chat
      const assistantMessage = { 
        role: 'assistant', 
        content: response.message, 
        timestamp: new Date().toISOString() 
      };
      
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: [...chat.messages, assistantMessage] } 
            : chat
        )
      );
      
    } catch (err) {
      console.error('Error sending message:', err);
      Sentry.captureException(err);
      setError('Failed to get response from AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a chat
  const deleteChat = (chatId) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    
    // If the deleted chat is the current one, select another chat or create a new one
    if (chatId === currentChatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        setCurrentChatId(remainingChats[0].id);
      } else {
        setCurrentChatId(null);
      }
    }
  };
  
  // Clear all chats
  const clearAllChats = () => {
    setChats([]);
    setCurrentChatId(null);
    localStorage.removeItem('alescai-chats');
  };
  
  return {
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
  };
}
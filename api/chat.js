import OpenAI from 'openai';
import Sentry from './_sentry.js';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is required but was not found in environment variables');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Define different model behaviors
const modelConfigs = {
  assistant: {
    systemPrompt: "You are ALESCAI, a helpful and friendly AI assistant. Provide clear, concise, and accurate responses to the user's questions.",
    model: "gpt-3.5-turbo",
  },
  teacher: {
    systemPrompt: "You are ALESCAI, an educational AI tutor. Explain concepts in a way that's easy to understand, provide examples, and help the user learn new topics.",
    model: "gpt-3.5-turbo",
  },
  creative: {
    systemPrompt: "You are ALESCAI, a creative AI companion. Help with creative writing, generate ideas, and think outside the box when responding to the user.",
    model: "gpt-3.5-turbo",
  },
};

export default async function handler(req, res) {
  console.log('Received chat request', { bodyLength: JSON.stringify(req.body).length });
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Please use POST.' });
  }

  try {
    const { messages, modelType = 'assistant' } = req.body;
    
    if (!Array.isArray(messages) || !messages.length) {
      return res.status(400).json({ error: 'Invalid or missing messages array' });
    }

    // Get the configuration for the selected model type
    const config = modelConfigs[modelType] || modelConfigs.assistant;
    
    // Prepare the messages for OpenAI, adding the system prompt
    const apiMessages = [
      { role: 'system', content: config.systemPrompt },
      ...messages
    ];

    console.log('Sending to OpenAI', { 
      modelType, 
      messageCount: apiMessages.length,
      firstUserMessage: messages[0]?.content?.substring(0, 100) + '...'
    });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: config.model,
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 800,
    });

    console.log('Received OpenAI response', { 
      responseLength: response.choices[0].message.content.length,
      tokens: response.usage.total_tokens
    });

    return res.status(200).json({
      message: response.choices[0].message.content,
      usage: response.usage,
    });
  } catch (error) {
    console.error('Error processing chat request:', error);
    Sentry.captureException(error);
    
    return res.status(500).json({ 
      error: 'Failed to generate AI response',
      message: error.message 
    });
  }
}
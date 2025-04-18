import * as Sentry from '@sentry/browser';

const API_URL = '/api/chat';

export async function generateResponse(messages, modelType = 'assistant') {
  try {
    console.log('Sending request to API:', API_URL);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        modelType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get AI response');
    }

    return await response.json();
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        messages: messages.length,
        modelType,
      }
    });
    console.error('Error generating AI response:', error);
    throw error;
  }
}
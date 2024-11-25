import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from the backend
});
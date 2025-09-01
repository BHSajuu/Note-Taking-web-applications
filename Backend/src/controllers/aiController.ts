import { Request, Response } from 'express';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import User from '../models/userModel.js';

const genAI = new GoogleGenerativeAI(process.env['GEMINI_API_KEY'] as string);

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  // ... (add other safety settings as needed)
];

export const generateContent = async (req: Request, res: Response) => {
  const { prompt, history } = req.body;
  const userId = req.user?._id;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = new Date().setHours(0, 0, 0, 0);
    const lastRequestDate = user.lastAiRequestDate ? new Date(user.lastAiRequestDate).setHours(0, 0, 0, 0) : null;

    if (lastRequestDate === today && user.aiRequestCount >= 5) {
      return res.status(429).json({ message: 'You have reached your daily limit of 5 requests.' });
    }

    if (lastRequestDate !== today) {
      user.aiRequestCount = 0;
    }

    user.aiRequestCount = user.aiRequestCount + 1;
    user.lastAiRequestDate = new Date();
    await user.save();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const finalPrompt = `
      You are an expert note-taking assistant integrated into a note app. 
      Your primary goal is to provide well-structured, clear, and comprehensive notes based on the user's prompt.

      **Formatting Rules (MANDATORY):**
      - ALWAYS use Markdown for formatting.
      - Use headings (#, ##, ###) for main topics and sub-topics.
      - Use bullet points (-) or numbered lists (1.) for details and lists.
      - Use bold text (**) for important keywords or phrases.
      - Keep paragraphs concise and easy to read.

      If the user provides follow-up instructions, use the provided chat history to understand the context and refine or build upon your previous response.

      User Prompt: "${prompt}"
    `;

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(finalPrompt);
    const response =  result.response;
    const text = response.text();

    return res.json({ text, requestCount: user.aiRequestCount });

  } catch (error) {
    console.error('Error generating content:', error);
   return res.status(500).json({ message: 'Failed to generate content' });
  }
};
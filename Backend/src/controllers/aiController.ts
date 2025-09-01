import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env['GEMINI_API_KEY'] as string);

export const generateContent = async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return res.json({ text });
  } catch (error) {
    console.error('Error generating content:', error);
    return res.status(500).json({ message: 'Failed to generate content' });
  }
};
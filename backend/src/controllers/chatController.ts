import { Request, Response } from 'express';
import pool from '../db';
import { answerQuestion } from '../services/openaiService';

export const askChat = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    const userId = req.user?.id;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Fetch recent tasks for context
    const [tasks] = await pool.query(`
      SELECT t.description, t.assignee, t.status, m.title as meetingTitle 
      FROM tasks t 
      JOIN meetings m ON t.meetingId = m.id 
      WHERE t.userId = ? 
      LIMIT 50
    `, [userId]);
    
    const context = JSON.stringify(tasks);
    const answer = await answerQuestion(question, context);

    res.status(200).json({ answer });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Failed to process question' });
  }
};

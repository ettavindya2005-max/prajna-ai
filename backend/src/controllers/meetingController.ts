import { Request, Response } from 'express';
import pool from '../db';
import { generateSummaryAndTasks } from '../services/openaiService';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from 'mysql2';

export const processMeeting = async (req: Request, res: Response) => {
  try {
    const { title, transcript } = req.body;
    const userId = req.user?.id;

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    // Call OpenAI
    const aiResult = await generateSummaryAndTasks(transcript);
    
    const meetingId = uuidv4();
    
    // Save to database
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        'INSERT INTO meetings (id, userId, title, transcript, summary) VALUES (?, ?, ?, ?, ?)',
        [meetingId, userId, title || 'Untitled Meeting', transcript, aiResult.summary]
      );

      for (const task of aiResult.tasks) {
        const taskId = uuidv4();
        await connection.query(
          'INSERT INTO tasks (id, meetingId, userId, description, assignee, deadline) VALUES (?, ?, ?, ?, ?, ?)',
          [taskId, meetingId, userId, task.description, task.assignee, task.deadline ? String(task.deadline) : null]
        );
      }

      await connection.commit();

      const [meetings] = await connection.query<RowDataPacket[]>('SELECT * FROM meetings WHERE id = ?', [meetingId]);
      const [tasks] = await connection.query('SELECT * FROM tasks WHERE meetingId = ?', [meetingId]);

      res.status(201).json({ ...meetings[0], tasks });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('Error processing meeting:', error);
    res.status(500).json({ error: 'Error: ' + (error.message || String(error)) });
  }
};

export const getMeetings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const [meetings] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM meetings WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );

    // Fetch tasks for these meetings
    for (let i = 0; i < meetings.length; i++) {
      const [tasks] = await pool.query('SELECT * FROM tasks WHERE meetingId = ?', [meetings[i].id]);
      meetings[i].tasks = tasks;
    }

    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
};

export const getMeetingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const [meetings] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM meetings WHERE id = ? AND userId = ?',
      [id, userId]
    );
    
    if (meetings.length === 0) return res.status(404).json({ error: 'Meeting not found' });
    
    const [tasks] = await pool.query('SELECT * FROM tasks WHERE meetingId = ?', [id]);
    const meeting = { ...meetings[0], tasks };

    res.status(200).json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meeting' });
  }
};

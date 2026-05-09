import { Request, Response } from 'express';
import pool from '../db';
import { RowDataPacket } from 'mysql2';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const [tasks] = await pool.query<RowDataPacket[]>(`
      SELECT t.*, m.title as meetingTitle 
      FROM tasks t 
      JOIN meetings m ON t.meetingId = m.id 
      WHERE t.userId = ? 
      ORDER BY t.createdAt DESC
    `, [userId]);

    // Format like Prisma did
    const formattedTasks = tasks.map((t: any) => ({
      ...t,
      meeting: { title: t.meetingTitle }
    }));

    res.status(200).json(formattedTasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    const [result] = await pool.query<any>(
      'UPDATE tasks SET status = ? WHERE id = ? AND userId = ?',
      [status, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.status(200).json({ id, status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

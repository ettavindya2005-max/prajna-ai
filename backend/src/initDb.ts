import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const initDb = async () => {
  try {
    // Connect without database to ensure it exists
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    const dbName = process.env.DB_NAME || 'prajna_ai';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.query(`USE \`${dbName}\`;`);

    // Create Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Meetings Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS meetings (
          id VARCHAR(36) PRIMARY KEY,
          userId INT NOT NULL,
          title VARCHAR(255) NOT NULL,
          transcript TEXT NOT NULL,
          summary TEXT NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create Tasks Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tasks (
          id VARCHAR(36) PRIMARY KEY,
          meetingId VARCHAR(36) NOT NULL,
          userId INT NOT NULL,
          description TEXT NOT NULL,
          assignee VARCHAR(255),
          deadline VARCHAR(255),
          status VARCHAR(50) DEFAULT 'pending',
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (meetingId) REFERENCES meetings(id) ON DELETE CASCADE,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log('Database and tables initialized successfully.');
    await connection.end();
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

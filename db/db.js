import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Create a connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,             // MySQL host
  user: process.env.DB_USER,             // MySQL user
  password: process.env.DB_PASSWORD,     // MySQL password
  database: process.env.DB_NAME,         // MySQL database name
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306, // Ensure port is a number, default to 3306
  waitForConnections: true,              // Wait for connections if pool is full
  connectionLimit: 10,                   // Max number of connections in the pool
  queueLimit: 0                          // Unlimited queue limit
});

// Test the database connection
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('Database connected successfully.');
    connection.release();  // Release the connection back to the pool
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
})();

export default db;

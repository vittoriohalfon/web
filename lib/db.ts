import { Pool } from 'pg';

// Create a connection pool
const db = new Pool({
  host: process.env.TENDERS_DB_HOST,
  port: parseInt(process.env.TENDERS_DB_PORT || '5432'),
  database: process.env.TENDERS_DB_NAME,
  user: process.env.TENDERS_DB_USER,
  password: process.env.TENDERS_DB_PASS,
  ssl: {
    rejectUnauthorized: false // Required for AWS RDS SSL connections
  }
});

// Add error handler for the pool
db.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export { db }; 
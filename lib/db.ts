import { Pool } from 'pg';

// Create a connection pool
const db = new Pool({
  host: process.env.AWS_DB_HOST,
  port: parseInt(process.env.AWS_DB_PORT || '5432'),
  database: process.env.AWS_DB_NAME,
  user: process.env.AWS_DB_USER,
  password: process.env.AWS_DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false // Required for AWS RDS SSL connections
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
});

// Add error handler for the pool
db.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export { db }; 
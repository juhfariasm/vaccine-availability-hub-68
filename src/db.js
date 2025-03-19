
import pkg from 'pg';
const { Pool } = pkg;

// PostgreSQL configuration using Pool instead of Client
const pool = new Pool({
  user: 'infovacdb_idtw_user',
  host: 'dpg-cv0fht5umphs73eqfk6g-a.oregon-postgres.render.com',
  database: 'infovacdb_idtw',
  password: 'TR33ZGyimpS9UKIF6DtQijfBhD6YfNRN',
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // Allow SSL connections without certificate verification
  },
});

export default pool;

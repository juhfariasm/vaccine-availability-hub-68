
import pg from 'pg';
const { Pool } = pg;

// PostgreSQL configuration
const pool = new Pool({
  user: 'infovacdb_idtw_user',
  host: 'dpg-cv0fht5umphs73eqfk6g-a.oregon-postgres.render.com',
  database: 'infovacdb_idtw',
  password: 'TR33ZGyimpS9UKIF6DtQijfBhD6YfNRN',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testConnection() {
  try {
    // Execute a simple query to test connection
    const res = await pool.query('SELECT NOW()');
    console.log('Database connection established!');
    console.log('Current database time:', res.rows[0].now);
    
    // Check if ubs table exists
    const tablesRes = await pool.query(`
      SELECT * FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'ubs'
    `);
    
    if (tablesRes.rows.length > 0) {
      console.log('UBS table found! Counting records...');
      const countRes = await pool.query('SELECT COUNT(*) FROM ubs');
      console.log(`Total UBS records: ${countRes.rows[0].count}`);
      
      // Example query to show the data
      const ubsRes = await pool.query('SELECT * FROM ubs LIMIT 2');
      console.log('Sample UBS data:');
      console.log(ubsRes.rows);
    } else {
      console.log('UBS table not found. You need to run the setup script first.');
      console.log('Run: node src/scripts/setupDatabase.js');
    }
    
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    await pool.end();
  }
}

// Run the test
testConnection();

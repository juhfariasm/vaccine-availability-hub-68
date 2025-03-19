
import { Client } from 'pg';

// PostgreSQL configuration
const client = new Client({
  user: 'seu_usuario',
  host: 'localhost',
  database: 'seu_banco',
  password: 'sua_senha',
  port: 5432,
});

async function testConnection() {
  try {
    // Connect to the database
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');
    
    // Execute a simple query to test connection
    const res = await client.query('SELECT NOW()');
    console.log('Database connection established!');
    console.log('Current database time:', res.rows[0].now);
    
    // Check if ubs table exists
    const tablesRes = await client.query(`
      SELECT * FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'ubs'
    `);
    
    if (tablesRes.rows.length > 0) {
      console.log('UBS table found! Counting records...');
      const countRes = await client.query('SELECT COUNT(*) FROM ubs');
      console.log(`Total UBS records: ${countRes.rows[0].count}`);
      
      // Example query to show the data
      const ubsRes = await client.query('SELECT * FROM ubs LIMIT 2');
      console.log('Sample UBS data:');
      console.log(ubsRes.rows);
    } else {
      console.log('UBS table not found. You need to run the setup script first.');
      console.log('Run: node src/scripts/setupDatabase.js');
    }
    
  } catch (err) {
    console.error('❌ Erro ao conectar com o banco de dados:', err);
  } finally {
    await client.end();
  }
}

// Run the test
testConnection();

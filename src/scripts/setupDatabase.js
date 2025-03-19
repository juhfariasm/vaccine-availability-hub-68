
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

async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Test connection
    const connTest = await pool.query('SELECT NOW()');
    console.log('Database connection established!');
    console.log('Database current time:', connTest.rows[0].now);
    
    // Check if ubs table exists
    const tablesRes = await pool.query(`
      SELECT * FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'ubs'
    `);
    
    if (tablesRes.rows.length === 0) {
      console.log('Creating UBS table...');
      
      // Create ubs table
      await pool.query(`
        CREATE TABLE ubs (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          address VARCHAR(255) NOT NULL,
          distance NUMERIC(5,2),
          status VARCHAR(50),
          opening_hours VARCHAR(100),
          vaccines JSONB
        );
      `);
      
      console.log('UBS table created successfully!');
    } else {
      console.log('UBS table already exists. Skipping creation.');
    }
    
    // Check if there are already records in the table
    const countRes = await pool.query('SELECT COUNT(*) FROM ubs');
    
    if (parseInt(countRes.rows[0].count) === 0) {
      console.log('Inserting sample data into UBS table...');
      
      // Sample data for insertion - ensuring status is 'open' or 'closed'
      const sampleData = [
        {
          name: 'UBS Vila Nova',
          address: 'Rua das Flores, 123 - Teresina',
          distance: 1.2,
          status: 'open',
          opening_hours: '07:00 - 19:00',
          vaccines: {
            "COVID-19": true,
            "Gripe": true,
            "Febre Amarela": false,
            "Tétano": true,
            "Hepatite B": true,
            "Sarampo": false
          }
        },
        {
          name: 'UBS Central',
          address: 'Av. Principal, 500 - Timon',
          distance: 1.8,
          status: 'open',
          opening_hours: '08:00 - 18:00',
          vaccines: {
            "COVID-19": true,
            "Gripe": false,
            "Febre Amarela": true,
            "Tétano": true,
            "Hepatite B": false,
            "Sarampo": true
          }
        },
        {
          name: 'UBS Jardim América',
          address: 'Rua dos Ipês, 78 - Teresina',
          distance: 2.5,
          status: 'open',
          opening_hours: '07:00 - 17:00',
          vaccines: {
            "COVID-19": false,
            "Gripe": true,
            "Febre Amarela": true,
            "Tétano": false,
            "Hepatite B": true,
            "Sarampo": true
          }
        },
        {
          name: 'UBS Parque das Árvores',
          address: 'Alameda dos Cedros, 45 - Demerval Lobão',
          distance: 3.1,
          status: 'open',
          opening_hours: '08:00 - 20:00',
          vaccines: {
            "COVID-19": true,
            "Gripe": true,
            "Febre Amarela": true,
            "Tétano": true,
            "Hepatite B": true,
            "Sarampo": false
          }
        },
        {
          name: 'UBS São João',
          address: 'Rua dos Pinheiros, 89 - Timon',
          distance: 3.5,
          status: 'open',
          opening_hours: '07:00 - 17:00',
          vaccines: {
            "COVID-19": true,
            "Gripe": false,
            "Febre Amarela": false,
            "Tétano": true,
            "Hepatite B": false,
            "Sarampo": true
          }
        },
        {
          name: 'UBS Boa Vista',
          address: 'Av. das Palmeiras, 321 - Teresina',
          distance: 4.2,
          status: 'closed',
          opening_hours: '08:00 - 18:00',
          vaccines: {
            "COVID-19": false,
            "Gripe": true,
            "Febre Amarela": true,
            "Tétano": false,
            "Hepatite B": true,
            "Sarampo": false
          }
        }
      ];
      
      // Insert data into the table
      for (const ubs of sampleData) {
        await pool.query(
          `INSERT INTO ubs (name, address, distance, status, opening_hours, vaccines) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            ubs.name,
            ubs.address,
            ubs.distance,
            ubs.status,
            ubs.opening_hours,
            JSON.stringify(ubs.vaccines)
          ]
        );
      }
      
      console.log('Sample data inserted successfully!');
    } else {
      console.log(`UBS table already contains ${countRes.rows[0].count} records. Skipping insertion.`);
    }
    
    console.log('Database setup completed!');
    
  } catch (err) {
    console.error('Error during database setup:', err);
  } finally {
    await pool.end();
  }
}

// Run the setup
setupDatabase();

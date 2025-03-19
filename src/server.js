
// Importa o pool de conexões do PostgreSQL do arquivo db.js
import pool from './db.js';

// Função para testar a conexão com o banco de dados
async function testConnection() {
  try {
    // Executa uma consulta simples para verificar a conexão
    const res = await pool.query('SELECT NOW()');
    console.log('Conexão com o banco de dados estabelecida!');
    console.log('Hora atual do banco:', res.rows[0].now);
    
    // Verifica se a tabela ubs existe
    try {
      const tablesRes = await pool.query(`
        SELECT * FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'ubs'
      `);
      
      if (tablesRes.rows.length > 0) {
        console.log('Tabela UBS encontrada! Contando registros...');
        const countRes = await pool.query('SELECT COUNT(*) FROM ubs');
        console.log(`Total de registros na tabela UBS: ${countRes.rows[0].count}`);
        
        // Exemplo de consulta para mostrar os dados
        const ubsRes = await pool.query('SELECT * FROM ubs LIMIT 2');
        console.log('Amostra de dados da tabela UBS:');
        console.log(ubsRes.rows);
      } else {
        console.log('Tabela UBS não encontrada. Você precisa criar a tabela.');
        console.log('Exemplo de script para criar a tabela:');
        console.log(`
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
      }
    } catch (err) {
      console.error('Erro ao verificar a tabela UBS:', err);
    }
    
  } catch (err) {
    console.error('Erro na conexão com o banco de dados:', err);
  } finally {
    // Encerra o pool de conexões após os testes
    await pool.end();
  }
}

// Executa o teste de conexão
testConnection();

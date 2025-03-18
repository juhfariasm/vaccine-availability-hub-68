
const { Pool } = require('pg');

// Configurações do PostgreSQL usando Pool em vez de Client
const pool = new Pool({
  user: 'infovacdb_idtw_user',
  host: 'dpg-cv0fht5umphs73eqfk6g-a.oregon-postgres.render.com',
  database: 'infovacdb_idtw',
  password: 'TR33ZGyimpS9UKIF6DtQijfBhD6YfNRN',
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // Permite conexões SSL sem verificar o certificado
  },
});

// Teste de conexão ao inicializar
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
  } else {
    console.log('Conexão com o PostgreSQL estabelecida com sucesso!');
  }
});

// Exporta o pool para ser usado em outros arquivos
module.exports = pool;

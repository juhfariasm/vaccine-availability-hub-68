
const { Client } = require('pg');

// Configurações do PostgreSQL
const client = new Client({
  user: 'infovacdb_idtw_user',
  host: 'dpg-cv0fht5umphs73eqfk6g-a.oregon-postgres.render.com',
  database: 'infovacdb_idtw',
  password: 'TR33ZGyimpS9UKIF6DtQijfBhD6YfNRN',
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // Permite conexões SSL sem verificar o certificado
  },
});

// Conecta ao banco de dados
client
  .connect()
  .then(() => console.log('Conectado ao banco de dados PostgreSQL'))
  .catch((err) => console.error('Erro ao conectar ao banco:', err));

// Exporta o client para ser usado em outros arquivos
module.exports = client;

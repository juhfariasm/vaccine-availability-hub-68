
// Importa o cliente PostgreSQL do arquivo db.js
const client = require('./db');

// Executa uma consulta simples para verificar a conexão
client.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro na consulta:', err);
  } else {
    console.log('Hora atual do banco:', res.rows[0].now);
  }
});

// Esta consulta é apenas para fins de teste da conexão
// Em um aplicativo real, você executaria consultas baseadas nas ações do usuário

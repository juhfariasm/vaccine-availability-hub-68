
// Script para configurar o banco de dados inicial
const pool = require('../db');

async function setupDatabase() {
  try {
    console.log('Iniciando configuração do banco de dados...');
    
    // Verifica se a tabela ubs já existe
    const tablesRes = await pool.query(`
      SELECT * FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'ubs'
    `);
    
    if (tablesRes.rows.length === 0) {
      console.log('Criando tabela UBS...');
      
      // Cria a tabela ubs
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
      
      console.log('Tabela UBS criada com sucesso!');
    } else {
      console.log('Tabela UBS já existe. Pulando criação.');
    }
    
    // Verifica se já existem registros na tabela
    const countRes = await pool.query('SELECT COUNT(*) FROM ubs');
    
    if (parseInt(countRes.rows[0].count) === 0) {
      console.log('Inserindo dados de exemplo na tabela UBS...');
      
      // Dados de exemplo para inserção
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
      
      // Insere os dados na tabela
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
      
      console.log('Dados de exemplo inseridos com sucesso!');
    } else {
      console.log(`Tabela UBS já contém ${countRes.rows[0].count} registros. Pulando inserção.`);
    }
    
    console.log('Configuração do banco de dados concluída!');
    
  } catch (err) {
    console.error('Erro durante a configuração do banco de dados:', err);
  } finally {
    pool.end();
  }
}

// Executa a configuração
setupDatabase();

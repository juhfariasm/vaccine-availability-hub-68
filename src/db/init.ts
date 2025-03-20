
import { testConnection } from './config';
import { initModels } from './models';
import { initializeData } from '../services/ubsService';

export const initDatabase = async () => {
  try {
    // Testa a conexão com o banco
    const connected = await testConnection();
    
    if (!connected) {
      console.error('Não foi possível conectar ao banco de dados. Usando dados mockados.');
      return false;
    }
    
    // Inicializa os modelos
    await initModels();
    
    // Inicializa dados padrão se necessário
    await initializeData();
    
    return true;
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    return false;
  }
};

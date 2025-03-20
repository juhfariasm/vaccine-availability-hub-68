
import { testConnection } from '../config/database';
import { UBS, Vaccine, UBSVaccine, sequelize } from '../models';
import { VaccineModel, UBSModel } from '../types/ubs';
import { useToast } from '@/hooks/use-toast';

// Função para inicializar o banco de dados e os modelos
export const initializeDatabase = async () => {
  try {
    // Testar a conexão
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('Failed to connect to the database');
      return false;
    }
    
    // Sincronizar os modelos com o banco de dados
    // Em produção, use {alter: true} em vez de {force: true}
    // force: true vai recriar as tabelas, perdendo dados
    await sequelize.sync({ alter: true });
    
    console.log('Database models synchronized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// Função para buscar todas as vacinas
export const getAllVaccines = async (): Promise<VaccineModel[]> => {
  try {
    return await Vaccine.findAll();
  } catch (error) {
    console.error('Error fetching vaccines:', error);
    return [];
  }
};

// Função para buscar todas as UBS
export const getAllUBS = async (): Promise<UBSModel[]> => {
  try {
    return await UBS.findAll({
      include: [{
        model: Vaccine,
        as: 'vaccines',
        through: {
          attributes: ['available']
        }
      }]
    });
  } catch (error) {
    console.error('Error fetching UBS:', error);
    return [];
  }
};

// Função para atualizar a disponibilidade de uma vacina em uma UBS
export const updateVaccineAvailability = async (
  ubsId: number,
  vaccineId: number,
  available: boolean
): Promise<boolean> => {
  try {
    const [record, created] = await UBSVaccine.findOrCreate({
      where: { ubsId, vaccineId },
      defaults: { available }
    });
    
    if (!created) {
      await record.update({ available });
    }
    
    return true;
  } catch (error) {
    console.error('Error updating vaccine availability:', error);
    return false;
  }
};

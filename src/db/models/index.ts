
import UBS from './UBS';
import Vaccine from './Vaccine';
import UBSVaccine from './UBSVaccine';
import sequelize from '../config';

// Inicializa os modelos e as associações
const initModels = async () => {
  try {
    await sequelize.sync();
    console.log('Modelos sincronizados com o banco de dados.');
  } catch (error) {
    console.error('Erro ao sincronizar modelos:', error);
  }
};

export { UBS, Vaccine, UBSVaccine, initModels };

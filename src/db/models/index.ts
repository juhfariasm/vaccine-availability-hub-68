
import UBS from './UBS';
import Vaccine from './Vaccine';
import UBSVaccine from './UBSVaccine';
import sequelize from '../config';

// Inicializa os modelos e as associações
const initModels = async () => {
  try {
    // Certifique-se de que o UBSVaccine seja importado para que as associações sejam definidas
    console.log('Inicializando os modelos...');
    await sequelize.sync();
    console.log('Modelos sincronizados com o banco de dados.');
  } catch (error) {
    console.error('Erro ao sincronizar modelos:', error);
  }
};

export { UBS, Vaccine, UBSVaccine, initModels };

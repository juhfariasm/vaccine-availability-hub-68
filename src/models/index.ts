
import UBS from './UBS';
import Vaccine from './Vaccine';
import UBSVaccine from './UBSVaccine';
import sequelize from '../config/database';

// Export all models and database connection
export {
  UBS,
  Vaccine,
  UBSVaccine,
  sequelize
};

// Initialize all models and associations
export const initModels = () => {
  // Associations are already defined in their respective model files
  return {
    UBS,
    Vaccine,
    UBSVaccine
  };
};


import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import UBS from './UBS';
import Vaccine from './Vaccine';

class UBSVaccine extends Model {
  public id!: number;
  public ubsId!: number;
  public vaccineId!: number;
  public available!: boolean;
}

UBSVaccine.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ubsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ubs',
        key: 'id',
      },
    },
    vaccineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vaccines',
        key: 'id',
      },
    },
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'UBSVaccine',
    tableName: 'ubs_vaccines',
    timestamps: true,
  }
);

// Define associations
UBS.belongsToMany(Vaccine, {
  through: UBSVaccine,
  foreignKey: 'ubsId',
  as: 'vaccines'
});

Vaccine.belongsToMany(UBS, {
  through: UBSVaccine,
  foreignKey: 'vaccineId',
  as: 'ubs'
});

export default UBSVaccine;

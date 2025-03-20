
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config';
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
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'UBSVaccine',
    tableName: 'ubs_vaccines',
    timestamps: true,
  }
);

// Definindo as associações
UBS.belongsToMany(Vaccine, {
  through: UBSVaccine,
  foreignKey: 'ubsId',
  otherKey: 'vaccineId',
});

Vaccine.belongsToMany(UBS, {
  through: UBSVaccine,
  foreignKey: 'vaccineId',
  otherKey: 'ubsId',
});

export default UBSVaccine;

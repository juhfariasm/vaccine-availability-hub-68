
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class UBS extends Model {
  public id!: number;
  public name!: string;
  public address!: string;
  public latitude!: number;
  public longitude!: number;
  public status!: string;
  public openingHours!: string;
}

UBS.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    openingHours: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'UBS',
    tableName: 'ubs',
    timestamps: true,
  }
);

export default UBS;

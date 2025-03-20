
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config';

class UBS extends Model {
  public id!: number;
  public name!: string;
  public address!: string;
  public distance!: number;
  public status!: 'open' | 'closed';
  public openingHours!: string;
  public city!: string;
  public latitude!: number;
  public longitude!: number;
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
    distance: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('open', 'closed'),
      defaultValue: 'open',
    },
    openingHours: {
      type: DataTypes.STRING,
      defaultValue: '08:00 - 18:00',
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Teresina',
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
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

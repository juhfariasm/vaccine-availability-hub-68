
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config';
import Vaccine from './Vaccine';

class UBS extends Model {
  public id!: number;
  public name!: string;
  public address!: string;
  public status!: 'open' | 'closed' | string;
  public openingHours!: string;
  public distance!: number;
  public city!: string;
  public latitude!: number;
  public longitude!: number;
  
  // Add declaration for the association
  public Vaccines?: Vaccine[];
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
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'open',
    },
    openingHours: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    distance: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
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

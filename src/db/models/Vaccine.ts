
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config';
import UBS from './UBS';

class Vaccine extends Model {
  public id!: number;
  public name!: string;
  
  // Add declaration for the association
  public UBS?: UBS[];
}

Vaccine.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Vaccine',
    tableName: 'vaccines',
    timestamps: true,
  }
);

export default Vaccine;

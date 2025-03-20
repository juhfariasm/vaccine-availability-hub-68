
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Vaccine extends Model {
  public id!: number;
  public name!: string;
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

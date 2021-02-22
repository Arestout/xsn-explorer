import { Sequelize, DataTypes, Model } from 'sequelize';
import { Value } from './values.interface';

export class ValueModel extends Model<Value> implements Value {
  public tx: string;
  public address: string;
  public value: number;
}

export default function (sequelize: Sequelize): typeof ValueModel {
  ValueModel.init(
    {
      tx: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'values',
      sequelize,
    },
  );

  return ValueModel;
}

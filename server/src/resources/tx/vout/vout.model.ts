import { Sequelize, DataTypes, Model } from 'sequelize';
import { Vout } from './vout.interface';

export class VoutModel extends Model<Vout> implements Vout {
  public value: number;
  public n: number;
  public type: string;
  public tx: string;
}

export default function (sequelize: Sequelize): typeof VoutModel {
  VoutModel.init(
    {
      value: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      n: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tx: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'vouts',
      sequelize,
    },
  );

  return VoutModel;
}

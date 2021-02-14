import { Sequelize, DataTypes, Model } from 'sequelize';
import { Vin } from './vin.interface';

export class VinModel extends Model<Vin> implements Vin {
  public vout: number;
  public txid: string;
  public tx: string;
}

export default function (sequelize: Sequelize): typeof VinModel {
  VinModel.init(
    {
      vout: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      txid: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      tx: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'vins',
      sequelize,
    },
  );

  return VinModel;
}

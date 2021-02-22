import { Sequelize, DataTypes, Model } from 'sequelize';
import { Tx } from './interfaces/tx.interface';

export class TxModel extends Model<Tx> implements Tx {
  public txid: string;
  public confirmations: number;
  public time: number;
  public blocktime: number;
  public blockhash: string;
  public raw: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models) {
    this.hasMany(models.Vin, { as: 'vin', foreignKey: 'tx' });
    this.hasMany(models.Vout, { as: 'vout', foreignKey: 'tx' });
    this.hasMany(models.Addresses, { as: 'address', foreignKey: 'tx' });
  }
}

export default function (sequelize: Sequelize): typeof TxModel {
  TxModel.init(
    {
      txid: {
        primaryKey: true,
        type: DataTypes.STRING,
        unique: true,
      },
      blockhash: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'tx',
      sequelize,
    },
  );

  return TxModel;
}

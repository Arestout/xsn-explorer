import { Sequelize, DataTypes, Model } from 'sequelize';
import { BlockDb } from './interfaces/block.interface';

export class BlockModel extends Model<BlockDb> implements BlockDb {
  public hash: string;
  public confirmations: number;
  public size: number;
  public height: number;
  public version: number;
  public time: number;
  public mediantime: number;
  public nonce: number;
  public bits: string;
  public difficulty: number;
  public chainwork: string;
  public tposcontract: null | string;
  public previousblockhash: null | string;
  public nextblockhash: string;
  public raw: string;

  static associate(models) {
    this.hasMany(models.Tx, { as: 'blocks', foreignKey: 'blockhash' });
  }
}

export default function (sequelize: Sequelize): typeof BlockModel {
  BlockModel.init(
    {
      hash: {
        primaryKey: true,
        type: DataTypes.STRING,
        unique: true,
      },
      size: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      height: {
        allowNull: false,
        type: DataTypes.INTEGER,
        unique: true,
      },
      version: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      time: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      mediantime: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      nonce: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      bits: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      difficulty: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      chainwork: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      tposcontract: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      previousblockhash: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      nextblockhash: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'blocks',
      sequelize,
    },
  );

  return BlockModel;
}

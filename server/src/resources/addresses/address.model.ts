import { Sequelize, DataTypes, Model } from 'sequelize';
import { Address } from './address.interface';

export class AddressModel extends Model<Address> implements Address {
  public address: string;
  public balance: number;
  public tx: string;

  // static associate(models) {
  //   this.hasMany(models.Tx, { as: 'tx', foreignKey: 'address' });
  // }
}

export default function (sequelize: Sequelize): typeof AddressModel {
  AddressModel.init(
    {
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      balance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      tx: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'addresses',
      sequelize,
    },
  );

  return AddressModel;
}

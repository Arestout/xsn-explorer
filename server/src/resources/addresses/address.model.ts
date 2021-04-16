import { Sequelize, DataTypes, Model } from 'sequelize';
import { AddressDTO } from './interfaces/address.interface';

export class AddressModel extends Model<AddressDTO> implements AddressDTO {
  public address: string;
  public value: number;
  public tx: string;
  public time: number;
  public balance: number;
}

export default function (sequelize: Sequelize): typeof AddressModel {
  AddressModel.init(
    {
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        get() {
          const rawValue = this.getDataValue('value');
          return rawValue ? (rawValue / 1e8).toFixed(8) : null;
        },
      },
      time: {
        type: DataTypes.INTEGER,
        allowNull: false,
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

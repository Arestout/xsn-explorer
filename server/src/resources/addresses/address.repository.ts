import { isEmpty } from '../../utils/util';
import DB from './../../database/index';
import HttpException from '../../utils/HttpException';
import { DIGITS } from '../../config';
import { OneAddress, IAddressRepository } from './interfaces/addressRepository.interface';

export class AddressRepository implements IAddressRepository {
  private addresses = DB.Addresses;

  public async findOne(address: string): Promise<OneAddress> {
    const addressDb = await this.addresses.findOne({
      attributes: ['address', [DB.Sequelize.fn('sum', DB.Sequelize.col('value')), 'balance']],
      where: {
        address,
      },
      group: 'address',
      raw: true,
    });

    if (isEmpty(addressDb)) {
      throw new HttpException(404, 'Address not found');
    }

    const balance = (addressDb.balance / DIGITS).toFixed(8);

    const transactions = await this.addresses.findAll({
      attributes: ['tx', 'value', 'time'],
      where: {
        address,
      },
      order: [['time', 'DESC']],
      raw: true,
    });

    return {
      address: {
        address: addressDb.address,
        balance,
      },
      transactions,
    };
  }
}

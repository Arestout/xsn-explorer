import { Address } from './address.interface';
import HttpException from '../../utils/HttpException';
import DB from './../../database/index';
import { Tx } from './../tx/tx.interface';
import { Vout } from './../tx/vout/vout.interface';
import { Vin } from '../tx/vin/vin.interface';

export class AddressRepository {
  private addresses = DB.Addresses;

  public async updateVout(tx: Tx): Promise<void> {
    for (const vout of tx.vout) {
      if (vout.value === 0) continue;

      const [address, created] = await this.addresses.findOrCreate({
        where: {
          address: vout.scriptPubKey.addresses[0],
          tx: tx.txid,
        },
      });

      address.update({
        balance: address.balance + Number(vout.value),
      });
    }
  }

  public async updateVin(vout: Vout): Promise<void> {
    const [address, created] = await this.addresses.findOrCreate({
      where: {
        address: vout.scriptPubKey.addresses[0],
      },
    });

    address.update({
      balance: address.balance - Number(vout.value),
    });
  }
}

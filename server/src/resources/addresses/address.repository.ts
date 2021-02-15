import { Transaction } from 'sequelize/types';
import { isEmpty } from '../../utils/util';
import DB from './../../database/index';
import { Tx } from './../tx/tx.interface';
import { Vout } from './../tx/vout/vout.interface';

export class AddressRepository {
  private addresses = DB.Addresses;

  public async updateVout(tx: Tx, transaction: Transaction): Promise<void> {
    for (const vout of tx.vout) {
      if (vout.value === 0) continue;

      let address = await this.addresses.findOne({
        where: {
          address: vout.scriptPubKey.addresses[0],
        },
      });

      if (isEmpty(address)) {
        address = await this.addresses.create(
          {
            address: vout.scriptPubKey.addresses[0],
            tx: tx.txid,
            balance: 0,
          },
          {
            transaction,
          },
        );
      }

      address.update(
        {
          balance: address.balance + Number(vout.value),
        },
        {
          transaction,
        },
      );
    }
  }

  public async updateVin(vout: Vout, transaction: Transaction): Promise<void> {
    const address = await this.addresses.findOne({
      where: {
        address: vout.scriptPubKey.addresses[0],
      },
    });

    address.update(
      {
        balance: address.balance - Number(vout.value),
      },
      {
        transaction,
      },
    );
  }
}

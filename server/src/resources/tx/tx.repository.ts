import { Tx } from './interfaces/tx.interface';
import HttpException from '../../utils/HttpException';
import DB from './../../database/index';
import { Transaction } from 'sequelize/types';
import { Vout } from './vout/vout.interface';
import { isEmpty } from '../../utils/util';
import { RpcClient } from '../../lib/wallet/rpcClient';
import { Lock } from './../../utils/lock';
import { logger } from '../../utils/logger';
import { WALLET } from '../../config';
import { ITxRepository } from './interfaces/txRepository.interface';

export class TxRepository implements ITxRepository {
  private tx = DB.Tx;
  private vins = DB.Vin;
  private vouts = DB.Vout;
  private addresses = DB.Addresses;
  private rpcClient = new RpcClient(WALLET);
  private lock = new Lock();

  public async create(tx: Tx, transaction: Transaction): Promise<void> {
    try {
      await this.lock.enter();
      const findTx: Tx = await this.tx.findOne({ where: { txid: tx.txid } });
      if (findTx) throw new HttpException(409, `The tx with id ${tx.txid} already exists`);

      await this.tx.create(
        {
          txid: tx.txid,
          blockhash: tx.blockhash,
        },
        {
          transaction,
        },
      );

      const createValues = async balance => {
        const [address, value] = balance;
        if (value === 0) {
          return;
        }

        await this.addresses.create(
          {
            tx: tx.txid,
            address,
            time: tx.time,
            value,
          },
          {
            transaction,
          },
        );
      };
      const balances = {};
      await this.createVin(tx, balances, transaction);
      await this.createVout(tx, balances, transaction);
      await Promise.all(Object.entries(balances).map(createValues));
    } catch (error) {
      logger.error(error.message);
      console.log(error);
    } finally {
      await this.lock.leave();
    }
  }

  private async createVin(tx: Tx, balances, transaction: Transaction) {
    for (const vin of tx.vin) {
      if (vin.txid) {
        await this.vins.create(
          {
            txid: vin.txid,
            vout: Number(vin.vout),
            tx: tx.txid,
          },
          {
            transaction,
          },
        );

        let vout: Vout = await this.vouts.findOne({
          where: {
            tx: vin.txid,
            n: vin.vout,
          },
          raw: true,
        });

        if (isEmpty(vout)) {
          const tx = await this.rpcClient.getRawTransaction(vin.txid);
          vout = tx.vout.find(vout => vout.n === vin.vout);
          vout.value = Math.round(vout.value * 1e8);
        }

        const address = vout?.scriptPubKey?.addresses[0] || vout.address;
        const voutValue = vout.value * -1;

        balances[address] = balances[address] ? balances[address] + voutValue : voutValue;
      }
    }
  }

  private async createVout(tx: Tx, balances, transaction: Transaction) {
    for (const vout of tx.vout) {
      if (vout?.scriptPubKey?.addresses) {
        const voutValue = Math.round(vout.value * 1e8);

        await this.vouts.create(
          {
            value: voutValue,
            n: vout.n,
            type: vout.scriptPubKey.type,
            tx: tx.txid,
            address: vout.scriptPubKey.addresses[0],
          },
          {
            transaction,
          },
        );

        const address = vout.scriptPubKey.addresses[0];

        balances[address] = balances[address] ? balances[address] + voutValue : voutValue;
      }
    }
  }
}

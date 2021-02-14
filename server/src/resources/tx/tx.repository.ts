import { Tx, TxDb } from './tx.interface';
import HttpException from '../../utils/HttpException';
import DB from './../../database/index';
import { Vin } from './vin/vin.interface';

export class TxRepository {
  private tx = DB.Tx;
  private vins = DB.Vin;
  private vouts = DB.Vout;

  public async createTx(tx: Tx): Promise<TxDb> {
    const findTx: Tx = await this.tx.findOne({ where: { txid: tx.txid } });
    if (findTx) throw new HttpException(409, `The tx with id ${tx.txid} already exists`);

    const txDB: TxDb = await this.tx.create({
      txid: tx.txid,
      blockhash: tx.blockhash,
    });

    await this.createVin(tx);
    await this.createVout(tx);

    return txDB;
  }

  private async createVin(tx: Tx) {
    for (const vin of tx.vin) {
      if (vin.txid) {
        await this.vins.create({
          txid: vin.txid,
          vout: Number(vin.vout),
          tx: tx.txid,
        });
      }
    }
  }

  private async createVout(tx: Tx) {
    for (const vout of tx.vout) {
      await this.vouts.create({
        value: vout.value,
        n: vout.n,
        type: vout.scriptPubKey.type,
        tx: tx.txid,
      });
    }
  }
}

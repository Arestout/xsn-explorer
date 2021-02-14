import { Block } from '../blocks/block.interface';
import { TxDb, Tx } from './tx.interface';
import { TxRepository } from './tx.repository';
import { RpcClient } from '../../lib/wallet/rpcClient';

export class TxService {
  public txRepository: TxRepository;
  public rpcClient: RpcClient;

  constructor(repository, rpcClient) {
    this.txRepository = repository;
    this.rpcClient = rpcClient;
  }

  public async createTx(block: Block): Promise<Tx[]> {
    const txs: Tx[] = [];

    for (const tx of block.tx) {
      const rawTx: Tx = await this.rpcClient.getRawTransaction(tx.txid);
      txs.push(rawTx);
    }

    for (const tx of txs) {
      await this.txRepository.createTx(tx);
    }

    return txs;
  }
}

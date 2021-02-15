import { Block } from '../blocks/block.interface';
import { Tx, TxDb } from './tx.interface';
import { TxRepository } from './tx.repository';
import { RpcClient } from '../../lib/wallet/rpcClient';
import { Transaction } from 'sequelize/types';

export class TxService {
  public txRepository: TxRepository;
  public rpcClient: RpcClient;

  constructor(repository, rpcClient) {
    this.txRepository = repository;
    this.rpcClient = rpcClient;
  }

  public async getTx(id: string): Promise<TxDb> {
    const tx = await this.rpcClient.getRawTransaction(id);

    return tx;
  }

  public async createTx(block: Block, transaction: Transaction): Promise<Tx[]> {
    const txs: Tx[] = [];

    for (const tx of block.tx) {
      const rawTx: Tx = await this.rpcClient.getRawTransaction(tx.txid);
      txs.push(rawTx);
    }

    for (const tx of txs) {
      await this.txRepository.createTx(tx, transaction);
    }

    return txs;
  }
}

import { Block } from '../blocks/interfaces/block.interface';
import { Tx, TxDb } from './interfaces/tx.interface';
import { Transaction } from 'sequelize/types';
import { IRpcClient } from './../../lib/wallet/rpcClient.interface';
import { ITxRepository } from './interfaces/txRepository.interface';

export class TxService {
  public txRepository: ITxRepository;
  public rpcClient: IRpcClient;

  constructor(repository: ITxRepository, rpcClient: IRpcClient) {
    this.txRepository = repository;
    this.rpcClient = rpcClient;
  }

  public async getTx(id: string): Promise<TxDb> {
    const tx = await this.rpcClient.getRawTransaction(id);

    return tx;
  }

  public async create(block: Block, transaction: Transaction): Promise<void> {
    const txs: Tx[] = [];

    for (const tx of block.tx) {
      const rawTx: Tx = await this.rpcClient.getRawTransaction(tx.txid);
      txs.push(rawTx);
    }

    for (const tx of txs) {
      await this.txRepository.create(tx, transaction);
    }
  }
}

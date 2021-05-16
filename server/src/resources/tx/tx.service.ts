import { TxDb } from './interfaces/tx.interface';
import { IRpcClient } from '../../libs/wallet/rpcClient.interface';
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
}

import { Block } from '../blocks/block.interface';
import { RpcClient } from '../../lib/wallet/rpcClient';
import { AddressRepository } from './address.repository';
import { Tx } from './../tx/tx.interface';

export class AddressService {
  public addressRepository: AddressRepository;
  public rpcClient: RpcClient;

  constructor(repository, rpcClient) {
    this.addressRepository = repository;
    this.rpcClient = rpcClient;
  }

  public async createAddress(txs: Tx[]): Promise<void> {
    for (const tx of txs) {
      await this.addressRepository.updateVout(tx);

      for (const vin of tx.vin) {
        if (vin.txid) {
          const tx = await this.rpcClient.getRawTransaction(vin.txid);
          const vout = tx.vout.find(vout => (vout.n = vin.vout));
          if (vout.value === 0) continue;
          await this.addressRepository.updateVin(vout);
        }
      }
    }
  }
}

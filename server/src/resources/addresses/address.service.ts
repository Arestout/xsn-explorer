import { IRpcClient } from '../../libs/wallet/rpcClient.interface';
import { OneAddress, IAddressRepository } from './interfaces/addressRepository.interface';

export class AddressService {
  public addressRepository: IAddressRepository;
  public rpcClient: IRpcClient;

  constructor(repository: IAddressRepository, rpcClient: IRpcClient) {
    this.addressRepository = repository;
    this.rpcClient = rpcClient;
  }

  public async findOne(address: string): Promise<OneAddress> {
    return await this.addressRepository.findOne(address);
  }
}

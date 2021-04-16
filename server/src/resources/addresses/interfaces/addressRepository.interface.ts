import { Tx } from '../../tx/interfaces/tx.interface';

interface Address {
  address: string;
  balance: string;
}

export interface OneAddress {
  address: Address;
  transactions: Tx[];
}
export interface IAddressRepository {
  findOne(address: string): Promise<OneAddress>;
}
